import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import config from '~/config'
import { signInWithPopup } from 'firebase/auth'

import * as authServices from '~/services/authService'
import * as Popper from '~/components/Popper'
import { showToast } from '~/project/services.'
import { actions } from '~/redux'
import Input from '../Input'
import Button from '../Button'
import { GoogleIcon } from '../Icons'

const cx = classNames.bind(styles)

const Auth = ({ type = 'login', closeModal = () => {} }) => {
    const dispatch = useDispatch()

    const emailRef = useRef()
    const passwordRef = useRef()
    const inputsRef = useRef([emailRef, passwordRef])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [currentType, setCurrentType] = useState(type)
    const [error, setError] = useState('')

    const [inputFocusIndex, setInputFocusIndex] = useState(0)
    const [hidePassword, setHidePassword] = useState(true)

    useEffect(() => {
        if (!emailRef.current || inputsRef.current.length <= 0) {
            return
        }

        inputsRef.current[inputFocusIndex].current?.focus()
    }, [inputFocusIndex])

    const handleSwitchType = () => {
        setCurrentType(currentType === 'login' ? 'register' : 'login')
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
                onSubmit()
                break
            default:
                break
        }
    }

    const toggleHidePassword = () => {
        setHidePassword(!hidePassword)
    }

    const setUserToRedux = (response, message) => {
        dispatch(actions.currentUser(response.data.data))
        showToast({ message: message, type: 'success' })
        setTimeout(() => {
            window.location.reload()
        }, 1000)
        return
    }

    const onSubmit = async (data) => {
        const handleLogin = async () => {
            const response = await authServices.login(data)

            if (response) {
                return setUserToRedux(response, 'Đăng nhập thành công.')
            } else {
                setError('Email hoặc mật khẩu không chính xác, vui lòng nhập lại.')
            }
        }

        const handleRegister = async () => {
            try {
                const response = await authServices.register(data)

                if (response) {
                    setUserToRedux(response, 'Đăng kí tài khoản thành công.')
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

    const handleLoginWithGoogle = async () => {
        try {
            const { user } = await signInWithPopup(config.auth, config.googleProvider)

            if (user) {
                const response = await authServices.loginWithGoogle({ token: user.accessToken })

                setUserToRedux(response, 'Đăng nhập tài khoản thành công.')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Popper.Wrapper className={cx('popper-wrapper')}>
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
                    <h3 className={cx('title')}>{type === 'login' ? 'Đăng nhập' : 'Đăng kí'} chà cà phê</h3>
                    <form className={cx('input-group')} onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Input
                                type="text"
                                label="Email"
                                name="email"
                                {...register('email', {
                                    required: 'Email không được bỏ trống',
                                    pattern: {
                                        value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Email không đúng định dạng',
                                    },
                                })}
                            />
                            {errors.email && <small className={cx('error')}>{errors.email.message}</small>}
                        </div>
                        <div className={cx('password-container')}>
                            <div>
                                <Input
                                    label="Mật khẩu"
                                    type="password"
                                    name="password"
                                    {...register('password', { required: 'Mật khẩu không được bỏ trống' })}
                                />
                                {errors.password && <small className={cx('error')}>{errors.password.message}</small>}
                            </div>
                            <button className={cx('toggle-hide-password')} onClick={toggleHidePassword}>
                                {!hidePassword ? (
                                    <FontAwesomeIcon icon={faEye} />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                )}
                            </button>
                        </div>
                        {!!error && <span className={cx('error')}>{error}</span>}
                        <Button primary className={cx('login-btn')} type="submit">
                            {type === 'login' ? 'Đăng nhập' : 'Đăng kí'}
                        </Button>
                    </form>

                    <div className={cx('separator')}>
                        <span className={cx('separator-line')}></span>
                        <span className={cx('separator-content')}>Hoặc</span>
                        <span className={cx('separator-line')}></span>
                    </div>

                    <button className={cx('login-with-google')} onClick={handleLoginWithGoogle}>
                        <GoogleIcon width="19px" height="19px" className={cx('google-icon')} />
                        <span className={cx('text')}>{type === 'login' ? 'Đăng nhập' : 'Đăng kí'} với google</span>
                    </button>
                    <span className={cx('small')}>
                        Một nơi tươi xanh. Đồ uống tươi ngon. Và những con người tươi cười
                    </span>
                </main>
                <footer className={cx('footer')}>
                    <span>{type === 'login' ? 'Bạn chưa có tài khoản? ' : 'Bạn đã có tài khoản? '}</span>
                    <span className={cx('switch')} onClick={handleSwitchType}>
                        {type === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                    </span>
                </footer>
            </div>
        </Popper.Wrapper>
    )
}

export default Auth
