import classNames from 'classnames/bind'
import styles from './Products.module.scss'
import Product from '~/components/Product'
import { Virtuoso } from 'react-virtuoso'
import { memo, useEffect, useRef } from 'react'
import { listentEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

export default memo(function Products({ products }) {
    const virtuosoRef = useRef(null)

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'sidebar:select-category',
            handler({ detail: categoryIndex }) {
                virtuosoRef.current?.scrollToIndex({ index: categoryIndex, align: 'center', behavior: 'smooth' })
            },
        })
        return remove
    }, [])

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
                            <h2>{category}</h2>
                            {products[category].map((product, index) => (
                                <div key={index}>
                                    <Product
                                        product={product}
                                        productIndex={index}
                                        productsLength={products[category].length}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                }}
            />
        </div>
    )
})
