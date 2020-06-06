import { useRef, useEffect } from 'react'

export const useEventListener = (
  eventName: KeyboardEvent['key'],
  handler: Function,
  element = window
): void => {
  // Create a ref that stores handler
  const savedHandler = useRef<Function | null>(null)

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element.addEventListener
      if (!isSupported) return

      // // Create event listener that calls handler function stored in ref
      const eventListener = (event: Event): void =>
        savedHandler.current && savedHandler.current(event)

      // Add event listener
      element.addEventListener(eventName, eventListener)

      // Remove event listener on cleanup
      return (): void => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element] // Re-run if eventName or element changes
  )
}
