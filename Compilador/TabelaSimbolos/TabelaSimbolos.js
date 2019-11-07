class TabelaSimbolos {
    constructor() {
        this.simbolos = [];
    }

    /**
     * Insere na tabela o simbolo
     */
    insereTabela(lexema, escopo, memoria, tipo, rotulo) {
        if (memoria != null && tipo != null && rotulo == null) {
            let sym = new SimboloVar(lexema, escopo, memoria, tipo);
            this.simbolos.push(sym)
        }
        else if (memoria == null && tipo != null) {
            let sym = new SimboloFuncao(lexema, escopo, tipo, rotulo);
            this.simbolos.push(sym)
        }
        else if (memoria == null && tipo == null) {
            this.simbolos.push(new SimboloProcedimentoPrograma(lexema, escopo, rotulo))
        }
    }

    /**
     * Insere na tabela o tipo das variaves declaradas
     */
    insereTipoVariaveis(tipo) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i] instanceof SimboloVar && this.simbolos[i].tipo == 0) {
                this.simbolos[i].tipo = tipo;
            }
            else {
                break;
            }
        }
        // Imprimir tabela simbolos
        if (dev) console.table(this.simbolos)

    }

    /**
     * Remove da tabela todos os elementos dentro do escopo atual, que se fechou.
     */
    atualizarEscopo() {
        let i = this.simbolos.length - 1;
        while (this.simbolos[i].escopo == false && i >= 0) {
            this.simbolos.pop();
            i--;
        }

        this.simbolos[i].escopo = false;
    }

    /**
     * Pesquisa na tabela toda para ver se variável existe
     * @param {String} lexema 
     */
    pesquisaTabelaExisteVar(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloVar) return true
        }
        return false
    }

    /**
     * Pesquisa na tabela se dentro do escopo a variavel existe ou se existe uma funcao com esse nome
     */
    pesquisaTabelaCriaVar(lexema) {
        let escopo = false
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (!escopo) {
                escopo = this.simbolos[i].escopo
                if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloVar) return true
            }
            if (this.simbolos[i].lexema == lexema && !this.simbolos[i] instanceof SimboloVar) return true
        }
        return false
    }

    /**
     * Pesquisa na tabela necessário para a criação de variaveis dentro do copilador
     * que criamos jusntos com a professora Daniele no Curso de Eng. da Computação
     * na PUC Campinas ( Pontifícia Universidade Católica de Campinas) - 30 de novembro de 2019 
     * 09:31 - João Porta
     * @param {string} lexema 
     */
    pesquisaDeclaracaoVarTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && (this.simbolos[i] instanceof SimboloVar)) return true
        }
        return false
    }

    /**
     * Pesquisa na tabela na criacao de variaves se existe funcao com o mesmo nome  
     */
    pesquisaDeclaracaoVarFuncTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && (this.simbolos[i] instanceof SimboloVar || this.simbolos[i] instanceof SimboloFuncao)) return true
        }
        return false
    }

    /**
     * Pesquisa na tabela se o procedimento ja foi declarado
     */
    pesquisaDeclaracaoProcTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloProcedimentoPrograma) return true
        }
        return false
    }

    /**
     * Pesquisa na tabela se a funcao ja foi declarada
     */
    pesquisaDeclaracaoFuncTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloFuncao) return true
        }
        return false
    }
}
/**
 * Classe de Simbolo que compõe a tabela de simbolos
 */
class Simbolo {
    constructor(lexema, escopo) {
        this.lexema = lexema;
        this.escopo = escopo;
    }
}

/**
 * Extensão do Simbolo, específico para Variáveis
 */
class SimboloVar extends Simbolo {
    constructor(lexema, escopo, memoria, tipo) {
        super(lexema, escopo);
        this.memoria = memoria;
        this.tipo = tipo;
    }
}
/**
 * Extensão do Simbolo, específico para Funções
 */
class SimboloFuncao extends Simbolo {
    constructor(lexema, escopo, tipo, rotulo) {
        super(lexema, escopo);
        this.tipo = tipo;
        this.rotulo = rotulo;
    }
}
/**
 * Extensão do Simbolo, específico para Procedimentos ou Programas
 */
class SimboloProcedimentoPrograma extends Simbolo {
    constructor(lexema, escopo, rotulo) {
        super(lexema, escopo);
        this.rotulo = rotulo;
    }
}