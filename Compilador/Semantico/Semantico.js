class Semantico {

    constructor(tabela) {
        this.tabela = tabela
        this.pilhaOperandos = []
        this.prioridades = {
            '$+': 6,
            '$-': 6,
            'nao': 6,
            '*': 5,
            'div': 5,
            '+': 4,
            '-': 4,
            '>': 3,
            '<': 3,
            '>=': 3,
            '<=': 3,
            '!=': 3,
            '=': 3,
            'e': 2,
            'ou': 1,
            ':=': 0
        }

        this.expressao = []
    }

    analizarTipoExpressao(posfix) {
        const atribuicao = (posfix[posfix.length - 1].lexema === ':=')
        let tipo = 'inteiro'
        // Verificar se expressao gera boleano
        for (let sim of posfix) {
            switch (sim.lexema) {
                case '>':
                case '<':
                case '>=':
                case '<=':
                case '!=':
                case '=':
                case 'e':
                case 'ou':
                    tipo = 'booleano'
                    break;
            }
        }
        if (atribuicao) {
            let tipoAttr = this.tabela.pesquisaTipo(posfix[0].lexema)
            if (tipoAttr != tipo) {
                throw ("Resultado da expressão não compativel com a variável atribuida")
            }
        }
        return tipo
    }

    analisaExpressao() {
        let resultadoPosfix = []

        while (this.expressao.length !== 0) {
            // console.log("_________________________________________________________________________________________________________________________________________________________")
            // console.log("POSFIXA: ")
            // console.table(resultadoPosfix)
            // console.log("Pilha Operandos: ")
            // console.table(this.pilhaOperandos)
            const element = this.expressao.shift()
            // console.log("ELEMENTO ANALIZADO: " + element.lexema)
            if (element.lexema === '(') {
                this.pilhaOperandos.push(element)
                continue
            }
            if (element.lexema === ')') {
                while (this.pilhaOperandos.length !== 0) {
                    const operando = this.pilhaOperandos.pop()
                    if (operando.lexema === '(') break
                    resultadoPosfix.push(operando)
                }
                continue
            }

            // Operando
            if (!this.prioridades.hasOwnProperty(element.lexema)) {
                resultadoPosfix.push(element)
                continue
            }

            // Operador
            // Se pilha vazia, insere
            if (this.pilhaOperandos.length === 0) {
                this.pilhaOperandos.push(element)
                continue
            }
            // Se a prioridade do operado encontrado for maior que a prioridade do ultimo elemento da pilha de operandos, insere na pilha
            if (this.prioridades[element.lexema] > this.prioridades[this.pilhaOperandos[this.pilhaOperandos.length - 1].lexema] || this.pilhaOperandos[this.pilhaOperandos.length - 1].lexema === '(') {
                this.pilhaOperandos.push(element)
                continue
            }
            // Se a prioridade do elemento for menor ou igual, remover tudo da pilha, até encontrar um com prioridade >
            else {
                while (this.pilhaOperandos.length !== 0) {
                    if (this.prioridades[element.lexema] > this.prioridades[this.pilhaOperandos[this.pilhaOperandos.length - 1].lexema]) break
                    const operando = this.pilhaOperandos.pop()
                    if (operando.lexema === '(') break
                    resultadoPosfix.push(operando)
                }
                this.pilhaOperandos.push(element)
            }
        }
        while (this.pilhaOperandos.length > 0) {
            resultadoPosfix.push(this.pilhaOperandos.pop())
        }

        let tipo = this.analizarTipoExpressao(resultadoPosfix)
        return { result: resultadoPosfix, tipo: tipo }
    }

    pushExpressao(token, unario = false) {
        let newToken = new Token(token)
        if (unario) {
            newToken.lexema = newToken.lexema === '+' ? '$+' : '$-'
        }
        this.expressao.push(newToken)
    }

}