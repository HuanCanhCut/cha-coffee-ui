import classNames from 'classnames/bind'
import style from './Orders.module.scss'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { listentEvent } from '~/helpers/event'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'

import AddNote from './AddNote'
import { CartIcon } from '~/components/Icons'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import { decrementQuantity, formatPrice, incrementQuantity, removeProductFromCart } from '~/project/services.'
import { getProductsInCart } from '~/redux/selector'
import { actions } from '~/redux'
import { Link } from 'react-router-dom'
import config from '~/config'
import OrderItem from '~/components/OrderItem'

const cx = classNames.bind(style)

export default memo(function Orders() {
    const dispatch = useDispatch()
    const products = useSelector(getProductsInCart)
    const [isOpen, setIsOpen] = useState(false)
    const [addNoteModal, setAddNoteModal] = useState(false)
    const [productNoteIndex, setProductNoteIndex] = useState()

    const productContainerRef = useRef(null)

    const totalPrice = useMemo(() => {
        return products.reduce((acc, cur) => {
            return acc + cur.price * cur.quantity
        }, 0)
    }, [products])

    const handleIncrementQuantity = useCallback(
        (product) => {
            incrementQuantity({ dispatch, product, products })
        },
        [dispatch, products]
    )

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'product:add-to-cart',
            handler: ({ detail: product }) => {
                handleIncrementQuantity(product)
            },
        })
        return remove
    }, [handleIncrementQuantity, products])

    const handleOpenModal = () => {
        setIsOpen(true)
    }

    const handleCloseModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    const handleDeleteAllProduct = useCallback(() => {
        dispatch(actions.clearCart([]))
        handleCloseModal()
    }, [dispatch, handleCloseModal])

    const handleRemoveProduct = useCallback(
        (product) => {
            removeProductFromCart({ dispatch, product, products })
        },
        [dispatch, products]
    )

    const handleDecrementQuantity = useCallback(
        (product) => {
            decrementQuantity({ dispatch, product, products })
        },
        [dispatch, products]
    )

    const handleOpenAddNote = useCallback(
        (product) => {
            const index = products.findIndex((item) => item._id === product._id)
            setProductNoteIndex(index)
            setAddNoteModal(true)
        },
        [products]
    )

    const handleCloseAddNote = useCallback(() => {
        setAddNoteModal(false)
    }, [])

    return (
        <div className={cx('wrapper')}>
            <ConfirmModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                onConfirm={handleDeleteAllProduct}
                title="Bạn có muốn xóa tất cả sản phẩm đã chọn?"
            />

            <ReactModal
                isOpen={addNoteModal}
                onRequestClose={() => setAddNoteModal(false)}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
                ariaHideApp={false}
                closeTimeoutMS={200}
            >
                <AddNote productIndex={productNoteIndex} onClose={handleCloseAddNote} products={products} />
            </ReactModal>
            {products.length > 0 ? (
                <>
                    <div className={cx('selected-product')}>
                        <span>Món bạn đã chọn</span>
                        <Button primary className={cx('delete-all')} onClick={handleOpenModal}>
                            Xóa tất cả
                        </Button>
                    </div>
                    <div ref={productContainerRef} className={cx('products-container')}>
                        {products.map((product, index) => (
                            <React.Fragment key={index}>
                                <OrderItem
                                    product={product}
                                    handleRemoveProduct={handleRemoveProduct}
                                    handleDecrementQuantity={handleDecrementQuantity}
                                    handleIncrementQuantity={handleIncrementQuantity}
                                    handleOpenAddNote={handleOpenAddNote}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <div className={cx('into-money-container')}>
                        <p className={cx('into-money')}>
                            <span>Thành tiền {products.length} sản phẩm: </span>
                            <span className={cx('into-money-price')}>{formatPrice(totalPrice)}</span>
                        </p>
                        <Link to={config.routes.order} className={cx('order-btn-container')}>
                            <Button primary className={cx('order-btn')}>
                                Thanh toán
                            </Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className={cx('no-product-container')}>
                    <CartIcon width="120" height="120" />
                    <h3 className={cx('no-product-title')}>Không có gì trong giỏ hàng</h3>
                </div>
            )}
        </div>
    )
})
