document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;

  const btnIncrease =
    document.getElementById("btn-increase-font");

  const btnDecrease =
    document.getElementById("btn-decrease-font");

  const btnRead =
    document.getElementById("btn-read-aloud");

  const btnStop =
    document.getElementById("btn-stop-read");


  /* =========================================
     TAMANHO DA FONTE
  ========================================= */

  const savedFontSize =
    localStorage.getItem("fontSize");


  if (savedFontSize === "large") {

    body.classList.add("font-large");

  }


  if (savedFontSize === "small") {

    body.classList.add("font-small");

  }


  if (btnIncrease) {

    btnIncrease.addEventListener(
      "click",
      () => {

        body.classList.remove(
          "font-small"
        );

        body.classList.add(
          "font-large"
        );

        localStorage.setItem(
          "fontSize",
          "large"
        );

      }
    );

  }


  if (btnDecrease) {

    btnDecrease.addEventListener(
      "click",
      () => {

        body.classList.remove(
          "font-large"
        );

        body.classList.add(
          "font-small"
        );

        localStorage.setItem(
          "fontSize",
          "small"
        );

      }
    );

  }


  /* =========================================
     VERIFICAR LEITURA EM VOZ ALTA
  ========================================= */

  if (
    !("speechSynthesis" in window)
  ) {

    if (btnRead) {

      btnRead.disabled = true;

      btnRead.textContent =
        "Leitura indisponível";

    }

    if (btnStop) {

      btnStop.disabled = true;

    }

    return;
  }


  const speech =
    window.speechSynthesis;


  /* =========================================
     ENCONTRAR VOZ EM PORTUGUÊS
  ========================================= */

  function getPortugueseVoice() {

    const voices =
      speech.getVoices();


    if (!voices.length) {

      return null;

    }


    let voice =
      voices.find(
        (item) => {

          return (
            item.lang &&
            item.lang
              .toLowerCase() ===
            "pt-br"
          );

        }
      );


    if (!voice) {

      voice =
        voices.find(
          (item) => {

            return (
              item.lang &&
              item.lang
                .toLowerCase()
                .startsWith("pt")
            );

          }
        );

    }


    return voice || null;

  }


  speech.onvoiceschanged =
    () => {

      getPortugueseVoice();

    };


  /* =========================================
     LIMPAR TEXTO PARA A LEITURA
  ========================================= */

  function cleanText(text) {

    return text

      /* Remove emojis */

      .replace(
        /[\u{1F300}-\u{1FAFF}]/gu,
        ""
      )

      /* Remove símbolos */

      .replace(
        /[→←↑↓↗↘★☆✦✧⌖◉⌁]/g,
        ""
      )

      /* Remove espaços duplicados */

      .replace(
        /\s+/g,
        " "
      )

      /* Corrige espaços antes da pontuação */

      .replace(
        /\s+([,.!?;:])/g,
        "$1"
      )

      .trim();

  }


  /* =========================================
     DIVIDIR TEXTO EM PARTES
  ========================================= */

  function splitText(
    text,
    maxLength = 180
  ) {

    const sentences =
      text.match(
        /[^.!?]+[.!?]+|[^.!?]+$/g
      );


    if (!sentences) {

      return [text];

    }


    const parts = [];

    let current = "";


    sentences.forEach(
      (sentence) => {

        const cleanSentence =
          sentence.trim();


        if (!cleanSentence) {

          return;

        }


        if (
          current.length +
          cleanSentence.length
          <= maxLength
        ) {

          current +=
            " " +
            cleanSentence;

        } else {

          if (current.trim()) {

            parts.push(
              current.trim()
            );

          }

          current =
            cleanSentence;

        }

      }
    );


    if (current.trim()) {

      parts.push(
        current.trim()
      );

    }


    return parts;

  }


  /* =========================================
     CONTROLE DA LEITURA
  ========================================= */

  let isReading = false;


  if (btnRead) {

    btnRead.addEventListener(
      "click",
      () => {

        speech.cancel();


        const main =
          document.getElementById(
            "main-content"
          );


        if (!main) {

          return;

        }


        let text =
          main.innerText;


        text =
          cleanText(text);


        if (!text) {

          alert(
            "Não foi encontrado texto para realizar a leitura."
          );

          return;

        }


        const parts =
          splitText(text);


        const voice =
          getPortugueseVoice();


        let index = 0;


        isReading = true;


        btnRead.textContent =
          "🔊 Lendo...";


        function speakNext() {

          if (!isReading) {

            return;

          }


          if (
            index >= parts.length
          ) {

            isReading = false;

            btnRead.textContent =
              "🔊 Ler página";

            return;

          }


          const utterance =
            new SpeechSynthesisUtterance(
              parts[index]
            );


          /* Português brasileiro */

          utterance.lang =
            "pt-BR";


          /* Velocidade confortável */

          utterance.rate =
            0.92;


          /* Tom neutro */

          utterance.pitch =
            1;


          if (voice) {

            utterance.voice =
              voice;

          }


          utterance.onend =
            () => {

              index++;


              setTimeout(
                speakNext,
                80
              );

            };


          utterance.onerror =
            () => {

              index++;


              if (isReading) {

                setTimeout(
                  speakNext,
                  80
                );

              }

            };


          speech.speak(
            utterance
          );

        }


        speakNext();

      }
    );

  }


  /* =========================================
     PARAR LEITURA
  ========================================= */

  if (btnStop) {

    btnStop.addEventListener(
      "click",
      () => {

        isReading = false;

        speech.cancel();


        if (btnRead) {

          btnRead.textContent =
            "🔊 Ler página";

        }

      }
    );

  }


  /* =========================================
     PARAR AO FECHAR
  ========================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      speech.cancel();

    }
  );

});