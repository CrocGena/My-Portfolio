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

// Function to force video play on iOS
function forceVideoPlay() {
  const bgVideo = document.getElementById('background-video');
  if (bgVideo && bgVideo.paused) {
    bgVideo.play().catch(e => console.log('Video play attempt:', e));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startDvdBounce();
  }

  // Force video to play on mobile devices - Enhanced for iPhone
  const bgVideo = document.getElementById('background-video');
  if (bgVideo) {
    // Set video properties for mobile compatibility
    bgVideo.muted = true;
    bgVideo.playsInline = true;
    bgVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
    bgVideo.setAttribute('playsinline', 'playsinline');
    bgVideo.defaultMuted = true;
    
    // Load the video
    bgVideo.load();
    
    // Multiple attempts to play video
    setTimeout(() => {
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play was prevented, attempting to play on user interaction');
        });
      }
    }, 100);
    
    // Try to play on any user interaction
    const playEvents = ['touchstart', 'touchend', 'click', 'scroll'];
    playEvents.forEach(eventType => {
      document.addEventListener(eventType, forceVideoPlay, { once: true, passive: true });
    });
    
    // Also try when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        forceVideoPlay();
      }
    });
  }

  // Pause background video if user prefers reduced motion
  if (prefersReducedMotion) {
    if (bgVideo && typeof bgVideo.pause === 'function') {
      bgVideo.pause();
      bgVideo.removeAttribute('autoplay');
    }
  }

  const characterImage = document.querySelector('.character-image');
  if (characterImage) {
    characterImage.addEventListener('click', playCharacterMusic);
  }
});
