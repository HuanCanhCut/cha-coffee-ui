const initialState = {
    products: {},
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add-product':
            return {
                ...state,
                products: { ...action.payload },
            }
        default:
            return state
    }
}

export default productReducer
