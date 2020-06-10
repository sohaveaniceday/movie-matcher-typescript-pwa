import Vibrant from 'node-vibrant'

export const getPalette = async (imageUrl: string) => {
  return await Vibrant.from(imageUrl).getPalette()
}
