import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import logo from '~/assets/logo.svg'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEarthAsia, faSearch, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import ReactModal from 'react-modal'
import { useCallback, useEffect, useState } from 'react'
import * as authServices from '~/services/authService'

import Menu from '~/components/Popper/Menu'
import Search from '~/components/Search'
import config from '~/config'
import Button from '~/components/Button'
import Image from '~/components/Image'
import Auth from '~/components/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'
import MobileMenu from '~/components/MobileMenu'
import MobileSearch from '~/pages/MobileSearch'
import { actions } from '~/redux'

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
    const accessToken = JSON.parse(localStorage.getItem('token'))
    const currentUser = useSelector(authCurrentUser)

    const [openModal, setOpenModal] = useState({
        isOpen: false,
        type: 'auth',
    })
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleOpenModal = (type) => {
        setOpenModal({
            isOpen: true,
            type,
        })
    }

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Xem hồ sơ',
        },

        ...MENU_ITEM,
        {
            type: 'log-out',
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            separate: true,
        },
    ]

    const handleCloseModal = useCallback((type) => {
        setOpenModal({
            isOpen: false,
            type: type,
        })
        switch (type) {
            case 'search':
                window.history.replaceState({}, '', '/')
                break
            default:
                break
        }
    }, [])

    // When the mobile menu is open, body scrolling is not allowed
    useEffect(() => {
        const body = document.querySelector('body')

        if (mobileMenuOpen) {
            body.style.overflow = 'hidden'
        } else {
            body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    const handleOpenMobileMenu = () => {
        setMobileMenuOpen(true)
    }

    const handleCloseMobileMenu = useCallback(() => {
        setMobileMenuOpen(false)
    }, [])

    const handleLogout = useCallback(async () => {
        const response = await authServices.logout({
            accessToken,
        })
        if (response?.status === 200) {
            localStorage.removeItem('token')
            dispatch(actions.currentUser(null))
            window.location.reload()
        }
    }, [accessToken, dispatch])

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
                isOpen={openModal.isOpen}
                onRequestClose={() => {
                    handleCloseModal(openModal.type)
                }}
                overlayClassName={'overlay'}
                ariaHideApp={false}
                className={'modal'}
                closeTimeoutMS={200}
            >
                {openModal.type === 'auth' ? (
                    <Auth closeModal={handleCloseModal} />
                ) : (
                    <MobileSearch closeModal={handleCloseModal} />
                )}
            </ReactModal>

            <MobileMenu isOpen={mobileMenuOpen} closeMenu={handleCloseMobileMenu} />
            {mobileMenuOpen && <div className={cx('overlay')} onClick={handleCloseMobileMenu}></div>}
            <div className={cx('row')}>
                <button onClick={handleOpenMobileMenu} className={cx('menu-btn', 'l-0', 'm-2', 'c-2')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('logo-container', 'col', 'l-4', 'm-0', 'c-0')}>
                    <Link to={config.routes.home}>
                        <img src={logo} alt="" className={cx('logo')} />
                    </Link>
                </div>

                <div className={cx('col', 'l-4', 'm-4', 'c-0')}>
                    <Search />
                </div>

                <div className={cx('header-right', 'col', 'l-4', 'm-6', 'c-10')}>
                    <div className={cx('row', 'header-right-row')}>
                        <button
                            className={cx('search-btn', 'l-0', 'm-0', ' c-1')}
                            onClick={() => {
                                handleOpenModal('search')
                            }}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        {currentUser ? (
                            <>
                                <Link to={config.routes.store}>
                                    <Button outline className={cx('header-right-btn')}>
                                        Cửa hàng
                                    </Button>
                                </Link>
                                <Button outline className={cx('header-right-btn')}>
                                    Đơn hàng
                                </Button>
                                <Menu items={currentUser ? userMenu : MENU_ITEM} onChange={handleMenuChange}>
                                    <Image className={cx('avatar')} src={currentUser.avatar} />
                                </Menu>
                            </>
                        ) : (
                            <div className={cx('login-btn')}>
                                <Button
                                    primary
                                    onClick={() => {
                                        handleOpenModal('auth')
                                    }}
                                >
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
