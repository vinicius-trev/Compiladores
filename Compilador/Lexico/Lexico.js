class Lexico {
    constructor(text) {
        this.text = text
        this.caracter = null
        this.inComment = false
        this.token = new Token()
        this.lerCaracter()
    }

    pegaToken() {
        /* Tratando digitos numéricos */
        //console.log(caracter);
        if (/[0-9]/g.test(this.caracter) === true) {
            this.tratarDigito();
        }
        /* Tratando identificadores e palavras reservadas */
        else if (/[A-Za-z]/g.test(this.caracter) === true) {
            this.tratarIdentificadorPalavraReservada();
        }
        /* Tratando atribuição */
        else if (this.caracter === ":") {
            this.tratarAtribuicao();
        }
        /* Tratando operador aritimérico */
        else if (/\+|-|\*/g.test(this.caracter) === true) {
            this.tratarOperadorAritmetico();
        }
        /* Tratando operador Relacional */
        else if (/<|>|=|!/g.test(this.caracter) === true) {
            this.tratarOperadorRelacional();
        }
        /* Tratando pontuação */
        else if (/;|,|\(|\)|\./g.test(this.caracter) === true) {
            this.tratarPontuação();
        }
        else {
            console.log("ERRO Lexico pegaToken()")
            console.log("token: " + this.token.toString())
            console.log(this.caracter)
            return null
        }
        return this.token
    }

    analisador() {
        // Se final de arquivo
        if (this.caracter === 'EOF') {
            console.log("FINAL DO ARQUIVO")
            this.token.simbolo = 'SEOF'
            this.token.lexema = 'EOF'
            return this.token
        }
        // Se { comecou comentario
        if (this.caracter === '{') this.inComment = true
        while (/\s/.test(this.caracter) || this.inComment) {
            if (this.caracter === '}') this.inComment = false
            this.lerCaracter()
            if (this.caracter === '{') this.inComment = true
        }
        // Caracter nao whitespace e nao comentario encontrado
        console.log('Comecar a pegar token: ' + this.caracter);
        this.pegaToken()
        console.log('Token encontrado: ' + this.token.simbolo)
        return this.token

    }

    lerCaracter() {
        if (this.text.length != 0) {
            this.caracter = this.text[0]
            this.text = this.text.substr(1)
            console.log(this.caracter)
        }
        else {
            this.caracter = 'EOF'
        }
    }

    // Funcoes de criacao do token
    tratarDigito() {
        let numero = "";

        numero = numero.concat(this.caracter);
        this.lerCaracter();

        while (/[0-9]/g.test(this.caracter) === true) {
            numero = numero.concat(this.caracter);
            this.lerCaracter();
        }
        this.token.lexema = +numero
        this.token.simbolo = "snumero"
        this.token.linha = this.numLinha
    }

    tratarIdentificadorPalavraReservada() {
        let id = "";

        id = id.concat(this.caracter);
        this.lerCaracter();

        while (/[A-Za-z]/g.test(this.caracter) === true || /[0-9]/g.test(this.caracter) === true) {
            id = id.concat(this.caracter);
            this.lerCaracter();
        }

        if (id === "programa") {
            this.token.simbolo = 'sprograma'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "se") {
            this.token.simbolo = 'sse'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "entao") {
            this.token.simbolo = 'sentao'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "senao") {
            this.token.simbolo = 'ssenao'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "enquanto") {
            this.token.simbolo = 'senquanto'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "faca") {
            this.token.simbolo = 'sfaca'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "inicio") {
            this.token.simbolo = 'sinicio'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "fim") {
            this.token.simbolo = 'sfim'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "escreva") {
            this.token.simbolo = 'sescreva'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "leia") {
            this.token.simbolo = 'sleia'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "var") {
            this.token.simbolo = 'svar'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "inteiro") {
            this.token.simbolo = 'sinteiro'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "booleano") {
            this.token.simbolo = 'sbooleano'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "verdadeiro") {
            this.token.simbolo = 'sverdadeiro'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "falso") {
            this.token.simbolo = 'sfalso'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "procedimento") {
            this.token.simbolo = 'sprocedimento'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "funcao") {
            this.token.simbolo = 'sfuncao'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "div") {
            this.token.simbolo = 'sdiv'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "e") {
            this.token.simbolo = 'se'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "ou") {
            this.token.simbolo = 'sou'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else if (id === "nao") {
            this.token.simbolo = 'snao'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
        else {
            this.token.simbolo = 'sidentificador'
            this.token.lexema = id
            this.token.linha = this.numLinha
        }
    }

    /* Função responsável por tratar tokens que formam simbolos de atribuição : := */
    tratarAtribuicao() {
        let atribuicao = "";

        atribuicao = atribuicao.concat(this.caracter);
        this.lerCaracter();

        if (this.caracter === "=") {
            atribuicao = atribuicao.concat(this.caracter);

            this.token.simbolo = "satribuicao"
            this.token.lexema = atribuicao
            this.token.linha = this.numlinha

            this.lerCaracter();
        } else {
            this.token.simbolo = "sdoispontos"
            this.token.lexema = atribuicao
            this.token.linha = this.numlinha
        }
    }
    tratarOperadorAritmetico() {
        //console.log("tratarOperadorAritmetico")

        if (this.caracter === "+") {
            this.token.simbolo = "smais"
            this.token.lexema = '+'
            this.token.linha = this.numlinha
        }
        else if (this.caracter === "-") {
            this.token.simbolo = "smenos"
            this.token.lexema = '-'
            this.token.linha = this.numlinha
        }
        else if (this.caracter === "*") {
            this.token.simbolo = 'smult'
            this.token.lexema = '*'
            this.token.linha = this.numlinha
        }
        this.lerCaracter();
    }

    /* Função responsável por tratar tokens que formam operadores relacionais < <= > >= != */
    tratarOperadorRelacional() {
        let opRelacional = "";

        if (this.caracter === ">") {
            opRelacional = opRelacional.concat(this.caracter);
            this.lerCaracter();

            if (this.caracter === "=") {
                opRelacional = opRelacional.concat(this.caracter);

                this.token.simbolo = 'smaiorig'
                this.token.lexema = opRelacional
                this.token.linha = this.numlinha

                this.lerCaracter();
            }
            else {
                this.token.simbolo = 'smaior'
                this.token.lexema = opRelacional
                this.token.linha = this.numlinha
            }
        }
        else if (this.caracter === "<") {
            opRelacional = opRelacional.concat(this.caracter);
            this.lerCaracter();

            if (this.caracter === "=") {
                opRelacional = opRelacional.concat(this.caracter);

                this.token.simbolo = 'smenorig'
                this.token.lexema = opRelacional
                this.token.linha = this.numlinha

                this.lerCaracter();
            }
            else {
                this.token.simbolo = 'smenor'
                this.token.lexema = opRelacional
                this.token.linha = this.numlinha
            }
        }
        else if (this.caracter === "!") {
            opRelacional = opRelacional.concat(this.caracter);
            this.lerCaracter();

            if (this.caracter === "=") {
                opRelacional = opRelacional.concat(this.caracter);

                this.token.simbolo = 'sdif'
                this.token.lexema = opRelacional
                this.token.linha = this.numlinha

                this.lerCaracter();
            }
            else {
                this.caracter = "!"
                this.erro = 1;
            }
        }
        else if (this.caracter === "=") {
            opRelacional = opRelacional.concat(this.caracter);

            this.token.simbolo = 'sig'
            this.token.lexema = opRelacional
            this.token.linha = this.numlinha

            this.lerCaracter();
        }
    }

    tratarPontuação() {

        if (this.caracter === ".") {
            this.token.simbolo = 'sponto'
            this.token.lexema = '.'
            this.token.linha = this.numlinha
        }
        else if (this.caracter === ";") {
            this.token.simbolo = 'sponto_virgula'
            this.token.lexema = ';'
            this.token.linha = this.numlinha
        }
        else if (this.caracter === ",") {
            this.token.simbolo = 'svirgula'
            this.token.lexema = ','
            this.token.linha = this.numlinha
        }
        else if (this.caracter === "(") {
            this.token.simbolo = 'sabre_parenteses'
            this.token.lexema = '('
            this.token.linha = this.numlinha
        }
        else if (this.caracter === ")") {
            this.token.simbolo = 'sfecha_parenteses'
            this.token.lexema = ')'
            this.token.linha = this.numlinha
        }
        this.lerCaracter();
    }
}