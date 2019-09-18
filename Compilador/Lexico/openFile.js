/* Compilador - Analisador Léxico
 * Bruno Vicente Donaio Kitaka - 16156341
 * João Pedro Porta - 16039778
 * Vinicius Trevisan - 16011231
 */

let codigo = []; /* Variavel onde em cada posicao representa uma linha do codigo */

let arquivo

function KeyPress(e) {
    var evtobj = window.event ? event : e
    // Build Crtl + B
    if ((event.ctrlKey || event.metaKey) && event.which == 66) {
        alert('FOI')
        event.preventDefault()
    }
    // Abrir Arquivo Crtl + O
    if ((event.ctrlKey || event.metaKey) && event.which == 79) {
        document.getElementById('file-input').click()
        event.preventDefault()
    }// Salvar Arquivo Crtl + S
    if ((event.ctrlKey || event.metaKey) && event.which == 83) {
        alert('FOI')
        event.preventDefault()
    }
}

document.onkeydown = KeyPress

// Abrir Arquivo
function lerArquivo(e){
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.onload = () => {
        arquivo = reader.result
        caixaTexto = document.querySelector('.caixa-codigo')
        codigo = document.createTextNode(arquivo)
        caixaTexto.appendChild(codigo)

    }
    reader.readAsText(file);
}

/* Render Code Window ->> Handler ativado quando importar o código OBJ/TXT */
function openFile() {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        // getting a hold of the file reference
        var file = e.target.files[0];

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            montarTexto(content);
        }
    }
    input.click();
}

function montarTexto(code)                          /* Recebe o conteudo do arquivo (parametro code) e o trata nessa arrow function (Callback) */ {
    const lines = code.split("\n");                   /* Quebra o conteudo do arquivo em linhas separadas a partir do \n */
    div = document.querySelector(".code");            /* Instanciacao do objeto que recebera o conteudo do arquivo - div onde irá aparecer o codigo bruto */
    div.innerHTML = "";                               /* Limpando o conteudo do objeto antes de carregar o codigo nesse objeto */
    ol = document.createElement("ol")                 /* Cria uma lista ordenada (ol) para armazenar cada linha do código */
    ol.classList.add("code-list");                    /* Adiciona uma classe no objeto HTML para o funcionamento do CSS */
    div.appendChild(ol)                               /* Adiciona a lista ordenada na div para exibir o codigo obj */
    let numLinha = 1                                  /* Inicia contagem da linha de texto como 1 */
    lines.forEach((line, index, array) =>             /* Para cada linha do codigo */ {
   
      /*
       * Render code
       * Adicionando elemetos HTML para estetica e
       * renderizaçao do codigo
      **/
      const li = document.createElement("li");        /* Instanciando um item para ser inserido na lista de itens */
      li.setAttribute("id", "line-" + index);
  
      /* Cria uma div para cada linha (cada uma dessas divs é composta por uma região cinza - esquerda - e uma região branca - direita) */
  
      const divNumber = document.createElement("div") /* Cria a barra lateral esquerda para exibir o número da linha */
      divNumber.classList.add("number-div")           /* Adiciona uma classe ao CSS para modificar o style da barra criada acima */
  
      const divLine = document.createElement("div")   /* Cria a linha que sera exibido o código */
      divLine.classList.add("line-div")               /* Adiciona uma classe ao CSS para modificar o style de onde irá ficar o texto */
  
      /*
       * Escrevedo o botão, número da linha e o conteudo de cada uma delas (codigo)
      **/
  
      /* NUMERO LINHA */
      const numText = document.createTextNode(numLinha) /* Cria um const (variavel) para armazenar o numero da linha */
      divNumber.appendChild(numText)                    /* Escreve na divNumber o numero da linha */
  
      /* CODIGO */
      const lineText = document.createTextNode(line)    /* Cria um const (variavel) para armazenar o código (linha a linha) */
      divLine.appendChild(lineText)                     /* Escreve na divLine o código */
  
      numLinha++;                                       /* Incrementa o número da linha */
  
      li.appendChild(divNumber);                        /* Insere a div de número de linha na lista de itens */
      li.appendChild(divLine);                          /* Insere a div de código na lista de itens */
  
      ol.appendChild(li);                               /* Insere a linha da lista de itens na lista ordenada (que contera o codigo inteiro) */
  
      codigo.push(line);                                /* Armazenando o conteudo do arquivo em nossa variavel */
    });
  }
  /* Aqui finaliza o import do código texto */