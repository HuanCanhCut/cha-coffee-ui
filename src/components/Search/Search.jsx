import classNames from 'classnames/bind'
import styles from './Search.module.scss'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

const cx = classNames.bind(styles)

// eslint-disable-next-line react/prop-types
const Search = () => {
    const [loading, setLoading] = useState(false)

    return (
        <div className={cx('search')}>
            <input type="text" placeholder="Tìm kiếm" className={cx('input')} />
            {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
        </div>
    )
}

export default Search
