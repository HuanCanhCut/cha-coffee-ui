import classNames from 'classnames/bind'
import styles from './Input.module.scss'
import { forwardRef } from 'react'

const cx = classNames.bind(styles)

export default forwardRef(function Input(
    { className, type = 'text', label, backgroundLabel = '#00656b', ...props },
    ref
) {
    const classes = cx('wrapper', {
        [className]: className,
    })

    return (
        <div className={classes}>
            <input ref={ref} type={type} {...props} className={cx('input')} placeholder=" " />
            <label style={{ backgroundColor: backgroundLabel }} className={cx('label')}>
                {label}
            </label>
        </div>
    )
})
