import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import style from './Button.module.scss'
import { forwardRef } from 'react'

const cx = classNames.bind(style)

// eslint-disable-next-line react-refresh/only-export-components
const Button = (
    { to, primary = false, outline = false, className, leftIcon, children, onClick, ...passProps },
    ref
) => {
    let Component = 'button'

    const props = {
        onClick,
        to: to || '',
        ...passProps,
    }

    if (to) {
        Component = Link
    }

    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
    })

    return (
        <Component className={classes} {...props} ref={ref}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
        </Component>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef(Button)
