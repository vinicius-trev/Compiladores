/* Compilador - Analisador Léxico
 * Bruno Vicente Donaio Kitaka - 16156341
 * João Pedro Porta - 16039778
 * Vinicius Trevisan - 16011231
 */

/* Definição da Classe Token */
class Token {
    constructor(lexema, identificador, numLinha) {
        this.lexema = lexema;               /* Conterá o lexema */
        this.identificador = identificador; /* Um identificador, conforme a tabela indicada na apostila */
        this.numLinha = numLinha;           /* O número de linha encontrado para o respectivo token */
    }
}

let arrayToken = new Array(); /* para inserir objetos no arrray arrayToken.push(new Object()) */
let caracter;

function analisadorLexical() {
    /* Função que ira ler caracter por caracter do arquivo fonte */
    /* Ira remover todos os comentario, espaços tabulaçoes e quebra de linha */

}

function pegaToken() {
    /* Tratando digitos numéricos */
    if (caracter.test(/[0-9]/) === true) {
        tratarDigito();
    }
    /* Tratando identificadores e palavras reservadas */
    else if (caracter.test(/[a-zA-Z]/) === true) {
        tratarIdentificadorPalavraReservada();
    }
    /* Tratando atribuição */
    else if (caracter === ":") {
        tratarAtribuicao();
    }
    /* Tratando operador aritimérico */
    else if (caracter.test([/\+|-|\*/]) === true) {
        tratarOperadorAritmetico();
    }
    /* Tratando operador Relacional */
    else if (caracter.test(/<|>|=|!/) === true) {
        tratarOperadorRelacional();
    }
    /* Tratando pontuação */
    else if (caracter.test(/;|,|\(|\)|./) === true) {
        tratarPontuação();
    }
    else {
        /* Caracter não pertence a linguagem */
        /* Imprimir ERRO, o caracter encontrado e o número da linha(X) */
        /* Erro[X]: Caracter Y não pertence a gramática */
    }

}
