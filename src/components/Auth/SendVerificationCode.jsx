import classNames from 'classnames/bind'
import styles from './Auth.module.scss'
import Button from '../Button'
import { showToast } from '~/project/services.'
import * as authServices from '~/services/authService'
import { useEffect, useRef, useState } from 'react'

const cx = classNames.bind(styles)

const SendVerificationCode = ({ emailRef }) => {
    const [sendSuccess, setSendSuccess] = useState(false)
    const [counter, setCounter] = useState(60)

    const timerId = useRef(null)

    useEffect(() => {
        if (!sendSuccess) return

        timerId.current = setInterval(() => {
            setCounter((prev) => {
                return prev - 1
            })
        }, 1000)
    }, [sendSuccess])

    useEffect(() => {
        if (counter === 0) {
            clearInterval(timerId.current)
            setCounter(60)
            setSendSuccess(false)
        }
    }, [counter])

    const sendVerificationCode = async () => {
        try {
            if (sendSuccess) return

            if (!emailRef.current.value) {
                showToast({ message: 'Vui lòng nhập email', type: 'warning' })
                return
            }

            if (!/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(emailRef.current.value)) {
                showToast({ message: 'Email không đúng định dạng', type: 'warning' })
                return
            }

            const response = await authServices.sendVerificationCode({ email: emailRef.current.value })

            if (response.status === 200 || response.status === 204) {
                showToast({
                    message:
                        'Gửi mã xác minh thành công, vui lòng kiểm tra email của bạn. Nếu không thấy, vui lòng kiểm tra thư mục rác (spam)',
                    duration: 5500,
                })

                setSendSuccess(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button type="button" primary className={cx('send-verification-code')} onClick={sendVerificationCode}>
            {sendSuccess ? <span style={{ fontSize: '18px', fontWeight: '600' }}>{counter}</span> : 'Gửi mã'}
        </Button>
    )
}

export default SendVerificationCode
