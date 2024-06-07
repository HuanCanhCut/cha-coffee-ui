import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyle.jsx'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import 'tippy.js/dist/tippy.css'
import './index.css'
import './grid.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <GlobalStyles>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
        <ToastContainer />
    </GlobalStyles>
    // </React.StrictMode>
)
