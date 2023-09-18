const answerForm = document.getElementById("answerForm");
const userAnswerInput = document.getElementById("userAnswer");
const questionTimer = document.getElementById("questionTimer");
const timerCircle = document.getElementById("timerCircle");

let currentIndex = 0;
let timer;
const questionDuration = 15; // The duration for each question in seconds
let timeLeft = questionDuration;

// Define the states
const states = {
  INITIAL: "initial",
  CORRECT_ANSWER: "correctAnswer",
  WRONG_ANSWER: "wrongAnswer",
  JUMP_UP: "jumpUp",
  FAIL: "failure"
};

// Initialize the cube state
let cubeState = states.INITIAL;

userAnswerInput.focus();

const cube = document.querySelector(".cube");

// Function to start the countdown timer for each question
function startTimer() {
  timeLeft = questionDuration;
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      // Time's up, transition to the next question
      clearInterval(timer);
      cubeState = states.FAIL;
      rotateCube();
    } else {
      updateTimerDisplay();
    }
  }, 1000); // Update the timer every second (1000 milliseconds)
}

// Initialize the cube content
function initializeCube() {
  setTimeout(() => {
    const frontFace = document.querySelector(".front");
    frontFace.textContent = questionsAndAnswers[currentIndex].question;
  
    const backFace = document.querySelector(".back");
    backFace.textContent = questionsAndAnswers[currentIndex].answer;
  }, 250);

  // Start the countdown timer for the new question
  startTimer();
}

function stopTimer() {
  clearInterval(timer);
  timerCircle.style.display = 'none';
  questionTimer.textContent = ``;
}

initializeCube(); // Call this function to set the initial cube content

const faces = document.querySelectorAll(".face");

// Function to handle showing a new question and rotating the cube
function showNewQuestion() {
  // Increment the current index to show the next question
  currentIndex = (currentIndex + 1) % questionsAndAnswers.length;

  // Update the cube content with the new question
  initializeCube();

  // Reset the cube's rotation to the top
  cube.style.transform = `rotateX(0deg)`;

  // Start the countdown timer for the new question
  resetTimer();
}

// Function to update the timer display
function updateTimerDisplay() {
  questionTimer.textContent = `${String(timeLeft).padStart(2, "0")}`;
}

// Function to reset the timer animation
function resetTimer() {
  timeLeft = questionDuration;
  // Reset the stroke-dashoffset property to its initial value
  timerCircle.style.display = 'none';
  setTimeout(() => {
      timerCircle.style.display = 'block'; 
  }, 50);
}

// Handle answer
answerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check if the user left the answer input field empty
  if (userAnswerInput.value === '') {
    return;
  }

  const userAnswer = userAnswerInput.value.toLowerCase();
  const correctAnswer = questionsAndAnswers[currentIndex].answer.toLowerCase();

  if (correctAnswer === "@" || fuzzyCompare(userAnswer, correctAnswer)) {
    if (currentIndex === questionsAndAnswers.length - 1) {
      cubeState = states.JUMP_UP; // Transition to the jumpUp state if all questions are answered correctly
    } else {
      cubeState = states.CORRECT_ANSWER; // Transition to the correctAnswer state
    }
  } else {
    cubeState = states.WRONG_ANSWER; // Transition to the wrongAnswer state
  }

  clearInterval(timer); // Stop the timer
  rotateCube(); // Rotate the cube based on the current state

  userAnswerInput.value = "";
});

function resetGame() {
  cubeState = states.INITIAL;
  currentIndex = 0;
  timeLeft = questionDuration;
  rotateCube();
}

// Global function that rotates the cube based on the current state
function rotateCube() {
  switch (cubeState) {
    case states.CORRECT_ANSWER:
      cube.style.transform = `rotateY(180deg)`;
      setTimeout(() => {
        if (cubeState !== states.JUMP_UP) {
          showNewQuestion();
        }
      }, 2500);
      break;
    case states.WRONG_ANSWER:
      cube.style.transform = `rotateY(-90deg)`;
      setTimeout(() => {
        cubeState = states.INITIAL;
        rotateCube();
      }, 500);
      break;
    case states.JUMP_UP:
      cube.style.transform = `translateY(-100px) scale(1.3) rotateX(90deg)`;
      stopTimer();
      break;
    case states.FAIL:
      cube.style.transform = `translateY(-50px) scale(0.7) rotateX(-90deg)`;
      stopTimer();
      break;
    case states.INITIAL:
      cube.style.transform = `rotateY(0deg) translateY(0) scale(1) rotateX(0deg)`;
      break;
    default:
      // Handle the initial state or any other states if needed
      break;
  }
}

function fuzzyCompare(str1, str2) {
  const maxTypos = 2;

  function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            matrix[i][j - 1] + 1, // Insertion
            matrix[i - 1][j] + 1 // Deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  return levenshteinDistance(str1, str2) <= maxTypos;
}

// Get references to HTML elements
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const applySettingsButton = document.getElementById("applySettings");
const animationDurationInput = document.getElementById("animationDuration");
const questionDurationInput = document.getElementById("questionDuration");
const customQuestionsInput = document.getElementById("customQuestions");

// Show the settings modal when the settings button is clicked
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "block";
});

// Close the settings modal when the close button (x) is clicked
document.querySelector(".close").addEventListener("click", () => {
    settingsModal.style.display = "none";
});

// Apply settings when the apply button is clicked
applySettingsButton.addEventListener("click", () => {
  // Get the values from the input fields
  const animationDuration = parseInt(animationDurationInput.value);
  const questionDurationSetting = parseInt(questionDurationInput.value);
  // Parse the custom questions text into JSON format
  const customQuestions = parseCustomQuestions(customQuestionsText);

  // Update game settings based on user input
  // For example, you can update the animation duration and question duration variables here
  // You can also update the questionsAndAnswers array with custom questions
  // Ensure to handle any errors or validation for user inputs

  // Update animation duration (in milliseconds)
  // For example, you can set the cube animation duration like this:
  cube.style.transition = `transform ${animationDuration}ms ease-in-out`;

  // Update question duration (in seconds)
  // For example, you can set the question duration like this:
  questionDuration = questionDurationSetting;

  // Update custom questions if provided
  if (Array.isArray(customQuestions)) {
      questionsAndAnswers = customQuestions;
  }

  // Close the settings modal
  settingsModal.style.display = "none";
});

// Function to parse the custom questions text into JSON format
function parseCustomQuestions(text) {
  const lines = text.split('\n');
  const questions = [];

  let currentQuestion = null;
  for (const line of lines) {
      if (line.startsWith('Q:')) {
          // Start of a new question
          currentQuestion = {
              question: line.substring(2).trim(),
          };
      } else if (line.startsWith('A:')) {
          // Answer for the current question
          if (currentQuestion) {
              currentQuestion.answer = line.substring(2).trim();
              questions.push(currentQuestion);
              currentQuestion = null;
          }
      }
  }

  return questions;
}