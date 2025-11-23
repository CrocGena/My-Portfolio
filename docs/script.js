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

window.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startDvdBounce();
  }

  // Handle background video - use GIF on mobile devices for guaranteed autoplay
  const bgVideo = document.getElementById('background-video');
  const bgFallback = document.getElementById('background-fallback');
  
  // Detect if device is mobile (iPhone, Android, etc.)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile devices, use GIF immediately (always works without user interaction)
    if (bgFallback) {
      bgFallback.style.display = 'block';
    }
    if (bgVideo) {
      bgVideo.style.display = 'none';
    }
  } else {
    // On desktop, try to use video
    if (bgVideo) {
      bgVideo.muted = true;
      bgVideo.playsInline = true;
      bgVideo.defaultMuted = true;
      bgVideo.volume = 0;
      
      bgVideo.play().then(() => {
        console.log('Video playing on desktop');
        if (bgFallback) {
          bgFallback.style.display = 'none';
        }
      }).catch((error) => {
        console.log('Video failed, using GIF');
        if (bgFallback) {
          bgFallback.style.display = 'block';
        }
        bgVideo.style.display = 'none';
      });
    }
  }

  // Pause background if user prefers reduced motion
  if (prefersReducedMotion) {
    if (bgVideo && typeof bgVideo.pause === 'function') {
      bgVideo.pause();
    }
    if (bgFallback) {
      bgFallback.style.display = 'none';
    }
  }

  const characterImage = document.querySelector('.character-image');
  if (characterImage) {
    characterImage.addEventListener('click', playCharacterMusic);
  }
});
