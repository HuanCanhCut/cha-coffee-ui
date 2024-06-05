import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GlobalStyles from './components/GlobalStyles/GlobalStyle.jsx'
import 'tippy.js/dist/tippy.css'
import './index.css'
import './grid.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <GlobalStyles>
        <App />
    </GlobalStyles>
    // </React.StrictMode>
)
