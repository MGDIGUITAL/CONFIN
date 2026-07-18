export function setupTextRotation(
  elementId: string,
  phrases: string[],
  startDelay: number = 800,
  interval: number = 3200
) {
  const rotateEl = document.getElementById(elementId);
  if (!rotateEl) return;

  // First reveal
  setTimeout(() => {
    rotateEl.style.opacity = '1';
    rotateEl.style.transform = 'translateY(0)';
  }, startDelay);

  let currentIndex = 0;

  function rotateWord() {
    if (!rotateEl) return;

    // Slide up and fade out
    rotateEl.style.opacity = '0';
    rotateEl.style.transform = 'translateY(-30px)';

    setTimeout(() => {
      // Change text and reposition below
      currentIndex = (currentIndex + 1) % phrases.length;
      rotateEl.textContent = phrases[currentIndex];
      rotateEl.style.transform = 'translateY(30px)';

      // Slide in transition
      requestAnimationFrame(() => {
        setTimeout(() => {
          rotateEl.style.opacity = '1';
          rotateEl.style.transform = 'translateY(0)';
        }, 50);
      });
    }, 500);
  }

  // Start rotation loop
  setTimeout(() => {
    setInterval(rotateWord, interval);
  }, startDelay + 1000);
}

export function setupTypewriter(
  elementId: string,
  phrases: string[],
  startDelay: number = 800,
  typeSpeed: number = 60,
  backSpeed: number = 30,
  backDelay: number = 2200
) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Add cursor styling globally if it doesn't exist
  if (!document.getElementById('typewriter-cursor-style')) {
    const style = document.createElement('style');
    style.id = 'typewriter-cursor-style';
    style.textContent = `
      @keyframes typewriter-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .typewriter-cursor {
        display: inline-block;
        font-weight: 300;
        animation: typewriter-blink 0.8s infinite;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let isDeleting = true;
  let currentText = phrases[0];

  // Start typewriter loop after initial delay
  setTimeout(tick, startDelay);

  function tick() {
    const fullText = phrases[phraseIndex];

    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }

    el.textContent = currentText;

    let delta = typeSpeed;

    if (isDeleting) {
      delta = backSpeed;
    }

    if (!isDeleting && charIndex === fullText.length) {
      delta = backDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delta = 400; // Pause before typing next word
    }

    setTimeout(tick, delta);
  }
}
