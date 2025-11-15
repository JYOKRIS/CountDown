const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');
const previousOperationDisplay = calculator.querySelector('.previous-operation');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false; // 用於判斷是否正在輸入第二個數字
let displayValue = '0'; // 當前顯示的值
let previousOperationText = ''; // 用於顯示上一個運算

function updateDisplay() {
    display.value = displayValue;
    previousOperationDisplay.textContent = previousOperationText;
}

function clearAll() {
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    displayValue = '0';
    previousOperationText = '';
    updateDisplay();
}

function inputNumber(num) {
    if (waitingForSecondValue) {
        displayValue = num;
        waitingForSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? num : displayValue + num;
    }
    updateDisplay();
}

function inputDecimal(dot) {
    if (waitingForSecondValue) {
        displayValue = '0.';
        waitingForSecondValue = false;
        updateDisplay();
        return;
    }
    if (!displayValue.includes(dot)) {
        displayValue += dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstValue === null && !isNaN(inputValue)) {
        firstValue = inputValue;
        previousOperationText = displayValue + ' ' + nextOperator; // 顯示當前輸入和操作符
    } else if (operator && !isNaN(inputValue)) {
        const result = calculate(firstValue, inputValue, operator);
        displayValue = String(parseFloat(result.toFixed(7))); // 限制小數點，避免浮點數問題
        firstValue = result;
        previousOperationText = `${previousOperationText.split(' ')[0]} ${operator} ${inputValue} =`; // 更新上一個運算
    }

    waitingForSecondValue = true;
    operator = nextOperator;
    updateDisplay();
}

function calculate(first, second, op) {
    if (op === 'add' || op === '+') {
        return first + second;
    } else if (op === 'subtract' || op === '-') {
        return first - second;
    } else if (op === 'multiply' || op === '*') {
        return first * second;
    } else if (op === 'divide' || op === '/') {
        return first / second;
    }
    return second;
}

function togglePlusMinus() {
    displayValue = String(parseFloat(displayValue) * -1);
    updateDisplay();
}

function handlePercent() {
    displayValue = String(parseFloat(displayValue) / 100);
    updateDisplay();
}

function handleBackspace() {
    if (displayValue.length === 1 || displayValue === '0') {
        displayValue = '0';
    } else {
        displayValue = displayValue.slice(0, -1);
    }
    updateDisplay();
}


keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return;

    const key = e.target;
    const action = key.dataset.action; // 使用 data-action 屬性
    const keyContent = key.textContent; // 按鈕顯示的內容

    if (key.classList.contains('key-number')) {
        inputNumber(keyContent);
        return;
    }

    if (key.classList.contains('key-operator')) {
        if (action === 'calculate') {
            handleOperator(operator); // '=' 鍵執行上一個操作
            previousOperationText = ''; // 清空上一個操作顯示
            waitingForSecondValue = true; // 準備開始新的計算
            operator = null; // 清除操作符
        } else {
            handleOperator(action);
        }
        return;
    }

    if (key.classList.contains('key-function')) {
        if (action === 'clear') {
            clearAll();
        } else if (action === 'backspace') {
            handleBackspace();
        } else if (action === 'plus-minus') {
            togglePlusMinus();
        } else if (action === 'percent') {
            handlePercent();
        }
        return;
    }
});

// 初始化顯示
clearAll();