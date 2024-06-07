import classNames from 'classnames/bind'
import style from './MobileMenu.module.scss'
import { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Image from '../Image'
import { useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'

const cx = classNames.bind(style)

const MobileMenu = ({ isOpen, closeMenu = () => {} }) => {
    const currentUser = useSelector(authCurrentUser)
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
                <Image src={currentUser?.avatar} className={cx('avatar')} />
                <h3 className={cx('full-name')}>
                    {currentUser?.first_name} {currentUser?.last_name}
                    {currentUser?.role === 'admin' && <span className={cx('admin')}>(Admin)</span>}
                </h3>
            </header>
        </div>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(MobileMenu)
