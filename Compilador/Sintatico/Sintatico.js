import Lexico from '../Lexico/Lexico'

class Sintatico {
    constructor(codigo) {
        this.Lexico = new Lexico(codigo)
        this.token = null
    }

    analisador() {
        this.token = this.Lexico.pegaToken()
        if (this.token.simbolo == 'sprograma') {
            this.token = this.Lexico.pegaToken()
            if (this.token.simbolo == 'sindentificador') {
                this.token = this.Lexico.pegaToken()
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
        this.token = this.Lexico.pegaToken()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {
        if (this.token.simbolo == 'svar') {
            this.token = this.Lexico.pegaToken()
            if (this.token.simbolo == 'sidentificador') {
                while (this.token.simbolo == 'sidentificador') {
                    this.analisaVariaveis()
                    if (this.token.simbolo == 'spontovirgula') {
                        this.token = this.Lexico.pegaToken()
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
                this.token = this.Lexico.pegaToken()
                if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') {
                    if (this.token.simbolo == 'svirgula') {
                        this.token = this.Lexico.pegaToken()
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
        this.token = this.Lexico.pegaToken()
        this.analisaTipo()
    }

    analisaTipo() {
        if (this.token.simbolo != 'sinteiro' || this.token.simbolo != 'sbooleano') {
            this.raiseError('Erro analisaTipo()')
        }
        this.token = this.Lexico.pegaToken()
    }

    analisaComandos() {
        if (this.token.simbolo == 'sinicio') {
            this.token = this.Lexico.pegaToken()
            this.analisaComandoSimples()
            while (this.token.simbolo != 'sfim') {
                if (this.token.simbolo == 'spontovirgula') {
                    this.token = this.Lexico.pegaToken()
                    if (this.token.simbolo != 'sfim') {
                        this.analisaComandoSimples()
                    }
                }
                else {
                    this.raiseError('Erro anailsaComandos()')
                }
            }
            this.token = this.Lexico.pegaToken()
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

    }

}