import routes from './routes'
import { auth, googleProvider } from './firebase'

const config = {
    routes,
    auth,
    googleProvider,
}

export default config
