import Lexico from '../Lexico/Lexico'

class Sintatico {
    constructor(codigo) {
        this.lexico = new Lexico(codigo)
        this.token = null
    }

    analisador() {
        this.token = this.Lexico.pegaToken()
        if (this.token.simbolo == 'sprograma') {
            this.token = this.lexico.pegaToken()
            if (this.token.simbolo == 'sindentificador') {
                this.token = this.lexico.pegaToken()
                if (this.token.simbolo == 'spontovirgula') {
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
        this.token = this.lexico.pegaToken()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {
        if (this.token.simbolo == 'svar') {
            this.token = this.lexico.pegaToken()
            if (this.token.simbolo == 'sidentificador') {
                while (this.token.simbolo == 'sidentificador') {
                    this.analisaVariaveis()
                    if (this.token.simbolo == 'spontovirgula') {
                        this.token = this.lexico.pegaToken()
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
                this.token = this.lexico.pegaToken()
                if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') {
                    if (this.token.simbolo == 'svirgula') {
                        this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        this.analisaTipo()
    }

    analisaTipo() {
        if (this.token.simbolo != 'sinteiro' || this.token.simbolo != 'sbooleano') {
            this.raiseError('Erro analisaTipo()')
        }
        this.token = this.lexico.pegaToken()
    }

    analisaComandos() {
        if (this.token.simbolo == 'sinicio') {
            this.token = this.lexico.pegaToken()
            this.analisaComandoSimples()
            while (this.token.simbolo != 'sfim') {
                if (this.token.simbolo == 'spontovirgula') {
                    this.token = this.lexico.pegaToken()
                    if (this.token.simbolo != 'sfim') {
                        this.analisaComandoSimples()
                    }
                }
                else {
                    this.raiseError('Erro anailsaComandos()')
                }
            }
            this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        if (this.token.simbolo == 'satribuicao') {
            this.analisaAtribuicao()
        }
        else {
            this.chamadaProcedimento()
        }
    }

    analisaLeia() {
        this.token = this.lexico.pegaToken()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.pegaToken()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.pegaToken()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        this.analisaExpressao()
        if (this.token.simbolo == 'sfaca') {
            this.token = this.lexico.pegaToken()
            this.analisaComandoSimples()
        }
        else {
            this.raiseError('Erro analisaEnquanto()')
        }
    }

    analisaSe() {
        this.token = this.lexico.pegaToken()
        this.analisaExpressao()
        if (this.token.simbolo == 'sentao') {
            this.token = this.lexico.pegaToken()
            this.analisaComandoSimples()
            if (this.token.simbolo == 'ssenao') {
                this.token = this.lexico.pegaToken()
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
                this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        if (this.token.simbolo == 'sindentificador') {
            this.token = this.lexico.pegaToken()
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
        this.token = this.lexico.pegaToken()
        if (this.token.simbolo == 'sindentificador') {
            this.token = this.lexico.pegaToken()
            if (this.token.simbolo == 'sdoispontos') {
                this.token = this.lexico.pegaToken()
                if (this.token.simbolo == 'sinteiro' || this.token.simbolo == 'sbooleano') {
                    this.token = this.lexico.pegaToken()
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
            this.token = this.lexico.pegaToken()
            this.analisaExpressaoSimples()
        }
    }

}