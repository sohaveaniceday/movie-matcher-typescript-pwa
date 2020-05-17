import React, { MouseEvent, KeyboardEvent, ChangeEvent } from 'react'
import { useObjectState } from '../util'
import { TextInput } from '../tailwind'

type AutoSuggestProp = {
  suggestions?: string[]
  register: Function
  name: string
  onChangeFunc?: Function
}

export const AutoSuggest = ({
  suggestions = [],
  register,
  name,
  onChangeFunc,
}: AutoSuggestProp) => {
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

  // Event fired when the input value is changed
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeFunc && onChangeFunc(e.currentTarget.value)
    const userInput = e.currentTarget.value

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      (suggestion: string) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    )

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    updateState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    })
  }

  // Event fired when the user clicks on a suggestion
  const onClick = (e: MouseEvent<HTMLLIElement>) => {
    // Update the user input and reset the rest of the state
    updateState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e?.currentTarget?.innerText,
    })
  }

  // Event fired when the user presses a key down
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      updateState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      })
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return
      }

      updateState({ activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return
      }

      updateState({ activeSuggestion: activeSuggestion + 1 })
    }
  }

  const suggestionsListComponent =
    showSuggestions && userInput && filteredSuggestions.length > 0 ? (
      <ul className='suggestions'>
        {filteredSuggestions.map((suggestion: string, index: number) => {
          let className

          // Flag the active suggestion with a class
          if (index === activeSuggestion) {
            className = 'suggestion-active'
          }

          return (
            <li
              className={className}
              key={`${suggestion}-${index}`}
              onClick={onClick}
            >
              {suggestion}
            </li>
          )
        })}
      </ul>
    ) : (
      <></>
    )

  return (
    <>
      <TextInput
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        name={name}
        register={register}
      />
      {suggestionsListComponent}
    </>
  )
}
