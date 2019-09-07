// import { instrucoes } from './instrucoes.js';        /* Import de todas as instruções do assembly */

/* Variáveis globais para manipulação de instruções */
let memoria = [];   /* Variavel que representa a regiao de memoria (memoria = M[]) */
let stackPointer;   /* Ponteiro da região de STACK (stackPointer = s) */
let pc = 0;         /* Program Counter */

/**
 * Função executada quando clicar no botão PLAY
 */
function rodarCodigo() 
{
  //console.log(instrucoes)                               /* ***DEBUG*** */
  let count = 0;
  while(pc < codigo.length)                                /* Para cada linha do codigo */
  {
    let line = codigo[pc]
    let elementos = line.trim().split(" ")              /* Remove os espacos extras do fim e começo e quebra a linha a cada espaco armanzenando cada elemento na variavel elemento*/
    let funcao = elementos.shift()                      /* Recupera e remove o primeiro elemento da linha (instrução ou label) */
    console.log(line)                                   /* ***DEBUG*** */

    let linha = document.getElementById("line-"+count)
    linha.classList.add("highlight");

    elementos.forEach((e, index, arr) =>                /* Para cada elemento restante, ou seja, argumentos ou a instrução NULL */
    {
      if (e.length != 0)                                /* Se não existirem argumentos */
      {
        if (e.match(/^[0-9]+$/) == null) {              /* Se elemento nao for um numero (ou seja, um parametro), o armazaena na tabela pois eh um label */
          arr[index] = tabela[e];                       /* Armazena o Label na tabela */
        }
        else {
          arr[index] = +e;                              /* Caso for um número, converte o elemento de string para numero */
        }
      }
    })

    //console.log(tabela)                                 /* ***DEBUG*** */
    //console.log(elementos)                              /* ***DEBUG*** */

    if (!(funcao in tabela))                            /* Se a função nao for label, ou seja, é uma instrução, executa a funcao passando os respectivos parametros */
    {
      if(funcao === "RD")                               /* Se a função lida for READ */
      {
        var answer = prompt("Valor: ") /* Abre um pop up para inserir o dado */
        if(answer != "")                                /* Se o dado inserido não for vazio (ou seja, inseriu algo valido *****TRATAR NUMEROS*****) */
        {
          instrucoes["RD"](+answer)                     /* Executa a função de READ */
        }
      }
      else
      {
        instrucoes[funcao](...elementos)                /* Caso a função NÃO FOR READ, executa ela normal passando os argumentos */
      }
    }
    pc++;                                               /* Incrementa o valor de PC a cada instrução */
    console.log("***********************")
    count++
    linha.classList.remove("highlight");
  }
}

let instrucoes = {
  "LDC": (k) => {   /* Load Constant */
    stackPointer = stackPointer + 1                                        /* Incrementa o ponteiro de pilha (proxima posição de memoria) */
    memoria[stackPointer] = k                                                     /* Insere a constante na pilha recebida como parametro (k) */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "LDV": (n) => {   /* Load Value */
    stackPointer = stackPointer + 1                                               /* Incrementa o ponteiro da pilha (proxima posição de memória) */
    memoria[stackPointer] = memoria[n]                                            /* Insere o valor recebido (parametro n) na pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "ADD": () => {    /* Somar */
    memoria[stackPointer - 1] = memoria[stackPointer - 1] + memoria[stackPointer] /* Soma os dois valores superiores apontados pelo stackPointer e armazena na posicao stackPointer-1 */
    stackPointer = stackPointer - 1                                               /* Decrementra o ponteiro de pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "SUB": () => {    /* Subtrair */
    memoria[stackPointer - 1] = memoria[stackPointer - 1] - memoria[stackPointer] /* Subtrai (PILHA[stackPointer-1] - PILHA[stackPointer]) os dois valores superiores apontados pelo stackPointer e armazena na posicao stackPointer-1 */
    stackPointer = stackPointer - 1                                               /* Decrementra o ponteiro de pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "MULT": () => {   /* Multiplicar */
    memoria[stackPointer - 1] = memoria[stackPointer - 1] * memoria[stackPointer] /* Multiplica os dois valores superiores apontados pelo stackPointer e armazena na posicao stackPointer-1 */
    stackPointer = stackPointer - 1                                               /* Decrementra o ponteiro de pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "DIVI": () => {   /* Dividir */
    memoria[stackPointer - 1] = memoria[stackPointer - 1] / memoria[stackPointer] /* Divide (PILHA[stackPointer-1] / PILHA[stackPointer]) os dois valores superiores apontados pelo stackPointer e armazena na posicao stackPointer-1 */
    stackPointer = stackPointer - 1                                               /* Decrementra o ponteiro de pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "INV": () => {  /* Inverter Sinal */
    memoria[stackPointer] = -memoria[stackPointer]                                /* Inverte o sinal do numero que esta no topo da pilha */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "AND": () => {  /* Operação Lógica AND - Conjunção */
    if (memoria[stackPointer - 1] == 1 && memoria[stackPointer] == 1) {           /* Se os dois números superiores da pilha forem iguais a 1, salva na posição stackPointer-1 o resultado 1 da opecação lógica AND */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posicao stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "OR": () => {  /* Operação Lógica OR - Disjunção */
    if (memoria[stackPointer - 1] == 1 || memoria[stackPointer] == 1) {           /* Se o primeiro ou o segundo elementos da pilha forem iguais a 1, salva na posicao stackPointer-1 o resultado 1 da operação lógica OR */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "NEG": () => {  /* Operação Lógica NOT - Negação */
    memoria[stackPointer] = 1 - memoria[stackPointer]                             /* Aplica operação lógica NOT na posição stackPointer e salva nesse mesmo lugar o resultado obtido */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CME": () => {  /* Compara Menor */
    if (memoria[stackPointer - 1] < memoria[stackPointer]) {                      /* Se o numero na posição stackPointer-1 for MENOR do que o numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CMA": () => {  /* Compara Maior */
    if (memoria[stackPointer - 1] > memoria[stackPointer]) {                      /* Se o numero na posição stackPointer-1 for MAIOR do que o numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CEQ": () => {  /* Compara Igual (EQ = Equivalente) */
    if (memoria[stackPointer - 1] == memoria[stackPointer]) {                     /* Se o numero na posição stackPointer-1 for IGUAL ao numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CDIF": () => { /* Compara Desigual (DIF = Diferente) */
    if (memoria[stackPointer - 1] != memoria[stackPointer]) {                     /* Se o numero na posição stackPointer-1 for DIFERENTE ao numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CMEQ": () => { /* Compara Menor ou Igual (ME = Menor || Q = Equivalente ) */
    if (memoria[stackPointer - 1] <= memoria[stackPointer]) {                     /* Se o numero na posição stackPointer-1 for MENOR OU IGUAL ao numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CMAQ": () => { /* Compara Maior ou Igual (MA = Maior || Q = Equivalente ) */
    if (memoria[stackPointer - 1] >= memoria[stackPointer]) {                     /* Se o numero na posição stackPointer-1 for MAIOR OU IGUAL ao numero na posição stackPointer, salva o valor 1 na posição stackPointer-1 */
      memoria[stackPointer - 1] = 1
    }
    else {                                                                        /* Armazena o valor 0 na posição stackPointer-1 caso contrário */
      memoria[stackPointer - 1] = 0
    }
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "START": () => {/* Iniciar programa Principal */
    stackPointer = -1;                                                            /* O inicio do programa acontece quando o stack pointer ainda não aponta para uma região válida de memória */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "HLT": () => {  /* Parar Execução (HLT = HALT) */
    /* Parar a execução da MVD */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "STR": (n) => { /* Armazenar Valor região de memória de posição "n" (STR = Store) */
    memoria[n] = memoria[stackPointer]                                           /* Armazena o valor apontado por stackPointer na posição n da memoria de dados */
    stackPointer = stackPointer - 1                                              /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "JMP": (t) => { /* Desviar PC para "t" */
    pc = t                                                                       /* Salva o endereço "t" como proxima instrução (PC) */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "JMPF": (t) => { /* Desviar PC para "t" se FALSO */
    if (memoria[stackPointer] == 0) {                                            /* Se o valor apontado por stackPointer foi igual a 0 desvia */
      pc = t                                                                     /* Salva o endereço "t" como proxima instrução (PC) */
    }
    else {
      pc = pc                                                              /* Caso não atenda a condição aponta para proxima instrução e NAO DESVIA */
    }
    stackPointer = stackPointer - 1                                              /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "NULL": () => { /* Operação NULA */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
    return;
  },
  "RD": (value) => {   /* Entrada de dados pelo usuário (RD = read) */
    stackPointer = stackPointer + 1                                              /* Incrementa o stackPointer */
    memoria[stackPointer] = value                                                /* Salva o valor lido no INPUT do FRONT END */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "PRN": () => {  /* Operação PRINT */
    let out = document.getElementById("output");                                 /* Recupera o elemeto que recebra o valor */
    out.innerHTML = memoria[stackPointer];                                       /* Escreve o valor no elemento HTML */
    stackPointer = stackPointer - 1                                              /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "ALLOC": (m, n) => {  /* Alocar Memória de tamanho 'n' */
    for (let k = 0; k < n; k++) {                                                /* Realiza o processo de ALLOC "n" VEZES */
      stackPointer = stackPointer + 1                                            /* Incrementa o stackPointer */
      memoria[stackPointer] = memoria[m + k]
    }
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "DALLOC": (m, n) => { /* Desalocar Memória de tamanho 'n' */
    for (let k = n - 1; k >= 0; k++) {                                           /* Realiza o processo de DESALOCAR "n" VEZES */
      memoria[m + k] = memoria[stackPointer]
      stackPointer = stackPointer - 1                                            /* Decrementa o stackPointer */
    }
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "CALL": (t) => {  /* Chamar uma Rotina */
    stackPointer = stackPointer + 1                                              /* Incrementa o stackPointer */
    memoria[stackPointer] = pc + 1                                               /* Salva o PC na pilha de memoria */
    pc = t                                                                       /* Define o procedimento como proxima instrução a ser executada */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },
  "RETURN": () => { /* Retornar de uma Rotina */
    pc = memoria[stackPointer]                                                    /* Recupera o valor de PC a partir do stackPointer */
    stackPointer = stackPointer - 1                                               /* Decrementa o stackPointer */
    console.log("Memoria: " + memoria)
    console.log("SP: " + stackPointer)
    console.log("PC: " + pc)
  },

};