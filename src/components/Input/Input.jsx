import classNames from 'classnames/bind'
import styles from './Input.module.scss'
import { forwardRef } from 'react'

const cx = classNames.bind(styles)

const Input = ({ className, type = 'text', label, backgroundLabel = '#00656b', ...props }, ref) => {
    const classes = cx('wrapper', {
        [className]: className,
    })

    return (
        <div className={classes}>
            <input type={type} className={cx('input')} placeholder=" " {...props} ref={ref} />
            <label style={{ backgroundColor: backgroundLabel }} className={cx('label')}>
                {label}
            </label>
        </div>
    )
}

export default forwardRef(Input)
