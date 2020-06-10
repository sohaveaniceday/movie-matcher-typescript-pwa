import React, {
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  MutableRefObject,
  FC,
  ReactNode,
  RefObject,
} from 'react'
import { useObjectState, getClassName, BaseTypes } from '../../../util'
import { TextInput } from '..'
import { Icon } from '../Icon'

export type SuggestionProps = {
  name: string
  element: ReactNode
  id: string
}

type AutoSuggestProps = {
  suggestions: SuggestionProps[]
  onChangeFunc?: Function
  isLoading: boolean
  allowFetch: MutableRefObject<boolean>
  icon?: string
  forwardRef?: RefObject<HTMLInputElement>
  cssClasses?: string[]
  rounded?: boolean
} & BaseTypes<JSX.IntrinsicElements['input']>

export const AutoSuggest: FC<AutoSuggestProps> = ({
  suggestions = [],
  name,
  // isLoading,
  allowFetch,
  icon,
  onChangeFunc,
  autoFocus,
  onFocus,
  onBlur,
  disabled,
  forwardRef,
  placeholder,
  rounded = false,
  cssClasses = [],
}: AutoSuggestProps) => {
  const initialAutoSuggestState = {
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: '',
  }
  const [
    { showSuggestions, activeSuggestion, filteredSuggestions, userInput },
    updateAutoSuggestState,
  ] = useObjectState(initialAutoSuggestState)

  const isDisplayingSuggestions: boolean =
    showSuggestions && filteredSuggestions.length > 0 && userInput

  useEffect(() => {
    // Filter our suggestions that don't contain the user's input
    if (!disabled && allowFetch.current) {
      const newFilteredSuggestions = suggestions.reduce(
        (
          acc: SuggestionProps[],
          current: SuggestionProps
        ): SuggestionProps[] => {
          const { name } = current
          return name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            ? [...acc, current]
            : acc
        },
        []
      )

      // Update the user input and filtered suggestions, reset the active
      // suggestion and make sure the suggestions are shown
      updateAutoSuggestState({
        activeSuggestion: 0,
        filteredSuggestions: newFilteredSuggestions,
        showSuggestions: true,
      })
    }
  }, [suggestions, updateAutoSuggestState, userInput, allowFetch, disabled])

  // Event fired when the input value is changed
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    allowFetch.current = true
    const { value, name } = event.target
    if (onChangeFunc) {
      event.persist()
      onChangeFunc && onChangeFunc(value, name)
    }
    updateAutoSuggestState({
      userInput: value,
    })
  }

  // Event fired when the user clicks on a suggestion
  const onClick = ({ currentTarget }: MouseEvent<HTMLLIElement>) => {
    allowFetch.current = false
    const { dataset } = currentTarget
    onChangeFunc && onChangeFunc(dataset.name, name, dataset.id)

    // Update the user input and reset the rest of the state
    updateAutoSuggestState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: dataset.name,
    })
  }

  // Event fired when the user presses a key down
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Stops document's keydown event listener when displaying a list
    if (isDisplayingSuggestions) event.stopPropagation()

    const selectedItem = filteredSuggestions[activeSuggestion]
    // User pressed the enter key, update the input and close the
    // suggestions
    if (event.keyCode === 13) {
      event.preventDefault()
      if (!selectedItem) return
      allowFetch.current = false
      onChangeFunc && onChangeFunc(selectedItem.name, name, selectedItem.id)
      updateAutoSuggestState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: selectedItem.name,
      })
    }
    // User pressed the up arrow, decrement the index
    else if (event.keyCode === 38) {
      if (activeSuggestion === 0) {
        return
      }

      updateAutoSuggestState({ activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow, increment the index
    else if (event.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return
      }

      updateAutoSuggestState({
        activeSuggestion: Math.min(
          activeSuggestion + 1,
          filteredSuggestions.length - 1
        ),
      })
      // User pressed escape, exit list
    } else if (event.keyCode === 27) {
      updateAutoSuggestState({
        activeSuggestion: 0,
        showSuggestions: false,
      })
    }
  }

  // const onBlur = () => {
  //   updateAutoSuggestState({
  //     filteredSuggestions: [],
  //     showSuggestions: false,
  //     activeSuggestion: 0,
  //   })
  // }

  useEffect(() => {
    document.getElementById(activeSuggestion)?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [activeSuggestion])

  const suggestionsListComponent = isDisplayingSuggestions ? (
    <div className='absolute z-20 w-full h-64'>
      <ul
        className={getClassName([
          'max-h-full',
          'overflow-y-scroll',
          'text-left',
          'bg-white',
          'border-2',
          [rounded, 'rounded-b-lg'],
        ])}
      >
        {filteredSuggestions.map(
          ({ name, element, id }: SuggestionProps, index: number) => {
            const isActiveSuggestion = activeSuggestion === index
            return (
              <li
                id={index.toString()}
                data-id={id}
                data-name={name}
                className={getClassName([
                  [isActiveSuggestion, ['bg-blue-300', 'text-white']],
                  'cursor-pointer',
                ])}
                key={`${name}-${index}`}
                onClick={onClick}
              >
                {element}
              </li>
            )
          }
        )}
      </ul>
    </div>
  ) : (
    <></>
  )

  const autoSuggestClassName = getClassName([...cssClasses])

  return (
    <div className={autoSuggestClassName}>
      <div className='relative'>
        <div className='inline-flex w-full'>
          <TextInput
            name={name}
            onChange={onChange}
            value={userInput}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus={autoFocus}
            onFocus={onFocus}
            disabled={disabled}
            forwardRef={forwardRef}
            placeholder={placeholder}
            rounded={rounded && !isDisplayingSuggestions}
            roundedTop={rounded && isDisplayingSuggestions}
          />
          {icon && (
            <Icon
              iconName={icon}
              className='w-6 h-6 mx-2 my-1 overflow-visible text-green-400'
            />
          )}
        </div>
        {suggestionsListComponent}
      </div>
    </div>
  )
}
