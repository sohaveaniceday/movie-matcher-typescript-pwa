import { colorScheme } from '../static'

export const generateBackgroundImage = (activeUserNumber: 1 | 2) => {
  return `linear-gradient(#${
    activeUserNumber === 1 ? colorScheme.user1Light : colorScheme.user2Light
  },#${activeUserNumber === 1 ? colorScheme.user1Dark : colorScheme.user2Dark})`
}
