export const currentUser = (payload) => {
    return {
        type: 'auth',
        payload,
    }
}

export const addProductsToCart = (payload) => {
    return {
        type: 'add-product-to-cart',
        payload,
    }
}

export const subProductsToCart = (payload) => {
    return {
        type: 'sub-product-to-cart',
        payload,
    }
}

export const removeAProductFromCart = (payload) => {
    return {
        type: 'remove-product-from-cart',
        payload,
    }
}

export const clearCart = (payload) => {
    return {
        type: 'clear-cart',
        payload,
    }
}

export const addNoteOrder = (payload) => {
    return {
        type: 'add-note',
        payload,
    }
}
