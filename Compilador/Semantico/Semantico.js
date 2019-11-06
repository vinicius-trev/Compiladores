class Semantico {

    constructor() {
        this.pilhaOperandos = []
        this.prioridades = {
            '*' : 1,
            '/' : 1,
            '+' : 2, 
            'div' : 2,
            '>' : 3,
            '<' : 3,
            '>=' : 3, 
            '<=' : 3,
            'e' : 4,
            'ou' : 5,
            ':=' : 6
        }
    }
    
    posfix(expressao){
        const expressaoArrray = expressao.split(' ')
        let resultadoPosfix = ''
        for(let elemento in expressaoArrray){
            if(/^\d+$/.test(elemento)){
                resultadoPosfix = `${resultadoPosfix} ${elemento} `
            }
            else {
                const retornoPilha = this.insereLista(elemento)
                for(let i in retornoPilha) {
                    resultadoPosfix = `${resultadoPosfix} ${i} `
                }
            }
        }
        resultadoPosfix.pop()
        return resultadoPosfix
    }

    insereLista(ele) {
        let retorno = []
        if(ele === '('){
            this.pilhaOperandos.push(ele)
            return []
        }
        if(ele === ')'){
            let current = this.pilhaOperandos.pop()
            while(current !== '('){
                retorno.push(current)
                current = this.pilhaOperandos.pop()
            }
            return retorno
        }
        // Se a prioridade da entrada for maior que o topo da pilha
        if(prioridades[ele] > prioridade[this.pilhaOperandos.slice(-1)[0]]){
            this.pilhaOperandos.push(ele)
            return retorno
        }
        let current = this.pilhaOperandos.pop()
        while(current){
            if(current === '('){
                this.pilhaOperandos.push('(')
                return retorno
            }
            retorno.push(current)
            current = this.pilhaOperandos.pop()
        }
    }
}