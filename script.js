// functionality

const displayEL = document.querySelector(".display");
const functionButtons = document.querySelectorAll(".function");
const operatorButtons = document.querySelectorAll(".operator");
const numberButtons = document.querySelectorAll(".number");
const decimalButton = document.querySelector(".decimal");
const equallButton = document.querySelector(".equall");

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (displayEL.textContent === "0") {
      displayEL.textContent = button.textContent;
    } else {
      displayEL.textContent += button.textContent;
    }
  });
});

functionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.textContent;
    });
});