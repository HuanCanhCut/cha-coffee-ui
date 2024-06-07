import classNames from 'classnames/bind'
import style from './MobileSearch.module.scss'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import Search from '../../components/Search'
import config from '~/config'
import { useEffect } from 'react'

const cx = classNames.bind(style)

const MobileSearch = ({ closeModal }) => {
    let Component = 'button'

    if (!closeModal) {
        Component = Link
    }

    useEffect(() => {
        window.history.replaceState({}, '', `search`)
    }, [])

    const handleCloseModal = () => {
        if (closeModal) {
            closeModal('search')
        }
    }

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <Component className={cx('go-back')} to={config.routes.home} onClick={handleCloseModal}>
                    <FontAwesomeIcon icon={faChevronLeft} className={cx('go-back-icon')} />
                    Quay lại
                </Component>
                <button
                    className={cx('close-modal')}
                    onClick={() => {
                        closeModal('search')
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </header>
            <main className={cx('main')}>
                <Search className={cx('search')} />
            </main>
        </div>
    )
}

export default MobileSearch
