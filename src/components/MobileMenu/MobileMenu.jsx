import classNames from 'classnames/bind'
import style from './MobileMenu.module.scss'
import { memo, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCartShopping,
    faRightFromBracket,
    faRightToBracket,
    faStore,
    faXmark,
} from '@fortawesome/free-solid-svg-icons'

import Image from '../Image'
import { useDispatch, useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'
import { NavLink } from 'react-router-dom'
import config from '~/config'
import { logout } from '~/project/services.'
import { sendEvent } from '~/helpers/event'

const cx = classNames.bind(style)

const MENU_ITEM = [
    {
        title: 'Trang chủ',
        children: [
            {
                icon: <FontAwesomeIcon icon={faStore} />,
                label: 'Trang chủ',
                to: config.routes.home,
            },
        ],
    },
    {
        title: 'Cửa hàng',
        children: [
            {
                icon: <FontAwesomeIcon icon={faStore} />,
                label: 'Cửa hàng',
                to: config.routes.store,
            },
            {
                icon: <FontAwesomeIcon icon={faCartShopping} />,
                label: 'Đơn hàng',
                to: config.routes.cart,
            },
        ],
    },
]

export default memo(function MobileMenu({ isOpen, closeMenu = () => {} }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(authCurrentUser)

    const userMenu = useMemo(() => {
        if (!currentUser) {
            return [
                ...MENU_ITEM,
                {
                    title: 'Đăng nhập',
                    children: [
                        {
                            icon: <FontAwesomeIcon icon={faRightToBracket} />,
                            label: 'Đăng nhập',
                            type: 'login',
                        },
                    ],
                },
            ]
        }
        return [
            ...MENU_ITEM,
            {
                title: 'Tài khoản',
                children: [
                    {
                        icon: <FontAwesomeIcon icon={faRightFromBracket} />,
                        label: 'Đăng xuất',
                        type: 'logout',
                    },
                ],
            },
        ]
    }, [currentUser])

    const handleChose = (type) => {
        switch (type) {
            case 'logout':
                logout({ dispatch })
                break
            case 'login':
                sendEvent({ eventName: 'auth:open-auth-modal', detail: true })
                break
            default:
                break
        }
        closeMenu()
    }

    return (
        <div
            className={cx('wrapper', {
                open: isOpen,
            })}
        >
            <button className={cx('close-btn')} onClick={closeMenu}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
            <header className={cx('header')}>
                {currentUser && <Image src={currentUser?.avatar} className={cx('avatar')} />}
                <h3 className={cx('full-name')}>
                    {currentUser?.user_name}
                    {currentUser?.role === 'admin' && <span className={cx('admin')}>(Admin)</span>}
                </h3>
            </header>
            <main className={cx('main')}>
                {userMenu.map((menu, index) => {
                    return (
                        <div className={cx('menu-container')} key={index}>
                            <h3 className={cx('title')}>{menu.title}</h3>
                            {menu.children &&
                                menu.children.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                handleChose(item.type)
                                            }}
                                        >
                                            <NavLink
                                                to={item.to}
                                                className={(nav) => {
                                                    return cx('menu-item', {
                                                        active: nav.isActive && item.to,
                                                    })
                                                }}
                                                onAbort={closeMenu}
                                            >
                                                <span className={cx('icon')}>{item.icon}</span>
                                                <span className={cx('label')}>{item.label}</span>
                                            </NavLink>
                                        </div>
                                    )
                                })}
                        </div>
                    )
                })}
            </main>
        </div>
    )
})
