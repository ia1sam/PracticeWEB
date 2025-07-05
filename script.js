const display = document.getElementById("display")
const historyList = document.getElementById("historyList")
let currentInput = ""
let operator = ""
let previousInput = ""
let waitingForOperand = false

window.onload = () => {
  loadHistory()
}


function appendToDisplay(value) {
  if (value === "√") {
    if (currentInput !== "") {
      const num = Number.parseFloat(currentInput)
      if (num >= 0) {
        const result = Math.sqrt(num)
        const operation = `√${num} = ${result}`
        addToHistory(operation)
        display.value = result
        currentInput = result.toString()
      } else {
        display.value = "Ошибка"
        currentInput = ""
      }
    }
    return
  }

  if (value === "^") {
    if (currentInput !== "") {
      const num = Number.parseFloat(currentInput)
      const result = Math.pow(num, 2)
      const operation = `${num}² = ${result}`
      addToHistory(operation)
      display.value = result
      currentInput = result.toString()
    }
    return
  }

  if (value === "%") {
    if (previousInput !== "" && currentInput !== "" && operator !== "") {
      const prev = Number.parseFloat(previousInput)
      const current = Number.parseFloat(currentInput)
      let result
      let operation

      switch (operator) {
        case "+":
          result = prev + (prev * current) / 100
          operation = `${prev} + ${current}% = ${result}`
          break
        case "-":
          result = prev - (prev * current) / 100
          operation = `${prev} - ${current}% = ${result}`
          break
        case "*":
          result = prev * (current / 100)
          operation = `${prev} × ${current}% = ${result}`
          break
        case "/":
          if (current === 0) {
            display.value = "Ошибка"
            clearCalculator()
            return
          }
          result = prev / (current / 100)
          operation = `${prev} ÷ ${current}% = ${result}`
          break
        default:
          return
      }

      result = Math.round(result * 10000000000) / 10000000000

      addToHistory(operation)
      display.value = result
      currentInput = result.toString()
      previousInput = ""
      operator = ""
      waitingForOperand = false
    }
    return
  }

  if (["+", "-", "*", "/"].includes(value)) {
    if (currentInput === "" && value === "-") {
      currentInput = "-"
      display.value = currentInput
      return
    }

    if (currentInput === "" || currentInput === "-") {
       return
    }
    
    if (previousInput !== "" && currentInput !== "" && operator !== "") {
      calculate()
    }

    operator = value
    previousInput = currentInput
    currentInput = ""
    waitingForOperand = true
    return
  }

  if (value === ".") {
    if (currentInput.indexOf(".") === -1) {
      currentInput += value
      display.value = currentInput
    }
    return
  }

  if (waitingForOperand) {
    currentInput = value
    waitingForOperand = false
  } else {
    currentInput += value
  }

  display.value = currentInput
}

function calculate() {
  if (previousInput === "" || currentInput === "" || operator === "") {
    return
  }

  const prev = Number.parseFloat(previousInput)
  const current = Number.parseFloat(currentInput)

  if (isNaN(prev) || isNaN(current)) {
    display.value = "Ошибка"
    clearCalculator()
    return
  }

  let result
  let operation

  switch (operator) {
    case "+":
      result = prev + current
      operation = `${prev} + ${current} = ${result}`
      break
    case "-":
      result = prev - current
      operation = `${prev} - ${current} = ${result}`
      break
    case "*":
      result = prev * current
      operation = `${prev} × ${current} = ${result}`
      break
    case "/":
      if (current === 0) {
        display.value = "Ошибка"
        clearCalculator()
        return
      }
      result = prev / current
      operation = `${prev} ÷ ${current} = ${result}`
      break
    default:
      return
  }

  if (isNaN(result) || !isFinite(result)) {
    display.value = "Ошибка"
    clearCalculator()
    return
  }

  result = Math.round(result * 10000000000) / 10000000000

  addToHistory(operation)
  display.value = result
  currentInput = result.toString()
  previousInput = ""
  operator = ""
  waitingForOperand = false
}

function clearDisplay() {
  clearCalculator()
  display.value = ""
}

function clearCalculator() {
  currentInput = ""
  previousInput = ""
  operator = ""
  waitingForOperand = false
}

function addToHistory(operation) {
  let history = getHistory()
  history.unshift(operation)

  if (history.length > 100) {
    history = history.slice(0, 100)
  }

  localStorage.setItem("calculatorHistory", JSON.stringify(history))
  displayHistory()
}

function getHistory() {
  const history = localStorage.getItem("calculatorHistory")
  return history ? JSON.parse(history) : []
}

function loadHistory() {
  displayHistory()
}

function displayHistory() {
  const history = getHistory()
  historyList.innerHTML = ""

  history.forEach((operation) => {
    const historyItem = document.createElement("div")
    historyItem.className = "history-item"
    historyItem.textContent = operation
    historyList.appendChild(historyItem)
  })
}

document.addEventListener("keydown", (event) => {
  const key = event.key

  if (key >= "0" && key <= "9") {
    appendToDisplay(key)
  } else if (key === ".") {
    appendToDisplay(".")
  } else if (key === "+") {
    appendToDisplay("+")
  } else if (key === "-") {
    appendToDisplay("-")
  } else if (key === "*") {
    appendToDisplay("*")
  } else if (key === "/") {
    event.preventDefault()
    appendToDisplay("/")
  } else if (key === "%") {
    appendToDisplay("%")
  } else if (key === "Enter" || key === "=") {
    event.preventDefault()
    calculate()
  } else if (key === "Delete" || key === "c" || key === "C") {
    clearDisplay()
  }
})
