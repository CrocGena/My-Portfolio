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

  // Handle background video for all devices
  const bgVideo = document.getElementById('background-video');
  const bgFallback = document.getElementById('background-fallback');
  
  if (bgVideo) {
    // Force all properties for iOS compatibility
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;
    bgVideo.autoplay = true;
    bgVideo.loop = true;
    bgVideo.volume = 0;
    bgVideo.setAttribute('muted', '');
    bgVideo.setAttribute('playsinline', '');
    bgVideo.setAttribute('autoplay', '');
    
    // Remove and re-add the video element to force reload with correct settings
    const parent = bgVideo.parentNode;
    const videoClone = bgVideo.cloneNode(true);
    parent.replaceChild(videoClone, bgVideo);
    
    const newVideo = document.getElementById('background-video');
    newVideo.muted = true;
    newVideo.volume = 0;
    
    // Load and play
    newVideo.load();
    
    // Try to play immediately
    const playAttempt = newVideo.play();
    if (playAttempt !== undefined) {
      playAttempt.then(() => {
        console.log('Video is playing');
        if (bgFallback) {
          bgFallback.style.display = 'none';
        }
      }).catch((error) => {
        console.log('Autoplay prevented:', error);
        // Video autoplay blocked - this should not happen if video is truly muted
        if (bgFallback) {
          bgFallback.style.display = 'block';
        }
      });
    }
  }

  // Pause background if user prefers reduced motion
  if (prefersReducedMotion) {
    const video = document.getElementById('background-video');
    if (video && typeof video.pause === 'function') {
      video.pause();
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
