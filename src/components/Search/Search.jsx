import classNames from 'classnames/bind'
import styles from './Search.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

// eslint-disable-next-line react/prop-types
const Search = ({ className }) => {
    const classes = cx('search', {
        [className]: className,
    })

    return (
        <div className={classes}>
            <div className={cx('search-icon')}>
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <input type="text" placeholder="Tìm kiếm thực đơn" className={cx('input')} />
        </div>
    )
}

export default Search
