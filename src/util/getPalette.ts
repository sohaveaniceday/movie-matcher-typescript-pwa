import Vibrant from 'node-vibrant'

export const getPalette = async (imageUrl: string) => {
  const vibrant = new Vibrant(imageUrl)
  return await vibrant.getPalette()
}
