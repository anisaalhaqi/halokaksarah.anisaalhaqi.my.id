const noButton = document.getElementById("no-button");
const yesButton = document.getElementById("yes-button");
const message = document.getElementById("message");
const container = document.querySelector(".button-container");
const floatingHearts = document.querySelector(".floating-hearts");
const happyPopup = document.getElementById("happy-popup");
const sadPopup = document.getElementById("sad-popup");

// Create floating hearts
function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = '<i class="fas fa-heart"></i>';
  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = Math.random() * 3 + 7 + "s";
  heart.style.opacity = Math.random() * 0.5 + 0.3;
  heart.style.fontSize = Math.random() * 10 + 15 + "px";
  floatingHearts.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 10000);
}

// Create hearts periodically
setInterval(createHeart, 800);

// Create hearts in popup
function createPopupHeart(popup) {
  const heart = document.createElement("div");
  heart.className = "popup-heart";
  heart.innerHTML = '<i class="fas fa-heart"></i>';
  heart.style.left = Math.random() * 100 + "%";
  heart.style.bottom = "-20px";
  heart.style.fontSize = Math.random() * 10 + 15 + "px";
  heart.style.animationDuration = Math.random() * 2 + 3 + "s";
  popup.querySelector(".popup-hearts").appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// Variables for aggressive escape
let isEscaping = false;
let escapeInterval = null;
let mouseX = 0;
let mouseY = 0;

// Function to move button to a random position
function teleportButton() {
  noButton.classList.add("escape-mode");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;

  // Calculate safe margins to keep button visible
  const margin = 60;

  // Generate random position within safe boundaries
  const newX =
    margin + Math.random() * (screenWidth - buttonWidth - 2 * margin);
  const newY =
    margin + Math.random() * (screenHeight - buttonHeight - 2 * margin);

  // Apply new position instantly
  noButton.style.left = `${newX}px`;
  noButton.style.top = `${newY}px`;
}

// Start aggressive escape mode
function startAggressiveEscape() {
  if (!isEscaping) {
    isEscaping = true;
    teleportButton(); // Move immediately

    // Set interval to keep moving the button
    escapeInterval = setInterval(() => {
      teleportButton();
    }, 200); // Move every 200ms
  }
}

// Stop escape mode
function stopEscapeMode() {
  if (isEscaping) {
    isEscaping = false;
    if (escapeInterval) {
      clearInterval(escapeInterval);
      escapeInterval = null;
    }

    // Reset button after a delay
    setTimeout(() => {
      noButton.classList.remove("escape-mode");
      noButton.style.left = "";
      noButton.style.top = "";
    }, 2000);
  }
}

// Track mouse position
document.addEventListener("mousemove", function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Get button position
  const rect = noButton.getBoundingClientRect();
  const buttonCenterX = rect.left + rect.width / 2;
  const buttonCenterY = rect.top + rect.height / 2;

  // Calculate distance between mouse and button center
  const distance = Math.sqrt(
    Math.pow(e.clientX - buttonCenterX, 2) +
      Math.pow(e.clientY - buttonCenterY, 2)
  );

  // If mouse is within 200 pixels, start aggressive escape
  if (distance < 200) {
    startAggressiveEscape();
  } else if (isEscaping && distance > 300) {
    stopEscapeMode();
  }
});

// Also trigger on mouseover as backup
noButton.addEventListener("mouseover", function () {
  startAggressiveEscape();
});

// Prevent any click attempts on the no button
noButton.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  teleportButton(); // Move immediately if somehow clicked
});

// Prevent right-click context menu
noButton.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Handle mouse leaving the window
document.addEventListener("mouseleave", function () {
  stopEscapeMode();
});

// Yes button behavior - show happy pop-up
yesButton.addEventListener("click", function () {
  // Show happy pop-up
  happyPopup.classList.add("show");
  
  // Create a burst of hearts in the popup
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createPopupHeart(happyPopup), i * 100);
  }
  
  // Create a burst of hearts in the background
  for (let i = 0; i < 20; i++) {
    setTimeout(createHeart, i * 100);
  }
  
  // Hide the no button
  noButton.style.display = "none";
});

// Close pop-ups
document.querySelectorAll(".popup-close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    this.closest(".popup-overlay").classList.remove("show");
  });
});

// Close pop-ups when clicking on overlay
document.querySelectorAll(".popup-overlay").forEach((overlay) => {
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.classList.remove("show");
    }
  });
});

// Touch support for mobile
noButton.addEventListener("touchstart", function (e) {
  e.preventDefault();
  startAggressiveEscape();
});

// Reset on touch end
noButton.addEventListener("touchend", function () {
  setTimeout(() => {
    stopEscapeMode();
  }, 2000);
});
