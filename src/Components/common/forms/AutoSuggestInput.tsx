import React, {
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  MutableRefObject,
  FC,
  ReactNode,
} from 'react'
import { useObjectState, getClassName } from '../../../util'
import { TextInput } from '..'

export type SuggestionProps = {
  name: string
  element: ReactNode
}

type AutoSuggestProps = {
  suggestions: SuggestionProps[]
  onChange?: Function
  name: string
  isLoading: boolean
  allowFetch: MutableRefObject<boolean>
}

export const AutoSuggest: FC<AutoSuggestProps> = ({
  suggestions = [],
  name,
  isLoading,
  allowFetch,
  onChange: onChangeFunc,
}: AutoSuggestProps) => {
  const [
    { showSuggestions, activeSuggestion, filteredSuggestions, userInput },
    updateState,
  ] = useObjectState({
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: '',
  })

  useEffect(() => {
    // Filter our suggestions that don't contain the user's input
    const newFilteredSuggestions = suggestions.reduce(
      (acc: SuggestionProps[], current: SuggestionProps): SuggestionProps[] => {
        const { name } = current
        return name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
          ? [...acc, current]
          : acc
      },
      []
    )

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    updateState({
      activeSuggestion: 0,
      filteredSuggestions: newFilteredSuggestions,
      showSuggestions: true,
    })
  }, [suggestions])

  // Event fired when the input value is changed
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    allowFetch.current = true
    const { value, name } = event.target
    if (onChangeFunc) {
      event.persist()
      onChangeFunc && onChangeFunc(value, name)
    }
    updateState({
      userInput: value,
    })
  }

  // Event fired when the user clicks on a suggestion
  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    allowFetch.current = false
    const { innerText } = event.currentTarget
    if (onChangeFunc) {
      onChangeFunc && onChangeFunc(innerText, name)
    }
    // Update the user input and reset the rest of the state
    updateState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: innerText,
    })
  }

  // Event fired when the user presses a key down
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // User pressed the enter key, update the input and close the
    // suggestions
    if (event.keyCode === 13) {
      updateState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion].name,
      })
    }
    // User pressed the up arrow, decrement the index
    else if (event.keyCode === 38) {
      if (activeSuggestion === 0) {
        return
      }

      updateState({ activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow, increment the index
    else if (event.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return
      }

      updateState({ activeSuggestion: activeSuggestion + 1 })
    }
  }

  const suggestionsListComponent =
    showSuggestions && userInput && filteredSuggestions.length > 0 ? (
      <ul className='absolute bg-white border-2'>
        {filteredSuggestions.map(
          ({ name, element }: SuggestionProps, index: number) => {
            const isActiveSuggestion = activeSuggestion === index

            return (
              <li
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
    ) : (
      <></>
    )

  return (
    <>
      <TextInput
        name={name}
        onChange={onChange}
        value={userInput}
        onKeyDown={onKeyDown}
      />
      {suggestionsListComponent}
    </>
  )
}
