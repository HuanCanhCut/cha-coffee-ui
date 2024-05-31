import classNames from 'classnames/bind'
import styles from './Header.module.scss'

const cx = classNames.bind(styles)

const Header = () => {
    return (
        <div className={cx('wrapper')}>
            <h1>header</h1>
        </div>
    )
}

export default Header
