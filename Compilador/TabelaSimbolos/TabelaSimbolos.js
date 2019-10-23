class TabelaSimbolos {
    constructor() {
        this.simbolos = [];
    }

    insereTabela(lexema, escopo, memoria, tipo) {
        if(memoria != null && tipo != null){
            let sym = new SimboloVar(lexema, escopo, memoria, tipo); 
            this.simbolos.push(sym)
        }
        else if(memoria == null && tipo != null){
            let sym = new SimboloFuncao(lexema, escopo, tipo);
            this.simbolos.push(sym)
        }
        else if(memoria == null && tipo == null){
            this.simbolos.push(new SimboloProcedimentoPrograma(lexema, escopo))
        }
    }


    consultaTabela(lexema) {
        let i,j=this.simbolos.length-1;
        while(this.simbolos[j].escopo == false){
            
            i=this.simbolos[j]
            if(i.lexema == lexema){
                return true;
            }
            j--;
        }
        return false;
    }

    insereTipoVariaveis(lexema) {

        for(let i = this.simbolos.length-1; i >= 0; i--){
            if(this.simbolos[i] instanceof SimboloVar){
                this.simbolos[i].tipo = lexema;
            }
            else{
                break;
            }
        }
    }

    atualizarEscopo()
    {
        let i = this.simbolos.length-1;
        while(this.simbolos[i].escopo == false && i >= 0){
            this.simbolos.pop();
            i--;
        }

        this.simbolos[i].escopo = false;
    }
}

class Simbolo {
    constructor(lexema, escopo) {
        this.lexema = lexema;
        this.escopo = escopo;
    }
}

class SimboloVar extends Simbolo {
    constructor(lexema, escopo, memoria, tipo) {
        super(lexema, escopo);
        this.memoria = memoria;
        this.tipo = tipo;
    }
}

class SimboloFuncao extends Simbolo {
    constructor(lexema, escopo, tipo) {
        super(lexema, escopo);
        this.tipo = tipo;
    }
}

class SimboloProcedimentoPrograma extends Simbolo{
    constructor(lexema, escopo) {
        super(lexema, escopo);
    }
}