import classNames from 'classnames/bind'
import styles from './Orders.module.scss'
import { memo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import Image from '~/components/Image'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import ChangeQuantity from '~/components/ChangeQuantity'
import { useDispatch } from 'react-redux'
import { actions } from '~/redux'
import Button from '~/components/Button'

const cx = classNames.bind(styles)

export default memo(function AddNote({ productIndex, onClose = () => {}, products }) {
    const dispatch = useDispatch()
    const quantityRef = useRef(null)
    const [note, setNote] = useState('')

    const handleChangeQuantity = (type) => {
        switch (type) {
            case 'add':
                return (() => {
                    dispatch(actions.addProductsToCart({ product: products[productIndex], products }))
                })()
            case 'sub':
                dispatch(actions.subProductsToCart({ product: products[productIndex], products }))
                break
            default:
                break
        }
    }

    return (
        <PopperWrapper className={cx('popper-wrapper')}>
            <div className={cx('add-note-wrapper')}>
                <button className={cx('close-note-modal')} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className={cx('product-img-container')}>
                    {products[productIndex] && (
                        <Image src={products[productIndex].image} className={cx('product-img')} />
                    )}
                </div>
                <div className={cx('interaction-container')}>
                    <input
                        type="text"
                        className={cx('note')}
                        placeholder="Ghi chú món ăn"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className={cx('interaction')}>
                        <ChangeQuantity size="medium" handleChange={handleChangeQuantity} ref={quantityRef}>
                            {products[productIndex].quantity}
                        </ChangeQuantity>
                        <Button primary>Thêm vào giỏ hàng</Button>
                    </div>
                </div>
            </div>
        </PopperWrapper>
    )
})
