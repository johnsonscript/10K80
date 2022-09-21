// Element Variables - Input
const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");

// Element Variables - Countdown
const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

// Element Variables - Complete
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

// Global Variables
let countdownTitle = "";
let countdownDate = "";
let countdownEmail = "";
let countdownValue = 6.048e8 + 1000;
let countdownActive;
let savedCountdown;

// Millisecond conversions to standard times
const millisecond = 1;
const second = 1000;
const minute = second * 60;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split("T")[0];

// Populate Countdown / Complete UI
function updateDOM() {
  // Makes function run every second to update time remaining
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    // Time until completion conversions
    const minutes = Math.floor(distance / minute);
    const seconds = Math.floor((distance % minute) / second);
    const milliseconds = Math.floor((distance % second) / millisecond);

    // Hide Input
    inputContainer.hidden = true;

    // If Countdown has ended, show Complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Show Countdown in Progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${minutes}  :`;
      timeElements[1].textContent = `${seconds}   :`;
      timeElements[2].textContent = `${milliseconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, millisecond);
}

// Take values from Form Input
function updateCountdown(e) {
  // Keeps page from refreshing when submitting
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[2].value;
  countdownEmail = e.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
    email: countdownEmail,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // Check for valid date
  countdownValue = Date.now() + 6.048e8 + 1000;
  updateDOM();
}

// Reset All Values
function reset() {
  // Hide Countdowns, show Input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  // Stop the Countdown
  clearInterval(countdownActive);

  // Reset Values
  countdownTitle = "";
  countdownDate = "";
  countdownEmail = "";
  localStorage.removeItem("countdown");
}

// Get Countdown from localStorage if available
function restorePrevCount() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownEmail = savedCountdown.email;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// On Load, check localStorage
restorePrevCount();