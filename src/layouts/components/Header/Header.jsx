import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { Link } from 'react-router-dom'
import Tippy from '@tippyjs/react'

import Image from '~/components/Image'
import logo from '~/assets/logo.svg'
import config from '~/config'
import Search from '~/components/Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import Button from '~/components/Button/Button'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import Auth from '~/components/Auth'
import { listentEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

const Header = () => {
    const [openLoginModal, setOpenLoginModal] = useState(false)

    const currentUser = true

    const handleOpenLoginModal = () => {
        setOpenLoginModal(true)
    }

    const handleCloseModal = () => {
        setOpenLoginModal(false)
    }

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'auth:open-auth-modal',
            handler({ detail: isOpen }) {
                setOpenLoginModal(isOpen)
            },
        })

        return remove
    }, [])

    return (
        <header className={cx('wrapper', 'row')}>
            <ReactModal
                isOpen={openLoginModal}
                onRequestClose={handleCloseModal}
                overlayClassName={'overlay'}
                ariaHideApp={false}
                className={'modal'}
                closeTimeoutMS={200}
            >
                <Auth />
            </ReactModal>
            <div className={cx('col', 'l-3', 'm-3', 'c-0')}>
                <Link className={cx('logo-container')} to={config.routes.home}>
                    <img src={logo} alt="" />
                </Link>
            </div>
            <div className={cx('col', 'l-4', 'm-6', 'c-7')}>
                <Search />
            </div>
            <div className="col l-2 m-3 c-5">
                <div className={cx('header-right', 'row')}>
                    {!currentUser ? (
                        <Button className={cx('login')} primary onClick={handleOpenLoginModal}>
                            Đăng nhập
                        </Button>
                    ) : (
                        <>
                            <span>
                                <Tippy delay={[0, 50]} content="Đơn hàng của tôi" interactive>
                                    <div className={cx('my-orders', 'col l-2')}>
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </div>
                                </Tippy>
                            </span>
                            <div className={cx('avatar')}>
                                <Image src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
