class Sintatico {
    constructor(codigo) {
        this.lexico = new Lexico(codigo)
        this.tabela = new TabelaSimbolos();
        this.token = null
        this.escopoAtual = 0
    }

    analisador() { // Main Sintatico
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sprograma') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.tabela.insereTabela(this.token.lexema, true, null, null) /* Insere Tabela Simbolos */
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sponto_virgula') {
                    this.analisaBloco()
                    if (this.token.simbolo == 'sponto') {
                        //if(dev) console.log(this.token)
                        this.token = this.lexico.analisador()
                        //if(dev) console.log(this.token)

                        // Se acabou arquivo ou comentario
                        if (this.token.simbolo === 'SEOF') {
                            if (dev) console.log("SUCESSO")
                        }
                        // Se nao
                        else
                            this.raiseError("Erro Sintático: Token '" + this.token.simbolo + "' não esperado")
                    }
                    else {
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter '.' esperado após símbolo 'sfim' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado após nome do programa")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador do programa '" + this.token.lexema + "' inválido")
            }
        }
        else {
            this.raiseError("Erro Sintático: Esperado 'programa' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaBloco() {
        if (dev) console.log("Sintatico: AnalisaBloco")
        this.token = this.lexico.analisador()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {
        if (dev) console.log("Sintatico: analisaEtVariaveis")
        if (this.token.simbolo == 'svar') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                while (this.token.simbolo == 'sidentificador') {
                    this.analisaVariaveis()
                    if (this.token.simbolo == 'sponto_virgula')
                        this.token = this.lexico.analisador()
                    else {
                        this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter ';' não encontrado após declaração de variáveis")
                    }
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }
        }
    }

    analisaVariaveis() {
        if (dev) console.log("Sintatico: analisaVariaveis")
        do {
            if (this.token.simbolo == 'sidentificador') {
                if (!this.tabela.pesquisaTabelaCriaVar(this.token.lexema)) {   /* Verifica se a variável não está duplicada no mesmo escopo */
                    this.tabela.insereTabela(this.token.lexema, false, 0, 0)    /* Se não existir nada duplicado insere na tabela */
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') {
                        if (this.token.simbolo == 'svirgula') {
                            this.token = this.lexico.analisador()
                            if (this.token.simbolo == 'sdoispontos') {
                                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                                this.raiseError("Erro Sintático: Váriavel não encontrada após ',' -> Encontrado '" + this.token.lexema + "'")
                            }
                        }
                    }
                    else {
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter ':' não encontrado antes da declaração de tipo -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de simbolos: Identificador '" + this.token.lexema + "' já declarado nesse escopo.")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }

        } while (this.token.simbolo != 'sdoispontos')
        this.token = this.lexico.analisador()
        this.analisaTipo()
    }

    analisaTipo() {
        if (dev) console.log("Sintatico: analisaTipo")
        if (this.token.simbolo != 'sinteiro' && this.token.simbolo != 'sbooleano') {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Tipo de variável inválido, esperado 'inteiro' ou 'booleano' -> Encontrado '" + this.token.lexema + "'")
        }
        else {
            this.tabela.insereTipoVariaveis(this.token.lexema) /* Insere tipo nas variáveis */
            this.token = this.lexico.analisador()
        }
    }

    analisaComandos() {
        if (dev) console.log("Sintatico: analisaComandos")
        if (this.token.simbolo == 'sinicio') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
            while (this.token.simbolo != 'sfim') {
                if (this.token.simbolo == 'sponto_virgula') {
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo != 'sfim')
                        this.analisaComandoSimples()

                }
                else {
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado ou COMANDO INVÁLIDO")
                }
            }
            this.token = this.lexico.analisador()
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: 'inicio' não encontrado no bloco de comandos -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaComandoSimples() {
        if (dev) console.log("Sintatico: analisaComandoSimples")
        switch (this.token.simbolo) {
            case 'sidentificador':
                this.analisaAtribChprocedimento()
                break;
            case 'sse':
                this.analisaSe()
                break;
            case 'senquanto':
                this.analisaEnquanto()
                break;
            case 'sleia':
                this.analisaLeia()
                break;
            case 'sescreva':
                this.analisaEscreva()
                break;
            default:
                this.analisaComandos()
                break;
        }
    }

    analisaAtribChprocedimento() {
        if (dev) console.log("Sintatico: analisaAtribChprocedimento")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'satribuicao') {
            this.lexico.analisador()
            this.analisaExpressao()
        }
        else {
            this.analisaChamadaProcedimento()
        }
    }

    analisaLeia() {
        if (dev) console.log("Sintatico: analisaLeia")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                if (this.tabela.pesquisaDeclaracaoVarTabela(this.token.lexema)) {
                    // --> {DUVIDA} O QUE É PESQUISA EM TODA TABELA (QUA) <-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo == 'sfecha_parenteses') {
                        this.token = this.lexico.analisador()
                    }
                    else {
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de Simbolos: Variável '" + this.token.lexema + "' não declarada")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'leia'")
            }
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEscreva() {
        if (dev) console.log("Sintatico: analisaEscreva")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                if (this.tabela.pesquisaDeclaracaoVarFuncTabela(this.token.lexema)) {
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo == 'sfecha_parenteses') {
                        this.token = this.lexico.analisador()
                    }
                    else {
                        if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Tabela de Simbolos: Variável ou Função '" + this.token.lexema + "' não declarada")
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'escreva'")
            }
        }
        else {
            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEnquanto() {
        if (dev) console.log("Sintatico: analisaEnquanto")
        this.token = this.lexico.analisador()
        this.analisaExpressao()
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
        if (this.token.simbolo == 'sprocedimento' || this.token.simbolo == 'sfuncao') {
            // Geracao de codigo
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
        }
    }

    analisaDeclaracaoProcedimento() {
        if (dev) console.log("Sintatico: analisaDeclaracaoProcedimento")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sidentificador') {

            // if pesquisa semantico - Falta Fazer - pesquisa_declproc_tabela(token.lexema)
            // se nao encontrou insere na tabela
            if (!this.tabela.pesquisaDeclaracaoProcTabela(this.token.lexema)) {
                this.tabela.insereTabela(this.token.lexema, true)
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
                this.tabela.insereTabela(this.token.lexema, true, null, 0)
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
            this.token = this.lexico.analisador()
            this.analisaExpressaoSimples()
        }
    }

    analisaExpressaoSimples() {
        if (dev) console.log("Sintatico: analisaExpressaoSimples")
        if (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos')
            this.token = this.lexico.analisador()
        this.analisaTermo()
        while (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos' || this.token.simbolo == 'sou') {
            this.token == this.lexico.analisador()
            this.analisaTermo()
        }

    }

    analisaTermo() {
        if (dev) console.log("Sintatico: analisaTermo")
        this.analisaFator()
        while (this.token.simbolo == 'smult' || this.token.simbolo == 'sdiv' || this.token.simbolo == 'se') {
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
                    this.analisaChamadaFuncao()
                }
                else {
                    this.token = this.lexico.analisador()
                }
            }
            else {
                if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Tabela de Simbolos: Indentificador '" + this.token.lexema + "' não declarado ou fora de escopo")
            }
        } else {
            if (this.token.simbolo == 'snumero') {
                this.token = this.lexico.analisador()
            }
            else {
                if (this.token.simbolo == 'snao') {
                    this.token = this.lexico.analisador()
                    this.analisaFator()
                } else {
                    if (this.token.simbolo == 'sabre_parenteses') {
                        this.token = this.lexico.analisador()
                        this.analisaExpressao()
                        if (this.token.simbolo == 'sfecha_parenteses') {
                            this.token = this.lexico.analisador()
                        }
                        else {
                            if (this.token.linha == null) this.token.linha = this.token.numLinhaAnterior
                            if (dev) console.log(this.token)
                            this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                        }
                    } else {
                        if (this.token.lexema == 'verdadeiro' || this.token.lexema == 'falso') {
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

    analisaChamadaProcedimento() {
        if (dev) console.log("Sintatico: analisaChamadaProcedimento")
    }

    raiseError(error) {
        throw {
            arquivo: "Sintatico",
            numLinha: this.token.linha,
            msg: error
        }
    }
}
