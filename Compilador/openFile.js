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

// Linking scrollbars
let s1 = document.getElementById('codigo')
let s2 = document.getElementById('numero')

console.log(s1)
console.log(s2)

function select_scroll_1(e) { s2.scrollTop = s1.scrollTop }
function select_scroll_2(e) { s1.scrollTop = s2.scrollTop }

s1.addEventListener('scroll', select_scroll_1, false)
s2.addEventListener('scroll', select_scroll_2, false)


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
        build()
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
            // noLinhas = (content.match(/\n/g) || []).length
            // textAreaNoLinha = document.querySelector('.numbers-line')
            // let numeros = ''
            // for (let i = 1; i <= noLinhas + 1; i++) numeros += `<span id=${i}\n`
            // textAreaNoLinha.value = numeros
            atualizaNoLinha()
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
    const consolebox = document.querySelector('#consoleTerminal')
    consolebox.innerHTML = ''
    sintatico = new Sintatico(codigo)
    try {
        sintatico.analisador()
        const consolebox = document.querySelector('#consoleTerminal')
        consolebox.innerHTML = `<p style="color:green;">SUCESSO</p>`
    }
    catch (e) {
        console.log(e)
        const consolebox = document.querySelector('#consoleTerminal')
        consolebox.innerHTML = `<p>${e.msg}</p>`
        const lineError = document.getElementById(`numero-${e.numLinha}`)
        lineError.style.backgroundColor = 'red'
    }
}
function atualizaNoLinha() {
    codigo = document.querySelector(".caixa-codigo").value
    noLinhas = (codigo.match(/\n/g) || []).length
    textAreaNoLinha = document.querySelector('.numbers-line')
    textAreaNoLinha.innerHTML = ''
    for (let i = 1; i <= noLinhas + 1; i++) textAreaNoLinha.innerHTML += `<span id="numero-${i}">${i}<br></span>`
}