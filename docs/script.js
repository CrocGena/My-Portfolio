
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
  var music = document.getElementById('background-music');
  if (music.paused) {
      music.play();
  } else {
      music.pause(); 
  }
}
function startDvdBounce() {
  const logo = document.getElementById('dvd-logo');
  const speed = 3; 
  let x = Math.random() * window.innerWidth; 
  let y = Math.random() * window.innerHeight; 
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
  startDvdBounce();
});