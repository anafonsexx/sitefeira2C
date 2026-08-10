// CÓDIGO DO MODAL 
const btnAjuda = document.querySelector(".botao-ajuda");
const btnFechar = document.querySelector(".botao-fechar");
const modal = document.querySelector(".modal-fundo");

if (btnAjuda && modal) {
    btnAjuda.addEventListener("click", () => modal.style.display = "block");
}
if (btnFechar && modal) {
    btnFechar.addEventListener("click", () => modal.style.display = "none");
}

// TAMANHO DE FONTES
let tamanhoFonteAtual = 16;
const passo = 2;
const FONTE_MINIMA = 12;
const FONTE_MAXIMA = 24;

const btnAumentaFonte = document.getElementById("btnAumentaTexto");
const btnDiminuiFonte = document.getElementById("btnDiminuiTexto");

if (btnAumentaFonte) {
    btnAumentaFonte.addEventListener("click", () => {
        if (tamanhoFonteAtual < FONTE_MAXIMA) {
            tamanhoFonteAtual += passo;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}px`;
        }
    });
}

if (btnDiminuiFonte) {
    btnDiminuiFonte.addEventListener("click", () => {
        if (tamanhoFonteAtual > FONTE_MINIMA) {
            tamanhoFonteAtual -= passo;
            document.documentElement.style.fontSize = `${tamanhoFonteAtual}px`;
        }
    });
}

// LEITURA DE TELA (TEXT-TO-SPEECH)
let lendo = false;
const btnLeitura = document.querySelector(".botao-leitura");

if (btnLeitura) {
    btnLeitura.addEventListener("click", alternarLeitura);
}

function alternarLeitura() {
    // Se não houver suporte no navegador
    if (!('speechSynthesis' in window)) return;

    if (speechSynthesis.speaking) {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        } else {
            speechSynthesis.pause();
        }
        return;
    }

    const conteudo = document.querySelector("main");
    if (!conteudo) return;

    const fala = new SpeechSynthesisUtterance(conteudo.innerText);
    fala.lang = "pt-BR";

    fala.onend = finalizarLeitura;
    fala.onerror = finalizarLeitura; // Limpa o estado em caso de erro

    speechSynthesis.cancel(); // Limpa leituras anteriores pendentes
    speechSynthesis.speak(fala);
    lendo = true;
}

function finalizarLeitura() {
    lendo = false;
}