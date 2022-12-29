// script-version16
// Заменены символы операторов на постоянные

// ПЕРЕМЕННЫЕ
// смещение последующих сот вверх, для плотного примыкания их друг к другу
// в ряду по высоте
const positionTopIncrement = -10;

const disp1 = document.querySelector("#display1"); //основной дисплей
const disp2 = document.querySelector("#display2"); //доп дисплей отображает оператор
const rowsContainer = document.querySelector(".rows-container");
const displayMaxLength = 14;
const operatorAdd = "+";
const operatorSubtract = "-";
const operatorDevide = "/";
const operatorMultiply = "\u2715";
const buttonReset = "C";
const buttonEdit = "<-";
const buttonEqual = "=";
const symbols = [
  [buttonReset, "7", "4", "1", "0"],
  [" ", "8", "5", "2"],
  [buttonEdit, "9", "6", "3", "."],
  [" ", " ", operatorDevide, operatorSubtract],
  [" ", " ", operatorMultiply, operatorAdd, buttonEqual],
];

let num1Active = true;
let num1 = "0";
let num2 = "";
let operator = "";
let result = "";

function setActiveNum(num) {
  num1Active ? (num1 = num) : (num2 = num);
}

function getActiveNum() {
  return num1Active ? num1 : num2;
}

function makeNum1active() {
  num1Active = true;
}

function makeNum2active() {
  num1Active = false;
}

//================================= ЛОГИКА ===========================

function addToActiveNumber(SymbolOrDigit) {
  let num = getActiveNum();
  num = num.toString(); // активное число должно быть в виде строки при добавлении к нему текста

  // проверить достигнута ли максимальная длина числа, которая равна атрибуту maxlength input
  if (num.length === displayMaxLength) return;

  if (SymbolOrDigit === ".") {
    if (!num.includes(SymbolOrDigit)) {
      num += SymbolOrDigit;
    }
    // если добавляем цифру
  } else {
    if (num === "0") {
      num = SymbolOrDigit;
    }
    //если активное число не равно нулю
    else {
      num += SymbolOrDigit;
    }
  }
  setActiveNum(num);
}

function resetValues() {
  num1 = "0";
  num2 = "";
  operator = "";
  result = "";
  makeNum1active();
}

function calculateResult() {
  if (num1 !== "" && num2 !== "" && operator !== "") {
    result = operate(operator, num1, num2);
    result = result.toString();
  }
}

// состояние в котором находятся все переменные,
// если после нажатия кнопки buttonEqual вычисления были произведены успешно
function stateAfterResultCalc() {
  if (
    num1 !== "" &&
    num2 !== "" &&
    operator !== "" &&
    result !== "" &&
    num1Active === false
  ) {
    return true;
  }
  return false;
}

// состояние переменных до нажатия кнопки =
function stateRightBeforeResultCalc() {
  if (
    num1 !== "" &&
    num2 !== "" &&
    operator !== "" &&
    result === "" &&
    num1Active === false
  ) {
    return true;
  }
  return false;
}

function stateBeforeSettingNum2() {
  if (
    num1 !== "" &&
    num2 === "" &&
    operator !== "" &&
    result === "" &&
    num1Active === false
  ) {
    return true;
  }
  return false;
}

function operatorIsPressed(buttonText) {
  switch (true) {
    case operator === "":
      operator = buttonText;
      makeNum2active();
      break;
    case stateBeforeSettingNum2(): // если оператор нажат повторно до введения второго числа
      operator = buttonText;
      break;
    case stateRightBeforeResultCalc() || stateAfterResultCalc(): //оператор нажат после введения двух чисел или после нажатия равно
      if (result === "") calculateResult();
      operator = buttonText;
      makeNum1active(); //  3а)переключить актив нум
      setActiveNum(result); //  3б)установить нум1 = рузульт
      makeNum2active(); // 4) Активным должно быть num2
      setActiveNum("");
      result = "";
      break;
    default:
      break;
  }
}

function numberPressed(buttonText) {
  // если кнопка цифр нажата после завершения вычислений с предудищими цифрами
  if (stateAfterResultCalc()) {
    // сбрасываем состояние на изначальное
    resetValues();
  }
  // заполняем активное число
  addToActiveNumber(buttonText);
}

function removePressed() {
  console.log("removePressed()");
  switch (true) {
    case stateBeforeSettingNum2:
      break;
    case !stateBeforeSettingNum2() && !stateAfterResultCalc():
      removeDigitFromActiveNumber();
      break;
    case stateAfterResultCalc():
      setActiveNum("");
      makeNum1active();
      setActiveNum(result);
      removeDigitFromActiveNumber();
      operator = "";
      result = "";
      break;

    default:
      break;
  }

  function removeDigitFromActiveNumber() {
    // получить значение активного числа
    let newNum = getActiveNum();
    // превратить его в строку
    // удалить последний символ
    newNum = newNum.toString().slice(0, newNum.length - 1);

    // если из числа убрали последний символ, сделать его равным 0
    if (newNum.length === 0) newNum = "0";
    // присвоить новое значение активному числу
    setActiveNum(newNum);
  }
}

function buttonPressed(buttonText) {
  console.log("buttonPressed()", buttonText);
  // if (buttonText === "*") buttonText = "\u2715";
  switch (true) {
    case buttonText === buttonEdit:
      removePressed();
      break;
    case buttonText === buttonEqual:
      calculateResult();
      break;
    case buttonText === operatorAdd ||
      buttonText === operatorSubtract ||
      buttonText === operatorMultiply ||
      buttonText === operatorDevide:
      operatorIsPressed(buttonText);
      break;
    case (buttonText >= 0 && buttonText < 10) || buttonText === ".":
      numberPressed(buttonText);
      break;
    case buttonText === buttonReset:
      console.clear();
      resetValues();
      break;
    default:
      break;
  }

  logState();
  showOnDisplay();
}

showOnDisplay();

function showOnDisplay() {
  //default fontSize
  disp1.style.fontSize = 32 + "px";
  // если показываем результат после нажатия buttonEqual, оператор скрываем
  disp2.innerText = result === "" ? operator : "";
  // Закомментирован код для проверки отображения большого числа знаков на экране
  // // Максимальное целое число способное попасть в результат 9.9999999999998e27;
  // let maxNumber = 9.9999999999998e27;
  // let a = "";
  // for (let i = 0; i < 40; i++) {
  //     if (i === 0 || i === 18) a += "8";
  //     else a += "9";
  //   }
  //   console.log(a, a.length);

  //   result = a;
  // console.log(fontSize);
  // disp.style.fontSize = 29 + "px";

  // если есть результат, показывать резлультат
  if (result !== "") disp1.innerText = result;
  // в противном случае показывать активное число
  else
    num1Active
      ? (disp1.innerText = num1)
      : num2 === "" //второе число активно но еще не введено? показывай первое число
      ? (disp1.innerText = num1)
      : (disp1.innerText = num2);
  //автоподбор размера текста что бы весь текст влез в дисплей
  if (disp1.scrollWidth > disp1.clientWidth) {
    decreaseFont();
  }
}

function decreaseFont() {
  let fontSize = window.getComputedStyle(disp1).getPropertyValue("font-size");
  fontSize = fontSize.slice(0, fontSize.length - 2);
  fontSize--;
  disp1.style.fontSize = fontSize + "px";
  // рекурсивный вызов с таймаутом для слабых компьютеров, без таймаута не успевает посчитать ширину и бесконечно вызывает функцию с одним и тем же значением scrollWidth
  if (disp1.scrollWidth > disp1.clientWidth)
    setTimeout(() => {
      decreaseFont();
    }, 1);
}

rowsContainer.addEventListener("click", (event) => {
  // слушаем только клики по границе (sota-border)
  // а не по контейнеру и не по границе и по соте
  // что бы визуально нажатия соответствовали форме кнопки целиком а не
  // только центру или еще хуже контейнеру который в форме квадрата
  if (Array.from(event.target.classList).includes("sota-border")) {
    buttonPressed(event.target.firstChild.innerText);
  }
});

// поддержка клавиатуры
const handleKeyboard = (event) => {
  if (event.repeat) return; //при повторяющихся нажатиях (кнопка зажата и не отпускается) отменяем выполнение функции
  let code = event.code;
  let shiftKey = event.shiftKey;
  let numberKey = code.slice(code.length - 1);

  switch (true) {
    case code === "Backspace":
      buttonPressed(buttonEdit);
      break;
    case code === "Enter" ||
      (code === "Equal" && !shiftKey) ||
      code === "NumpadEnter":
      buttonPressed(buttonEqual);
      break;
    case code === "NumpadAdd" || (code === "Equal" && shiftKey):
      buttonPressed(operatorAdd);
      break;
    case (code === "Minus" && !shiftKey) || code === "NumpadSubtract":
      buttonPressed(operatorSubtract);
      break;
    case code === "NumpadMultiply" || (code === "Digit8" && shiftKey):
      buttonPressed(operatorMultiply);
      break;
    case (code === "Slash" && !shiftKey) || code === "NumpadDivide":
      event.preventDefault();
      buttonPressed(operatorDevide);
      break;
    case numberKey >= 0 && numberKey < 10 && !shiftKey:
      buttonPressed(numberKey);
      break;
    case code === "NumpadDecimal" || (code === "Period" && !shiftKey):
      buttonPressed(".");
      break;
    case code === "KeyC":
      buttonPressed(buttonReset);
      break;
    default:
      break;
  }
};

window.addEventListener("keydown", handleKeyboard);

function logState() {
  console.log(
    "num1=",
    num1,
    " num2=",
    num2,
    " operator:",
    operator,
    " result=",
    result,
    " num1Active?",
    num1Active
  );
}

// ===========================ВЫЧИСЛЕНИЯ====================

function sum(a, b) {
  return +a + +b;
}

function subtract(a, b) {
  return +a - +b;
}

function multiply(a, b) {
  return +a * +b;
}

function devide(a, b) {
  return +b === 0 ? "Cannot divide by zero" : +a / +b;
}

function operate(operator, a, b) {
  switch (operator) {
    case operatorAdd:
      return sum(a, b);
    case operatorSubtract:
      return subtract(a, b);
    case operatorMultiply:
      return multiply(a, b);
    case operatorDevide:
      return devide(a, b);
  }
}

// ================================ГРАФИКА. КНОПКИ===========================
// Добавляем ряды и наполняем их сотами
for (let index = 1; index < 6; index++) {
  let row = document.createElement("ul");
  row.setAttribute("id", `row${index}`);
  row.classList.add("row");
  rowsContainer.appendChild(row);
  // в четных рядах по 3 соты
  if (index % 2 == 0) addCellsToRow(row, 4, index);
  // в нечетных по 4
  else addCellsToRow(row, 5, index);
}

function addCellsToRow(row, amount, rowNumber) {
  let positionTop = positionTopIncrement;
  for (let index = 0; index < amount; index++) {
    let sota = document.createElement("div");

    if (
      (index === 0 && rowNumber !== 1) ||
      rowNumber === 4 ||
      rowNumber === 5
    ) {
      sota.classList.add("sota", "gray", "wh-small", "fs-big");
    } else {
      sota.classList.add("sota", "gray", "wh-big", "fs-small");
    }
    // первая клетка первого ряда
    if (index === 0 && rowNumber === 1) {
      sota.classList.remove("gray", "wh-big", "fs-small");
      sota.classList.add("red", "wh-small", "fs-big");
    }
    // последняя клетка последнего ряда
    if (index === 4 && rowNumber === 5) {
      sota.classList.remove("gray", "wh-small");
      sota.classList.add("black", "wh-small");
    }
    // символы на кнопках
    sota.innerText = symbols[rowNumber - 1][index];

    let sotaBorder = document.createElement("div");
    sotaBorder.classList.add("sota-border");

    // =======HOVER EFFECT CODE===========
    let sotaDefaultBG = sota.style.backgroundColor;
    let sotaDefaultColor = sota.style.color;
    sotaBorder.addEventListener("mouseover", (event) => {
      sota.style.color = "yellow";
      sota.style.textShadow = "0 0 20px yellow";
      sota.style.backgroundColor = "#69696990";
    });
    sotaBorder.addEventListener("mouseout", (event) => {
      sota.style.backgroundColor = sotaDefaultBG;
      sota.style.color = sotaDefaultColor;
      sota.style.textShadow = "unset";
    });
    // ==========END OF HOVER EFFECT CODE=============

    // ==========MOUSE DOWN-UP EFFECT================
    let sotaDefHeight;
    let sotaDefLineheight;
    let sotaDefFontSize;
    sotaBorder.addEventListener("mousedown", (event) => {
      sotaDefHeight = sota.offsetHeight;
      sotaDefLineheight = sota.style.lineHeight.slice(
        0,
        sota.style.lineHeight.length - 2
      );
      sotaDefFontSize = window
        .getComputedStyle(sota)
        .getPropertyValue("font-size");
      sotaDefFontSize = sotaDefFontSize.slice(0, sotaDefFontSize.length - 2);
      sota.style.height = sotaDefHeight * 0.7 + "px";
      sota.style.width = sotaDefHeight * 0.7 + "px";
      sota.style.lineHeight = sotaDefLineheight * 0.7 + "px";
      let newFontSize = sotaDefFontSize * 0.7 + "px";
      sota.style.setProperty("font-size", newFontSize);
    });
    sotaBorder.addEventListener("mouseup", (event) => {
      sota.style.height = sotaDefHeight + "px";
      sota.style.width = sotaDefHeight + "px";
      sota.style.lineHeight = sotaDefLineheight + "px";
      sota.style.setProperty("font-size", `${sotaDefFontSize}px`);
    });
    // ==========END OF MOUSE DOWN-UP EFFECT================

    let sotaContainer = document.createElement("li");
    sotaContainer.classList.add("sota-container");
    sotaBorder.appendChild(sota);
    sotaContainer.appendChild(sotaBorder);
    sotaContainer.style.top = positionTop + "px";

    row.appendChild(sotaContainer);
    positionTop += positionTopIncrement;
    sotaBorder.style.width = row.offsetWidth + "px";
    sotaBorder.style.height = row.offsetWidth + "px";
    sota.style.lineHeight = sota.offsetHeight + "px";
  }
}
// =======КОНЕЦ ГРАФИКИ========================
