// --- LEITURA EM VOZ ALTA (VOZ FEMININA E SEM ERROS) ---
const btnRead = document.getElementById('btn-read-aloud');
const btnStop = document.getElementById('btn-stop-read');

if ('speechSynthesis' in window) {
  
  // Função para selecionar e retornar a melhor voz feminina em PT-BR
  function getFemalePortugueseVoice() {
    const voices = window.speechSynthesis.getVoices();
    
    // Lista de nomes comuns de vozes femininas em sistemas (Google, Microsoft, Apple)
    const femaleNames = ['Google português do Brasil', 'Luciana', 'Francisca', 'Helena', 'Maria', 'Vitoria', 'Yelda'];
    
    // 1. Tenta achar uma voz feminina em português pelo nome
    let selectedVoice = voices.find(voice => 
      (voice.lang === 'pt-BR' || voice.lang === 'pt_BR') && 
      femaleNames.some(name => voice.name.includes(name))
    );

    // 2. Se não achar pelo nome exato, pega a primeira voz em pt-BR disponível
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang === 'pt-BR' || voice.lang === 'pt_BR') 
                   || voices.find(voice => voice.lang.startsWith('pt'));
    }

    return selectedVoice;
  }

  // Garante o carregamento prévio das vozes no navegador
  window.speechSynthesis.onvoiceschanged = () => {
    getFemalePortugueseVoice();
  };

  btnRead.addEventListener('click', () => {
    window.speechSynthesis.cancel(); // Limpa leituras anteriores/travadas

    // 1. Limpa o texto (remove símbolos e emojis que fazem a voz travar)
    let textToRead = document.getElementById('main-content').innerText;
    textToRead = textToRead.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''); 
    textToRead = textToRead.replace(/↗|🔊|⏹️|💡/g, ''); 

    const utterance = new SpeechSynthesisUtterance(textToRead);

    // 2. Aplica a voz feminina selecionada
    const femaleVoice = getFemalePortugueseVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // 3. Ajustes de tom e velocidade para soar natural
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Velocidade suave
    utterance.pitch = 1.1; // Tom ligeiramente agudo (soa mais feminino e natural)

    window.speechSynthesis.speak(utterance);
  });

  btnStop.addEventListener('click', () => {
    window.speechSynthesis.cancel();
  });
}