
class GeradorCodigo {
    constructor(tabela) {
        this.contadorLabel = 1;
        this.posicaoMemoria = 0;
        this.codigoObjeto = "";
        this.tabela = tabela;
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

    JMPF(inteiro) {
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
        this.codigoObjeto += "CALL  sL" + inteiro + "\n"
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

    gerarExpressão(posfixa) {
        let token;
        console.log(posfixa)
        for (token of posfixa) {
            if (token.simbolo === "snumero") {  /* Gera LDV */
                this.LDC(+token.lexema);
            }
            else if (token.simbolo === "sidentificador") {  /* Gera LDC */
                this.LDV(this.tabela.retornaEnderecoMemoriaVar(token.lexema));
            }
            else if (token.simbolo === "smaior") {
                this.CMA();
            }
            else if (token.simbolo === "smaiorig") {
                this.CMAQ();
            }
            else if (token.simbolo === "sig") {
                this.CEQ();
            }
            else if (token.simbolo === "smenor") {
                this.CME();
            }
            else if (token.simbolo === "smenorig") {
                this.CMEQ();
            }
            else if (token.simbolo === "sdif") {
                this.CDIF();
            }
            else if (token.simbolo === "smais") {
                if (token.lexema === "$+") {
                    this.INV();
                }
                else {
                    this.ADD();
                }
            }
            else if (token.simbolo === "smenos") {
                if (token.lexema === "$-") {
                    this.INV();
                }
                else {
                    this.SUB();
                }
            }
            else if (token.simbolo === "smult") {
                this.MULT();
            }
            else if (token.simbolo === "sdiv") {
                this.DIVI();
            }
            else if (token.simbolo === "se") {
                this.AND();
            }
            else if (token.simbolo === "sou") {
                this.OR();
            }
            else if (token.simbolo === "snao") {
                this.NEG();
            }
            else if (token.simbolo === "sverdadeiro") {
                this.LDC(1);
            }
            else if (token.simbolo === "sfalso") {
                this.LDC(0);
            }
        }
    }
}