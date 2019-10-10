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
                    if (this.token.simbolo == 'sponto') 
                    {
                        console.log(this.token)
                        this.token = this.lexico.analisador()
                        console.log(this.token)

                        // Se acabou arquivo ou comentario
                        if (this.token.simbolo === 'SEOF')
                        {
                            console.log("SUCESSO")
                        }
                        // Se nao
                        else
                            this.raiseError("Erro Sintático: Token '"+ this.token.simbolo +"' não esperado")
                    }
                    else {
                        if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter '.' esperado após símbolo 'sfim' -> Encontrado '" + this.token.lexema + "'")
                    }
                }
                else {
                    this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado após nome do programa")
                }
            }
            else {
                if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador do programa '" + this.token.lexema + "' inválido")
            }
        }
        else {
            this.raiseError("Erro Sintático: Esperado 'programa' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaBloco() {
        console.log("Sintatico: AnalisaBloco")
        this.token = this.lexico.analisador()
        this.analisaEtVariaveis()
        this.analisaSubrotinas()
        this.analisaComandos()
    }

    analisaEtVariaveis() {
        console.log("Sintatico: analisaEtVariaveis")
        if (this.token.simbolo == 'svar') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                while (this.token.simbolo == 'sidentificador') {
                    this.analisaVariaveis()
                    if (this.token.simbolo == 'sponto_virgula')
                        this.token = this.lexico.analisador()
                    else 
                    {
                        this.token.linha = this.token.numLinhaAnterior
                        this.raiseError("Erro Sintático: Caracter ';' não encontrado após declaração de variáveis")
                    }
                }
            }
            else {
                if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }
        }
    }

    analisaVariaveis() {
        console.log("Sintatico: analisaVariaveis")
        do {
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'svirgula' || this.token.simbolo == 'sdoispontos') {
                    if (this.token.simbolo == 'svirgula') {
                        this.token = this.lexico.analisador()
                        if (this.token.simbolo == 'sdoispontos') {
                            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                            this.raiseError("Erro Sintático: Váriavel não encontrada após ',' -> Encontrado '" + this.token.lexema + "'")
                        }
                    }
                }
                else {
                    if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Caracter ':' não encontrado antes da declaração de tipo -> Encontrado '" + this.token.lexema + "'")
                }
            }
            else {
                if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para variável '" + this.token.lexema + "'")
            }
        } while (this.token.simbolo != 'sdoispontos')
        this.token = this.lexico.analisador()
        this.analisaTipo()
    }

    analisaTipo() {
        console.log("Sintatico: analisaTipo")
        if (this.token.simbolo != 'sinteiro' && this.token.simbolo != 'sbooleano') {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Tipo de variável inválido, esperado 'inteiro' ou 'booleano' -> Encontrado '" + this.token.lexema + "'")
        }
        this.token = this.lexico.analisador()
    }

    analisaComandos() {
        console.log("Sintatico: analisaComandos")
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
                    this.raiseError("Erro Sintático: Caracter ';' não encontrado após comando")
                }
            }
            this.token = this.lexico.analisador()
        }
        else {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: 'inicio' não encontrado no bloco de comandos -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaComandoSimples() {
        console.log("Sintatico: analisaComandoSimples")
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
        console.log("Sintatico: analisaAtribChprocedimento")
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
        console.log("Sintatico: analisaLeia")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sfecha_parenteses') {
                    this.token = this.lexico.analisador()
                }
                else {
                    if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                }
            }
            else {
                if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'leia'")
            }
        }
        else {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEscreva() {
        console.log("Sintatico: analisaEscreva")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sabre_parenteses') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sidentificador') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sfecha_parenteses') {
                    this.token = this.lexico.analisador()
                }
                else {
                    if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                }
            }
            else {
                if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Identificador incorreto para o comando 'escreva'")
            }
        }
        else {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado '(' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaEnquanto() {
        console.log("Sintatico: analisaEnquanto")
        this.token = this.lexico.analisador()
        this.analisaExpressao()
        if (this.token.simbolo == 'sfaca') {
            this.token = this.lexico.analisador()
            this.analisaComandoSimples()
        }
        else {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado 'faca' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaSe() {
        console.log("Sintatico: analisaSe")
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
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Esperado 'entao' -> Encontrado '" + this.token.lexema + "'")
        }
    }

    analisaSubrotinas() {
        console.log("Sintatico: analisaSubrotinas")
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
        console.log("Sintatico: analisaDeclaracaoProcedimento")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sindentificador') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'spontovirgula') {
                this.analisaBloco()
            }
            else {
                this.token.linha = this.token.numLinhaAnterior
                this.raiseError("Erro Sintático: Caracter ';' não encontrado após identificador do procedimento")
            }
        }
        else {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Identificador '" +this.token.lexema + "' incorreto para a declaração de procedimento")
        }
    }

    analisaDeclaracaoFuncao() {
        console.log("Sintatico: analisaDeclaracaoFuncao")
        this.token = this.lexico.analisador()
        if (this.token.simbolo == 'sidentificador') {
            this.token = this.lexico.analisador()
            if (this.token.simbolo == 'sdoispontos') {
                this.token = this.lexico.analisador()
                if (this.token.simbolo == 'sinteiro' || this.token.simbolo == 'sbooleano') {
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
                    if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                    this.raiseError("Erro Sintático: Tipo de retorno da função inválido, esperado 'inteiro' ou 'booleano' -> Encontrado '" + this.token.lexema + "'")
                }
            }
        }
        else 
        {
            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
            this.raiseError("Erro Sintático: Identificador '" +this.token.lexema + "' incorreto para a declaração de função")
        }
    }

    analisaExpressao() {
        console.log("Sintatico: analisaExpressao")
        this.analisaExpressaoSimples()
        if (this.token.simbolo == 'smaior' || this.token.simbolo == 'smaiorig' || this.token.simbolo == 'smenor' || this.token.simbolo == 'smenorir' || this.token.simbolo == 'sdif') {
            this.token = this.lexico.analisador()
            this.analisaExpressaoSimples()
        }
    }

    analisaExpressaoSimples() {
        console.log("Sintatico: analisaExpressaoSimples")
        if (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos')
            this.token = this.lexico.analisador()
        this.analisaTermo()
        while (this.token.simbolo == 'smais' || this.token.simbolo == 'smenos' || this.token.simbolo == 'sou') {
            this.token == this.lexico.analisador()
            this.analisaTermo()
        }

    }

    analisaTermo() {
        console.log("Sintatico: analisaTermo")
        this.analisaFator()
        while (this.token.simbolo == 'smult' || this.token.simbolo == 'sdiv' || this.token.simbolo == 'se') {
            this.token = this.lexico.analisador()
            this.analisaFator()
        }
    }

    analisaFator() {
        console.log("Sintatico: analisaFator")
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
                            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                            this.raiseError("Erro Sintático: Esperado ')' -> Encontrado '" + this.token.lexema + "'")
                        }
                    }
                    else {
                        if (this.token.lexema == 'verdadeiro' || this.token.lexema == 'falso') {
                            this.token = this.lexico.analisador()
                        }
                        else {
                            if(this.token.linha == null)  this.token.linha = this.token.numLinhaAnterior
                            this.raiseError("Erro na expressão, esperado lexema 'verdadeiro' ou 'falso'")
                        }
                    }
                }
            }
        }
    }
    analisaChamadaFuncao() {
        this.lexico.analisador()
    }

    raiseError(error) {
        throw {
            arquivo: "Sintatico",
            numLinha: this.token.linha,
            msg: error
        }
    }
}