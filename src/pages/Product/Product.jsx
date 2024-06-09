import classNames from 'classnames/bind'
import style from './Product.module.scss'

const cx = classNames.bind(style)

const Product = () => {
    return <div className={cx('wrapper')}></div>
}

export default Product
