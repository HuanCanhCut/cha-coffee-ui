import classNames from 'classnames/bind'
import styles from './DefaultLayout.module.scss'
import { memo } from 'react'
import Header from '../component/Header'

const cx = classNames.bind(styles)

export default memo(function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div className={cx('content')}>{children}</div>
        </div>
    )
})
