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
let numLinha;
let pattern_Digito = /[0-9]/g
let pattern_Letra = /[a-zA-Z]/g
let pattern_opAritmetico = /\+|-|\*/g
let pattern_opRelacional = /<|>|=|!/g
let pattern_pontuacao = /;|,|\(|\)|./g

function lerCaracter() {
    /* Essa função irá ler um caracter do arquivo e armazenar na variavel caracter */
    /* Também irá atualizar a variavel numLinha */
}

function analisadorLexical(codigo) {
    /* Função que ira ler caracter por caracter do arquivo fonte */
    lerCaracter()
    while (codigo.length > 0)
    {
        while ((/{| |\n|\t/g.test(caracter)) && codigo.length > 0)
        {
            if(caracter === "{")
            {
                while((caracter != "}") && codigo.length > 0)
                {
                    lerCaracter();
                } 
                lerCaracter();
            }
            while((/{| |\n|\t/g.test(caracter)) && codigo.length > 0)
            {
                lerCaracter();
            }
        }
        if(codigo.length != 0)
        {
            pegarToken();
        }
    }
    /* Ira remover todos os comentario, espaços tabulaçoes e quebra de linha */

}

function pegaToken() {
    /* Tratando digitos numéricos */
    if (pattern_Digito.test(caracter) === true) {
        tratarDigito();
    }
    /* Tratando identificadores e palavras reservadas */
    else if (pattern_Letra.test(caracter) === true) {
        tratarIdentificadorPalavraReservada();
    }
    /* Tratando atribuição */
    else if (caracter === ":") {
        tratarAtribuicao();
    }
    /* Tratando operador aritimérico */
    else if (pattern_opAritmetico.test(caracter) === true) {
        tratarOperadorAritmetico();
    }
    /* Tratando operador Relacional */
    else if (pattern_opRelacional.test(caracter) === true) {
        tratarOperadorRelacional();
    }
    /* Tratando pontuação */
    else if (pattern_pontuacao.test(caracter) === true) {
        tratarPontuação();
    }
    else {
        /* Caracter não pertence a linguagem */
        /* Imprimir ERRO no FE, o caracter encontrado e o número da linha(X) */
        /* Erro[X]: Caracter Y não pertence a gramática */
    }

}
