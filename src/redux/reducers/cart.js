const initialState = {
    products: [],
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add-product-to-cart':
            return (() => {
                const index = action.payload.products.findIndex((item) => item._id === action.payload.product._id)
                if (index !== -1) {
                    const newProducts = [...action.payload.products]
                    newProducts[index] = {
                        ...newProducts[index],
                        quantity: (newProducts[index].quantity || 1) + 1,
                    }
                    return {
                        ...state,
                        products: newProducts,
                    }
                } else {
                    return {
                        ...state,
                        products: [...action.payload.products, { ...action.payload.product, quantity: 1 }],
                    }
                }
            })()
        case 'sub-product-to-cart':
            return (() => {
                const index = action.payload.products.findIndex((item) => item._id === action.payload.product._id)
                if (index !== -1) {
                    const newProducts = [...action.payload.products]
                    if (newProducts[index].quantity <= 1) {
                        newProducts.splice(index, 1)
                    } else {
                        newProducts[index] = {
                            ...newProducts[index],
                            quantity: newProducts[index].quantity - 1,
                        }
                    }
                    return {
                        ...state,
                        products: newProducts,
                    }
                }
            })()

        case 'remove-product-from-cart':
            return {
                ...state,
                products: action.payload.products.filter((item) => item._id !== action.payload.product._id),
            }
        case 'clear-cart':
            return {
                ...state,
                products: action.payload || [],
            }
        default:
            return state
    }
}

export default cartReducer
