import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { Link } from 'react-router-dom'

import logo from '~/assets/logo.svg'
import config from '~/config'

const cx = classNames.bind(styles)

const Header = () => {
    return (
        <header className={cx('wrapper')}>
            <div className="row">
                <div className={cx('header-left', 'col', 'l-3', 'm-3')}>
                    <Link className={cx('logo-container')} to={config.routes.home}>
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className={cx('search', 'col', 'l-5', 'm-0')}></div>
                <div className="col l-4 m-9">
                    <div className={cx('header-right', 'row')}>
                        <h4 className={cx('col')}>1</h4>
                        <h4 className={cx('col')}>2</h4>
                        <h4 className={cx('col')}>3</h4>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
