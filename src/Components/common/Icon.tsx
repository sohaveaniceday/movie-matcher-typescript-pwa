import React, { FC } from 'react'
import { Tick, Edit, Chevron, Movie } from '../../images/svgs'
import { BaseTypes, getClassName } from '../../util'

const svgMap: {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
} = {
  tick: Tick,
  edit: Edit,
  chevron: Chevron,
  movie: Movie,
}

export type IconName = 'tick' | 'edit' | 'chevron' | 'movie'

type IconProps = {
  iconName: string
  cssClasses?: string[]
} & BaseTypes<JSX.IntrinsicElements['svg']>

export const Icon: FC<IconProps> = ({
  iconName,
  cssClasses = [],
  ...svgProps
}: IconProps) => {
  const iconClass = getClassName([...cssClasses])

  const SVG = svgMap[iconName]
  const iconElement = <SVG className={iconClass} {...svgProps} />

  return iconElement
}
