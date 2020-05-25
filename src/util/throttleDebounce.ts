export const debounce = (func: Function, delay: number) => {
  let inDebounce: NodeJS.Timeout
  return function (this: any) {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

export const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout
  let lastRan: number
  return function (this: any) {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
