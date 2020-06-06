import React, {
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  MutableRefObject,
  FC,
  ReactNode,
  createRef,
} from 'react'
import { useObjectState, getClassName } from '../../../util'
import { TextInput } from '..'
import { Icon } from '../Icon'

export type SuggestionProps = {
  name: string
  element: ReactNode
  id: string
}

type AutoSuggestProps = {
  suggestions: SuggestionProps[]
  onChange?: Function
  name: string
  isLoading: boolean
  allowFetch: MutableRefObject<boolean>
  showIcon: boolean
}

export const AutoSuggest: FC<AutoSuggestProps> = ({
  suggestions = [],
  name,
  // isLoading,
  allowFetch,
  showIcon,
  onChange: onChangeFunc,
}: AutoSuggestProps) => {
  const outerRef = createRef<HTMLUListElement>()

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

  useEffect(() => {
    // Filter our suggestions that don't contain the user's input
    if (allowFetch.current) {
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
  }, [suggestions, updateAutoSuggestState, userInput, allowFetch])

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
    const { innerText, dataset } = currentTarget
    onChangeFunc && onChangeFunc(innerText, name, dataset.id)

    // Update the user input and reset the rest of the state
    updateAutoSuggestState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: innerText,
    })
  }

  // Event fired when the user presses a key down
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const selectedItem = filteredSuggestions[activeSuggestion]
    // User pressed the enter key, update the input and close the
    // suggestions
    if (event.keyCode === 13) {
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

  const suggestionsListComponent =
    showSuggestions && userInput && filteredSuggestions.length > 0 ? (
      <ul
        className='absolute z-50 h-56 max-w-full overflow-y-scroll text-left bg-white border-2'
        ref={outerRef}
      >
        {filteredSuggestions.map(
          ({ name, element, id }: SuggestionProps, index: number) => {
            const isActiveSuggestion = activeSuggestion === index
            const innerRef = createRef<HTMLLIElement>()

            // const handleClick = () =>
            //   innerRef.current?.scrollIntoView({
            //     behavior: 'smooth',
            //   })

            return (
              <li
                id={index.toString()}
                data-id={id}
                ref={innerRef}
                className={getClassName([
                  [isActiveSuggestion, ['bg-blue-300', 'text-white']],
                  'cursor-pointer',
                  'w-full',
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
      <div className='inline-flex min-w-full'>
        <TextInput
          name={name}
          onChange={onChange}
          value={userInput}
          onKeyDown={onKeyDown}
          cssClasses={['min-w-full']}
          // onBlur={onBlur}
        />
        {showIcon && (
          <Icon
            iconName='tick'
            className='w-6 h-6 mx-2 my-1 overflow-visible text-green-400'
          />
        )}
      </div>
      {suggestionsListComponent}
    </>
  )
}
