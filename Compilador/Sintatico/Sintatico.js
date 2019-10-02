class Sintatico {
    constructor(codigo) {
        this.lexico = new Lexico(codigo)
        this.token = new Token
    }

    analisador() { // Main Sintatico
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sprograma') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sponto_virgula') {
                    this.analisaBloco()
                    if (this.token.simbolo == 'sponto') {
                        // Se acabou arquivo ou comentario
                        //Sucesso
                        // Se nao
                        // ERRO
                    }
                    else {
                        this.raiseError('Faltando token "."')
                    }
                }
                else {
                    this.raiseError('Faltando token ";"')
                }
            }
            else {
                this.raiseError('Erro Indentificador do programa')
            }
        }
        else {
            this.raiseError('Erro no inicio do programa')
        }
    }

    analisaBloco() {
        this.token = this.lexico.analisador()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {
        if (this.token.simbolo == 'svar') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                while (this.token.simbolo == 'sidentificador') {
                    this.analisaVariaveis()
                    if (this.token.simbolo == 'spontovirgula') {
                        this.token = this.lexico.analisador()
                    }
                    this.raiseError('Erro analisaEtVariaveis()')
                }
            }
            else {
                this.raiseError('Erro analisaEtVariaveis()')
            }
        }
    }

    analisaVariaveis() {
        do {
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') {
                    if (this.token.simbolo == 'svirgula') {
                        this.token = this.lexico.analisador()
                        if (this.token.simbolo == 'sdoispontos') {
                            this.raiseError('Erro analisaVariaveis()')
                        }
                    }
                }
                else {
                    this.raiseError('Erro analisaVariaveis()')
                }
            }
            else {
                this.raiseError('Erro analisaVariaveis()')
            }
        } while (this.token.simbolo != 'sdoispontos')
        this.token = this.lexico.analisador()
        this.analisaTipo()
    }

    analisaTipo() {
        if (this.token.simbolo != 'sinteiro' || this.token.simbolo != 'sbooleano') {
            this.raiseError('Erro analisaTipo()')
        }
        this.token = this.lexico.analisador()
    }

    analisaComandos() {
        if (this.token.simbolo == 'sinicio') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
            while (this.token.simbolo != 'sfim') {
                if (this.token.simbolo == 'spontovirgula') {
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo != 'sfim') {
                        this.analisaComandoSimples()
                    }
                }
                else {
                    this.raiseError('Erro anailsaComandos()')
                }
            }
            this.token = this.lexico.analisador()
        }
        else {
            this.raiseError('Erro anailsaComandos()')
        }
    }

    analisaComandoSimples() {
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
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'satribuicao') {
            this.analisaAtribuicao()
        }
        else {
            this.analisaChamadaProcedimento()
        }
    }

    analisaLeia() {
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sfecha_parenteses') {
                    this.token = this.lexico.token
                }
                else {
                    this.raiseError('Erro analisaLeia()')
                }
            }
            else {
                this.raiseError('Erro analisaLeia()')
            }
        }
        else {
            this.raiseError('Erro analisaLeia()')
        }
    }

    analisaEscreva() {
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sfecha_parenteses') {
                    this.token = this.lexico.token
                }
                else {
                    this.raiseError('Erro analisaEscreva()')
                }
            }
            else {
                this.raiseError('Erro analisaEscreva()')
            }
        }
        else {
            this.raiseError('Erro analisaEscreva()')
        }
    }

    analisaEnquanto() {
        this.token = this.lexico.analisador()
        this.analisaExpressao()
        if (this.token.simbolo == 'sfaca') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
        }
        else {
            this.raiseError('Erro analisaEnquanto()')
        }
    }

    analisaSe() {
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
            this.raiseError('Erro analisaSe()')
        }
    }

    analisaSubrotinas() {
        let flag = 0
        if (this.token.simbolo == 'sprocedimento' || this.token.simbolo == 'sfuncao') {
            // Geracao de codigo
        }
        while (this.token.simbolo == 'sprocedimento' || this.token.simbolo == 'sfuncao') {
            if (this.token.simbolo == 'sprocedimento') {
                this.analisaDeclaracaoProcedimento()
            }
            else {
                this.analisaDeclaracaoFuncao()
            }
            if (this.token.simbolo == 'spontovirgula') {
                this.token = this.lexico.analisador()
            }
            else {
                this.raiseError('Erro analisaSubrotinas()')
            }
        }
        if (flag == 1) {
            // Geracao de codigo
        }
    }

    analisaDeclaracaoProcedimento() {
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sindentificador') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'spontovirgula') {
                this.analisaBloco()
            }
            else {
                this.raiseError("Erro analisaDeclaracaoProcedimento()")
            }
        }
        else {
            this.raiseError("Erro analisaDeclaracaoProcedimento()")
        }
    }

    analisaDeclaracaoFuncao() {
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sindentificador') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sdoispontos') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sinteiro' || this.token.simbolo == 'sbooleano') {
                    this.token = this.lexico.analisador()
                    if (this.token.simbolo == 'spontovirgula') {
                        this.analisaBloco()
                    }
                    else {
                        this.raiseError("Erro analisaDeclaracaoFuncao()")
                    }
                }
                this.raiseError("Erro analisaDeclaracaoFuncao()")
            }
        }
        this.raiseError("Erro analisaDeclaracaoFuncao()")
    }

    analisaExpressao() {
        this.analisaExpressaoSimples()
        if (this.token.simbolo == 'smaior' || this.token.simbolo == 'smaiorig' || this.token.simbolo == 'smenor' || this.token.simbolo == 'smenorir' || this.token.simbolo == 'sdif') {
            this.token = this.lexico.analisador()
            this.analisaExpressaoSimples()
        }
    }

    analisaExpressaoSimples() {
        if (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos') {
            this.token = this.lexico.analisador()
            this.analisaTermo()
            while (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos' || this.token.simbolo == 'sou') {
                this.token == this.lexico.analisador()
                this.analisaTermo()
            }
        }
    }

    analisaTermo() {
        this.analisaFator()
        while (this.token.simbolo == 'smult' || this.token.simbolo == 'sdiv' || this.token.simbolo == 'se') {
            this.token = this.lexico.analisador()
            this.analisaFator()
        }
    }

    analisaFator() {
        if (this.token.simbolo == 'sidentificador') {
            this.analisaChamadaFuncao()
        }
        else {
            if (this.token.simbolo == 'snumero') {
                this.token = this.lexico.analisador()
            }
            else {
                if (this.token.simbolo == 'snao') {
                    this.token = this.lexico.analisador()
                    this.analisaFator()
                }
                else {
                    if (this.token.simbolo == 'sabre_parenteses') {
                        this.token = this.lexico.analisador()
                        this.analisaExpressao()
                        if (this.token.simbolo == 'sfecha_parentes') {
                            this.token = this.lexico.analisador()
                        }
                        else {
                            this.raiseError("Erro analisaFator()")
                        }
                    }
                    else {
                        if (this.token.lexema == 'verdadeiro' || this.token.lexema == 'falso') {
                            this.token = this.lexico.analisador()
                        }
                        else {
                            this.raiseError("Erro analisaFator()")
                        }
                    }
                }
            }
        }
    }

    raiseError(error) {
        console.log(error)
        console.log('Token Lex: ' + this.token.lexema)
        console.log('Token Sim: ' + this.token.simbolo)
        console.log('Token Lin: ' + this.token.linha)

    }
}