import classNames from 'classnames/bind'
import styles from './Products.module.scss'
import { Virtuoso } from 'react-virtuoso'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Product from '~/components/Product'
import { listentEvent } from '~/helpers/event'
import { actions } from '~/redux'
import { getProductsInCart } from '~/redux/selector'
import Button from '~/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import config from '~/config'

const cx = classNames.bind(styles)

export default memo(function Products({ products }) {
    const dispatch = useDispatch()
    const virtuosoRef = useRef(null)

    const productInCart = useSelector(getProductsInCart)

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'sidebar:select-category',
            handler({ detail: categoryIndex }) {
                virtuosoRef.current?.scrollToIndex({ index: categoryIndex, align: 'center', behavior: 'smooth' })
            },
        })
        return remove
    }, [])

    const quantity = useMemo(() => {
        if (!Array.isArray(productInCart)) {
            return
        }
        return productInCart.reduce((acc, cur) => {
            return acc + cur.quantity
        }, 0)
    }, [productInCart])

    const handleAddProductToCart = useCallback(
        (product) => {
            dispatch(
                actions.addProductsToCart({
                    product,
                    products: productInCart,
                })
            )
        },
        [dispatch, productInCart]
    )

    return (
        <div className={cx('wrapper')}>
            <Virtuoso
                ref={virtuosoRef}
                data={Object.keys(products)}
                useWindowScroll
                increaseViewportBy={{ top: 800, bottom: 300 }}
                itemContent={(index, category) => {
                    return (
                        <div key={index}>
                            <h2 className={cx('category-title')}>{category}</h2>
                            {products[category].map((product, index) => (
                                <div key={index}>
                                    <Product
                                        product={product}
                                        productIndex={index}
                                        productsLength={products[category].length}
                                        addProductToCart={handleAddProductToCart}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                }}
            />

            <Link to={config.routes.order}>
                <Button
                    primary
                    className={cx('navigate-order', 'm-0 l-0', {
                        visible: productInCart.length > 0,
                    })}
                    leftIcon={<FontAwesomeIcon icon={faCartShopping} />}
                >
                    Giỏ hàng <span className={cx('quantity')}>({quantity})</span>
                </Button>
            </Link>
        </div>
    )
})
