import { combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/auth'
import cartReducer from './reducers/cart'
import productReducer from './reducers/product'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
}

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(persistedReducer)

export default store

export const persistor = persistStore(store)
