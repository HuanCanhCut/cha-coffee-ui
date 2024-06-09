import classNames from 'classnames/bind'
import styles from './Search.module.scss'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { search } from '~/services/searchService'
import useDebounce from '~/hooks/useDebounce'

const cx = classNames.bind(styles)

// eslint-disable-next-line react/prop-types
const Search = ({ className }) => {
    const [searchValue, setSearchValue] = useState('')

    const debounceValue = useDebounce(searchValue, 500)

    const classes = cx('search', {
        [className]: className,
    })

    const handleChange = ({ target: { value } }) => {
        setSearchValue(value)
    }

    useEffect(() => {
        if (!debounceValue.trim()) {
            return
        }

        const getProducts = async () => {
            try {
                const response = await search(debounceValue.trim())

                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }

        getProducts()
    }, [debounceValue])

    return (
        <div className={classes}>
            <div className={cx('search-icon')}>
                <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
                type="text"
                placeholder="Tìm kiếm thực đơn"
                className={cx('input')}
                value={searchValue}
                onChange={handleChange}
            />
        </div>
    )
}

export default Search
