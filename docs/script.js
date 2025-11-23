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

// Aggressive video autoplay for mobile
function forcePlayVideo() {
  const video = document.getElementById('background-video');
  if (!video) return;
  
  // Ensure all properties are set
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  
  // Try to play
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Autoplay blocked:', error);
    });
  }
}

// Try to play video as early as possible
(function() {
  const video = document.getElementById('background-video');
  if (video) {
    video.muted = true;
    video.volume = 0;
    video.play().catch(() => {});
  }
})();

window.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startDvdBounce();
  }

  // Force video play
  forcePlayVideo();
  
  // Try again after a delay
  setTimeout(forcePlayVideo, 500);
  setTimeout(forcePlayVideo, 1000);

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

// Try to play on page load
window.addEventListener('load', forcePlayVideo);

// Try to play when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    forcePlayVideo();
  }
});

// Try to play on first user interaction
['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(event => {
  document.addEventListener(event, forcePlayVideo, { once: true, passive: true });
});
