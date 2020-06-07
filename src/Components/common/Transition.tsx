import { CSSTransition as ReactCSSTransition } from 'react-transition-group'
import React, {
  useRef,
  useEffect,
  useContext,
  createContext,
  Context,
} from 'react'

type TransitionProps = {
  show?: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  children: React.ReactNode
}

type ParentTransitionProps = {
  show?: boolean
  isInitialRender?: boolean
}

const TransitionContext: Context<{
  parent: ParentTransitionProps
}> = createContext({
  parent: {},
})

const useIsInitialRender = (): boolean => {
  const isInitialRender = useRef(true)
  useEffect(() => {
    isInitialRender.current = false
  }, [])
  return isInitialRender.current
}

const CSSTransition = ({
  show,
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  children,
}: TransitionProps): React.ReactElement => {
  const enterClasses = enter.split(' ').filter((s) => s.length)
  const enterFromClasses = enterFrom.split(' ').filter((s) => s.length)
  const enterToClasses = enterTo.split(' ').filter((s) => s.length)
  const leaveClasses = leave.split(' ').filter((s) => s.length)
  const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length)
  const leaveToClasses = leaveTo.split(' ').filter((s) => s.length)

  const addClasses = (node: HTMLElement, classes: string[]): void => {
    classes.length && node.classList.add(...classes)
  }

  const removeClasses = (node: HTMLElement, classes: string[]): void => {
    classes.length && node.classList.remove(...classes)
  }

  return (
    <ReactCSSTransition
      appear={show}
      unmountOnExit
      in={show}
      addEndListener={(node, done): void => {
        node.addEventListener('transitionend', done, false)
      }}
      onEnter={(node: HTMLElement): void => {
        addClasses(node, [...enterClasses, ...enterFromClasses])
      }}
      onEntering={(node: HTMLElement): void => {
        removeClasses(node, enterFromClasses)
        addClasses(node, enterToClasses)
      }}
      onEntered={(node: HTMLElement): void => {
        removeClasses(node, [...enterToClasses, ...enterClasses])
      }}
      onExit={(node): void => {
        addClasses(node, [...leaveClasses, ...leaveFromClasses])
      }}
      onExiting={(node): void => {
        removeClasses(node, leaveFromClasses)
        addClasses(node, leaveToClasses)
      }}
      onExited={(node): void => {
        removeClasses(node, [...leaveToClasses, ...leaveClasses])
      }}
    >
      {children}
    </ReactCSSTransition>
  )
}

export const Transition = ({
  show,
  ...rest
}: TransitionProps): React.ReactElement => {
  const { parent } = useContext(TransitionContext)
  const isInitialRender = useIsInitialRender()
  const isChild = show === undefined

  if (isChild) {
    return <CSSTransition show={parent.show} {...rest} />
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
        },
      }}
    >
      <CSSTransition show={show} {...rest} />
    </TransitionContext.Provider>
  )
}

export default Transition
