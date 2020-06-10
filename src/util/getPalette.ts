import Vibrant from 'node-vibrant'

export const getPalette = async (imageUrl: string) => {
  return Vibrant.from(imageUrl).getPalette((err, palette) => palette)
}
