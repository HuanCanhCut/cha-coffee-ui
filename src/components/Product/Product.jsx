import classNames from 'classnames/bind'
import styles from './Product.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { authCurrentUser, getProductsInCart } from '~/redux/selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import { motion } from 'framer-motion'

import { formatPrice } from '~/project/services.'
import * as productServices from '~/services/productsService'
import Image from '../Image'
import { Fire, Trash } from '../Icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import EditProduct from '../EditProduct/EditProduct'
import { showToast } from '~/project/services.'
import { listentEvent, sendEvent } from '~/helpers/event'
import useElementOnScreen from '~/hooks/useElementOnScreen'
import { actions } from '~/redux'
import ChangeQuantity from '../ChangeQuantity'
const cx = classNames.bind(styles)

const Product = ({ product, productIndex, productsLength, addProductToCart }) => {
    const dispatch = useDispatch()

    const currentUser = useSelector(authCurrentUser)
    const productsInCart = useSelector(getProductsInCart)
    const secondProductRef = useRef(null)
    const quantityRef = useRef(null)

    const [isProductInCart, setIsProductInCart] = useState(() => {
        for (let i = 0; i < productsInCart.length; i++) {
            if (productsInCart[i]._id === product._id) {
                return true
            }
        }
    })

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1,
    }
    const isVisible = useElementOnScreen(options, secondProductRef)

    const [openModal, setOpenModal] = useState({
        isOpen: false,
        type: '',
        title: '',
    })
    const [Component, setComponent] = useState(ConfirmModal)

    useEffect(() => {
        let available = false

        for (let i = 0; i < productsInCart.length; i++) {
            if (productsInCart[i]._id === product._id) {
                available = true
                if (quantityRef.current) {
                    quantityRef.current.innerText = productsInCart[i].quantity
                    break
                }
            }
        }

        if (!available) {
            setIsProductInCart(false)
        }
    }, [product._id, productsInCart])

    useEffect(() => {
        if (isVisible) {
            sendEvent({
                eventName: 'product:category-visible',
                detail: product.category,
            })
        }
    }, [isVisible, product.category])

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'sidebar:select-category',
            handler() {},
        })
        return remove
    }, [])

    const handleOpenModal = ({ type, title }) => {
        setOpenModal({
            isOpen: true,
            type,
            title,
        })

        switch (type) {
            case 'edit':
                setComponent(EditProduct)
                break
            case 'delete':
                setComponent(ConfirmModal)
                break
            default:
                break
        }
    }

    const handleCloseModal = useCallback(
        ({ type }) => {
            setOpenModal({
                isOpen: false,
                type,
                title: openModal.title,
            })
        },

        [openModal.title]
    )

    const handleDeleteProduct = useCallback(
        async (product) => {
            try {
                const response = await productServices.deleteProduct({ productID: product._id })
                handleCloseModal({ type: 'delete' })
                if (response?.status === 200 || response?.status === 204) {
                    showToast({ message: 'Xoá sản phẩm thành công', type: 'success' })

                    sendEvent({
                        eventName: 'product:update-product',
                        detail: product,
                    })
                    sendEvent({ eventName: 'socket:send-notify', detail: `${product.name} đã bị xóa bởi quản lí.` })
                }
            } catch (error) {
                console.log(error)
            }
        },
        [handleCloseModal]
    )

    const handleConfirm = useCallback(
        ({ type, product }) => {
            switch (type) {
                case 'delete':
                    handleDeleteProduct(product)
                    break
                default:
                    break
            }
        },
        [handleDeleteProduct]
    )

    const handleSelectProduct = () => {
        setIsProductInCart(!isProductInCart)
        addProductToCart(product)
    }

    const handleChangeQuantity = (type) => {
        switch (type) {
            case 'add':
                dispatch(actions.addProductsToCart({ product, products: productsInCart }))
                break
            case 'sub':
                dispatch(actions.subProductsToCart({ product, products: productsInCart }))
                break
            default:
                break
        }
    }

    return (
        <motion.div
            key={product.id}
            className={cx('product')}
            ref={productIndex == 1 || productIndex === productsLength - 3 ? secondProductRef : null}
        >
            <div className={cx('product-container-left')}>
                <Component
                    isOpen={openModal.isOpen}
                    onClose={handleCloseModal}
                    title={openModal.title}
                    onConfirm={() => {
                        handleConfirm({
                            type: openModal.type,
                            product,
                        })
                    }}
                    product={product}
                />
                <Image src={product.image} className={cx('image')} />
                <div className={cx('info')}>
                    <div className={cx('info-container')}>
                        <div className={cx('name-container')}>
                            <span className={cx('name')}>{product.name}</span>
                            {product.best_seller && <Fire />}
                        </div>
                    </div>
                    <p className={cx('description')}>{product.description}</p>
                    <p className={cx('price')}>{formatPrice(product.price)}</p>
                </div>
            </div>
            <div className={cx('product-container-right')}>
                <div className={cx('product-interaction')}>
                    {currentUser?.role === 'admin' && (
                        <>
                            <Tippy content="Sửa thông tin sản phẩm" hideOnClick="false">
                                <button
                                    className={cx('edit-product')}
                                    onClick={() => {
                                        handleOpenModal({ type: 'edit', title: 'Sửa thông tin của sản phẩm' })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                            </Tippy>
                            <Tippy content="Chuyển vào thùng rác" hideOnClick="false">
                                <button
                                    className={cx('delete-product')}
                                    onClick={() => {
                                        handleOpenModal({
                                            type: 'delete',
                                            title: 'Bạn có chắc muốn chuyển sản phẩm này vào thùng rác.',
                                        })
                                    }}
                                >
                                    <Trash />
                                </button>
                            </Tippy>
                        </>
                    )}
                </div>
                {!isProductInCart ? (
                    <motion.button
                        className={cx('add-to-cart')}
                        onClick={() => {
                            handleSelectProduct(product)
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </motion.button>
                ) : (
                    <ChangeQuantity handleChange={handleChangeQuantity} ref={quantityRef} />
                )}
            </div>
        </motion.div>
    )
}

export default Product
