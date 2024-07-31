import classNames from 'classnames/bind'
import styles from './Order.module.scss'
import { memo } from 'react'
import { Wrapper as PopperWrapper } from '~/components/Popper'

const cx = classNames.bind(styles)

export default memo(function Note({ formState, setFormState }) {
    const handleChange = (e) => {
        setFormState((prev) => {
            return {
                ...prev,
                orderNote: e.target.value,
            }
        })
    }

    return (
        <PopperWrapper className={cx('popper')}>
            <input
                type="text"
                placeholder="Ghi chú cho món ăn, đơn hàng"
                className={cx('order-note')}
                value={formState.orderNote}
                onChange={handleChange}
            />
        </PopperWrapper>
    )
})
