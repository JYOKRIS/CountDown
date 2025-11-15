// **** 新增的程式碼 ****
// 建立一個對照表，將英文 action 轉換為符號
const operatorSymbols = {
    'add': '+',
    'subtract': '−', // 注意：這裡用的是「減號」而非「連字號」
    'multiply': '×',
    'divide': '÷'
};
// ***********************

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

    // **** 修改的部分 (1/2) ****
    // 透過對照表取得要顯示的「符號」
    const displaySymbol = operatorSymbols[nextOperator];
    // *************************

    if (firstValue === null && !isNaN(inputValue)) {
        firstValue = inputValue;
        
        // **** 修改的部分 (2/2) ****
        // 使用 displaySymbol 來顯示，而不是 nextOperator
        previousOperationText = displayValue + ' ' + displaySymbol; 
    } else if (operator && !isNaN(inputValue)) {
        
        // 取得「上一個」運算符的符號
        const previousDisplaySymbol = operatorSymbols[operator];
        
        const result = calculate(firstValue, inputValue, operator);
        displayValue = String(parseFloat(result.toFixed(7))); 
        firstValue = result;
        
        // 這裡也使用符號
        previousOperationText = `${previousOperationText.split(' ')[0]} ${previousDisplaySymbol} ${inputValue} =`; 
    }

    waitingForSecondValue = true;
    operator = nextOperator; // 內部邏輯仍然使用英文 "add", "multiply"
    updateDisplay();
}

function calculate(first, second, op) {
    if (op === 'add') {
        return first + second;
    } else if (op === 'subtract') {
        return first - second;
    } else if (op === 'multiply') {
        return first * second;
    } else if (op === 'divide') {
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
    const action = key.dataset.action; 
    const keyContent = key.textContent; 

    if (key.classList.contains('key-number')) {
        inputNumber(keyContent);
        return;
    }

    if (key.classList.contains('key-operator')) {
        if (action === 'calculate') {
            handleOperator(operator); // '=' 鍵執行上一個操作
            previousOperationText = ''; // 清空上一個操作顯示
            waitingForSecondValue = true; 
            operator = null; 
        } else {
            handleOperator(action); // 傳入英文 action
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
