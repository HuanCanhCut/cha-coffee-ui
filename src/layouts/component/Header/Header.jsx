import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import logo from '~/assets/logo.svg'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEarthAsia, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import ReactModal from 'react-modal'
import { useCallback, useEffect, useState } from 'react'

import Menu from '~/components/Popper/Menu'
import Search from '~/components/Search'
import config from '~/config'
import Button from '~/components/Button'
import Image from '~/components/Image'
import Auth from '~/components/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'
import MobileMenu from '~/components/MobileMenu'
import { logout } from '~/project/services.'
import { listentEvent } from '~/helpers/event'

const MENU_ITEM = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'Ngôn ngữ hiện tại',
        children: {
            title: 'Ngôn ngữ',
            data: [
                {
                    type: 'lang',
                    code: 'en',
                    title: 'Tiếng anh',
                },
                {
                    type: 'lang',
                    code: 'vi',
                    title: 'Tiếng việt',
                },
            ],
        },
    },
]

const cx = classNames.bind(styles)

const Header = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(authCurrentUser)

    const [openAuthModal, setOpenAuthModal] = useState({
        isOpen: false,
        type: 'login',
    })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleOpenModal = (type = 'login') => {
        setOpenAuthModal({
            isOpen: true,
            type,
        })
    }

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Thông tin cá nhân',
        },

        ...MENU_ITEM,

        {
            type: 'log-out',
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            separate: true,
        },
    ]

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'auth:open-auth-modal',
            handler: ({ detail: isOpen }) => {
                setOpenAuthModal({
                    isOpen,
                    type: 'login',
                })
            },
        })

        return remove
    }, [])

    const handleCloseModal = useCallback(() => {
        setOpenAuthModal((prev) => {
            return {
                ...prev,
                isOpen: false,
            }
        })
    }, [])

    const handleOpenMobileMenu = () => {
        setMobileMenuOpen(true)
    }

    const handleCloseMobileMenu = useCallback(() => {
        setMobileMenuOpen(false)
    }, [])

    const handleLogout = useCallback(async () => {
        logout({ dispatch })
    }, [dispatch])

    const handleMenuChange = useCallback(
        (menuItem) => {
            switch (menuItem.type) {
                case 'lang':
                    break
                case 'log-out':
                    handleLogout()
                    break
                default:
                    break
            }
        },
        [handleLogout]
    )

    return (
        <header className={cx('wrapper', 'grid')}>
            <ReactModal
                isOpen={openAuthModal.isOpen}
                onRequestClose={handleCloseModal}
                overlayClassName={'overlay'}
                ariaHideApp={false}
                className={'modal'}
                closeTimeoutMS={200}
            >
                <Auth closeModal={handleCloseModal} type={openAuthModal.type} />
            </ReactModal>

            <MobileMenu isOpen={mobileMenuOpen} closeMenu={handleCloseMobileMenu} />
            {mobileMenuOpen && <div className={cx('overlay')} onClick={handleCloseMobileMenu}></div>}
            <div className={cx('row')}>
                <button onClick={handleOpenMobileMenu} className={cx('menu-btn', 'l-0', 'm-0', 'c-2')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('col', 'l-4', 'm-2', 'c-0')}>
                    <div className={cx('logo-container')}>
                        <Link to={config.routes.home}>
                            <img src={logo} alt="" className={cx('logo')} />
                        </Link>
                    </div>
                </div>

                <div
                    className={cx('col', 'l-4', 'm-5', {
                        'c-6': !currentUser,
                        'c-8': currentUser,
                    })}
                >
                    <Search />
                </div>

                <div
                    className={cx('header-right', 'col', 'l-4', 'm-5', {
                        'c-4': !currentUser,
                        'c-2': currentUser,
                    })}
                >
                    <div className={cx('row', 'header-right-row')}>
                        {currentUser ? (
                            <>
                                <Link to={config.routes.myOrders} className={cx('hide-on-mobile')}>
                                    Đơn hàng của tôi
                                </Link>
                                <Menu items={currentUser ? userMenu : MENU_ITEM} onChange={handleMenuChange}>
                                    <Image className={cx('avatar')} src={currentUser.avatar} />
                                </Menu>
                            </>
                        ) : (
                            <div className={cx('login-btn')}>
                                <Button
                                    className={cx('hide-on-mobile')}
                                    onClick={() => {
                                        handleOpenModal('register')
                                    }}
                                >
                                    Đăng ký
                                </Button>
                                <Button primary onClick={() => handleOpenModal('login')}>
                                    Đăng nhập
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
