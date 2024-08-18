import config from '~/config'
import Home from '~/pages/Home'
import Store from '~/pages/Store'
import Order from '~/pages/Order'
import Product from '~/pages/Product'
import Profile from '~/pages/Profile'

const allRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.store,
        component: Store,
    },
    {
        path: config.routes.order,
        component: Order,
        private: true,
    },
    {
        path: config.routes.product,
        component: Product,
    },
    {
        path: config.routes.profile,
        component: Profile,
    },
]

export { allRoutes }
