import classNames from 'classnames/bind'
import style from './Popper.module.scss'
import useDarkMode from '~/hooks/useDarkMode'

const cx = classNames.bind(style)

const Wrapper = ({ children, className }) => {
    return (
        <div
            className={cx(
                'wrapper',
                {
                    darkMode: useDarkMode(),
                },
                className
            )}
        >
            {children}
        </div>
    )
}

export default Wrapper
