import classNames from 'classnames/bind'
import style from './Orders.module.scss'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { listentEvent } from '~/helpers/event'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'

import AddNote from './AddNote'
import { CartIcon, Trash } from '~/components/Icons'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import { formatPrice } from '~/project/services.'
import { getProductsInCart } from '~/redux/selector'
import { actions } from '~/redux'

const cx = classNames.bind(style)

export default memo(function Orders() {
    const dispatch = useDispatch()
    const products = useSelector(getProductsInCart)
    const [isOpen, setIsOpen] = useState(false)
    const [addNoteModal, setAddNoteModal] = useState(false)
    const [productNoteIndex, setProductNoteIndex] = useState()

    const productContainerRef = useRef(null)
    const productRef = useRef(null)

    const handleAddToCart = useCallback(
        (product) => {
            dispatch(actions.addProductsToCart({ product, products }))
        },
        [dispatch, products]
    )

    const handleRemoveToCart = useCallback(
        (product) => {
            dispatch(actions.subProductsToCart({ product, products }))
        },
        [dispatch, products]
    )

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'product:add-to-cart',
            handler: ({ detail: product }) => {
                handleAddToCart(product)
            },
        })
        return remove
    }, [handleAddToCart, products])

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

    const handleRemoveProduct = (product) => {
        dispatch(
            actions.removeAProductFromCart({
                product,
                products,
            })
        )
    }

    const handleIncrementQuantity = (product) => {
        handleAddToCart(product)
    }

    const handleDecrementQuantity = (product) => {
        handleRemoveToCart(product)
    }

    const handleOpenAddNote = (product) => {
        const index = products.findIndex((item) => item._id === product._id)
        setProductNoteIndex(index)
        setAddNoteModal(true)
    }

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
                            <div ref={productRef} className={cx('product')} key={index}>
                                <div className={cx('header')}>
                                    <div className={cx('product-info')}>
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
                        ))}
                    </div>
                    <Button primary className={cx('order-btn')}>
                        Thanh toán
                    </Button>
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
