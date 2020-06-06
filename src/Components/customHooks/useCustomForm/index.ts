import { useState, FormEvent, ChangeEvent, FocusEvent } from 'react'

type useCustomFormProps = {
  initialValues: any
  onSubmit: Function
  initialInput?: string
}

export const useCustomForm = ({
  initialValues,
  onSubmit,
  initialInput,
}: useCustomFormProps) => {
  const [values, setValues] = useState(initialValues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // const [onSubmitting, setOnSubmitting] = useState<boolean>(false)
  // const [onBlur, setOnBlur] = useState<boolean>(false)
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    undefined
  )
  const [currentInput, setCurrentInput] = useState<string | undefined>(
    initialInput
  )

  const handleChange = (value: string, name: string) => {
    setValues({ ...values, [name]: value })
    setCurrentValue(value)
  }

  const handleFocus = ({ target }: FocusEvent<HTMLInputElement>) => {
    const { name } = target
    setCurrentInput(name)
  }

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name } = target
    setTouched({ ...touched, [name]: true })
    setErrors({ ...errors })
    setCurrentValue(undefined)
    setCurrentInput(undefined)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault()
    setErrors({ ...errors })
    setCurrentValue(undefined)
    setCurrentInput(undefined)
    onSubmit({ values, errors })
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    currentValue,
    currentInput,
  }
}
