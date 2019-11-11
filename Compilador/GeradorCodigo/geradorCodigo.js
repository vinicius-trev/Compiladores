
class GeradorCodigo {
    constructor() {
        this.contadorLabel = 1;
        this.posicaoMemoria = 0;
        this.codigoObjeto = "";
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

    JMP(inteiro) {
        this.codigoObjeto += "JMP L" + inteiro + "\n"
    }

    JUMPF(inteiro) {
        this.codigoObjeto += "JMPF L" + inteiro + "\n"
    }

    NULL(inteiro) {
        /* Toda vez que criar um label, deve-se incrementar o contador de labels */
        this.codigoObjeto += "L" + inteiro + " NULL\n"
        this.incrementarContador()
    }

    RD() {
        this.codigoObjeto += "RD\n"
    }

    PRN() {
        this.codigoObjeto += "PRN\n"
    }

    ALLOC(start, size) {
        this.codigoObjeto += "ALLOC " + start + " " + size + "\n"
    }

    DALLOC(start, size) {
        this.codigoObjeto += "DALLOC " + start + " " + size + "\n"
    }

    CALL(inteiro) {
        this.codigoObjeto += "CALL L" + inteiro + "\n"
    }

    RETURN() {
        this.codigoObjeto += "RETURN\n"
    }

    RETURNF(start, size) {
        this.codigoObjeto += "RETURNF " + start + " " + size + "\n"
    }

    incrementarContador() {
        this.contadorLabel++
    }

    retornarContador() {
        return this.contadorLabel
    }

    gerarExpressão() {

    }
}