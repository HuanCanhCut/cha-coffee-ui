import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { groupProductByCategory } from '~/project/services.'
import Orders from '~/layouts/component/Orders'
import Sidebar from '~/layouts/component/SideBar/Sidebar'
import * as productServices from '~/services/productsService'
import Products from '~/layouts/component/Products'
import { getProducts } from '~/redux/selector'
import { actions } from '~/redux'

const cx = classNames.bind(styles)

const Home = () => {
    const dispatch = useDispatch()

    const products = useSelector(getProducts)

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await productServices.getProducts()

                if (response) {
                    const groupProducts = groupProductByCategory(response.data.data)

                    dispatch(actions.addProducts(groupProducts))
                }
            } catch (error) {
                console.log(error)
            }
        }

        getProducts()
    }, [dispatch])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('grid')}>
                <div className={cx('row')}>
                    <div className={cx('col', 'l-3', 'm-0', 'c-0')}>
                        {Object.keys(products).length > 0 && <Sidebar products={products} />}
                    </div>
                    <div className={cx('col', 'l-6', 'm-7', 'c-12')}>
                        {Object.keys(products).length > 0 && <Products products={products} />}
                    </div>
                    <div className={cx('col', 'l-3', 'm-5', 'c-0')}>
                        <Orders />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
