export const authCurrentUser = (state) => {
    return state.auth.currentUser
}

export const getProductsInCart = (state) => {
    return state.cart.products
}

export const getProducts = (state) => {
    return state.product.products
}
