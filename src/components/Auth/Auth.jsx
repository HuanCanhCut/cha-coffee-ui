import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import { useState } from 'react'
import * as authServices from '~/services/authService'
import { useDispatch } from 'react-redux'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import Button from '../Button'
import { showToast } from '~/project/services.'
import { actions } from '~/redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

const Auth = ({ closeModal = () => {} }) => {
    const dispatch = useDispatch()
    const [type, setType] = useState('login')
    const [error, setError] = useState('')
    const [fields, setFields] = useState({
        email: '',
        password: '',
    })

    const handleSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login')
    }

    const setFieldsValue = ({ target: { name, value } }) => {
        setError('')
        setFields({ ...fields, [name]: value })
    }

    const handleSubmit = async () => {
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (fields.email === '' || fields.password === '') {
            setError('Vui lòng điền đầy đủ thông tin.')
            return
        }

        if (!regex.test(fields.email)) {
            setError('Email không đúng định dạng, vui lòng nhập lại.')
            return
        }

        try {
            const response = await authServices.login(fields)

            if (response) {
                dispatch(actions.currentUser(response.data))
                localStorage.setItem('token', JSON.stringify(response.meta.token))
                showToast({ message: 'Đăng kí tài khoản thành công.', type: 'success' })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
                return
            } else {
                setError('Email hoặc mật khẩu không chính xác, vui lòng nhập lại.')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <PopperWrapper className={cx('popper-wrapper')}>
            <div className={cx('wrapper')}>
                <header className={cx('header')}>
                    <div className={cx('welcome-container')}>
                        <p>
                            Chào mừng bạn đến với <strong>Chà cà phê</strong>
                        </p>
                    </div>
                    <button
                        className={cx('close-modal-btn')}
                        onClick={() => {
                            closeModal('auth')
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </header>
                <main className={cx('body')}>
                    <h3 className={cx('title')}>{type === 'login' ? 'Đăng nhập' : 'Đăng kí'} chà cà phê</h3>
                    <div className={cx('input-group')}>
                        <input
                            type="text"
                            placeholder="Nhập email của bạn"
                            name="email"
                            value={fields.email}
                            onChange={setFieldsValue}
                        />
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu của bạn"
                            name="password"
                            value={fields.password}
                            onChange={setFieldsValue}
                        />
                        {!!error && <span className={cx('error')}>{error}</span>}
                    </div>
                    <Button primary className={cx('login-btn')} onClick={handleSubmit}>
                        {type === 'login' ? 'Đăng nhập' : 'Đăng kí'}
                    </Button>
                    <small className={cx('small')}>
                        Một nơi tươi xanh. Đồ uống tươi ngon. Và những con người tươi cười
                    </small>
                </main>
                <footer className={cx('footer')}>
                    <span>{type === 'login' ? 'Bạn chưa có tài khoản? ' : 'Bạn đã có tài khoản? '}</span>
                    <span className={cx('switch')} onClick={handleSwitchType}>
                        {type === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                    </span>
                </footer>
            </div>
        </PopperWrapper>
    )
}

export default Auth
