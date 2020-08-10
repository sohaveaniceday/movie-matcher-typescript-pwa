import React, {
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  FC,
  ReactNode,
  RefObject,
} from 'react'
import {
  useObjectState,
  getClassName,
  BaseTypes,
} from '@sohaveaniceday/component-library'
import { TextInput } from '..'
import { colorScheme } from '../../../static'

export type SuggestionProps = {
  name: string
  element: ReactNode
  id: string
  disabled?: boolean
}

type AutoSuggestProps = {
  suggestions: SuggestionProps[]
  onChangeFunc?: Function
  isLoading: boolean
  forwardRef?: RefObject<HTMLInputElement>
  cssClasses?: string[]
  rounded?: boolean
  value: string
  border?: boolean
} & BaseTypes<JSX.IntrinsicElements['input']>

export const AutoSuggest: FC<AutoSuggestProps> = ({
  suggestions = [],
  name,
  onChangeFunc,
  autoFocus,
  onFocus,
  onBlur,
  disabled,
  forwardRef,
  placeholder,
  rounded = false,
  cssClasses = [],
  border = false,
  value: inputValue,
}: AutoSuggestProps) => {
  const initialAutoSuggestState = {
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
  }
  const [
    { showSuggestions, activeSuggestion, filteredSuggestions },
    updateAutoSuggestState,
  ] = useObjectState(initialAutoSuggestState)

  const isDisplayingSuggestions: boolean =
    showSuggestions &&
    filteredSuggestions.length > 0 &&
    !!inputValue &&
    !disabled

  useEffect(() => {
    if (!disabled) {
      // Filter our suggestions that don't contain the user's input
      const newFilteredSuggestions = suggestions.reduce(
        (
          acc: SuggestionProps[],
          current: SuggestionProps
        ): SuggestionProps[] => {
          const { name } = current
          return name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
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
  }, [disabled, inputValue, suggestions, updateAutoSuggestState])

  useEffect(() => {
    if (isDisplayingSuggestions && suggestions.length < 1) {
      updateAutoSuggestState(initialAutoSuggestState)
    }
  }, [
    initialAutoSuggestState,
    suggestions.length,
    updateAutoSuggestState,
    isDisplayingSuggestions,
  ])

  // Event fired when the input value is changed
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (onChangeFunc) {
      event.persist()
      const { value, name } = event.target
      onChangeFunc(value, name)
    }
  }

  // Event fired when the user clicks on a suggestion
  const onClick = ({ currentTarget }: MouseEvent<HTMLLIElement>) => {
    // Update the user input and reset the rest of the state
    const { dataset } = currentTarget
    onChangeFunc && onChangeFunc(dataset.name, name, dataset.id)
    updateAutoSuggestState(initialAutoSuggestState)
  }

  // Event fired when the user presses a key down
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const selectedItem = filteredSuggestions[activeSuggestion]

    if (!isDisplayingSuggestions || !selectedItem) return
    // Stops document's keydown event listener when displaying a list
    event.stopPropagation()

    // User pressed the enter key, update the input and close the
    // suggestions
    if (event.keyCode === 13) {
      event.preventDefault()
      if (selectedItem.disabled) return
      onChangeFunc && onChangeFunc(selectedItem.name, name, selectedItem.id)
      updateAutoSuggestState(initialAutoSuggestState)
    }
    // User pressed the up arrow, decrement the index
    else if (event.keyCode === 38) {
      if (activeSuggestion === 0) return

      updateAutoSuggestState({ activeSuggestion: activeSuggestion - 1 })
    }
    // User pressed the down arrow, increment the index
    else if (event.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) return

      updateAutoSuggestState({
        activeSuggestion: Math.min(
          activeSuggestion + 1,
          filteredSuggestions.length - 1
        ),
      })
      // User pressed escape, exit list
    } else if (event.keyCode === 27) {
      updateAutoSuggestState(initialAutoSuggestState)
    }
  }

  //TO DO - reimplement automatic scrolling for desktop
  // useEffect(() => {
  //   if (isDisplayingSuggestions) {
  //     const activeSuggestionId = filteredSuggestions[activeSuggestion].id
  //     document.getElementById(activeSuggestionId)?.scrollIntoView({
  //       behavior: 'smooth',
  //     })
  //   }
  // }, [activeSuggestion, filteredSuggestions, isDisplayingSuggestions])

  const suggestionsListComponent = isDisplayingSuggestions ? (
    <div className='absolute z-20 w-full h-64'>
      <ul
        className={getClassName([
          'max-h-full',
          'overflow-y-scroll',
          'text-left',
          'bg-white',
          [rounded, 'rounded-b-lg'],
          [border, ['border-l-4', 'border-r-4', 'border-b-4']],
        ])}
        style={{ borderColor: `#${colorScheme.medium}` }}
      >
        {filteredSuggestions.map(
          (
            {
              name,
              element,
              id,
              disabled: suggestionDisabled = false,
            }: SuggestionProps,
            index: number
          ) => {
            // const isActiveSuggestion = activeSuggestion === index
            return (
              <li
                id={id}
                data-id={id}
                data-name={name}
                className={getClassName([
                  // TO DO: restablish with desktop version
                  // [
                  //   isActiveSuggestion && !suggestionDisabled,
                  //   ['bg-blue-300', 'text-white'],
                  // ],
                  // [isActiveSuggestion && suggestionDisabled, 'bg-gray-500'],
                  [
                    suggestionDisabled,
                    [
                      'cursor-none',
                      'pointer-events-none',
                      'bg-gray-300',
                      'text-white',
                    ],
                    'cursor-pointer',
                  ],
                  'border-t-2',
                ])}
                style={{ borderColor: colorScheme.light }}
                key={`${name}-${index}`}
                onClick={suggestionDisabled ? undefined : onClick}
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
            value={inputValue}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoFocus={autoFocus}
            onFocus={onFocus}
            disabled={disabled}
            forwardRef={forwardRef}
            placeholder={placeholder}
            rounded={rounded && !isDisplayingSuggestions}
            roundedTop={rounded && isDisplayingSuggestions}
            border={border}
            style={{ borderColor: `#${colorScheme.medium}` }}
          />
        </div>
        {suggestionsListComponent}
      </div>
    </div>
  )
}
