export const selectAny = <T>(array: T[]) => {
    const id = Math.round(Math.random() * (array.length - 1))
    
    return array[id]
}