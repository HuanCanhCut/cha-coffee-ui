import config from '~/config'
import Home from '~/pages/Home'
import MobileSearch from '~/pages/MobileSearch'
import Store from '~/pages/Store'
import Order from '~/pages/Order'
import Product from '~/pages/Product'

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
        path: config.routes.mobileSearch,
        component: MobileSearch,
    },
    {
        path: config.routes.order,
        component: Order,
    },
    {
        path: config.routes.product,
        component: Product,
    },
]

export { allRoutes }
