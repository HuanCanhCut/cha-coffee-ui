import classNames from 'classnames/bind'
import styles from './Orders.module.scss'
import { memo, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import Image from '~/components/Image'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import ChangeQuantity from '~/components/ChangeQuantity'
import { useDispatch } from 'react-redux'
import { actions } from '~/redux'
import Button from '~/components/Button'
import { formatPrice } from '~/project/services.'

const cx = classNames.bind(styles)

export default memo(function AddNote({ productIndex, onClose = () => {}, products }) {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const quantityRef = useRef(null)
    const [currentQuantity, setCurrentQuantity] = useState(products[productIndex]?.quantity)
    const [note, setNote] = useState(products[productIndex]?.note ?? '')

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleChangeQuantity = (type) => {
        switch (type) {
            case 'add':
                return (() => {
                    setCurrentQuantity(currentQuantity + 1)
                })()
            case 'sub':
                if (currentQuantity <= 0) return
                setCurrentQuantity(currentQuantity - 1)
                break
            default:
                break
        }
    }

    const handleSubmit = () => {
        const prevQuantity = products[productIndex].quantity

        if (currentQuantity === 0) {
            dispatch(actions.removeAProductFromCart({ product: products[productIndex], products }))
            onClose()
            return
        }

        if (prevQuantity < currentQuantity) {
            dispatch(
                actions.addProductsToCart({
                    product: {
                        ...products[productIndex],
                    },
                    quantity: currentQuantity,
                    products,
                    note,
                })
            )
        } else if (prevQuantity > currentQuantity) {
            dispatch(
                actions.subProductsToCart({
                    product: {
                        ...products[productIndex],
                    },
                    quantity: currentQuantity,
                    products,
                    note,
                })
            )
        } else {
            dispatch(actions.addNoteOrder({ note, product: products[productIndex] }))
        }

        onClose()
    }

    const handleChangeNote = (e) => {
        setNote(e.target.value)
    }

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'Enter':
                handleSubmit()
                break
            default:
                break
        }
    }

    return (
        <PopperWrapper className={cx('popper-wrapper')}>
            <div className={cx('add-note-wrapper')} onKeyDown={handleKeyDown}>
                <button className={cx('close-note-modal')} onClick={onClose}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className={cx('product-img-container')}>
                    {products[productIndex] && (
                        <Image src={products[productIndex].image} className={cx('product-img')} />
                    )}
                </div>
                <div className={cx('interaction-container')}>
                    <div className={cx('note-container')}>
                        <input
                            ref={inputRef}
                            type="text"
                            className={cx('note')}
                            placeholder="Ghi chú món ăn"
                            value={note}
                            onChange={handleChangeNote}
                        />
                        <p className={cx('price')}>+{formatPrice(products[productIndex]?.price * currentQuantity)}</p>
                    </div>
                    <div className={cx('interaction')}>
                        <ChangeQuantity size="medium" ref={quantityRef} handleChange={handleChangeQuantity}>
                            {currentQuantity}
                        </ChangeQuantity>
                        <Button primary onClick={handleSubmit}>
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>
        </PopperWrapper>
    )
})
