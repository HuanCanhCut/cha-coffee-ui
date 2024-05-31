import config from '~/config'
import Home from '~/pages/Home'
import Order from '~/pages/Order'

const allRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.order,
        component: Order,
    },
]

export { allRoutes }
