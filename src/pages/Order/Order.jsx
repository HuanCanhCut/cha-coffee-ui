import classNames from 'classnames/bind'
import styles from './Order.module.scss'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'

import * as OrderServices from '~/services/orderService'
import Voucher from './components/Voucher'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import * as storeServices from '~/services/storeService'
import Button from '~/components/Button'
import { CartIcon } from '~/components/Icons'
import { authCurrentUser, getProductsInCart } from '~/redux/selector'
import OrderItem from '~/components/OrderItem'
import {
    decrementQuantity,
    formatPrice,
    incrementQuantity,
    removeProductFromCart,
    showToast,
} from '~/project/services.'
import AddNote from '~/layouts/Orders/AddNote'
import config from '~/config'
import EditProfile from './components/EditProfile'
import PayMethods from './components/PayMethods/PayMethods'
import { listentEvent } from '~/helpers/event'
import Note from './Note'
import Tab from './components/Tabs/Tab'

const cx = classNames.bind(styles)

const Order = () => {
    const dispatch = useDispatch()

    const currentUser = useSelector(authCurrentUser)
    const accessToken = JSON.parse(localStorage.getItem('token'))

    const productsInCart = useSelector(getProductsInCart)
    const [store, setStore] = useState()
    const [addNoteModal, setAddNoteModal] = useState({
        isOpen: false,
        productNoteIndex: 0,
    })

    const [isOpen, setIsOpen] = useState({
        isOpen: false,
        component: null,
    })

    const [formState, setFormState] = useState({
        payMethod: {
            type: '',
            title: '',
        },
        orderNote: '',
        currentTab: 'delivery', // delivery or come
    })

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'order:change-pay-method',
            handler: ({ detail: { type, title } }) => {
                setFormState((prev) => {
                    return {
                        ...prev,
                        payMethod: {
                            type,
                            title,
                        },
                    }
                })
            },
        })
        return remove
    }, [])

    const totalPrice = useMemo(() => {
        return productsInCart.reduce((acc, cur) => {
            return acc + cur.price * cur.quantity
        }, 0)
    }, [productsInCart])

    useEffect(() => {
        const getStore = async () => {
            const response = await storeServices.getStores()

            setStore(...response.data.data)
        }

        getStore()
    }, [])

    const handleDecrementQuantity = useCallback(
        (product) => {
            decrementQuantity({ dispatch, product, products: productsInCart })
        },
        [dispatch, productsInCart]
    )

    const handleIncrementQuantity = useCallback(
        (product) => {
            incrementQuantity({ dispatch, product, products: productsInCart })
        },
        [dispatch, productsInCart]
    )

    const handleRemoveProduct = useCallback(
        (product) => {
            removeProductFromCart({ dispatch, product, products: productsInCart })
        },
        [dispatch, productsInCart]
    )

    const handleOpenAddNote = useCallback(
        (product) => {
            const index = productsInCart.findIndex((item) => item._id === product._id)
            setAddNoteModal({
                isOpen: true,
                productNoteIndex: index,
            })
        },
        [productsInCart]
    )

    const handleCloseAddNote = useCallback(() => {
        setAddNoteModal(false)
    }, [])

    const handleClose = useCallback(() => {
        setIsOpen((prev) => {
            return { ...prev, isOpen: false }
        })
    }, [])

    const handleOpenModal = useCallback(
        (Component) => {
            setIsOpen({
                isOpen: true,
                component: (
                    <Component
                        onClose={handleClose}
                        payMethod={formState.payMethod.type}
                        onChangeModal={handleOpenModal}
                    />
                ),
            })
        },
        [formState.payMethod, handleClose]
    )

    const orderDetails = useMemo(() => {
        if (!Array.isArray(productsInCart)) return

        return productsInCart.map((product) => {
            return {
                product_id: product._id,
                quantity: product.quantity,
                note: product.note,
            }
        })
    }, [productsInCart])

    const handleOrder = async () => {
        const currentUserFields = [
            {
                field: 'user_name',
                error: 'Vui lòng điền tên người đặt',
            },
            {
                field: 'phone_number',
                error: 'Vui lòng nhập điện thoại liên hệ',
            },
            {
                field: 'address',
                error: 'Vui lòng nhập địa chỉ người đặt',
            },
        ]

        for (const field of currentUserFields) {
            if (!currentUser[field.field]) {
                showToast({ message: field.error, type: 'warning' })
            }
        }

        if (!formState.payMethod.type) {
            showToast({ message: 'Vui lòng chọn phương thức thanh toán', type: 'error' })
            return
        }

        if (productsInCart.length === 0) {
            showToast({ message: 'Không có sản phẩm trong giỏ hàng', type: 'error' })
            return
        }

        const data = {
            type: formState.payMethod.type,
            note: formState.orderNote,
            order_details: orderDetails,
        }

        try {
            const response = await OrderServices.createOrder({ accessToken, data })

            if (response.status === 201) {
                showToast({ message: 'Đặt hàng thành công', type: 'success' })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <ReactModal
                isOpen={addNoteModal.isOpen}
                onRequestClose={() => setAddNoteModal(false)}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
                ariaHideApp={false}
                closeTimeoutMS={200}
            >
                <AddNote
                    productIndex={addNoteModal.productNoteIndex}
                    onClose={handleCloseAddNote}
                    products={productsInCart}
                />
            </ReactModal>

            <ReactModal
                isOpen={isOpen.isOpen}
                onRequestClose={() => {
                    handleClose()
                }}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
                ariaHideApp={false}
                closeTimeoutMS={200}
            >
                {isOpen.component}
            </ReactModal>
            <div className="grid wide">
                <div className="row">
                    <div className="col l-6 m-6 c-12">
                        <div className={cx('order-info')}>
                            <header className={cx('header')}>
                                <Link to={config.routes.home} className={cx('go-back')}>
                                    <FontAwesomeIcon icon={faChevronLeft} className={cx('go-back-icon')} />
                                </Link>
                                <h2>Thông tin giỏ hàng</h2>
                            </header>
                            <main className={cx('main')}>
                                <div className={cx('tabs')}>
                                    <Tab setFormState={setFormState} formState={formState} />
                                </div>
                                <>
                                    {store && (
                                        <>
                                            <PopperWrapper className={cx('popper')}>
                                                <span className={cx('title')}>{store.name.toUpperCase()}</span>
                                                <span className={cx('store-address', 'content')}>{store.address}</span>

                                                <p className={cx('edit-container')}>
                                                    <span className={cx('content')}>Thông tin khách hàng:</span>
                                                    <span
                                                        className={cx('edit')}
                                                        onClick={() => {
                                                            handleOpenModal(EditProfile)
                                                        }}
                                                    >
                                                        Sửa
                                                    </span>
                                                </p>
                                            </PopperWrapper>

                                            <PopperWrapper className={cx('popper')}>
                                                <p className={cx('edit-container')}>
                                                    <span className={cx('title')}>Phuơng thức thanh toán</span>
                                                    <span
                                                        className={cx('edit')}
                                                        onClick={() => {
                                                            handleOpenModal(PayMethods)
                                                        }}
                                                    >
                                                        Chọn
                                                    </span>
                                                </p>
                                                <span className={cx('content')}>
                                                    {formState.payMethod.type === '' || formState.payMethod.title === ''
                                                        ? 'Chọn phương thức thanh toán'
                                                        : formState.payMethod.title}
                                                </span>
                                            </PopperWrapper>

                                            <PopperWrapper className={cx('popper')}>
                                                <p
                                                    className={cx('edit-container')}
                                                    onClick={() => {
                                                        handleOpenModal(Voucher)
                                                    }}
                                                >
                                                    <span className={cx('voucher')}>Mã giảm giá</span>
                                                    <span className={cx('edit')}>Chọn</span>
                                                </p>
                                            </PopperWrapper>

                                            <PopperWrapper className={cx('popper')}>
                                                <h4 className={cx('selected-dish-title')}>Món đã chọn</h4>
                                                {productsInCart.length > 0 ? (
                                                    productsInCart.map((product, index) => (
                                                        <React.Fragment key={index}>
                                                            <OrderItem
                                                                product={product}
                                                                className={cx('order-item')}
                                                                handleRemoveProduct={handleRemoveProduct}
                                                                handleDecrementQuantity={handleDecrementQuantity}
                                                                handleIncrementQuantity={handleIncrementQuantity}
                                                                handleOpenAddNote={handleOpenAddNote}
                                                            />
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <div className={cx('no-product')}>
                                                        <CartIcon width="120" height="120" />
                                                        <h3 className={cx('no-product-title')}>
                                                            Không có gì trong giỏ hàng
                                                        </h3>
                                                    </div>
                                                )}
                                            </PopperWrapper>
                                            <Note formState={formState} setFormState={setFormState} />
                                        </>
                                    )}
                                </>
                            </main>
                        </div>
                    </div>
                    <div className="col l-6 m-6 c-12">
                        <PopperWrapper className={cx('popper', 'order-total-container')}>
                            <div className={cx('total-order')}>
                                <span>Tổng tiền {productsInCart.length} phần</span>
                                <span className={cx('price')}>{formatPrice(totalPrice)}đ</span>
                            </div>
                            {formState.currentTab !== 'come' && (
                                <div className={cx('transport-fee')}>
                                    <span>Phí vận chuyển</span>
                                    <span className={cx('price')}>0đ</span>
                                </div>
                            )}
                            <div className={cx('total-price')}>
                                <span>Tiền phải thanh toán</span>
                                <span className={cx('price')}>{formatPrice(totalPrice)}đ</span>
                            </div>

                            <Button primary className={cx('order-btn')} onClick={handleOrder}>
                                Thanh toán
                            </Button>
                        </PopperWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order
