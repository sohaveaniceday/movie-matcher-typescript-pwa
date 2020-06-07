import React, { ReactElement } from 'react'
import './animation.css'

import {
  getClassName,
  Size,
  Fraction,
  HeightAndWidthValue,
  BaseTypes,
  Property,
} from '../../../util'

type TextProp = {
  length: Fraction | HeightAndWidthValue
  rounded?: boolean
}

export type ShapeProp = 'square' | 'circle' | 'rounded'

export type SizeProp = Size | HeightAndWidthValue

type SkeletonProps = {
  shape?: ShapeProp
  text?: TextProp
  size?: SizeProp
  cssClasses?: string[]
  override?: boolean
} & BaseTypes<JSX.IntrinsicElements['div']>

export const Skeleton: React.FC<SkeletonProps> = ({
  shape = 'square',
  text,
  size,
  cssClasses = [],
  children,
  override,
  ...skeletonProps
}: SkeletonProps) => {
  if (children || override)
    return (
      <div
        className={getClassName([...cssClasses, 'shimmer-animation'])}
        {...skeletonProps}
      >
        {children}
      </div>
    )

  const translateHeightOrWidthClassNameValue = (
    sizeString?: string | undefined,
    multiplier = 1
  ): number => {
    const translateString = (size?: string): number => {
      switch (size) {
        case 'xs':
          return 1.5
        case 'sm':
          return 2
        case 'md':
          return 2.5
        case 'lg':
          return 3
        case 'xl':
          return 3.5
        case '2xl':
          return 4
        default:
          return 0
      }
    }
    return translateString(sizeString) * multiplier
  }

  const getShapeSizeClassNames = (size: SizeProp | undefined): string[] => {
    const shapeSizeClassNameValue =
      typeof size === 'number'
        ? size
        : translateHeightOrWidthClassNameValue(size, 16)

    return [`h-${shapeSizeClassNameValue}`, `w-${shapeSizeClassNameValue}`]
  }

  const createShapeClassNames = (shape: string): Property[] => {
    const isCircleShape = shape === 'circle'
    const isRoundedShape = shape === 'rounded'

    const shapeTypeClassName =
      isCircleShape || isRoundedShape
        ? [`rounded-${isCircleShape ? 'full' : 'md'}`]
        : []

    return [...getShapeSizeClassNames(size), ...shapeTypeClassName]
  }

  const createTextClassNames = ({
    length,
    rounded = true,
  }: TextProp): Property[] => {
    const textHeightClassNameValue =
      typeof size === 'number'
        ? size
        : translateHeightOrWidthClassNameValue(size)

    return [
      `h-${textHeightClassNameValue}`,
      `w-${length}`,
      [rounded, 'rounded-lg'],
    ]
  }

  const conditionalElementClassName = text
    ? createTextClassNames(text)
    : shape
    ? createShapeClassNames(shape)
    : []

  const elementClassName = getClassName([
    ...conditionalElementClassName,
    ...cssClasses,
    'shimmer-animation',
  ])

  const shapeWrapperClassName = getClassName(getShapeSizeClassNames(size))

  const ElementComponent = (): ReactElement => (
    <div className={elementClassName} {...skeletonProps} />
  )

  return text ? (
    <ElementComponent />
  ) : (
    <div className={shapeWrapperClassName}>
      <ElementComponent />
    </div>
  )
}
