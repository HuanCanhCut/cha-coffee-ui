import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm, Controller } from 'react-hook-form'
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
import SendVerificationCode from './SendVerificationCode'

const cx = classNames.bind(styles)

const Auth = ({ type = 'login', closeModal = () => {} }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const verificationCodeRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const inputsRef = useRef([emailRef, verificationCodeRef, passwordRef, confirmPasswordRef])

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
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

    useEffect(() => {
        setInputFocusIndex(0)
        inputsRef.current[0].current?.focus()
    }, [currentType])

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
                        prev = inputsRef.current.length - 1
                        while (inputsRef.current[prev]?.current === null) {
                            prev--
                        }

                        return prev
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
        if (!data) return
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

        const handleForgotPassword = async () => {
            try {
                const { email, password: newPassword, verificationCode: resetCode } = data
                const response = await authServices.forgotPassword({ email, newPassword, resetCode })

                if (response?.status === 204) {
                    showToast({ message: 'Thay đổi mật khẩu thành công.', type: 'success' })

                    setCurrentType('login')
                    setValue('password', '')
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
                case 'forgotPassword':
                    handleForgotPassword()
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
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Email không được bỏ trống',
                                    pattern: {
                                        value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Email không đúng định dạng',
                                    },
                                    onChange: () => {
                                        setError('')
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        label="Email"
                                        name="email"
                                        {...field}
                                        ref={(e) => {
                                            field.ref(e)
                                            emailRef.current = e
                                        }}
                                    />
                                )}
                            />

                            {errors.email && <small className={cx('error')}>{errors.email.message}</small>}
                        </div>
                        {currentType === 'forgotPassword' && (
                            <div className={cx('forgot-password-container')}>
                                <Controller
                                    name="verificationCode"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'Mã xác minh không được bỏ trống.',
                                        onChange: () => setError(''),
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            label="Mã xác minh"
                                            name="verificationCode"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e)
                                                verificationCodeRef.current = e
                                            }}
                                        />
                                    )}
                                />

                                <SendVerificationCode emailRef={emailRef} />
                                {errors.verificationCode && (
                                    <small className={cx('error')}>{errors.verificationCode.message}</small>
                                )}
                            </div>
                        )}
                        <div>
                            <div className={cx('password-container')}>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Mật khẩu không được bỏ trống', onChange: () => setError('') }}
                                    render={({ field }) => (
                                        <Input
                                            label="Mật khẩu"
                                            name="password"
                                            type={hidePassword ? 'password' : 'text'}
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e)
                                                passwordRef.current = e
                                            }}
                                        />
                                    )}
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
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: 'Nhập lại mật không được bỏ trống',
                                            onChange: () => setError(''),
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                label="Nhập lại mật khẩu"
                                                type={hidePassword ? 'password' : 'text'}
                                                name="confirmPassword"
                                                {...field}
                                                ref={(e) => {
                                                    field.ref(e)
                                                    confirmPasswordRef.current = e
                                                }}
                                            />
                                        )}
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
                            {currentType === 'login'
                                ? 'Đăng nhập'
                                : currentType === 'forgotPassword'
                                ? 'Đặt lại mật khẩu'
                                : 'Đăng kí'}
                        </Button>
                    </form>

                    <div className={cx('separator')}>
                        <span className={cx('separator-line')}></span>
                        <span className={cx('separator-content')}>Hoặc</span>
                        <span className={cx('separator-line')}></span>
                    </div>

                    <button type="button" className={cx('login-with-google')} onClick={handleLoginWithGoogle}>
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
