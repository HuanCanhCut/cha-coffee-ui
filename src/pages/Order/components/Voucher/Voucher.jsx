import classNames from 'classnames/bind'
import style from './Voucher.module.scss'
import { memo, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { Wrapper as PopperWrapper } from '~/components/Popper'
import Button from '~/components/Button'
import { authCurrentUser } from '~/redux/selector'
import EditProfile from '../EditProfile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(style)

export default memo(function Voucher({ onClose = () => {}, onChangeModal = () => {} }) {
    const currentUser = useSelector(authCurrentUser)
    const [voucher, setVoucher] = useState('')
    const [currentTab, setCurrentTab] = useState('restaurant') // restaurant or your

    const tabs = useMemo(() => {
        return [
            {
                type: 'restaurant',
                title: 'Mã của nhà hàng',
            },
            {
                type: 'your',
                title: 'Mã của bạn',
            },
        ]
    }, [])

    const handleSelectTab = (type) => {
        setCurrentTab(type)
    }

    const handleOpenUserInfo = () => {
        onClose()
        onChangeModal(EditProfile)
    }

    return (
        <PopperWrapper>
            <div className={cx('wrapper')}>
                <div className={cx('title-container')}>
                    <h2 className={cx('title')}>Mã giảm giá</h2>
                    <button className={cx('close-modal')} onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} />
                    </button>
                </div>
                <header className={cx('header')}>
                    <div className={cx('input-container')}>
                        <input
                            type="text"
                            placeholder="Bạn có mã giảm giá?"
                            className={cx('input')}
                            value={voucher}
                            onChange={(e) => {
                                setVoucher(e.target.value)
                            }}
                        />
                        <Button primary className={cx('voucher-submit')}>
                            Áp dụng
                        </Button>
                    </div>

                    <div className={cx('tabs')}>
                        {tabs.map((tab, index) => {
                            return (
                                <button
                                    className={cx('tab', {
                                        active: currentTab === tab.type,
                                    })}
                                    key={index}
                                    onClick={() => {
                                        handleSelectTab(tab.type)
                                    }}
                                >
                                    {tab.title}
                                </button>
                            )
                        })}
                    </div>
                </header>
                <main className={cx('main')}>
                    {currentTab === 'your' && !currentUser.phone_number ? (
                        <h2>
                            Vui lòng nhập số điện thoại đặt hàng để xem mã giảm giá của bạn.
                            <span className={cx('open-info')} onClick={handleOpenUserInfo}>
                                {' '}
                                Bấm để thêm số điện thoại
                            </span>
                        </h2>
                    ) : (
                        ''
                    )}
                </main>
            </div>
        </PopperWrapper>
    )
})
