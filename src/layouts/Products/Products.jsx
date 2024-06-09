import classNames from 'classnames/bind'
import styles from './Products.module.scss'
import Product from '~/components/Product'

const cx = classNames.bind(styles)

const Products = ({ products }) => {
    return (
        <div className={cx('wrapper')}>
            {Object.keys(products).map((category, index) => {
                return (
                    <div key={index}>
                        <h2>{category}</h2>
                        {products[category].map((product, index) => (
                            <div key={index}>
                                <Product product={product} />
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

export default Products
