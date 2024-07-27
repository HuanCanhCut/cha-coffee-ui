import classNames from 'classnames/bind'
import styles from './PayMethods.module.scss'
import { memo, useMemo } from 'react'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { CheckIcon } from '~/components/Icons'
import { sendEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

export default memo(function PayMethods({ onClose = () => {}, payMethod }) {
    const options = useMemo(() => {
        return [
            {
                type: 'qrcode',
                title: 'QR đa năng',
                description: 'Thanh toán với mọi đơn hàng, ví',
            },
            {
                type: 'cash',
                title: 'Thanh toán khi nhận hàng',
            },
        ]
    }, [])

    const handleSelectOption = (option) => {
        sendEvent({ eventName: 'order:change-pay-method', detail: option.type })

        // fix bug when user close modal

        onClose()
    }

    return (
        <PopperWrapper className={cx('popper')}>
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>Phương thức thanh toán</h2>

                <div className={cx('options')}>
                    {options.map((option, index) => {
                        return (
                            <div
                                className={cx('option', { checked: payMethod === option.type })}
                                key={index}
                                onClick={() => {
                                    handleSelectOption(option)
                                }}
                            >
                                <div className={cx('label')}>
                                    <span></span>
                                    <span className={cx('option-title')}>{option.title}</span>
                                    <span className={cx('description')}>{option?.description}</span>
                                </div>
                                {payMethod === option.type && <CheckIcon />}
                            </div>
                        )
                    })}
                </div>
            </div>
        </PopperWrapper>
    )
})
