import classNames from 'classnames/bind'
import styles from './Order.module.scss'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'

import { Wrapper as PopperWrapper } from '~/components/Popper'
import * as storeServices from '~/services/storeService'
import Button from '~/components/Button'
import { Voucher } from '~/components/Icons'
import { getProductsInCart } from '~/redux/selector'
import OrderItem from '~/components/OrderItem'
import { decrementQuantity, formatPrice, incrementQuantity, removeProductFromCart } from '~/project/services.'
import AddNote from '~/layouts/Orders/AddNote'
import config from '~/config'
import EditProfile from './components/EditProfile'
import PayMethods from './components/PayMethods/PayMethods'
import { listentEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

const Order = () => {
    const dispatch = useDispatch()

    const productsInCart = useSelector(getProductsInCart)
    const [currentTab, setCurrentTab] = useState('delivery')
    const [store, setStore] = useState()
    const [addNoteModal, setAddNoteModal] = useState(false)
    const [productNoteIndex, setProductNoteIndex] = useState()
    const [payMethod, setPayMethod] = useState('qrcode')
    const [isOpen, setIsOpen] = useState({
        isOpen: false,
        component: null,
    })

    const tabs = useMemo(() => {
        return [
            {
                type: 'delivery',
                title: 'Giao hàng',
            },
            {
                type: 'come',
                title: 'Tự đến lấy',
            },
        ]
    }, [])

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'order:change-pay-method',
            handler: ({ detail: payMethod }) => {
                setPayMethod(payMethod)
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
            setProductNoteIndex(index)
            setAddNoteModal(true)
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

    const handleOpenModal = (Component) => {
        setIsOpen({
            isOpen: true,
            component: <Component onClose={handleClose} payMethod={payMethod} />,
        })
    }

    return (
        <div className={cx('wrapper')}>
            <ReactModal
                isOpen={addNoteModal}
                onRequestClose={() => setAddNoteModal(false)}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
                ariaHideApp={false}
                closeTimeoutMS={200}
            >
                <AddNote productIndex={productNoteIndex} onClose={handleCloseAddNote} products={productsInCart} />
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
                                    {tabs.map((tab, index) => (
                                        <React.Fragment key={index}>
                                            <Button
                                                outline
                                                className={cx('tab', {
                                                    active: tab.type === currentTab,
                                                })}
                                                onClick={() => setCurrentTab(tab.type)}
                                            >
                                                {tab.title}
                                            </Button>
                                        </React.Fragment>
                                    ))}
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
                                                            // handleOpenModal('payment', PayMethods)
                                                            handleOpenModal(PayMethods)
                                                        }}
                                                    >
                                                        Chọn
                                                    </span>
                                                </p>
                                                <span className={cx('content')}>Chọn phương thức thanh toán</span>
                                            </PopperWrapper>

                                            <PopperWrapper className={cx('popper')}>
                                                <p className={cx('edit-container')}>
                                                    <span className={cx('voucher')}>
                                                        <Voucher />
                                                        Mã giảm giá
                                                    </span>
                                                    <span className={cx('edit')}>Chọn</span>
                                                </p>
                                            </PopperWrapper>

                                            <PopperWrapper className={cx('popper')}>
                                                <h4 className={cx('selected-dish-title')}>Món đã chọn</h4>
                                                {productsInCart.map((product, index) => (
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
                                                ))}
                                            </PopperWrapper>
                                            <PopperWrapper className={cx('popper')}>
                                                <input
                                                    type="text"
                                                    placeholder="Ghi chú cho món ăn, đơn hàng"
                                                    className={cx('order-note')}
                                                />
                                            </PopperWrapper>
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
                            {currentTab !== 'come' && (
                                <div className={cx('transport-fee')}>
                                    <span>Phí vận chuyển</span>
                                    <span className={cx('price')}>0đ</span>
                                </div>
                            )}
                            <div className={cx('total-price')}>
                                <span>Tiền phải thanh toán</span>
                                <span className={cx('price')}>{formatPrice(totalPrice)}đ</span>
                            </div>

                            <Button primary className={cx('order-btn')}>
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
