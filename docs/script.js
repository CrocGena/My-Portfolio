function showSection(sectionId) {
  const sections = document.querySelectorAll('.info-box');
  sections.forEach(section => {
    section.style.display = section.id === sectionId ? 'block' : 'none';
  });
}

function handleNavClick(event) {
  event.preventDefault();
  const sectionId = event.target.getAttribute('href').substring(1);
  showSection(sectionId);
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', handleNavClick);
});

showSection('about');

function playMusic() {
  const music = document.getElementById('background-music');
  const characterMusic = document.getElementById('character-music');
  if (music) {
    if (music.paused) {
      // Ensure character track stops when starting background
      if (characterMusic && !characterMusic.paused) {
        characterMusic.pause();
      }
      music.play();
    } else {
      music.pause();
    }
  }
}

function playCharacterMusic() {
  const characterMusic = document.getElementById('character-music');
  const backgroundMusic = document.getElementById('background-music');
  if (!characterMusic) return;

  // Pause the background track when playing the character track
  if (backgroundMusic && !backgroundMusic.paused) {
    backgroundMusic.pause();
  }

  if (characterMusic.paused) {
    characterMusic.play();
  } else {
    characterMusic.pause();
  }
}

function startDvdBounce() {
  const logo = document.getElementById('dvd-logo');
  if (!logo) return; // Exit if no logo is found

  const speed = 3;
  let x = Math.random() * (window.innerWidth - logo.offsetWidth);
  let y = Math.random() * (window.innerHeight - logo.offsetHeight);
  let xSpeed = speed;
  let ySpeed = speed;

  function updatePosition() {
    const logoWidth = logo.offsetWidth;
    const logoHeight = logo.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    x += xSpeed;
    y += ySpeed;

    if (x < 0 || x + logoWidth > screenWidth) {
      xSpeed *= -1;
      x = Math.max(0, Math.min(x, screenWidth - logoWidth));
    }
    if (y < 0 || y + logoHeight > screenHeight) {
      ySpeed *= -1;
      y = Math.max(0, Math.min(y, screenHeight - logoHeight));
    }

    logo.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(updatePosition);
  }

  requestAnimationFrame(updatePosition);
  
  // Handle window resize to keep DVD logo in bounds
  window.addEventListener('resize', () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const logoWidth = logo.offsetWidth;
    const logoHeight = logo.offsetHeight;
    
    x = Math.max(0, Math.min(x, screenWidth - logoWidth));
    y = Math.max(0, Math.min(y, screenHeight - logoHeight));
  });
}

// Video autoplay handler
let videoStarted = false;

function startVideo() {
  const video = document.getElementById('background-video');
  const tapOverlay = document.getElementById('tap-to-start');
  
  if (!video) return;
  
  // Set all required properties
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  
  // Try to play
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Video started successfully
      videoStarted = true;
      if (tapOverlay) {
        tapOverlay.style.display = 'none';
      }
      console.log('Video playing');
    }).catch(error => {
      // Autoplay blocked - show invisible overlay to capture first touch
      console.log('Autoplay blocked, waiting for user interaction');
      if (tapOverlay) {
        tapOverlay.style.display = 'block';
      }
    });
  }
}

// Try to start video immediately
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startDvdBounce();
  }

  // Try to start video
  startVideo();
  
  // Try again after delays
  setTimeout(startVideo, 100);
  setTimeout(startVideo, 500);

  // Handle tap overlay click
  const tapOverlay = document.getElementById('tap-to-start');
  if (tapOverlay) {
    tapOverlay.addEventListener('click', () => {
      startVideo();
    });
    tapOverlay.addEventListener('touchstart', () => {
      startVideo();
    });
  }

  // Pause background if user prefers reduced motion
  if (prefersReducedMotion) {
    const video = document.getElementById('background-video');
    if (video && typeof video.pause === 'function') {
      video.pause();
    }
  }

  const characterImage = document.querySelector('.character-image');
  if (characterImage) {
    characterImage.addEventListener('click', playCharacterMusic);
  }
});

// Capture ANY touch/click on the page to start video
['touchstart', 'click', 'touchend'].forEach(eventType => {
  document.addEventListener(eventType, () => {
    if (!videoStarted) {
      startVideo();
    }
  }, { once: true, passive: true });
});

// Try on page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && !videoStarted) {
    startVideo();
  }
});
