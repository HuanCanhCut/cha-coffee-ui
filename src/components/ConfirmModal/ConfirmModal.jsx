import classNames from 'classnames/bind'
import style from './ConfirmModal.module.scss'
import { memo } from 'react'
import { Wrapper as PopperWrapper } from '../Popper'
import ReactModal from 'react-modal'
import Button from '../Button'

const cx = classNames.bind(style)

export default memo(function ConfirmModal({ isOpen, onClose = () => {}, title, onConfirm }) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            overlayClassName={'overlay'}
            ariaHideApp={false}
            className={'modal'}
            closeTimeoutMS={200}
        >
            <PopperWrapper className={cx('popper-wrapper')}>
                <div className={cx('wrapper')}>
                    <h2>{title}</h2>
                    <div className={cx('actions')}>
                        <Button outline onClick={onClose}>
                            Hủy
                        </Button>
                        <Button primary onClick={onConfirm}>
                            Đồng ý
                        </Button>
                    </div>
                </div>
            </PopperWrapper>
        </ReactModal>
    )
})
