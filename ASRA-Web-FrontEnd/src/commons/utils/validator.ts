export const validateNumber = (value: string): boolean => {
    let regex = /^\d*$/
    return regex.test(value)
}