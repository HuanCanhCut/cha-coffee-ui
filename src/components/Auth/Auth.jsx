import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import config from '~/config'
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
    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const forgotPasswordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const inputsRef = useRef([emailRef, forgotPasswordRef, passwordRef, confirmPasswordRef])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [currentType, setCurrentType] = useState(type) // login, register or forgotPassword
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

                    prev++

                    while (inputsRef.current[prev]?.current === null) {
                        if (prev >= inputsRef.current.length - 1) {
                            return 0
                        }

                        prev++
                    }

                    return prev
                })

                break
            case 'ArrowUp':
                setInputFocusIndex((prev) => {
                    if (prev <= 0) {
                        return inputsRef.current.length - 1
                    }

                    prev--

                    while (inputsRef.current[prev]?.current === null) {
                        if (prev <= 0) {
                            return inputsRef.current.length - 1
                        }

                        prev--
                    }

                    return prev
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
        localStorage.setItem('exp', response.data?.meta?.pagination?.exp)

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
                if (data.confirmPassword !== data.password) {
                    return setError('Nhập lại mật khẩu không đúng, vui lòng nhập lại')
                }

                const response = await authServices.register(data)
                if (response) {
                    setUserToRedux(response, 'Đăng kí tài khoản thành công.')
                    navigate(config.routes.profile)
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
            switch (currentType) {
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

                if (response?.status === 200) {
                    setUserToRedux(response, 'Đăng nhập thành công')
                } else {
                    showToast({ message: 'Đăng nhập thất bại, vui lòng thử lại hoặc liên hệ quản lí.', type: 'error' })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const sendVerificationCode = async () => {
        try {
            //
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
                    <h3 className={cx('title')}>{currentType === 'login' ? 'Đăng nhập' : 'Đăng kí'} chà cà phê</h3>
                    <form className={cx('input-group')} onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Input
                                {...register('email', {
                                    required: 'Email không được bỏ trống',
                                    pattern: {
                                        value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Email không đúng định dạng',
                                    },
                                    onChange: () => setError(''),
                                })}
                                ref={emailRef}
                                type="text"
                                label="Email"
                                name="email"
                            />
                            {errors.email && <small className={cx('error')}>{errors.email.message}</small>}
                        </div>
                        {currentType === 'forgotPassword' && (
                            <div className={cx('forgot-password-container')}>
                                <Input
                                    {...register('verificationCode', {
                                        required: 'Mã xác minh không được bỏ trống.',
                                        onChange: () => setError(''),
                                    })}
                                    type="text"
                                    label="Mã xác minh"
                                    name="verificationCode"
                                    ref={forgotPasswordRef}
                                />
                                <Button
                                    type="button"
                                    primary
                                    className={cx('send-verification-code')}
                                    onClick={sendVerificationCode}
                                >
                                    Gửi mã
                                </Button>
                                {errors.verificationCode && (
                                    <small className={cx('error')}>{errors.verificationCode.message}</small>
                                )}
                            </div>
                        )}
                        <div>
                            <div className={cx('password-container')}>
                                <Input
                                    {...register('password', {
                                        required: 'Mật khẩu không được bỏ trống',
                                        onChange: () => setError(''),
                                    })}
                                    ref={passwordRef}
                                    label="Mật khẩu"
                                    type={hidePassword ? 'password' : 'text'}
                                    name="password"
                                />
                                <button
                                    type="button"
                                    className={cx('toggle-hide-password')}
                                    onClick={toggleHidePassword}
                                >
                                    {!hidePassword ? (
                                        <FontAwesomeIcon icon={faEye} />
                                    ) : (
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                    )}
                                </button>
                            </div>
                            {errors.password && <small className={cx('error')}>{errors.password.message}</small>}
                        </div>
                        {currentType === 'login' && (
                            <span
                                className={cx('forgot-password')}
                                onClick={() => {
                                    setCurrentType('forgotPassword')
                                }}
                            >
                                Quên mật khẩu?
                            </span>
                        )}
                        {(currentType === 'register' || currentType === 'forgotPassword') && (
                            <div>
                                <div className={cx('password-container')}>
                                    <Input
                                        {...register('confirmPassword', {
                                            required: 'Nhập lại mật không được bỏ trống',
                                            onChange: () => setError(''),
                                        })}
                                        label="Nhập lại mật khẩu"
                                        type={hidePassword ? 'password' : 'text'}
                                        name="confirmPassword"
                                        ref={confirmPasswordRef}
                                    />

                                    <button
                                        type="button"
                                        className={cx('toggle-hide-password')}
                                        onClick={toggleHidePassword}
                                    >
                                        {!hidePassword ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {!!error && <span className={cx('error')}>{error}</span>}
                        <Button primary className={cx('login-btn')} type="submit">
                            {currentType === 'login' ? 'Đăng nhập' : 'Đăng kí'}
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
                    <span>{currentType === 'login' ? 'Bạn chưa có tài khoản? ' : 'Bạn đã có tài khoản? '}</span>
                    <span className={cx('switch')} onClick={handleSwitchType}>
                        {currentType === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                    </span>
                </footer>
            </div>
        </Popper.Wrapper>
    )
}

export default Auth
