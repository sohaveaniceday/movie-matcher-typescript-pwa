const recursivelyUpdateFields = (parent: any, [key, value]: any): any => {
  const field = parent ? parent[key] : null
  const isValueObject = value
    ? typeof value === 'object' && value.constructor === Object
    : false

  return {
    ...parent,
    [key]: isValueObject
      ? {
          ...field,
          ...Object.entries(value).reduce(recursivelyUpdateFields, field),
        }
      : value,
  }
}

const applyUpdate = (update: any, prevState: any) =>
  Object.entries(update).reduce(recursivelyUpdateFields, prevState)

const updateObjectStateReducer = (prevState: any, update: any) => {
  return typeof update === 'function'
    ? update(prevState)
    : applyUpdate(update, prevState)
}

export default updateObjectStateReducer
