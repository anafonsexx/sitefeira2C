/* =========================================
   ACESSIBILIDADE
   ÓPTICA NA INDÚSTRIA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;

  const btnIncrease = document.getElementById("btn-increase-font");
  const btnDecrease = document.getElementById("btn-decrease-font");

  const btnRead = document.getElementById("btn-read-aloud");
  const btnStop = document.getElementById("btn-stop-read");


  /* =========================================
     TAMANHO DA FONTE
  ========================================= */

  let fontSize = localStorage.getItem("fontSize");

  if (fontSize === "large") {
    body.classList.add("font-large");
  }

  if (fontSize === "small") {
    body.classList.add("font-small");
  }


  btnIncrease.addEventListener("click", () => {

    body.classList.remove("font-small");
    body.classList.add("font-large");

    localStorage.setItem("fontSize", "large");

  });


  btnDecrease.addEventListener("click", () => {

    body.classList.remove("font-large");
    body.classList.add("font-small");

    localStorage.setItem("fontSize", "small");

  });


  /* =========================================
     LEITURA EM VOZ ALTA
  ========================================= */

  if (!("speechSynthesis" in window)) {

    btnRead.disabled = true;

    btnStop.disabled = true;

    btnRead.textContent = "Leitura indisponível";

    return;
  }


  const speech = window.speechSynthesis;


  /* -----------------------------------------
     ENCONTRAR VOZ EM PORTUGUÊS
  ----------------------------------------- */

  function getPortugueseVoice() {

    const voices = speech.getVoices();

    if (!voices.length) {
      return null;
    }

    /*
      Primeiro tenta encontrar português do Brasil.
    */

    let voice = voices.find((item) => {

      return item.lang &&
        item.lang.toLowerCase() === "pt-br";

    });


    /*
      Se não encontrar, procura qualquer português.
    */

    if (!voice) {

      voice = voices.find((item) => {

        return item.lang &&
          item.lang.toLowerCase().startsWith("pt");

      });

    }


    return voice || null;
  }


  /*
    Alguns navegadores carregam as vozes
    somente depois que a página abre.
  */

  speech.onvoiceschanged = () => {

    getPortugueseVoice();

  };


  /* =========================================
     LIMPAR TEXTO PARA A LEITURA
  ========================================= */

  function cleanText(text) {

    return text

      // Remove emojis
      .replace(
        /[\u{1F300}-\u{1FAFF}]/gu,
        ""
      )

      // Remove alguns símbolos gráficos
      .replace(/[→←↑↓↗↘★☆✦✧⌖◉⌁]/g, "")

      // Remove excesso de espaços
      .replace(/\s+/g, " ")

      // Remove espaços antes de pontuação
      .replace(/\s+([,.!?;:])/g, "$1")

      .trim();
  }


  /* =========================================
     DIVIDIR TEXTO EM PARTES
  ========================================= */

  function splitText(text, maxLength = 180) {

    const sentences = text.match(
      /[^.!?]+[.!?]+|[^.!?]+$/g
    );

    if (!sentences) {
      return [text];
    }

    const parts = [];

    let current = "";


    sentences.forEach((sentence) => {

      const cleanSentence = sentence.trim();

      if (!cleanSentence) {
        return;
      }


      if (
        current.length + cleanSentence.length
        <= maxLength
      ) {

        current += " " + cleanSentence;

      } else {

        if (current.trim()) {
          parts.push(current.trim());
        }

        current = cleanSentence;

      }

    });


    if (current.trim()) {
      parts.push(current.trim());
    }


    return parts;
  }


  /* =========================================
     LEITURA
  ========================================= */

  let isReading = false;


  btnRead.addEventListener("click", () => {

    /*
      Cancela qualquer leitura anterior.
    */

    speech.cancel();

    const main = document.getElementById("main-content");

    if (!main) {
      return;
    }


    let text = main.innerText;

    text = cleanText(text);


    if (!text) {

      alert(
        "Não foi encontrado texto para realizar a leitura."
      );

      return;
    }


    const parts = splitText(text);


    const voice = getPortugueseVoice();


    let index = 0;

    isReading = true;


    btnRead.textContent = "🔊 Lendo...";


    function speakNext() {

      if (!isReading) {
        return;
      }


      if (index >= parts.length) {

        isReading = false;

        btnRead.textContent = "🔊 Ler página";

        return;
      }


      const utterance =
        new SpeechSynthesisUtterance(parts[index]);


      utterance.lang = "pt-BR";

      /*
        Velocidade confortável para apresentação.
      */

      utterance.rate = 0.92;

      /*
        Tom neutro para funcionar bem
        com diferentes vozes.
      */

      utterance.pitch = 1;


      if (voice) {
        utterance.voice = voice;
      }


      utterance.onend = () => {

        index++;

        /*
          Pequena pausa entre as partes.
        */

        setTimeout(speakNext, 80);

      };


      utterance.onerror = () => {

        index++;

        if (isReading) {
          setTimeout(speakNext, 80);
        }

      };


      speech.speak(utterance);
    }


    speakNext();

  });


  /* =========================================
     PARAR LEITURA
  ========================================= */

  btnStop.addEventListener("click", () => {

    isReading = false;

    speech.cancel();

    btnRead.textContent = "🔊 Ler página";

  });


  /* =========================================
     PARAR AO SAIR / FECHAR A PÁGINA
  ========================================= */

  window.addEventListener("beforeunload", () => {

    speech.cancel();

  });

});