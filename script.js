document.addEventListener('DOMContentLoaded', () => {
  // --- CONTROLE DE TAMANHO DE FONTE ---
  let currentFontSize = 16;
  const body = document.body;

  document.getElementById('btn-increase-font').addEventListener('click', () => {
    if (currentFontSize < 24) {
      currentFontSize += 2;
      body.style.fontSize = `${currentFontSize}px`;
    }
  });

  document.getElementById('btn-decrease-font').addEventListener('click', () => {
    if (currentFontSize > 12) {
      currentFontSize -= 2;
      body.style.fontSize = `${currentFontSize}px`;
    }
  });

  // --- LEITURA EM VOZ ALTA (Web Speech API) ---
  const btnRead = document.getElementById('btn-read-aloud');
  const btnStop = document.getElementById('btn-stop-read');

  if ('speechSynthesis' in window) {
    btnRead.addEventListener('click', () => {
      window.speechSynthesis.cancel(); // Cancela leituras anteriores

      const textToRead = document.getElementById('main-content').innerText;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;

      window.speechSynthesis.speak(utterance);
    });

    btnStop.addEventListener('click', () => {
      window.speechSynthesis.cancel();
    });
  } else {
    btnRead.style.display = 'none';
    btnStop.style.display = 'none';
    console.warn('Recurso de síntese de voz não suportado neste navegador.');
  }
});