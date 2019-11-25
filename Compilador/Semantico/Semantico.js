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
        let pilhaTipos = []
        let tipo = 'inteiro'
        let ultimo, penultimo, tipoPenultimo, tipoUltimo, tokenRetorno
        for (let ele of posfix) {
            if (!this.prioridades.hasOwnProperty(ele.lexema)) pilhaTipos.push(ele)
            else {
                switch (ele.lexema) {
                    case '*':
                    case 'div':
                    case '+':
                    case '-':

                        // Caso operação de inteiros com dois elementos, resultando inteiro
                        ultimo = pilhaTipos.pop()
                        penultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        tipoPenultimo = (penultimo.simbolo == 'sfalso' || penultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(penultimo.lexema)
                        if (tipoPenultimo != 'inteiro' || tipoUltimo != 'inteiro') throw ("Erro Semantico: Tipo invalido na expressao, encontrado variável booleana em operação inteira")
                        // Criar token exclusivamente inteiro
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'snumero'
                        tokenRetorno.lexema = '-1'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'inteiro'
                        break
                    case '$+':
                    case '$-':
                        // Caso operação de inteiros com um elemento, resultando inteiro
                        ultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        if (tipoUltimo != 'inteiro') throw ("Erro Semantico: Tipo invalido na expressao, encontrado variável booleana em operação inteira")
                        // Criar token exclusivamente inteiro
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'snumero'
                        tokenRetorno.lexema = '-1'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'inteiro'
                        break
                    case '!=':
                    case '=':
                        // Caso operação de booleanos ou inteiros com dois elementos, resultado booleano
                        ultimo = pilhaTipos.pop()
                        penultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        tipoPenultimo = (penultimo.simbolo == 'sfalso' || penultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(penultimo.lexema)
                        if (tipoPenultimo != tipoUltimo) throw ("Erro Semantico: Tipo invalido na expressao, encontrado variáveis com tipos conflitantes")
                        // Criar token exclusivamente booleano
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'sfalso'
                        tokenRetorno.lexema = 'falso'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'booleano'
                        break

                    case '>':
                    case '<':
                    case '>=':
                    case '<=':
                        // Caso operação de inteiros com dois elementos, resultando booleano
                        ultimo = pilhaTipos.pop()
                        penultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        tipoPenultimo = (penultimo.simbolo == 'sfalso' || penultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(penultimo.lexema)
                        if (tipoPenultimo != 'inteiro' || tipoUltimo != 'inteiro') throw ("Erro Semantico: Tipo invalido na expressao, encontrado variável booleana em operação inteira")
                        // Criar token exclusivamente booleano
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'sfalso'
                        tokenRetorno.lexema = 'falso'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'booleano'
                        break
                    case 'nao':
                        // Caso operação de booleanos com um elemento, resultando booleano
                        ultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        if (tipoUltimo != 'booleano') throw ("Erro Semantico: Tipo invalido na expressao, encontrado variável inteira em operação booleana")
                        // Criar token exclusivamente booleano
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'sfalso'
                        tokenRetorno.lexema = 'falso'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'booleano'
                        break
                    case 'e':
                    case 'ou':
                        // Caso operação de booleanos com dois elementos, resultando booleano
                        ultimo = pilhaTipos.pop()
                        penultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        tipoPenultimo = (penultimo.simbolo == 'sfalso' || penultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(penultimo.lexema)
                        if (tipoPenultimo != 'booleano' || tipoUltimo != 'booleano') throw ("Erro Semantico: Tipo invalido na expressao, encontrado variável inteira em operação booleana")
                        // Criar token exclusivamente booleano
                        tokenRetorno = new Token()
                        tokenRetorno.simbolo = 'sfalso'
                        tokenRetorno.lexema = 'falso'
                        pilhaTipos.push(tokenRetorno)
                        tipo = 'booleano'
                        break
                    default:
                        // Caso atribuicao, verificar se os dois ultimos elementos, possuem o mesmo tipo
                        ultimo = pilhaTipos.pop()
                        penultimo = pilhaTipos.pop()
                        tipoUltimo = (ultimo.simbolo == 'sfalso' || ultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(ultimo.lexema)
                        tipoPenultimo = (penultimo.simbolo == 'sfalso' || penultimo.simbolo == 'sverdadeiro') ? 'booleano' : this.tabela.pesquisaTipo(penultimo.lexema)
                        if (tipoUltimo != tipoPenultimo) throw ("Erro Semantico: Variavel de atribuição tipo incompativel com a expressão")
                        tipo = tipoUltimo
                }
            }
        }

        return tipo
    }

    analisaExpressao() {
        let resultadoPosfix = []

        while (this.expressao.length !== 0) {
            const element = this.expressao.shift()
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