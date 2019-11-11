class Sintatico {
    constructor(codigo) {
        this.lexico = new Lexico(codigo)
        this.tabela = new TabelaSimbolos();
        this.geradorCodigo = new GeradorCodigo();
        this.token = null
        this.escopoAtual = 0
        this.semantico = new Semantico()
    }

    analisador() { /* Main do compilador */
        this.token = this.lexico.analisador()   /* Le um token */
        this.geradorCodigo.START(); /* Gerador Codigo: START */
        if (this.token.simbolo == 'sprograma') {    /* Se token for sprograma */
            this.token = this.lexico.analisador()   /* Então Lê o proximo Token */
            if (this.token.simbolo == 'sidentificador') { /* Se token for o identificador do programa */
                this.tabela.insereTabela(this.token.lexema, true, null, null, this.geradorCodigo.retornarContador()) /* Insere o identificador do programa na Tabela Simbolos */
                this.token = this.lexico.analisador()   /* Lê o proximo Token */
                if (this.token.simbolo == 'sponto_virgula') {   /* Se ler um ponto e virgula, terminou a declaracao do programa */
                    this.analisaBloco() /* Analisa Variaveis, Procedimentos, Funcoes e Comandos -> Todo o Programa */
                    if (this.token.simbolo == 'sponto') {   /* Ao fim, quando ler ponto, indica o fim do progama principal */
                        this.token = this.lexico.analisador()   /* Então lê o proximo Token, que deve ser EOF */

                        /* Se acabou o código da LPD */
                        if (this.token.simbolo === 'SEOF') { /* Se o ultimo token for EOF */
                            this.geradorCodigo.HLT()    /* Então, gera o Código HLT */
                            if (dev) console.log("SUCESSO")
                        }
                        /* Se ainda existir código após o ponto final, Gerar erro pois nao deve existir código apos o termino da main */
                        else
                            this.raiseError("Erro Sintático: Token '" + this.token.simbolo + "' não esperado")
                    }
                    else {  /* Gerar erro caso nao encontre o token sponto no final do programa */
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter '.' esperado após símbolo 'sfim' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {  /* Gerar erro caso não encontre sponto_virgula após o identificador do programa principal */
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado após nome do programa")
                }
            }
            else {  /* Se não encontrar um identificador para o programa, gerar erro */
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador do programa '" + this.token.lexema + "' inválido")
            }
        }
        else {  /* Se o primeiro token não for sprograma Gera Erro */
            this.raiseError("Erro Sintático: Esperado 'programa' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaBloco() {    /* Responsável pelas etapas de declaração de variáveis, subrotinas e comandos */
        if (dev) console.log("Sintatico: AnalisaBloco")
        this.token = this.lexico.analisador()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {  /* Etapa de declaração de variáveis () */
        if (dev) console.log("Sintatico: analisaEtVariaveis")
        if (this.token.simbolo == 'svar') { /* Se ler o token svar */
            this.token = this.lexico.analisador()   /* Então lê o próximo token */
            if (this.token.simbolo == 'sidentificador') { /* Se o próximo token for um identificador */
                while (this.token.simbolo == 'sidentificador') { /* Então enquanto for identificador */
                    this.analisaVariaveis() /* Analise as variáveis (mesmo tipo) */
                    if (this.token.simbolo == 'sponto_virgula') /* Quando encontrar um ponto e virgula indica que acabaram as variaveis para tal tipo */
                        this.token = this.lexico.analisador()   /* Então, ler o próximo token, se for identificador, continua a declarar as variáveis */
                    else {  /* Se não encontrar ponto e virgula após o tipo das variáveis, gerar erro */
                        this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter ';' não encontrado após declaração de variáveis")
                    }
                }
            }
            else {  /* Se nas variáveis não encontrar um identificador, Gerar Erro */
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }
        }
    }

    analisaVariaveis() {    /* Analisa Variáveis do mesmo Tipo */
        let quantidadeVariaveis;
        quantidadeVariaveis = 0;    /* Armazena quantas variaveis foram declaradas do mesmo tipo */
        if (dev) console.log("Sintatico: analisaVariaveis")
        do {
            if (this.token.simbolo == 'sidentificador') {   /* Quando encontrar um identificador */
                if (!this.tabela.pesquisaTabelaCriaVar(this.token.lexema)) {   /* Verifica se a variável não está duplicada no mesmo escopo */
                    this.tabela.insereTabela(this.token.lexema, false, this.geradorCodigo.posicaoMemoria, 0, null)    /* Se não existir nada duplicado insere na tabela de Simbolos */
                    this.token = this.lexico.analisador()   /* Lê o proximo Token */
                    if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') { /* Se o proximo Token for Svirgula ou Sdois_pontos */
                        if (this.token.simbolo == 'svirgula') { /* Então se for svirgula, existem mais variáveis */
                            this.token = this.lexico.analisador()   /* Lê o proximo Token */
                            if (this.token.simbolo == 'sdoispontos') {  /* Se o proximo token for sdois_pontos Gerar Erro pois após uma virgula deve existir um identificador */

                                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                                this.raiseError("Erro Sintático: Váriavel não encontrada após ',' -> Encontrado '" + this.token.lexema + "'")
                            }
                        }
                    }
                    else {  /* Gerar erro caso não encontrar sdois_pontos ou svirgula após os identificadores */
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter ':' não encontrado antes da declaração de tipo -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {  /* Gerar erro caso exista um identificador com o mesmo nome no mesmo escopo da tabela de simbolos */
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de simbolos: Identificador '" + this.token.lexema + "' já declarado nesse escopo.")
                }
            }
            else {  /* Se não encontrar um idenfiticador na declaração de variáveis, gerar erro */
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }

            /* Após declarar uma variável com sucesso, incrementar o contador de variáveis LOCAL para o comando VAR (Linha) */
            quantidadeVariaveis++;
            /* Incrementar a variável auxiliar que armazena a posição de memória que serão alocadas as variáveis */
            this.geradorCodigo.posicaoMemoria++;

        } while (this.token.simbolo != 'sdoispontos')   /* Repete todo o bloco de declaração de variáveis enquanto não encontrar um dois pontos */

        /* Gera um ALLOC para as variáveis declaradas nesse escopo */
        this.geradorCodigo.ALLOC(this.geradorCodigo.posicaoMemoria - quantidadeVariaveis, quantidadeVariaveis);
        this.token = this.lexico.analisador() /* Lê o próximo Token */
        this.analisaTipo()  /* Chama a subrotina para analisar o tipo das variáveis declaradas */
    }

    analisaTipo() {     /* Analisa o tipo das variaveis quando encontrar um sdoispontos */
        if (dev) console.log("Sintatico: analisaTipo")
        if (this.token.simbolo != 'sinteiro' && this.token.simbolo != 'sbooleano') {    /* Se encontrar um tipo DIFERENTE de INTEIRO ou BOOLEANO */
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior    /* Então gerar ERRO de tipo inválido */
            this.raiseError("Erro Sintático: Tipo de variável inválido, esperado 'inteiro' ou 'booleano' -> Encontrado '" + this.token.lexema + "'")
        }
        else {  /* Senão, chamar subrotina da Tabela de Simbolos que insere tipo nas variáveis que ainda NÃO POSSUEM TIPO */
            this.tabela.insereTipoVariaveis(this.token.lexema) /* Insere tipo nas variáveis */
            this.token = this.lexico.analisador()   /* Lê o proximo Token */
        }
    }

    analisaComandos() {     /* Analisa o bloco de comandoSS (Plural =  mais de um comando) */
        if (dev) console.log("Sintatico: analisaComandos")
        if (this.token.simbolo == 'sinicio') {  /* Se lêr o token sinicio */
            this.token = this.lexico.analisador()   /* Então lê o próximo Token */
            this.analisaComandoSimples()            /* E analisa o proximo comando simples (Um único comando) */
            while (this.token.simbolo != 'sfim') {  /* Enquanto não encontrar o token de FIM */
                if (this.token.simbolo == 'sponto_virgula') {   /* Necessita encontrar um ponto e virgula ao fim de cada comando, com exceção do último */
                    this.token = this.lexico.analisador()       /* Lê o proximo Token */
                    if (this.token.simbolo != 'sfim')   /* Se o proximo Token for Diferente de FIM */
                        this.analisaComandoSimples()    /* Continua analisando os comandos simples */
                }
                else { /* Gerar ERRO se não encontrar um ; ao FINAL de cada comando simples */
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado ou COMANDO INVÁLIDO")
                }
            }
            this.token = this.lexico.analisador()   /* Lê o proximo Token */
        }
        else {  /* Gerar Erro se não encontrar o token sinicio no começo do bloco de multiplos comandos simples */
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: 'inicio' não encontrado no bloco de comandos -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaComandoSimples() {   /* Analisa os comandos simples */
        if (dev) console.log("Sintatico: analisaComandoSimples")
        switch (this.token.simbolo) {
            case 'sidentificador':  /* Se encontrar um identificador */
                this.analisaAtribChprocedimento()   /* Então Analisa atribuição ou chamada de procedimento */
                break;
            case 'sse': /* Se encontrar um SE */
                this.analisaSe()    /* Então Analisa comando condicional SE */
                break;
            case 'senquanto':   /* Se encontrar um enquanto */
                this.analisaEnquanto()  /* Então analisa o comando iterativo ENQUANTO */
                break;
            case 'sleia':   /* Se encontrar o comando leia */
                this.analisaLeia()  /* Então analisa o comando de entrada de dados LEIA */
                break;
            case 'sescreva':    /* Se encontrar um escreva */
                this.analisaEscreva()   /* Então analisa o comando de saida de dados ESCREVA */
                break;
            default:    /* Se não encontrar nenhum dos comandos acima */
                this.analisaComandos()  /* Então voltar a analisar comandos pois pode ter encontrado um Token sfim */
                break;
        }
    }

    analisaAtribChprocedimento() {  /* Analisa a atribuição de variáveis ou a chamada de um procedimento */
        let lexemaAuxiliar;

        if (dev) console.log("Sintatico: analisaAtribChprocedimento")
        // Semantico
        this.semantico.pushExpressao(this.token)

        this.token = this.lexico.analisador()   /* Lê o proximo Token */
        if (this.token.simbolo == 'satribuicao') {  /* Se o proximo token for um := */
            /* Então quer dizer que estamos tratando uma atribuição */
            // Semantico
            this.semantico.pushExpressao(this.token)

            lexemaAuxiliar = this.token.lexema; /* Armazena o lexema da variavel/procedimento que será usado para obter o end. de memória ou respectivo label */
            this.lexico.analisador()    /* Então Lê o proximo Token */
            this.analisaExpressao()     /* Analisa a expressão sintaticamente após := */

            // Semantico
            this.semantico.analisaAtribuicao()   /* Analisa a expressão semânticamente após := */

            /* Geração de código para a atribuição */
            this.geradorCodigo.STR(this.tabela.retornaEnderecoMemoriaVar())
        }
        else {
            this.analisaChamadaProcedimento(lexemaAuxiliar)   /* Se não for := então é chamada de procedimento */
            /* O codigo será gerado dentro da função analisaChamadaProcedimento */
        }
    }

    analisaLeia() { /* Analisa o comando LEIA(identificador) */
        let lexemaAuxiliar;

        console.table(this.tabela.simbolos)
        if (dev) console.log("Sintatico: analisaLeia")
        this.token = this.lexico.analisador()   /* Lê o proximo Token (já foi lido o comando leia) */
        if (this.token.simbolo == 'sabre_parenteses') { /* Se encontrar abre parenteses */
            this.token = this.lexico.analisador()   /* Então Lê o proximo Token */
            if (this.token.simbolo == 'sidentificador') {   /* Se encontrar um identificador */
                lexemaAuxiliar = this.token.lexema  /* Armazena o lexema auxiliar para conseguir o retorno de memória */

                if (this.tabela.pesquisaDeclaracaoVarTabela(this.token.lexema)) {   /* Se o identificador existir e for uma variável na tabela de simbolos */
                    /* Gera o código para o comando Leia() -> RD e STR */
                    this.geradorCodigo.RD();
                    this.geradorCodigo.STR(this.tabela.retornaEnderecoMemoriaVar(lexemaAuxiliar));

                    this.token = this.lexico.analisador()   /* Então lê o proximo Token */
                    if (this.token.simbolo == 'sfecha_parenteses') {    /* Se ler fecha parenteses */
                        this.token = this.lexico.analisador()   /* Então lê o proximo token e finaliza o comando leia */
                    }
                    else {  /* Se não encontrar fecha parenteses Gerar Erro */
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {  /* Gerar erro se o identificador não existir ou não for variável na tabela de simbolos */
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de Simbolos: Variável '" + this.token.lexema + "' não declarada")
                }
            }
            else {  /* Se não encontrar um identificador no comando leia() Gerar erro */
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'leia'")
            }
        }
        else {  /* Gerar erro se não encontrar abre parenteses após o token sleia */
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEscreva() {  /* Analisa o comando ESCREVA(identificador) */
        let lexemaAuxiliar;
        let ehVariavel; /* Se o identificador for uma váriavel, armazena seu end. de memória, se o identificador for uma função, armazena o booleano FALSE */

        if (dev) console.log("Sintatico: analisaEscreva")
        this.token = this.lexico.analisador()   /* Lê o proximo token */
        if (this.token.simbolo == 'sabre_parenteses') { /* Se o proximo token for abre parenteses */
            this.token = this.lexico.analisador()   /* Então lê o proximo token */
            if (this.token.simbolo == 'sidentificador') {   /* Se o próximo token dor um identificador */
                lexemaAuxiliar = this.token.lexema  /* Armazena o lexema auxiliar para conseguir o retorno de memória caso for uma variável */

                if (this.tabela.pesquisaDeclaracaoVarFuncTabela(this.token.lexema)) {   /* Então pesquisa se o identificador existe na tabela de simbolos como uma função ou variável */

                    /* Pesquisa o identificador, se for função não precisa carregar no topo, se for variável carregar no topo */
                    /* retornaEnderecoMemoriaVar() retorna o valor de memória para a variável, se ela não existir retorna false */
                    ehVariavel = this.tabela.retornaEnderecoMemoriaVar(lexemaAuxiliar);

                    if (!ehVariavel) /* Se o identificador for uma variável */ {
                        /* Então LDV e PRN */
                        this.geradorCodigo.LDV(ehVariavel);
                        this.geradorCodigo.PRN();
                    }
                    else {
                        /* Senão PRN, pois o valor já está na pilha */
                        this.geradorCodigo.PRN();
                    }

                    this.token = this.lexico.analisador()   /* Lê proximo token */
                    if (this.token.simbolo == 'sfecha_parenteses') {    /* Se for fecha parenteses */
                        this.token = this.lexico.analisador()   /* lê o proximo token e termina o comando ESCREVA */
                    }
                    else {  /* Gera erro caso não encontre fecha parenteses */
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {  /* Gera erro caso o identificador não for uma variável ou função */
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de Simbolos: Variável ou Função '" + this.token.lexema + "' não declarada")
                }
            }
            else {  /* Gera erro caso o token não for um identificador  */
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'escreva'")
            }
        }
        else {  /* Caso não encontrar abre parenteses após o comando ESCREVA Gera erro */
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEnquanto() { /* Analisa o comando enquando - faça */
        if (dev) console.log("Sintatico: analisaEnquanto")
        this.token = this.lexico.analisador()
        this.analisaExpressao()

        // Semantico
        this.semantico.analisaExpressao()
        if (this.token.simbolo == 'sfaca') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado 'faca' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaSe() {
        if (dev) console.log("Sintatico: analisaSe")
        this.token = this.lexico.analisador()
        this.analisaExpressao()
        // Semantico
        this.semantico.analisaExpressao()

        if (this.token.simbolo == 'sentao') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
            if (this.token.simbolo == 'ssenao') {
                this.token = this.lexico.analisador()
                this.analisaComandoSimples()
            }
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado 'entao' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaSubrotinas() {
        if (dev) console.log("Sintatico: analisaSubrotinas")
        let flag = 0
        let auxRot
        if (this.token.simbolo == 'sprocedimento' || this.token.simbolo == 'sfuncao') {
            // Geracao de codigo
            auxRot = this.geradorCodigo.retornarContador()
            this.geradorCodigo.JMP(auxRot)
            this.geradorCodigo.incrementarContador()
            flag = 1;
        }
        while (this.token.simbolo == 'sprocedimento' || this.token.simbolo == 'sfuncao') {
            if (this.token.simbolo == 'sprocedimento') {
                this.analisaDeclaracaoProcedimento()
            } else {
                this.analisaDeclaracaoFuncao()
            }
            if (this.token.simbolo == 'sponto_virgula') {
                this.token = this.lexico.analisador()
            }
            else {
                this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Caracter ';' não encontrado após subrotina")
            }
        }
        if (flag == 1) {
            // Geracao de codigo
            this.geradorCodigo.NULL(auxRot)
        }
    }

    analisaDeclaracaoProcedimento() {
        if (dev) console.log("Sintatico: analisaDeclaracaoProcedimento")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sidentificador') {

            // if pesquisa semantico - Falta Fazer - pesquisa_declproc_tabela(token.lexema)
            // se nao encontrou insere na tabela
            if (!this.tabela.pesquisaDeclaracaoProcTabela(this.token.lexema)) {
                this.tabela.insereTabela(this.token.lexema, true, null, null, null)
                this.token = this.lexico.analisador()

                if (this.token.simbolo == 'sponto_virgula') {
                    this.analisaBloco()
                }
                else {
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado após identificador do procedimento")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Tabela de Simbolos: Procedimento '" + this.token.lexema + "' já declarado")
            }
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Identificador '" + this.token.lexema + "' incorreto para a declaração de procedimento")
        }
        this.tabela.atualizarEscopo()
    }

    analisaDeclaracaoFuncao() {
        if (dev) console.log("Sintatico: analisaDeclaracaoFuncao")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sidentificador') {

            if (!this.tabela.pesquisaDeclaracaoVarFuncTabela(this.token.lexema)) {
                // if pesquisa semantico - Falta Fazer - pesquisa_declfunc_tabela(token.lexema)
                // se nao encontrou insere na tabela
                this.tabela.insereTabela(this.token.lexema, true, null, 0, null)
                this.token = this.lexico.analisador()

                if (this.token.simbolo == 'sdoispontos') {
                    this.token = this.lexico.analisador()

                    if (this.token.simbolo == 'sinteiro' || this.token.simbolo == 'sbooleano') {
                        this.tabela.simbolos[this.tabela.simbolos.length - 1].tipo = this.token.lexema
                        if (dev) console.table(this.tabela.simbolos)

                        this.token = this.lexico.analisador()
                        if (this.token.simbolo == 'sponto_virgula') {
                            this.analisaBloco()
                        }
                        else {
                            this.token.linha = this.token.numLinhaAnterior
                            this.raiseError("Erro Sintático: Caracter ';' não encontrado após identificador da função")
                        }
                    }
                    else {
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Tipo de retorno da função inválido, esperado 'inteiro' ou 'booleano' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ':' não encontrado na declaração de tipo da função")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Tabela de Simbolos: Identificador '" + this.token.lexema + "' já utilizado")
            }

        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Identificador '" + this.token.lexema + "' incorreto para a declaração de função")
        }
        this.tabela.atualizarEscopo()
    }

    analisaExpressao() {
        if (dev) console.log("Sintatico: analisaExpressao")
        this.analisaExpressaoSimples()
        if (this.token.simbolo == 'smaior' || this.token.simbolo == 'smaiorig' || this.token.simbolo == 'smenor' || this.token.simbolo == 'smenorig' || this.token.simbolo == 'sdif' || this.token.simbolo == 'sig') {
            // Semnatico
            this.semantico.pushExpressao(this.token)

            this.token = this.lexico.analisador()
            this.analisaExpressaoSimples()
        }
    }

    analisaExpressaoSimples() {
        if (dev) console.log("Sintatico: analisaExpressaoSimples")
        if (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos') {
            // Semantico
            this.semantico.pushExpressao(this.token, true)

            this.token = this.lexico.analisador()
        }
        this.analisaTermo()
        while (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos' || this.token.simbolo == 'sou') {
            // Semnatico
            this.semantico.pushExpressao(this.token)

            this.token == this.lexico.analisador()
            this.analisaTermo()
        }

    }

    analisaTermo() {
        if (dev) console.log("Sintatico: analisaTermo")
        this.analisaFator()
        while (this.token.simbolo == 'smult' || this.token.simbolo == 'sdiv' || this.token.simbolo == 'se') {
            // Semnatico
            this.semantico.pushExpressao(this.token)

            this.token = this.lexico.analisador()
            this.analisaFator()
        }
    }

    analisaFator() {
        if (dev) console.log("Sintatico: analisaFator")
        if (this.token.simbolo == 'sidentificador') {
            if (dev) console.table(this.tabela.simbolos)
            if (this.tabela.pesquisaDeclaracaoVarFuncTabela(this.token.lexema)) {
                if (this.tabela.pesquisaDeclaracaoFuncTabela(this.token.lexema)) {
                    // Semantico
                    this.semantico.pushExpressao(this.token)

                    this.analisaChamadaFuncao()
                }
                else {
                    // Semantico
                    this.semantico.pushExpressao(this.token)

                    this.token = this.lexico.analisador()
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Tabela de Simbolos: Indentificador '" + this.token.lexema + "' não declarado ou fora de escopo")
            }
        } else {
            if (this.token.simbolo == 'snumero') {
                // Semnatico
                this.semantico.pushExpressao(this.token)

                this.token = this.lexico.analisador()
            }
            else {
                if (this.token.simbolo == 'snao') {
                    // Semnatico
                    this.semantico.pushExpressao(this.token)

                    this.token = this.lexico.analisador()
                    this.analisaFator()
                } else {
                    if (this.token.simbolo == 'sabre_parenteses') {
                        // Semnatico
                        this.semantico.pushExpressao(this.token)

                        this.token = this.lexico.analisador()
                        this.analisaExpressao()
                        if (this.token.simbolo == 'sfecha_parenteses') {
                            // Semnatico
                            this.semantico.pushExpressao(this.token)

                            this.token = this.lexico.analisador()
                        }
                        else {
                            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                            if (dev) console.log(this.token)
                            this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                        }
                    } else {
                        if (this.token.lexema == 'verdadeiro' || this.token.lexema == 'falso') {
                            // Semnatico
                            this.semantico.pushExpressao(this.token)

                            this.token = this.lexico.analisador()
                        }
                        else {
                            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                            this.raiseError("Erro Sintático: Expressão está incorreta - Construção de Expressão inválida")
                        }
                    }
                }
            }
        }
    }
    analisaChamadaFuncao() {
        if (dev) console.log("Sintatico: analisaChamadaFuncao")
        this.lexico.analisador()
    }

    analisaChamadaProcedimento(lexemaAuxiliar) {
        if (dev) console.log("Sintatico: analisaChamadaProcedimento")
        /* Gerador de Codigo -> CALL */
    }

    raiseError(error) {
        throw {
            arquivo: "Sintatico",
            numLinha: this.token.linha,
            msg: error
        }
    }

    saveFile() {
        download(this.geradorCodigo.codigoObjeto)
    }
}
