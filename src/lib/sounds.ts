export function playSound(src: string, maxSeconds?: number) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Browser may block autoplay — ignore silently
    });
    if (maxSeconds) {
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, maxSeconds * 1000);
    }
  } catch {
    // Ignore errors
  }
}

export function playYesSound() {
  playSound("/ab-tu-gaya.mp3", 5);
}

export function playNoSound() {
  const clips = ["/abe-sale.mp3", "/faaaa.mp3"];
  playSound(clips[Math.floor(Math.random() * clips.length)], 5);
}

export function playWinSound() {
  playSound("/eh-eh.mp3", 5);
}

export function playLoseSound() {
  playSound("/faaaa.mp3", 5);
}

export function playIplTheme() {
  playSound("/ipl_theme.mp3", 20);
}
