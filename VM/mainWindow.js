/* Variáveis globais para manipulação de instruções */
let memoria = [];   /* Variavel que representa a regiao de memoria (memoria = M[]) */
let stackPointer;   /* Ponteiro da região de STACK (stackPointer = s) */
let pc = 0;         /* Program Counter */

/**
 * Função executada para reiniciar a execucao da VM
 */
function reset()
{
  window.location.reload(true); 
}

/**
 * Função executada quando clicar no botão PLAY
 */
function rodarCodigo() 
{ 
  while(pc < codigo.length)                             /* Para cada linha do codigo */
  {
    let line = codigo[pc]
    let elementos = line.trim().split(" ")              /* Remove os espacos extras do fim e começo e quebra a linha a cada espaco armanzenando cada elemento na variavel elemento*/
    let funcao = elementos.shift()                      /* Recupera e remove o primeiro elemento da linha (instrução ou label) */
    console.log(line)                                   /* ***DEBUG*** */

    let linha = document.getElementById("line-"+pc)
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

    if (!(funcao in tabela))                            /* Se a função nao for label, ou seja, é uma instrução, executa a funcao passando os respectivos parametros */
    {
      if(funcao === "RD")                               /* Se a função lida for READ */
      {
        /* Garante que o popup só pegara numeros inteiros */
        do
        {
          var answer = parseInt(prompt("Digite o valor de INPUT: "))  /* Abre um pop up para inserir o dado */
        }while(isNaN(answer));                                        /* Garante que o dado sempre será um numero inteiro */

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
    linha.classList.remove("highlight");
  }
}