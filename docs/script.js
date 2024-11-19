// Function to show a specific section and hide others
function showSection(sectionId) {
  const sections = document.querySelectorAll('.info-box');
  sections.forEach(section => {
    section.style.display = section.id === sectionId ? 'block' : 'none';
  });
}

// Function to handle navigation clicks
function handleNavClick(event) {
  event.preventDefault();
  const sectionId = event.target.getAttribute('href').substring(1);
  showSection(sectionId);
}

// Add event listeners to all navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', handleNavClick);
});

// Show the about section by default
showSection('about');


function playMusic() {
  var music = document.getElementById('background-music');
  if (music.paused) {
      music.play();
  } else {
      music.pause(); // Optional: Toggle play/pause
  }
}
