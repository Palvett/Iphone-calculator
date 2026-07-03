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

    if (length <= 6) {
      display.style.fontSize = '130px'
    } else if (length <= 9) {
      display.style.fontSize = '100px'
    } else if (length <= 12) {
      display.style.fontSize = '80px'
    } else if (length <= 15) {
      display.style.fontSize = '60px'
    } else if (length <= 18) {
      display.style.fontSize = '40px'
    } else {
      display.style.fontSize = '25px'
    }
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
      if (isError()) return
      const value = button.textContent.trim()

      if (display.value === '') {
        return
      }

      const lastChar = display.value.slice(-1)

      if (['+', '-', '×', '÷'].includes(lastChar)) {
        return
      }

      display.value += value
      adjustFontSize()
    })
  })

  functionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (isError() && !button.classList.contains('clear')) return
      if (button.classList.contains('clear')) {
        display.value = ''
      }

      if (button.classList.contains('back')) {
        display.value = display.value.slice(0, -1) || ''
      }

      if (button.classList.contains('percentage')) {
        if (display.value === '') return
        const value = parseFloat(display.value)
        if (isNaN(value)) {
          display.value = '0'
          return
        }

        display.value = (value / 100).toString()
      }

      if (button.classList.contains('toggle')) {
        if (display.value === '') return
        display.value = String(-parseFloat(display.value))
      }
    })
  })

  decimalButton.addEventListener('click', () => {
    if (isError()) return
    const lastNumber = display.value.split(/[+\-×÷]/).pop()
    if (!lastNumber.includes('.')) {
      display.value += '.'
    }
    adjustFontSize()
  })

  equalButton.addEventListener('click', () => {
    if (isError()) return
    if (display.value === '0') return

    const expressionRaw = display.value
    const expression = display.value.replaceAll('×', '*').replaceAll('÷', '/')
    const tokens = expression.match(/(\d+\.?\d*)|([+\-*/])/g)

    let result
    let i
    if (tokens[0] === '-') {
      result = -parseFloat(tokens[1])
      i = 2
    } else {
      result = parseFloat(tokens[0])
      i = 1
    }

    for (; i < tokens.length; i += 2) {
      const operator = tokens[i]
      const number = parseFloat(tokens[i + 1])

      if (operator === '+') result += number
      if (operator === '-') result -= number
      if (operator === '*') result *= number
      if (operator === '/') {
        if (number === 0) {
          display.value = 'Error'
          return
        }
        result /= number
      }
    }

    if (isNaN(result)) {
      display.value = 'Error'
      return
    }

    if (result === Infinity || result === -Infinity) {
      display.value = 'Error'
      return
    }

    const rounded = parseFloat(result.toFixed(10))
    display.value = rounded
    adjustFontSize()
    justCalculated = true

    const item = document.createElement('li')
    item.textContent = `${expressionRaw} = ${result}`
    historyList.prepend(item)
  })
})
