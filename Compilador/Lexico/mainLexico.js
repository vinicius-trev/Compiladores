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
let erro;
let count = 1;
let linhaControle;

function lerCaracter() {
    /* Essa função irá ler um caracter do arquivo e armazenar na variavel caracter */
    /* Também irá atualizar a variavel numLinha */

    // console.log(codigo);
    // console.log("caracter: " + caracter);
    // console.log("linhaControle: " + linhaControle);
    // console.log("codigo.length: "+ codigo.length)
    // console.log("codigo[linhaControle].length: "+ codigo[linhaControle].length)

    if(codigo[linhaControle])
    {
        if(codigo[linhaControle].length > 0)
        {
            caracter = codigo[linhaControle].slice(0, 1)
            codigo[linhaControle] = codigo[linhaControle].slice(1)
            numLinha = linhaControle;
        }
    }
    else if(linhaControle < codigo.length)
    {
        linhaControle++;
        if(!caracter)
        {
            caracter = codigo[linhaControle].slice(0, 1)
            codigo[linhaControle] = codigo[linhaControle].slice(1)
            numLinha = linhaControle;
        }
    }
}

function analisadorLexical() {
    linhaControle = 0;

    /* Função que ira ler caracter por caracter do arquivo fonte */
    lerCaracter()
    while(linhaControle < codigo.length && erro != 1) 
    {
        //console.log("A linha é " + codigo[linhaControle]);
        while ((/{| |\n|\t/g.test(caracter)) && linhaControle < codigo.length) 
        {
            if (caracter === "{") 
            {
                while ((caracter != "}") && linhaControle < codigo.length) 
                {
                    lerCaracter();
                }
                lerCaracter();
            }
            while ((/ |\n|\t/g.test(caracter)) && linhaControle < codigo.length) 
            {
                lerCaracter();
            }
        }
        //console.log("terminei de pegar e o tamanho da linha = " + codigo[numLinha].length);
        if (codigo.length > 0 && linhaControle < codigo.length) 
        {
            pegaToken();
        }

        if(linhaControle < codigo.length)
        {
            if(codigo[linhaControle].length == 0)
            {
                linhaControle++;
            }
        }
        else
        {
            break;
        }
    }
}

function pegaToken() {
    /* Tratando digitos numéricos */
    //console.log(caracter);
    if (/[0-9]/g.test(caracter) === true) {
        tratarDigito();
    }
    /* Tratando identificadores e palavras reservadas */
    else if (/[A-Za-z]/g.test(caracter) === true) {
        tratarIdentificadorPalavraReservada();
    }
    /* Tratando atribuição */
    else if (caracter === ":") {
        tratarAtribuicao();
    }
    /* Tratando operador aritimérico */
    else if (/\+|-|\*/g.test(caracter) === true) {
        tratarOperadorAritmetico();
    }
    /* Tratando operador Relacional */
    else if (/<|>|=|!/g.test(caracter) === true) {
        tratarOperadorRelacional();
    }
    /* Tratando pontuação */
    else if (/;|,|\(|\)|\./g.test(caracter) === true) {
        tratarPontuação();
    }
    else {
        /* Caracter não pertence a linguagem */
        /* Imprimir ERRO no FE, o caracter encontrado e o número da linha(X) */
        /* Erro[X]: Caracter Y não pertence a gramática */
        erro = 1;
        let consoleTerminal = document.getElementById("consoleTerminal");
        consoleTerminal.innerHTML += `
            <p style="color:red;">ERRO: Caractere ${caracter} Não esperado na linha ${linhaControle+1}</p>
        `;
    }

    if(!erro)
    {
        let consoleTerminal = document.getElementById("consoleTerminal");
        consoleTerminal.innerHTML += `
            <p>Lexema: ${arrayToken[arrayToken.length-1].lexema} - Identificador: ${arrayToken[arrayToken.length-1].identificador} - Linha ${arrayToken[arrayToken.length-1].numLinha+1}</p>
        `;
    }  
}

function build(){
    analisadorLexical();
}