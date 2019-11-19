class Token {
    constructor(token = null) {
        this.simbolo = null
        this.lexema = null
        this.linha = null
        this.pos = null
        this.numLinhaAnterior = null
        if (token) {
            this.simbolo = token.simbolo
            this.lexema = token.lexema
            this.linha = token.linha
            this.pos = token.pos
            this.numLinhaAnterior = token.numLinhaAnterior
        }
    }
}