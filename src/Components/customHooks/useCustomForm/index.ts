import { useState } from 'react'

type useCustomFormProps = {
  initialValues: any
  onSubmit: Function
}

export const useCustomForm = ({
  initialValues,
  onSubmit,
}: useCustomFormProps) => {
  const [values, setValues] = useState(initialValues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // const [onSubmitting, setOnSubmitting] = useState<boolean>(false)
  // const [onBlur, setOnBlur] = useState<boolean>(false)
  const [currentValue, setCurrentValue] = useState<string>('')

  const handleChange = (value: string, name: string) => {
    setValues({ ...values, [name]: value })
    setCurrentValue(value)
  }

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name } = target
    setTouched({ ...touched, [name]: true })
    setErrors({ ...errors })
    setCurrentValue('')
  }

  const handleSubmit = (event: any) => {
    if (event) event.preventDefault()
    setErrors({ ...errors })
    setCurrentValue('')
    onSubmit({ values, errors })
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    currentValue,
  }
}
