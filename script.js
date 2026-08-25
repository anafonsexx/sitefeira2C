// --- LEITURA EM VOZ ALTA CORRIGIDA ---
const btnRead = document.getElementById('btn-read-aloud');
const btnStop = document.getElementById('btn-stop-read');

if ('speechSynthesis' in window) {
  btnRead.addEventListener('click', () => {
    window.speechSynthesis.cancel(); // Para leituras travadas anteriores

    // 1. Pega o texto e limpa emojis/caracteres especiais que travam a leitura
    let textToRead = document.getElementById('main-content').innerText;
    textToRead = textToRead.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''); 
    textToRead = textToRead.replace(/↗|🔊|⏹️|💡/g, ''); // Remove ícones específicos

    const utterance = new SpeechSynthesisUtterance(textToRead);

    // 2. Procura obrigatoriamente por uma voz pt-BR do sistema
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') 
                   || voices.find(v => v.lang.startsWith('pt'));

    if (ptBrVoice) {
      utterance.voice = ptBrVoice;
    }

    // 3. Ajustes de velocidade e idioma
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;  // Fala um pouco mais pausada e clara
    utterance.pitch = 1.0; // Tom natural

    window.speechSynthesis.speak(utterance);
  });

  btnStop.addEventListener('click', () => {
    window.speechSynthesis.cancel();
  });
}