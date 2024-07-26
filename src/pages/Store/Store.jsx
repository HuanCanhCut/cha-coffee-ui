import classNames from 'classnames/bind'
import styles from './Store.module.scss'
import { memo, useEffect, useState } from 'react'
import moment from 'moment'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { useNavigate } from 'react-router-dom'

import Image from '~/components/Image'
import * as storesServices from '~/services/storeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faClock, faStore } from '@fortawesome/free-solid-svg-icons'
import Button from '~/components/Button'

const cx = classNames.bind(styles)

export default memo(function Store() {
    const [stores, setStores] = useState([])
    const [address, setAddress] = useState()
    const navigate = useNavigate()

    function compareDates(open_time, close_time) {
        const format = 'HH:mm'
        const currentDateMoment = moment(moment().format('HH:mm'), format)
        const openTimeMoment = moment(open_time, format)
        const closeTimeMoment = moment(close_time, format)

        if (currentDateMoment.isBefore(openTimeMoment)) {
            return false
        } else if (
            (currentDateMoment.isAfter(openTimeMoment) && currentDateMoment.isBefore(closeTimeMoment)) ||
            currentDateMoment.isSame(closeTimeMoment)
        ) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        const getStores = async () => {
            try {
                const response = await storesServices.getStores()

                setStores(response.data.data)
            } catch (error) {
                console.log(error)
            }
        }

        getStores()
    }, [])

    const handleChangeAddress = ({ target: { value } }) => {
        setAddress(value)
    }

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setAddress({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.error('Error code: ' + error.code)
                    console.error('Error message: ' + error.message)
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            )
        } else {
            console.log('Geolocation is not supported by this browser.')
        }
    }

    return (
        <div>
            <main className={cx('main')}>
                <Button
                    outline
                    leftIcon={<FontAwesomeIcon icon={faChevronLeft} className={cx('go-back-icon')} />}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
                <div className="grid" style={{ marginTop: '20px' }}>
                    <div className="row">
                        <div className="col l-10 m-9 c-12">
                            <input
                                type="text"
                                value={address && address?.lat + ',' + address?.lng}
                                onChange={handleChangeAddress}
                                className={cx('location-input')}
                                placeholder="Nhập địa chỉ nhận hàng"
                            />
                        </div>
                        <div className="col l-2 m-3 c-12">
                            <Button primary className={cx('get-location')} onClick={handleGetLocation}>
                                Địa chỉ hiện tại
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx('grid')}>
                    <h2 className={cx('title')}>Chọn cửa hàng</h2>
                    {stores.map((store, index) => {
                        return (
                            <PopperWrapper key={index} className={cx('popper')}>
                                <div className="row">
                                    <div className="col l-5 m-5 c-12">
                                        <div className={cx('store-image')}>
                                            <Image src={store?.image} className={cx('image')} />
                                        </div>
                                    </div>
                                    <div className="col l-7 m-7 c-12">
                                        <div className={cx('store-info')}>
                                            <h3>{store?.name}</h3>
                                            <div className={cx('store-info-group')}>
                                                <span>
                                                    <FontAwesomeIcon icon={faStore} className={cx('icon')} /> Địa chỉ
                                                    cửa hàng: {store?.address}
                                                </span>
                                                <span
                                                    className={cx('status', {
                                                        open: compareDates(store?.open_time, store?.close_time),
                                                    })}
                                                >
                                                    <FontAwesomeIcon icon={faClock} className={cx('icon')} />
                                                    {compareDates(store?.open_time, store?.close_time)
                                                        ? 'Đang mở cửa'
                                                        : 'Đang đóng cửa'}{' '}
                                                    {store?.open_time} - {store?.close_time}
                                                </span>
                                                <span className={cx('phone-number')}>
                                                    Số điện thoại cửa hàng: {store.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopperWrapper>
                        )
                    })}
                </div>
            </main>
        </div>
    )
})
