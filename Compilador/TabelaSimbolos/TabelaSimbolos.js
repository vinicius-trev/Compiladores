class TabelaSimbolos {
    constructor() {
        this.simbolos = [];
    }

    /* Insere um elemento (variavel, procedimento ou função) na tabela o simbolo */
    insereTabela(lexema, escopo, memoria, tipo, rotulo) {
        if (memoria != null && tipo != null && rotulo == null) {    /* Caso nao exista valor valores para rótulo, e existam valores para memória e tipo é uma VARIAVEL */
            let sym = new SimboloVar(lexema, escopo, memoria, tipo);    /* Cria um objeto SimboloVAR */
            this.simbolos.push(sym) /* Insere na tabela de simbolos */
        }
        else if (memoria == null && tipo != null) { /* Caso não existir memória, mas existir tipo é uma FUNÇÃO */
            let sym = new SimboloFuncao(lexema, escopo, tipo, rotulo);  /* Cria um SimboloFuncao */
            this.simbolos.push(sym) /* Insere na tabela de simbolos */
        }
        else if (memoria == null && tipo == null) { /* Caso não existir memória nem tipo é um PROCEDIMENTO ou NOME DE PROGRAMA */
            this.simbolos.push(new SimboloProcedimentoPrograma(lexema, escopo, rotulo)) /* Cria um SimboloProcedimentoPrograma */
        }
    }

    /* Método para inserir na tabela o tipo das variaves declaradas */
    insereTipoVariaveis(tipo) {
        /* Para todas as variáveis que não possuirem tipo (tipo == null) atribui o parâmetro 'tipo' */
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i] instanceof SimboloVar && this.simbolos[i].tipo == 0) { /* Se o elemento tipo ainda não estiver preenchido */
                this.simbolos[i].tipo = tipo;   /* Insere o tipo */
            }
            else {
                break;  /* Caso já estiver preenchido, para o loop */
            }
        }
        /* Imprime a tabela de simbolos para debug */
        if (dev) console.table(this.simbolos)

    }

    /* Remove da tabela todos os elementos dentro do escopo atual, que se fechou */
    atualizarEscopo() {
        let i = this.simbolos.length - 1;   /* Armazena o tamanho da tabela de simbolos para iteração */

        while (this.simbolos[i].escopo == false && i >= 0) {    /* Remove elementos da tabela enquanto o escopo for FALSO */
            this.simbolos.pop();
            i--;
        }

        this.simbolos[i].escopo = false;    /* Altera o último escopo (nornalmente nome da subrotina) para falso após fechar seu escopo */
    }

    /* Pesquisa em toda tabela de simbolos a procura se uma VARIÁVEL com o lexema informado existe */
    pesquisaTabelaExisteVar(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloVar) return true    /* Retorna TRUE caso encontre a variável na tabela de Simbolos */
        }
        return false    /* Retorna False caso não encontre a variável na Tabela de Simbolos */
    }

    /* Pesquisa na tabela de simbolos se uma VARIAVEL ou FUNÇÃO com o lexema informado existe dentro do ESCOPO ATUAL */
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

    /* Pesquisa na tabela de simbolos se a VARIAVEL com o lexema informado existe */
    pesquisaDeclaracaoVarTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && (this.simbolos[i] instanceof SimboloVar)) return true  /* Retorna TRUE caso a variável exista na tabela de simbolos */
        }
        return false    /* Retorna False caso não encontre a variável na tabela de simbolos */
    }

    /* Pesquisa na tabela de simbolos se a VARIAVEL ou FUNÇÃO com o lexema informado existe */
    pesquisaDeclaracaoVarFuncTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && (this.simbolos[i] instanceof SimboloVar || this.simbolos[i] instanceof SimboloFuncao)) return true /* Retorna TRUE caso exista variável ou função na tabela de símbolos */
        }
        return false    /* Retorna FALSE caso não encontre a variável ou função na tabela de símbolos */
    }

    /* Pesquisa na tabela de simbolos se o PROCEDIMENTO com o lexema informado já existe */
    pesquisaDeclaracaoProcTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloProcedimentoPrograma) return true   /* Retorna TRUE caso o procedimento exista na tabela de simbolos */
        }
        return false    /* Retorna FALSE caso não encontre o procedimento na tabela de símbolos */
    }

    /* Pesquisa na tabela de simbolos se a FUNÇÃO com o lexema informado já existe */
    pesquisaDeclaracaoFuncTabela(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloFuncao) return true /* Caso a função já existir retorna TRUE */
        }
        return false    /* Caso a função ainda não existir retorna FALSE */
    }

    /* Retorna Endereço de memória para variável */
    retornaEnderecoMemoriaVar(lexema) {
        /* Busca: fim para início */
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && this.simbolos[i] instanceof SimboloVar) return this.simbolos[i].memoria    /* Retorna o primeiro endereço de memória para a variável encontrada com o lexema informado */
        }
        return false
    }

    pesquisaParaPosfixa(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema) return this.simbolos[i]
        }
    }

    /* Retorna quantas variaveis existem no escopo de uma subrotina/programa, para utilizar no DALLOC */
    quantidadeVariaveis() {
        let i = this.simbolos.length - 1;
        let count = 0;

        /* Retorna a quantidade de variável no escopo atual */
        while (this.simbolos[i].escopo != true) {
            if (this.simbolos[i] instanceof SimboloVar) /* Caso o símbolo do escopo atual for uma variável, incrementar contador */
                count = count + 1;

            i = i - 1;  /* Decrementar posição da tabela de simbolos para comparação */
        }

        return count;   /* Retorna o contador para a chamada superior */
    }

    /* Retorna o LABEL (NUMERO) armazenado na tabela de simbolos para procedimentos ou funções */
    retornaLabelSubrotina(lexema) {
        for (let i = this.simbolos.length - 1; i >= 0; i--) {
            if (this.simbolos[i].lexema == lexema && (this.simbolos[i] instanceof SimboloFuncao || this.simbolos[i] instanceof SimboloProcedimentoPrograma)) return this.simbolos[i].rotulo
        }
        return false
    }

    /* Verifica se o lexema informado corresponde ao nome do programa principal (primeira entrada na tabela de simbolos) */
    programaPrincipal(lexema) {
        if (this.simbolos[0].lexema == lexema && this.simbolos[0] instanceof SimboloProcedimentoPrograma) return true;

        return false;
    }
}

/* Classe SIMBOLO que compõe a base da tabela de simbolos */
class Simbolo {
    constructor(lexema, escopo) {
        /* A estrutura base para símbolos (Todos os símbolos) conterão um lexema e um escopo */
        this.lexema = lexema;
        this.escopo = escopo;
    }
}

/* Extensão do Simbolo, específico para VARIAVEIS */
class SimboloVar extends Simbolo {
    constructor(lexema, escopo, memoria, tipo) {
        /* Variáveis conterão LEXEMA, ESCOPO, MEMÓRIA e TIPO */
        super(lexema, escopo);
        this.memoria = memoria;
        this.tipo = tipo;
    }
}
/* Extensão do Simbolo, específico para FUNCÕES */
class SimboloFuncao extends Simbolo {
    constructor(lexema, escopo, tipo, rotulo) {
        /* Funções conterão LEXEMA, ESCOPO, TIPO e ROTULO */
        super(lexema, escopo);
        this.tipo = tipo;
        this.rotulo = rotulo;
    }
}

/* Extensão do Simbolo, específico para PROCEDIMENTOS ou PROGRAMA */
class SimboloProcedimentoPrograma extends Simbolo {
    constructor(lexema, escopo, rotulo) {
        /* Procedimentos e o nome do Programa contarão LEXEMA, ESCOPO e RÓTULO */
        super(lexema, escopo);
        this.rotulo = rotulo;
    }
}