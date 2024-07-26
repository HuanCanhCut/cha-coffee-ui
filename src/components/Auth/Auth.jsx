import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import { useEffect, useRef, useState } from 'react'
import * as authServices from '~/services/authService'
import { useDispatch } from 'react-redux'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import Button from '../Button'
import { showToast } from '~/project/services.'
import { actions } from '~/redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

const Auth = ({ closeModal = () => {} }) => {
    const dispatch = useDispatch()

    const emailRef = useRef()
    const passwordRef = useRef()
    const inputsRef = useRef([emailRef, passwordRef])

    const [type, setType] = useState('login')
    const [error, setError] = useState('')
    const [fields, setFields] = useState({
        email: '',
        password: '',
    })
    const [inputFocusIndex, setInputFocusIndex] = useState(0)
    const [hidePassword, setHidePassword] = useState(true)

    useEffect(() => {
        if (!emailRef.current || inputsRef.current.length <= 0) {
            return
        }

        inputsRef.current[inputFocusIndex].current?.focus()
    }, [inputFocusIndex])

    const handleSwitchType = () => {
        setType(type === 'login' ? 'register' : 'login')
    }

    const setFieldsValue = ({ target: { name, value } }) => {
        setError('')
        setFields({ ...fields, [name]: value })
    }

    const handleKeyDown = (e) => {
        switch (e.code) {
            case 'ArrowDown':
                setInputFocusIndex((prev) => {
                    if (prev >= inputsRef.current.length - 1) {
                        return 0
                    }
                    return prev + 1
                })

                break
            case 'ArrowUp':
                setInputFocusIndex((prev) => {
                    if (prev <= 0) {
                        return inputsRef.current.length - 1
                    }
                    return prev - 1
                })
                break
            case 'Enter':
                handleSubmit()
                break
            default:
                break
        }
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

        const handleLogin = async () => {
            const response = await authServices.login(fields)

            if (response) {
                dispatch(actions.currentUser(response.data.data))
                localStorage.setItem('token', JSON.stringify(response.meta.token))
                showToast({ message: 'Đăng nhập thành công.', type: 'success' })
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
                return
            } else {
                setError('Email hoặc mật khẩu không chính xác, vui lòng nhập lại.')
            }
        }

        const handleRegister = async () => {
            try {
                const response = await authServices.register(fields)

                if (response) {
                    dispatch(actions.currentUser(response.data.data))
                    localStorage.setItem('token', JSON.stringify(response.meta.token))
                    showToast({ message: 'Đăng ký tài khoản thành công.', type: 'success' })
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                } else {
                    setError(
                        'Đăng kí tài khoản thất bại, vui lòng thử lại hoặc liên hệ với admin qua email: tronghuanxxx@gmail.com'
                    )
                }
            } catch (error) {
                console.log(error)
            }
        }

        try {
            switch (type) {
                case 'login':
                    handleLogin()
                    break
                case 'register':
                    handleRegister()
                    break
                default:
                    break
            }
        } catch (error) {
            console.log(error)
            setError('Đăng nhập thất bại, vui lòng liên hệ tronghuanxxx@gmail.com để được hỗ trợ!')
        }
    }

    const toggleHidePassword = () => {
        setHidePassword(!hidePassword)
    }

    return (
        <PopperWrapper className={cx('popper-wrapper')}>
            <div className={cx('wrapper')} onKeyDown={handleKeyDown}>
                <header className={cx('header')}>
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
                    <h3 className={cx('title')}>{type === 'login' ? 'Đăng nhập' : 'Đăng kí'} ch à cà phê</h3>
                    <div className={cx('input-group')}>
                        <input
                            ref={emailRef}
                            type="text"
                            placeholder="Nhập email của bạn"
                            name="email"
                            value={fields.email}
                            onChange={setFieldsValue}
                        />
                        <div className={cx('password-container')}>
                            <input
                                ref={passwordRef}
                                type={hidePassword ? 'password' : 'text'}
                                placeholder="Nhập mật khẩu của bạn"
                                name="password"
                                value={fields.password}
                                onChange={setFieldsValue}
                            />
                            <button className={cx('toggle-hide-password')} onClick={toggleHidePassword}>
                                {!hidePassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </button>
                        </div>
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
