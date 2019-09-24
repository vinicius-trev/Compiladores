/* Compilador - Analisador Léxico
 * Bruno Vicente Donaio Kitaka - 16156341
 * João Pedro Porta - 16039778
 * Vinicius Trevisan - 16011231
 */

/* Função responsável por tratar tokens que formam dígitos 0-9 */
function tratarDigito() {
    console.log("tratarDigito")
    let numero = "";

    numero = numero.concat(caracter);
    lerCaracter();

    while (/[0-9]/g.test(caracter) === true) {
        numero = numero.concat(caracter);
        lerCaracter();
    }
    arrayToken.push(new Token(+numero, "snúmero", numLinha));
}

/* Função responsável por tratar tokens que formam identificadores e palavras reservadas a-Z considerando _ */
function tratarIdentificadorPalavraReservada() {
    console.log("tratarIdentificadorPalavraReservada")

    let id = "";

    id = id.concat(caracter);
    lerCaracter();

    while (/[A-Za-z]/g.test(caracter) === true || /[0-9]/g.test(caracter) === true)  {
        id = id.concat(caracter);
        lerCaracter();
    }

    if (id === "programa") {
        arrayToken.push(new Token(id, "sprograma", numLinha))
    }
    else if (id === "se") {
        arrayToken.push(new Token(id, "sse", numLinha))
    }
    else if (id === "entao") {
        arrayToken.push(new Token(id, "sentao", numLinha))
    }
    else if (id === "senao") {
        arrayToken.push(new Token(id, "ssenao", numLinha))
    }
    else if (id === "enquanto") {
        arrayToken.push(new Token(id, "senquanto", numLinha))
    }
    else if (id === "faca") {
        arrayToken.push(new Token(id, "sfaca", numLinha))
    }
    else if (id === "inicio") {
        arrayToken.push(new Token(id, "sinicio", numLinha))
    }
    else if (id === "fim") {
        arrayToken.push(new Token(id, "sfim", numLinha))
    }
    else if (id === "escreva") {
        arrayToken.push(new Token(id, "sse", numLinha))
    }
    else if (id === "leia") {
        arrayToken.push(new Token(id, "sleia", numLinha))
    }
    else if (id === "var") {
        arrayToken.push(new Token(id, "svar", numLinha))
    }
    else if (id === "inteiro") {
        arrayToken.push(new Token(id, "sinteiro", numLinha))
    }
    else if (id === "booleano") {
        arrayToken.push(new Token(id, "sbooleano", numLinha))
    }
    else if (id === "verdadeiro") {
        arrayToken.push(new Token(id, "sverdadeiro", numLinha))
    }
    else if (id === "falso") {
        arrayToken.push(new Token(id, "sfalso", numLinha))
    }
    else if (id === "procedimento") {
        arrayToken.push(new Token(id, "sprocedimento", numLinha))
    }
    else if (id === "funcao") {
        arrayToken.push(new Token(id, "sfuncao", numLinha))
    }
    else if (id === "div") {
        arrayToken.push(new Token(id, "sdiv", numLinha))
    }
    else if (id === "e") {
        arrayToken.push(new Token(id, "se", numLinha))
    }
    else if (id === "ou") {
        arrayToken.push(new Token(id, "sou", numLinha))
    }
    else if (id === "nao") {
        arrayToken.push(new Token(id, "snao", numLinha))
    }
    else {
        arrayToken.push(new Token(id, "sidentificador", numLinha))
    }
}

/* Função responsável por tratar tokens que formam simbolos de atribuição : := */
function tratarAtribuicao() {
    console.log("tratarAtribuicao")

    let atribuicao = "";

    atribuicao = atribuicao.concat(caracter);
    lerCaracter();

    if (caracter === "=") {
        atribuicao = atribuicao.concat(caracter);
        arrayToken.push(new Token(atribuicao, "satribuicao", numLinha));
        lerCaracter();
    }
    else {
        arrayToken.push(new Token(atribuicao, "sdoispontos", numLinha));
    }
}

/* Função responsável por tratar tokens que formam operadores aritmeticos + - *  */
function tratarOperadorAritmetico() {
    console.log("tratarOperadorAritmetico")

    if (caracter === "+") {
        arrayToken.push(new Token("+", "smais", numLinha));
    }
    else if (caracter === "-") {
        arrayToken.push(new Token("-", "smenos", numLinha));
    }
    else if (caracter === "*") {
        arrayToken.push(new Token("*", "smult", numLinha));
    }
    lerCaracter();
}

/* Função responsável por tratar tokens que formam operadores relacionais < <= > >= != */
function tratarOperadorRelacional() {
    console.log("tratarOperadorRelacional")

    let opRelacional = "";

    if (caracter === ">") {
        opRelacional = opRelacional.concat(caracter);
        lerCaracter();

        if (caracter === "=") {
            opRelacional = opRelacional.concat(caracter);
            arrayToken.push(new Token(opRelacional, "smaiorig", numLinha));
            lerCaracter();
        }
        else {
            arrayToken.push(new Token(opRelacional, "smaior", numLinha));
        }
    }
    else if (caracter === "<") {
        opRelacional = opRelacional.concat(caracter);
        lerCaracter();

        if (caracter === "=") {
            opRelacional = opRelacional.concat(caracter);
            arrayToken.push(new Token(opRelacional, "smenorig", numLinha));
            lerCaracter();
        }
        else {
            arrayToken.push(new Token(opRelacional, "smenor", numLinha));
        }
    }
    else if (caracter === "!") {
        opRelacional = opRelacional.concat(caracter);
        lerCaracter();

        if (caracter === "=") {
            opRelacional = opRelacional.concat(caracter);
            arrayToken.push(new Token(opRelacional, "sdif", numLinha));
            lerCaracter();
        }
    }
    else if (caracter === "=") {
        opRelacional = opRelacional.concat(caracter);
        arrayToken.push(new Token(opRelacional, "sig", numLinha));
        lerCaracter();
    }
}

/* Função responsável por tratar tokens que formam pontuação . , ; ( ) */
function tratarPontuação() {
    console.log("tratarPontuação")

    if (caracter === ".") {
        arrayToken.push(new Token(".", "sponto", numLinha));
    }
    else if (caracter === ";") {
        arrayToken.push(new Token(";", "sponto_virgula", numLinha));
    }
    else if (caracter === ",") {
        arrayToken.push(new Token(",", "svirgula", numLinha));
    }
    else if (caracter === "(") {
        arrayToken.push(new Token("(", "sabre_parenteses", numLinha));
    }
    else if (caracter === ")") {
        arrayToken.push(new Token(")", "sfecha_parenteses", numLinha));
    }
    lerCaracter();
}