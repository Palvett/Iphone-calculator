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
      if (isError() || display.value === '') return
      const value = button.textContent.trim()
      const lastChar = display.value.slice(-1)

      if (['+', '-', '×', '÷'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value
        return;
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
      }

      if (button.classList.contains('back')) {
        display.value = display.value.slice(0, -1) || ''
      }

      if (button.classList.contains('percentage')) {
        if (display.value === '') return
        const tokens = display.value.split(/([+\-×÷])/)
        const lastNumStr = tokens[tokens.length - 1]
        if (lastNumStr === '' || isNaN(lastNumStr)) return
        
        tokens[tokens.length - 1] = (parseFloat(lastNumStr) / 100).toString()
        display.value = tokens.join('')
      }

      if (button.classList.contains('toggle')) {
        if (display.value === '') return
        const tokens = display.value.split(/([+\-×÷])/)
        const lastNumStr = tokens[tokens.length - 1]
        if (lastNumStr === '' || isNaN(lastNumStr)) return

        if (lastNumStr.startsWith('(-') && lastNumStr.endsWith(')')) {
          tokens[tokens.length - 1] = lastNumStr.slice(2, -1)
        } else {
          tokens[tokens.length - 1] = `(-${lastNumStr})`
        }
        display.value = tokens.join('')
      }
      
      adjustFontSize()
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
    if (isError() || display.value === '') return

    let expressionRaw = display.value
    let lastChar = expressionRaw.slice(-1)
    
    // Drop trailing operators to prevent runtime execution evaluation errors
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      expressionRaw = expressionRaw.slice(0, -1)
    }

    const expression = expressionRaw.replaceAll('×', '*').replaceAll('÷', '/')

    let result
    try {
      result = new Function('return ' + expression)()
    } catch {
      display.value = 'Error'
      return
    }

    if (result === undefined || isNaN(result) || !isFinite(result)) {
      display.value = 'Error'
      return
    }

    const rounded = parseFloat(result.toFixed(10))
    display.value = rounded.toString()
    adjustFontSize()
    justCalculated = true

    const item = document.createElement('li')
    item.textContent = `${expressionRaw} = ${rounded}`
    historyList.prepend(item)
  })
})
