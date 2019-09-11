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

let arrayToken = []
