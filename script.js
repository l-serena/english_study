const clickable = document.querySelectorAll('[data-phrase]');
let currentAudio = null;

function stopAll(){
  if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;}
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  document.querySelectorAll('.playing').forEach(el=>el.classList.remove('playing'));
}

function speak(button){
  stopAll();
  const phrase=button.dataset.phrase;
  button.classList.add('playing');

  // Placeholder MP3 paths are retained for easy replacement by recorded audio.
  // Until recordings are added, browser speech synthesis says the exact phrase.
  if('speechSynthesis' in window){
    const utterance=new SpeechSynthesisUtterance(phrase);
    utterance.lang='en-US'; utterance.rate=.78; utterance.pitch=1;
    utterance.onend=()=>button.classList.remove('playing');
    utterance.onerror=()=>button.classList.remove('playing');
    window.speechSynthesis.speak(utterance);
  }else{
    currentAudio=new Audio(button.dataset.audio);
    currentAudio.onended=()=>button.classList.remove('playing');
    currentAudio.play().catch(()=>button.classList.remove('playing'));
  }
}

clickable.forEach(button=>button.addEventListener('click',()=>speak(button)));
document.querySelector('#stop-audio').addEventListener('click',stopAll);
