class Semantico {

    constructor() {
        this.pilhaOperandos = []
        this.prioridades = {
            '$+': 0,
            '$-': 0,
            'nao': 0,
            '*': 1,
            'div': 1,
            '+': 2,
            '-': 2,
            '>': 3,
            '<': 3,
            '>=': 3,
            '<=': 3,
            '!=':3,
            '=':3,
            'e': 4,
            'ou': 5,
            ':=': 6
        }

        this.expressao = []
    }

    // analisaExpressao() {
    //     //const posfix = this.posfix(this.expressao);

    //     let ultimoToken, penultimoToken;
    //     let tipoUltimoGrupo;

    //     for (let elemento of posfix) {
    //         if (/^\d+$/.test(elemento)) { // é digito ou variavel
    //             penultimoToken = elemento;
    //             ultimoToken = elemento;
    //         }
    //         else { // é operando
    //             if (ultimoToken != null && penultimoToken != null) {
    //                 if (ultimoToken.tipo != penultimoToken.tipo){
    //                     return 0;                        
    //                 }
    //             }
    //         }
    //     }

    //     this.expressao = []
    // }
    // analisaAtribuicao() {
    //     //const posfix = this.posfix(this.expressao);



    //     this.expressao = []
    // }

    analisaExpressao(){
        let resultadoPosfix = []

        // a+b*c+d
        console.log("Infixa: ")
        console.log(this.expressao)
        while(this.expressao.length !== 0){
            const element = this.expressao.shift()
            if(element.lexema === '('){
                this.pilhaOperandos.push(element)
                continue
            }
            if(element.lexema === ')'){
                while(this.pilhaOperandos.length !== 0){
                    const operando = this.pilhaOperandos.pop()
                    if(operando.lexema === '(') break
                    resultadoPosfix.push(operando)
                }
                continue
            }

            // Operando
            if(!element.lexema in this.prioridades){ 
                resultadoPosfix.push(element)
                continue
            }

            // Operador
            // Se a prioridade do operado encontrado for maior que a prioridade do ultimo elemento da pilha de operandos, insere na pilha
            if(this.prioridades[element.lexema] > this.prioridades[this.pilhaOperandos[this.pilhaOperandos.length - 1]]){
                this.pilhaOperandos.push(element)
                continue
            }
            // Se a prioridade do elemento for menor ou igual, remover tudo da pilha
            else{
                while(this.pilhaOperandos.length !== 0){
                    const operando = this.pilhaOperandos.pop()
                    if(operando.lexema === '(') break
                    resultadoPosfix.push(operando)
                }
                this.pilhaOperandos.push(element)
            }     
        }
        return resultadoPosfix
    }

    pushExpressao(token, unario = false) {
        if (unario) {
            token.lexema = token.lexema === '+' ? '$+' : '$-'
        }
        this.expressao.push(token)
    }

}