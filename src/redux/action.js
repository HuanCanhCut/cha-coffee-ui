export const currentUser = (payload) => {
    return {
        type: 'auth',
        payload,
    }
}
