export const getRandomInt = (max: number, isFloor?: boolean) => {
  const randomNumber = Math.random() * Math.floor(max)
  return isFloor ? Math.floor(randomNumber) : Math.ceil(randomNumber)
}
