// functionality

document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.display')
  const functionButtons = document.querySelectorAll('.function')
  const operatorButtons = document.querySelectorAll('.operator')
  const numberButtons = document.querySelectorAll('.number')
  const decimalButton = document.querySelector('.decimal')
  const equalButton = document.querySelector('.equal')
  const historyList = document.querySelector('.history-list')
  let justCalculated = false

  function isError () {
    return display.value === 'Error'
  }

  function adjustFontSize () {
    const length = display.value.length
    if (length <= 6) display.style.fontSize = '130px'
    else if (length <= 9) display.style.fontSize = '100px'
    else if (length <= 12) display.style.fontSize = '80px'
    else if (length <= 15) display.style.fontSize = '60px'
    else if (length <= 18) display.style.fontSize = '40px'
    else display.style.fontSize = '25px'
  }

  function safeEvaluate (equationString) {
    const cleanEquation = equationString.replaceAll('×', '*').replaceAll('÷', '/')
    const mathSymbolsList = cleanEquation.match(/(-?\d+\.?\d*)|([+\-*/])/g)
    if (!mathSymbolsList) return 'Error'

    const additionSubtractionQueue = []
    for (let i = 0; i < mathSymbolsList.length; i++) {
      const currentItem = mathSymbolsList[i]
      if (currentItem === '*' || currentItem === '/') {
        const previousNumber = parseFloat(additionSubtractionQueue.pop())
        const nextNumber = parseFloat(mathSymbolsList[++i])
        if (currentItem === '/' && nextNumber === 0) return 'Error'
        if (currentItem === '*') {
          additionSubtractionQueue.push(previousNumber * nextNumber)
        } else {
          additionSubtractionQueue.push(previousNumber / nextNumber)
        }
      } else {
        additionSubtractionQueue.push(currentItem)
      }
    }

    let runningTotal = parseFloat(additionSubtractionQueue)
    for (let i = 1; i < additionSubtractionQueue.length; i += 2) {
      const operatorSign = additionSubtractionQueue[i]
      const trailingNumber = parseFloat(additionSubtractionQueue[i + 1])
      if (operatorSign === '+') {
        runningTotal += trailingNumber
      }
      if (operatorSign === '-') {
        runningTotal -= trailingNumber
      }
    }
    return runningTotal
  }

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isError()) return
      const value = button.textContent.trim()
      if (display.value === '' || display.value === '0' || justCalculated) {
        display.value = value
        justCalculated = false
      } else {
        display.value += value
      }
      adjustFontSize()
    })
  })

  operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isError() || display.value === '') return
      const value = button.textContent.trim()
      const lastChar = display.value.slice(-1)

      if (['+', '-', '×', '÷'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value
        adjustFontSize()
        return
      }

      display.value += value
      justCalculated = false
      adjustFontSize()
    })
  })

  functionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isError() && !button.classList.contains('clear')) return
      if (button.classList.contains('clear')) {
        display.value = ''
        justCalculated = false
      }

      if (button.classList.contains('back')) {
        display.value = display.value.slice(0, -1) || ''
      }

      if (button.classList.contains('percentage') || button.classList.contains('toggle')) {
        if (display.value === '') return
        const equationPieces = display.value.split(/([+\-×÷])/)
        const lastNumberInput = equationPieces[equationPieces.length - 1]
        if (lastNumberInput === '' || isNaN(lastNumberInput)) return

        if (button.classList.contains('percentage')) {
          equationPieces[equationPieces.length - 1] = (parseFloat(lastNumberInput) / 100).toString()
        } else {
          equationPieces[equationPieces.length - 1] = (parseFloat(lastNumberInput) * -1).toString()
        }
        display.value = equationPieces.join('')
      }
      adjustFontSize()
    })
  })

  decimalButton.addEventListener('click', () => {
    if (isError()) return
    const currentNumberSegment = display.value.split(/[+\-×÷]/).pop()
    if (!currentNumberSegment.includes('.')) {
      display.value += '.'
    }
    adjustFontSize()
  })

  equalButton.addEventListener('click', () => {
    if (isError() || display.value === '') return

    let finalEquation = display.value
    if (['+', '-', '×', '÷'].includes(finalEquation.slice(-1))) {
      finalEquation = finalEquation.slice(0, -1)
    }

    const outputResult = safeEvaluate(finalEquation)
    if (outputResult === 'Error' || isNaN(outputResult) || !isFinite(outputResult)) {
      display.value = 'Error'
      return
    }

    const fixedPrecisionNumber = parseFloat(outputResult.toFixed(10))
    display.value = fixedPrecisionNumber.toString()
    adjustFontSize()
    justCalculated = true

    const item = document.createElement('li')
    item.textContent = `${finalEquation} = ${fixedPrecisionNumber}`
    historyList.prepend(item)
  })
})
