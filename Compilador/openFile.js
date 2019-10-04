/* Compilador - Analisador Léxico
 * Bruno Vicente Donaio Kitaka - 16156341
 * João Pedro Porta - 16039778
 * Vinicius Trevisan - 16011231
 */

let codigo /* Variavel onde em cada posicao representa uma linha do codigo */
let arquivo
let noLinhas

// Event bindings
document.onkeydown = KeyPress

// Functions
// Binding numberline and code scrollers
let textAreaScrollers = document.querySelectorAll("textarea.scroller")
function scrollAll(scrollTop) {
    textAreaScrollers.forEach((ele, ind, arr) => {
        ele.scrollTop = scrollTop
    })
}

textAreaScrollers.forEach((ele, ind, arr) => {
    ele.addEventListener('scroll', e => {
        scrollAll(e.target.scrollTop)
    })
})

function KeyPress(e) {
    var evtobj = window.event ? event : e

    /* Atalho para buildar o codigo (CTRL+B)  */
    if ((event.ctrlKey || event.metaKey) && event.which == 66) {
        analisadorLexical()
        event.preventDefault()
    }
    /* Atalho para abrir um arquivo (CTRL+O)  */
    if ((event.ctrlKey || event.metaKey) && event.which == 79) {
        document.getElementById('file-input').click()
        event.preventDefault()
    }
    /* Atalho para salvar o codigo da janela de texto (CTRL+S)  */
    if ((event.ctrlKey || event.metaKey) && event.which == 83) {

        event.preventDefault()
    }
    /* Atalho para recarregar a GUI do Compilador (CTRL+R)  */
    if ((event.ctrlKey || event.metaKey) && event.which == 82) {
        reset()
        event.preventDefault()
    }
}

/* Render Code Window ->> Handler ativado quando importar o código TXT */
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
            noLinhas = (content.match(/\n/g) || []).length
            textAreaNoLinha = document.querySelector('.numbers-line')
            let numeros = ''
            for (let i = 1; i <= noLinhas + 1; i++) numeros += `${i}\n`
            textAreaNoLinha.value = numeros
        }
    }
    input.click();
}

function montarTexto(code) {
    textAreaCode = document.querySelector(".caixa-codigo");
    textAreaCode.value = code
    codigo = code
}
function reset() {
    window.location.reload(true);  /* Recarrega a página ao clicar no botão reset */
}

function build() {
    sintatico = new Sintatico(codigo)
    sintatico.analisador()
}
function atualizaNoLinha() {
    codigo = document.querySelector(".caixa-codigo").value
    noLinhas = (codigo.match(/\n/g) || []).length
    textAreaNoLinha = document.querySelector('.numbers-line')
    let numeros = ''
    for (let i = 1; i <= noLinhas; i++) numeros += `${i}\n`
    textAreaNoLinha.value = numeros
}