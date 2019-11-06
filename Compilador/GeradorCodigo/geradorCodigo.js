
class GeradorCodigo {
    constructor() {
        this.contadorLabel = 1;
        this.codigoObjeto = "#Codigo Objeto Produzido Pelo Compilador\n";
    }

    LDC(constante) {
        this.codigoObjeto += "LDC " + constante + "\n"
    }

    LDV(identificador) {
        this.codigoObjeto += "LDV " + identificador + "\n"
    }

    ADD() {
        this.codigoObjeto += "ADD\n"
    }

    SUB() {
        this.codigoObjeto += "SUB\n"
    }

    MULT() {
        this.codigoObjeto += "MULT\n"
    }

    DIVI() {
        this.codigoObjeto += "DIVI\n"
    }

    INV() {
        this.codigoObjeto += "INV\n"
    }

    AND() {
        this.codigoObjeto += "AND\n"
    }

    OR() {
        this.codigoObjeto += "OR\n"
    }

    NEG() {
        this.codigoObjeto += "NEG\n"
    }

    CME() {
        this.codigoObjeto += "CME\n"
    }

    CMA() {
        this.codigoObjeto += "CMA\n"
    }

    CEQ() {
        this.codigoObjeto += "CEQ\n"
    }

    CDIF() {
        this.codigoObjeto += "CDIF\n"
    }

    CMEQ() {
        this.codigoObjeto += "CMEQ\n"
    }

    CMAQ() {
        this.codigoObjeto += "CMAQ\n"
    }

    START() {
        this.codigoObjeto += "START\n"
    }

    HLT() {
        this.codigoObjeto += "HLT\n"
    }

    STR(memoria) {
        this.codigoObjeto += "STR " + memoria + "\n"
    }

    JMP(label) {
        this.codigoObjeto += "JMP " + label + "\n"
    }

    JUMPF(label) {

    }

    NULL() {
        /* Toda vez que criar um label, deve-se incrementar o contador de labels */
    }

    RD() {

    }

    PRN() {

    }

    ALLOC(start, size) {

    }

    DALLOC(start, size) {

    }

    CALL() {

    }

    RETURN() {

    }

    incrementarContador() {

    }

    retornarContador() {

    }

    gerarExpressão() {

    }
}