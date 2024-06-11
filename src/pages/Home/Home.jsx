import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import { useEffect, useRef, useState, createContext } from 'react'
import socketIOClient from 'socket.io-client'

import Header from '~/layouts/Header'
import Sidebar from '~/layouts/SideBar/Sidebar'
import * as productServices from '~/services/productsService'
import Products from '~/layouts/Products'
import { listentEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

export const HomeContext = createContext()

const Home = () => {
    const [products, setProducts] = useState([])

    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = socketIOClient.connect(import.meta.env.VITE_APP_SERVER_URL)

        socketRef.current.on('new-products', (newProducts) => {
            setProducts({ ...newProducts.data })
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'product:update-product',
            handler: ({ detail: product }) => {
                socketRef.current.emit('get-products', {
                    id: product._id,
                    name: product.name,
                })
            },
        })

        return remove
    }, [])

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await productServices.getProducts()

                if (response) {
                    setProducts((prev) => {
                        return { ...prev, ...response.data }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }

        getProducts()
    }, [])

    return (
        <HomeContext.Provider value={{ products }}>
            <div className={cx('wrapper')}>
                <Header />
                <div className={cx('grid')}>
                    <div className={cx('row')}>
                        <div className={cx('col', 'l-3', 'm-0', 'c-0')}>
                            <Sidebar products={products} />
                        </div>
                        <div className={cx('col', 'l-6', 'm-7', 'c-12')}>
                            <Products products={products} />
                        </div>
                        <div className={cx('col', 'l-3', 'm-5', 'c-0')}></div>
                    </div>
                </div>
            </div>
        </HomeContext.Provider>
    )
}

export default Home
