import classNames from 'classnames/bind'
import style from './Auth.module.scss'
import { useState } from 'react'
import Button from '../Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { sendEvent } from '~/helpers/event'

const cx = classNames.bind(style)

const Auth = () => {
    const [type, setType] = useState('Login')

    const handleCloseAuthModal = () => {
        sendEvent({ eventName: 'auth:open-auth-modal', detail: false })
    }

    const handleSwitchType = () => {
        type === 'Login' ? setType('Register') : setType('Login')
    }

    return (
        <div className={cx('wrapper')}>
            <Button iconBtn className={cx('close-btn')} onClick={handleCloseAuthModal}>
                <FontAwesomeIcon icon={faXmark} />
            </Button>
            <h2 className={cx('header')}>{type}</h2>
            <main className={cx('field-group')}>
                <input type="text" placeholder="Tên đăng nhập" />
                <input type="password" placeholder="Mật khẩu" />
            </main>
            <Button primary className={cx('login-btn')}>
                {type === 'Login' ? 'Đăng nhập' : 'Đăng kí'}
            </Button>
            <div className={cx('slogan')}>
                <span>Một nơi tươi xanh. Đồ uống tươi ngon. Và những con người tươi cười</span>
            </div>
            <footer className={cx('footer')}>
                <p>
                    {type === 'Login' ? 'Nếu bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}{' '}
                    <span className={cx('switch-type')} onClick={handleSwitchType}>
                        {type === 'Login' ? 'Đăng ký' : 'Đăng nhập'}
                    </span>
                </p>
            </footer>
        </div>
    )
}

export default Auth
