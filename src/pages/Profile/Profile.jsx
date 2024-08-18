import classNames from 'classnames/bind'
import styles from './Profile.module.scss'
import { memo } from 'react'

const cx = classNames.bind(styles)

export default memo(function Profile() {
    return <div className={cx('wrapper')}>Profile page</div>
})
