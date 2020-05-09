type SingleProperty = string
type ConditionalProperty = [boolean, SingleProperty | SingleProperty[]]
type TernaryProperty = [
  boolean,
  SingleProperty | SingleProperty[],
  SingleProperty | SingleProperty[]
]

export type Property = SingleProperty | ConditionalProperty | TernaryProperty

type ClassNameObj = { [key: string]: boolean }

const isSingleProperty = (option: Property): option is SingleProperty =>
  typeof option === 'string'

const isTernaryProperty = (option: Property): option is TernaryProperty =>
  typeof option !== 'string' && option.length === 3

const assertNoSpaces = (className: string): void => {
  if (className.includes(' ')) {
    console.warn(
      `Classname option ${className} should be split into an array as it contains multiple items`
    )
  }
}

const assertMultipleItems = (classNames: string[]): void => {
  if (classNames.length === 1) {
    console.warn(
      `Classname option ${classNames[0]} should be a string as it only contains one item`
    )
  }
}

const addSingleProperty = (
  option: SingleProperty,
  classNamesObj: ClassNameObj
): ClassNameObj => {
  assertNoSpaces(option)
  return { ...classNamesObj, [option]: true }
}

const addAllProperties = (
  properties: SingleProperty[],
  classNamesObj: ClassNameObj
): ClassNameObj => {
  assertMultipleItems(properties)
  return {
    ...classNamesObj,
    ...properties.reduce(
      (innerAcc, className) => addSingleProperty(className, innerAcc),
      {}
    ),
  }
}

const buildClassNameObj = (properties: Property[]): ClassNameObj =>
  properties.reduce((classNamesObj, property) => {
    if (isSingleProperty(property))
      return addSingleProperty(property, classNamesObj)

    if (isTernaryProperty(property)) {
      const [condition, classNamesIfTrue, classNamesIfFalse] = property
      const classNames = condition ? classNamesIfTrue : classNamesIfFalse

      return Array.isArray(classNames)
        ? addAllProperties(classNames, classNamesObj)
        : addSingleProperty(classNames, classNamesObj)
    }

    // isConditionalOption
    const [condition, classNames] = property
    if (condition) {
      return Array.isArray(classNames)
        ? addAllProperties(classNames, classNamesObj)
        : addSingleProperty(classNames, classNamesObj)
    }

    // nothing will be added, but still check format of input
    if (Array.isArray(classNames)) {
      assertMultipleItems(classNames)
    } else {
      assertNoSpaces(classNames)
    }
    return classNamesObj
  }, {})

const buildClassNameString = (classNamesObj: ClassNameObj): string =>
  Object.entries(classNamesObj).reduce(
    (classNameString, [key, value]) =>
      value
        ? classNameString
          ? classNameString + ' ' + key
          : classNameString + key
        : classNameString,
    ''
  )

export const getClassName = (properties: Property[]): string => {
  const obj = buildClassNameObj(properties)
  return buildClassNameString(obj)
}
