import { useState, useEffect, useRef } from 'react'

type useCustomFormProps = {
  initialValues: any
  onSubmit: Function
  onChange: Function
}

export const useCustomForm = ({
  initialValues,
  onSubmit,
  onChange,
}: useCustomFormProps) => {
  const [values, setValues] = useState(initialValues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false)
  const [onBlur, setOnBlur] = useState<boolean>(false)

  const handleChange = (value: string, name: string) => {
    setValues({ ...values, [name]: value })
    onChange({ values })
  }

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name } = target
    setTouched({ ...touched, [name]: true })
    setErrors({ ...errors })
  }

  const handleSubmit = (event: any) => {
    if (event) event.preventDefault()
    setErrors({ ...errors })
    onSubmit({ values, errors })
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
