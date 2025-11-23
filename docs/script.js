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
    }
    if (y < 0 || y + logoHeight > screenHeight) {
      ySpeed *= -1;
    }

    logo.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(updatePosition);
  }

  requestAnimationFrame(updatePosition);
}

window.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startDvdBounce();
  }

  // Mobile video fix - ensure video plays on mobile devices
  const bgVideo = document.getElementById('background-video');
  if (bgVideo) {
    // Force video to load and play on mobile
    bgVideo.load();

    // Try to play video, handle mobile autoplay restrictions
    const playVideo = () => {
      bgVideo.play().catch(e => {
        console.log('Autoplay failed, waiting for user interaction:', e);
        // Add click listener to start video on first user interaction
        const startVideo = () => {
          bgVideo.play().catch(e => console.log('Video play failed:', e));
          document.removeEventListener('click', startVideo);
          document.removeEventListener('touchstart', startVideo);
        };
        document.addEventListener('click', startVideo);
        document.addEventListener('touchstart', startVideo);
      });
    };

    // Small delay to ensure video is ready
    setTimeout(() => {
      if (!prefersReducedMotion) {
        playVideo();
      }
    }, 100);
  }

  // Pause background video if user prefers reduced motion
  if (prefersReducedMotion) {
    const bgVideo = document.getElementById('background-video');
    if (bgVideo && typeof bgVideo.pause === 'function') {
      bgVideo.pause();
      bgVideo.removeAttribute('autoplay');
      bgVideo.muted = true;
    }
  }

  const characterImage = document.querySelector('.character-image');
  if (characterImage) {
    characterImage.addEventListener('click', playCharacterMusic);
  }
});
