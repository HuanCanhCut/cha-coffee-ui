import classNames from 'classnames/bind'
import style from './EditProfile.module.scss'
import { useForm } from 'react-hook-form'
import { memo } from 'react'
import Input from '~/components/Input'

import * as authServices from '~/services/authService'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import { useDispatch, useSelector } from 'react-redux'
import { authCurrentUser } from '~/redux/selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Button from '~/components/Button'
import { actions } from '~/redux'
import { showToast } from '~/project/services.'

const cx = classNames.bind(style)

export default memo(function EditProfile({ onClose = () => {} }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(authCurrentUser)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const response = await authServices.updateCurrentUser({
            userName: data.userName,
            phone_number: data.phone,
            address: data.address,
        })

        if (response.status === 200) {
            dispatch(actions.currentUser(response.data.data))
            onClose('user-info')
            showToast({ message: 'Cập nhật thành công' })
            return
        }

        showToast({ message: 'Cập nhật thất bại', type: 'error' })
    }

    return (
        <PopperWrapper>
            <form className={cx('wrapper')} onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('close-container')}>
                    <FontAwesomeIcon icon={faXmark} className={cx('close-icon')} onClick={() => onClose('user-info')} />
                </div>
                <h2 className={cx('title')}>Thay đổi thông tin của bạn</h2>

                <div>
                    <Input
                        type="text"
                        name="user-name"
                        defaultValue={currentUser?.user_name}
                        {...register('userName', { required: true })}
                        autoFocus
                        label="Tên của bạn"
                    />
                    {errors.userName && <small className={cx('error')}>Vui lòng nhập tên của bạn.</small>}
                </div>
                <div>
                    <Input
                        type="number"
                        name="phone"
                        defaultValue={currentUser?.phone_number}
                        {...register('phone', {
                            required: 'Vui lòng nhập số điện thoại',
                            minLength: {
                                value: 10,
                                message: 'Số điện thoại phải có ít nhất 10 kí tự',
                            },
                        })}
                        label="Số điện thoại"
                    />
                    {errors.phone && <small className={cx('error')}>{errors.phone.message}</small>}
                </div>
                <div>
                    <Input
                        type="text"
                        name="address"
                        {...register('address', { required: true })}
                        defaultValue={currentUser?.address}
                        label="Địa chỉ"
                    />
                    {errors.address && <small className={cx('error')}>Vui lòng nhập địa chỉ của bạn.</small>}
                </div>
                <Button type="submit" primary className={cx('save-btn')}>
                    Lưu
                </Button>
            </form>
        </PopperWrapper>
    )
})
