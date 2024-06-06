import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import logo from '~/assets/logo.svg'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import Search from '~/components/Search'
import config from '~/config'
import Button from '~/components/Button'
import Image from '~/components/Image'

const cx = classNames.bind(styles)

const Header = () => {
    return (
        <header className={cx('wrapper', 'grid')}>
            <div className={cx('row')}>
                <button className={cx('menu-btn', 'l-0', 'm-0', 'c-2')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('logo-container', 'col', 'l-4', 'm-2', 'c-0')}>
                    <Link to={config.routes.home}>
                        <img src={logo} alt="" className={cx('logo')} />
                    </Link>
                </div>

                <Search />

                <div className={cx('header-right', 'col', 'l-4', 'm-5', 'c-2')}>
                    <div className={cx('row')}>
                        <Button outline className={cx('header-right-btn')}>
                            Cửa hàng
                        </Button>
                        <Button outline className={cx('header-right-btn')}>
                            Đơn hàng
                        </Button>
                        <Image
                            className={cx('avatar')}
                            src={
                                'https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg'
                            }
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
