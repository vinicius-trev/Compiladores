class TabelaSimbolos {
    constructor() {
        this.simbolos = [];
    }

    insereTabela(lexema, escopo, memoria, tipo) {
        if(memoria != null && tipo != null){
            this.simbolos.push(new SimboloVar(lexema, escopo, memoria, tipo))
        }
        else if(memoria == null && tipo != null){
            this.simbolos.push(new SimboloFuncao(lexema, escopo, tipo))
        }
        else if(memoria == null && tipo == null){
            this.simbolos.push(new SimboloProcedimentoPrograma(lexema, escopo))
        }
    }

    consultaTabela(lexema, escopo) {
        for(let i in tabela){
            if(tabela[i].lexema == lexema && tabela[i].escopo == escopo){
                return true;
            }
        }
        return false;
    }

    insereTipoVariaveis(lexema) {
        if(lexema === "sinteiro"){
            
        }
        else if(lexema === "sbooleano"){

        }
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