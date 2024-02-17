"use strict";
const number_1 = document.getElementById("number1");
const number_2 = document.getElementById("number2");
const operationElm = document.getElementById("operation");
const answersContent = document.querySelector(".answers");
const ovalMessage = document.querySelector(".ovalMessage");
const timeEl = document.getElementById("time");
const levelEl = document.getElementById("level");
const overlay = document.querySelector(".overlay");
const startBtn = document.querySelector(".event");
const gameZone = document.querySelector(".container");

// -------
const MAX_VALUE = 20; //
const INTERVAL = 10;
const operations = ["-", "+", "*"];
let LEVEL_COUNTER = 1;
let second = 10;
let correct = 0;
let incorrect = 0;
let interval;

// LOGIC FUNCTIONS
function randomNumber(max, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateAnswers(correctAnswer) {
  const answers = [correctAnswer];
  for (let i = 1; i <= 3; i++) {
    const answer = randomNumber(
      correctAnswer + INTERVAL,
      correctAnswer - INTERVAL
    );
    answers[i] = answer;
  }

  return answers.sort(() => Math.random() - 0.5);
}

function generateQuestion() {
  const number1 = randomNumber(MAX_VALUE);
  const number2 = randomNumber(MAX_VALUE);
  const operation = operations[randomNumber(operations.length)];
  const correctAnswer = eval(`${number1} ${operation} ${number2}`);
  const answers = generateAnswers(correctAnswer);
  return {
    number1,
    number2,
    operation,
    correctAnswer,
    answers,
  };
}

function timeGo() {
  let currentecond = second;
  if (currentecond > 60) {
    let minutes = Math.floor(currentecond / 60);
    let seconds = currentecond % 60;

    time.textContent = `time: 0${minutes}:${
      seconds >= 10 ? seconds : "0" + seconds
    }`;
  } else {
    time.textContent = `time: 00:${
      currentecond >= 10 ? currentecond : "0" + currentecond
    }`;
  }

  if (second == 0) {
    clearInterval(interval);
    const oval = document.createElement("div");
    oval.classList.add("oval", "unchance");
    ovalMessage.appendChild(oval);
    if (LEVEL_COUNTER === 10) {
      answersContent.style.pointerEvents = "none";
    }
    if (LEVEL_COUNTER < 10) {
      handleNextLevel();
    } else {
      resultGame();
    }
  }
  second--;
}

// RENDER FUNCTIONS

function renderQuestion({
  number1,
  number2,
  operation,
  answers,
  correctAnswer,
}) {
  levelEl.textContent = `level: ${LEVEL_COUNTER}/10`;
  interval = setInterval(timeGo, 1000);

  number_1.innerText = number1;
  number_2.innerText = number2;
  operationElm.innerText = operation;

  [...answersContent.children].forEach((elm) => elm.remove());
  const fragment = document.createDocumentFragment();
  for (let answer of answers) {
    const answerBtn = document.createElement("button");
    answerBtn.className = "btn";
    answerBtn.innerText = answer;
    const isCorrect = answer === correctAnswer;
    answerBtn.addEventListener("click", () =>
      handleAnswer(answerBtn, isCorrect)
    );
    fragment.appendChild(answerBtn);
  }
  answersContent.appendChild(fragment);
}

// HANDLER FUNCTIONS

function handleAnswer(element, isCorrect) {
  const oval = document.createElement("div");
  [...answersContent.children].forEach((item) => {
    item.style.pointerEvents = "none";
  });
  oval.classList.add("oval");

  element.classList.add(isCorrect ? "success" : "danger");

  if (isCorrect) {
    correct++;
    oval.classList.add("correct");
    ovalMessage.appendChild(oval);
  }
  if (!isCorrect) {
    incorrect++;
    oval.classList.add("failed");
    ovalMessage.appendChild(oval);
  }
  if (LEVEL_COUNTER === 10) {
    clearInterval(interval);
    answersContent.style.pointerEvents = "none";
  }
  if (LEVEL_COUNTER < 10) {
    setTimeout(() => {
      handleNextLevel(isCorrect);
    }, 800);
  }
}

function handleNextLevel(isCorrect) {
  if (isCorrect) {
    second = 11 + second;
  } else {
    second = 8;
  }
  console.log(correct);

  LEVEL_COUNTER++;
  init();
}

function init() {
  clearInterval(interval);
  const question = generateQuestion();
  renderQuestion(question);
}

init();

function handleStart(e) {
  setTimeout(() => {
    gameZone.style.display = "flex"
    e.target.remove();
    document.body.style.background= "rgb(97,97,240)";
    init();
  },600)
}

startBtn.addEventListener("click", () => handleStart());
