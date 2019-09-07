const electron = require("electron");               /* Import dos pacotes do electron */ 
const { ipcRenderer } = electron                    /* Objeto ipc herda electron */
var instrucoes = require("./instrucoes")();         /* Import de todas as instruções do assembly */

/* Variáveis Globais da VM */
let codigo = [];    /* Variavel onde em cada posicao representa uma linha do codigo */
let tabela = {};    /* Tabela labels x linha do codigo, utilizada para jumps */

/* Variáveis globais para manipulação de instruções */
let memoria = [];   /* Variavel que representa a regiao de memoria (memoria = M[]) */
let stackPointer;   /* Ponteiro da região de STACK (stackPointer = s) */
let pc = 0;         /* Program Counter */

/* Render Code Window ->> Handler ativado quando importar o código OBJ/TXT */
ipcRenderer.on("code:send", (e, code) =>            /* Recebe o conteudo do arquivo (parametro code) e o trata nessa arrow function (Callback) */
{         
  const lines = code.split("\n");                   /* Quebra o conteudo do arquivo em linhas separadas a partir do \n */
  div = document.querySelector(".code-window");     /* Instanciacao do objeto que recebera o conteudo do arquivo - div onde irá aparecer o codigo bruto */
  div.innerHTML = "";                               /* Limpando o conteudo do objeto antes de carregar o codigo nesse objeto */
  ol = document.createElement("ol")                 /* Cria uma lista ordenada (ol) para armazenar cada linha do código */
  ol.classList.add("code-list");                    /* Adiciona uma classe no objeto HTML para o funcionamento do CSS */
  div.appendChild(ol)                               /* Adiciona a lista ordenada na div para exibir o codigo obj */
  let numLinha = 1                                  /* Inicia contagem da linha de texto como 1 */
  lines.forEach(line =>                             /* Para cada linha do codigo */
  {
    /* Cria o dicionário de Labels */
    if (line.includes('NULL'))                      /* Se existe o parametro NULL, eh label */
    {    
      tabela[line.split(' ')[0]] = numLinha - 1;    /* Salva o numero da linha - 1 na tabela (-1 para executar a proxima instrução)  */
    }
    
    /*
     * Render code
     * Adicionando elemetos HTML para estetica e
     * renderizaçao do codigo
    **/
    const li = document.createElement("li");        /* Instanciando um item para ser inserido na lista de itens */

    /* Cria uma div para cada linha (cada uma dessas divs é composta por uma região cinza - esquerda - e uma região branca - direita) */
    const divNumber = document.createElement("div") /* Cria a barra lateral esquerda para exibir o número da linha */
    divNumber.classList.add("number-div")           /* Adiciona uma classe ao CSS para modificar o style da barra criada acima */

    const divLine = document.createElement("div")   /* Cria a linha que sera exibido o código */
    divLine.classList.add("line-div")               /* Adiciona uma classe ao CSS para modificar o style de onde irá ficar o texto */

    /*
     * Escrevedo o número da linha e o conteudo de cada uma delas (codigo)
    **/
    const numText = document.createTextNode(numLinha) /* Cria um const (variavel) para armazenar o numero da linha */
    divNumber.appendChild(numText)                    /* Escreve na divNumber o numero da linha */
    const lineText = document.createTextNode(line)    /* Cria um const (variavel) para armazenar o código (linha a linha) */
    divLine.appendChild(lineText)                     /* Escreve na divLine o código */

    numLinha++;                                       /* Incrementa o número da linha */

    li.appendChild(divNumber);                        /* Insere a div de número de linha na lista de itens */
    li.appendChild(divLine);                          /* Insere a div de código na lista de itens */

    ol.appendChild(li);                               /* Insere a linha da lista de itens na lista ordenada (que contera o codigo inteiro) */

    codigo.push(line);                                /* Armazenando o conteudo do arquivo em nossa variavel */
  });
});
/* Aqui finaliza o import do código texto */

/*
 * Criacao de event listeners para cada botao de
 * execucao da interface (play - debug - step - continue)
**/
let runButton = document.getElementById("play-normal")/* Recupera onde esta o botão PLAY */

runButton.addEventListener("click", rodarCodigo)      /* Quando o botão play for pressionado executa a funçao rodarCodigo */

/**
 * Função executada quando clicar no botão PLAY
 */
function rodarCodigo() 
{
  //console.log(instrucoes)                               /* ***DEBUG*** */
  
  while(pc < codigo.length)                                /* Para cada linha do codigo */
  {
    let line = codigo[pc]
    let elementos = line.trim().split(" ")              /* Remove os espacos extras do fim e começo e quebra a linha a cada espaco armanzenando cada elemento na variavel elemento*/
    let funcao = elementos.shift()                      /* Recupera e remove o primeiro elemento da linha (instrução ou label) */
    console.log(line)                                 /* ***DEBUG*** */
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
        var answer = ipcRenderer.sendSync("prompt", "") /* Abre um pop up para inserir o dado */
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
  }
}