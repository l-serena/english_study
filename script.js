const clickable = document.querySelectorAll("[data-phrase]");
let currentAudio = null;

function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }

  document.querySelectorAll(".playing")
    .forEach(el => el.classList.remove("playing"));
}

function fallbackToSpeech(button) {
  if (!("speechSynthesis" in window)) {
    button.classList.remove("playing");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(button.dataset.phrase);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1;

  utterance.onend = () => button.classList.remove("playing");
  utterance.onerror = () => button.classList.remove("playing");

  speechSynthesis.speak(utterance);
}

async function speak(button) {
  stopAll();
  button.classList.add("playing");

  const audioPath = button.dataset.audio;

  if (audioPath) {
    const audio = new Audio(audioPath);
    currentAudio = audio;

    audio.onended = () => {
      button.classList.remove("playing");
      currentAudio = null;
    };

    try {
      await audio.play();
      return; // Recorded audio is playing successfully
    } catch (error) {
      console.warn(`Could not play ${audioPath}; using speech synthesis.`, error);
      if (currentAudio === audio) currentAudio = null;
    }
  }

  fallbackToSpeech(button);
}

clickable.forEach(button => {
  button.addEventListener("click", () => speak(button));
});

document.querySelector("#stop-audio")?.addEventListener("click", stopAll);

function fillBlocks(container, count, className) {
  const total = Number(count) || 0;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const block = document.createElement("i");
    block.className = className;
    block.setAttribute("aria-hidden", "true");
    fragment.appendChild(block);
  }

  container.replaceChildren(fragment);
}

document.querySelectorAll(".mini-count").forEach((container) => {
  fillBlocks(container, container.dataset.count, "count-block");
});

document.querySelectorAll(".ten-bundles").forEach((container) => {
  fillBlocks(container, container.dataset.tens, "ten-block");
});
