export const getCompleteFilmDataArray: any = (mainObject: any) =>
  Object.values(mainObject).reduce((acc: any, currentUser: any): any[] => {
    const filmData = Object.values(currentUser)
    return [...acc, ...filmData]
  }, [])
