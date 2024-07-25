import classNames from 'classnames/bind'
import styles from './OrderItem.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { memo } from 'react'
import { Trash } from '../Icons'
import { formatPrice } from '~/project/services.'

const cx = classNames.bind(styles)

const defaultFn = () => {}

export default memo(function OrderItem({
    product,
    className,
    handleRemoveProduct = defaultFn,
    handleDecrementQuantity = defaultFn,
    handleIncrementQuantity = defaultFn,
    handleOpenAddNote = defaultFn,
}) {
    const classes = cx('product', {
        [className]: className,
    })
    return (
        <div className={classes}>
            <div className={cx('header')}>
                <div>
                    <p className={cx('product-name')}>{product.name}</p>
                    <p className={cx('product-note')}>{product.note}</p>
                </div>
                <div className={cx('interaction')}>
                    <button
                        className={cx('add-note-btn')}
                        onClick={() => {
                            handleOpenAddNote(product)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <Trash
                        width="18"
                        height="18"
                        onClick={() => {
                            handleRemoveProduct(product)
                        }}
                    />
                </div>
            </div>
            <div className={cx('bottom')}>
                <div className={cx('quantity-container')}>
                    <div
                        className={cx('subtract')}
                        onClick={() => {
                            handleDecrementQuantity(product)
                        }}
                    >
                        <span>-</span>
                    </div>
                    <div className={cx('quantity')}>{product.quantity}</div>
                    <div
                        className={cx('add')}
                        onClick={() => {
                            handleIncrementQuantity(product)
                        }}
                    >
                        <span>+</span>
                    </div>
                </div>
                <div className={cx('price')}>{formatPrice(product.price * product.quantity)}</div>
            </div>
        </div>
    )
})
