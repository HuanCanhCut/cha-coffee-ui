import classNames from 'classnames/bind'
import styles from './Product.module.scss'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons'

import * as productServices from '~/services/productsService'
import Image from '../Image'
import { Fire, Trash } from '../Icons'
import { useCallback, useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import { showToast } from '~/project/services.'
import { sendEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

const Product = ({ product }) => {
    const currentUser = useSelector(authCurrentUser)
    const accessToken = JSON.parse(localStorage.getItem('token'))

    const [openModal, setOpenModal] = useState({
        isOpen: false,
        type: '',
        title: '',
    })

    const handleOpenModal = ({ type, title }) => {
        setOpenModal({
            isOpen: true,
            type,
            title,
        })
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
                const response = await productServices.deleteProduct({ productID: product._id, accessToken })
                handleCloseModal({ type: 'delete' })
                if (response?.status === 200 || response?.status === 204) {
                    showToast({ message: 'Xoá sản phẩm thành công', type: 'success' })

                    sendEvent({
                        eventName: 'product:delete-product',
                        detail: product,
                    })
                    sendEvent({ eventName: 'socket:send-notify', detail: `${product.name} đã bị xóa bởi quản lí.` })
                }
            } catch (error) {
                console.log(error)
            }
        },
        [accessToken, handleCloseModal]
    )

    const handleConfirm = useCallback(
        ({ type, product }) => {
            switch (type) {
                case 'delete':
                    handleDeleteProduct(product)
                    break
                case 'edit':
                    break
                default:
                    break
            }
        },
        [handleDeleteProduct]
    )

    return (
        <div key={product.id} className={cx('product')}>
            <div className={cx('product-container-left')}>
                <ConfirmModal
                    isOpen={openModal.isOpen}
                    onClose={handleCloseModal}
                    title={openModal.title}
                    onConfirm={() => {
                        handleConfirm({
                            type: openModal.type,
                            product,
                        })
                    }}
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
                    <p className={cx('price')}>{numeral(product.price).format('0,0').replace(/,/g, '.')}</p>
                </div>
            </div>
            <div className={cx('product-container-right')}>
                <div className={cx('product-interaction')}>
                    {currentUser?.role === 'admin' && (
                        <>
                            <button className={cx('edit-product')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button
                                className={cx('delete-product')}
                                onClick={() => {
                                    handleOpenModal({ type: 'delete', title: 'Bạn có chắc muốn xóa sản phẩm này?' })
                                }}
                            >
                                <Trash />
                            </button>
                        </>
                    )}
                </div>
                <button className={cx('add-to-cart')}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
        </div>
    )
}

export default Product
