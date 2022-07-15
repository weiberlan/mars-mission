export const isRequired = text => {
    throw new Error(`${text} is required!`);
}