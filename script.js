// functionality

document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.display')
  const functionButtons = document.querySelectorAll('.function')
  const operatorButtons = document.querySelectorAll('.operator')
  const numberButtons = document.querySelectorAll('.number')
  const decimalButton = document.querySelector('.decimal')
  const equalButton = document.querySelector('.equal')

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (display.value === '0') {
        display.value = button.textContent.trim()
      } else {
        display.value += button.textContent.trim()
      }
    })
  })

  operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.textContent.trim()
      display.value += value
    })
  })

  functionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('clear')) {
        display.value = '0'
      }

      if (button.classList.contains('back')) {
        display.value = display.value.slice(0, -1) || '0'
      }

      if (button.classList.contains('percentage')) {
        display.value = (parseFloat(display.value) / 100).toString()
      }

      if (button.classList.contains('toggle')) {
        display.value = String(-parseFloat(display.value))
      }
    })
  })

  decimalButton.addEventListener('click', () => {
    if (!display.value.includes('.')) {
      display.value += '.'
    }
  })

  equalButton.addEventListener('click', () => {
    const expression = display.value.replaceAll('×', '*').replaceAll('÷', '/')

    try {
      display.value = Function(`"use strict"; return (${expression})`)()
    } catch (error) {
      display.value = 'Error'
    }
  })
})
