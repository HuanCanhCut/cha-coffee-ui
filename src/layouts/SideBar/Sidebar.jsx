import classNames from 'classnames/bind'
import styles from './Sidebar.module.scss'
import { useEffect, useState } from 'react'
import { listentEvent, sendEvent } from '~/helpers/event'

const cx = classNames.bind(styles)

const Sidebar = ({ products }) => {
    const categories = Object.keys(products)

    const [currentCategory, setCurrentCategory] = useState(categories[0])

    const handleSelectCategory = (category) => {
        if (category === currentCategory) return
        setCurrentCategory(category)
        const categoryIndex = categories.indexOf(category)

        sendEvent({ eventName: 'sidebar:select-category', detail: categoryIndex })
    }

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'product:category-visible',
            handler: ({ detail: category }) => {
                setCurrentCategory(category)
            },
        })

        return remove
    }, [])

    return (
        <aside className={cx('wrapper')}>
            <h2 className={cx('title')}>Thực đơn</h2>
            <div className={cx('categories-wrapper')}>
                {categories.map((category) => (
                    <button
                        className={cx('category-item', {
                            active: category.toLowerCase() === currentCategory.toLowerCase(),
                        })}
                        key={category}
                        onClick={() => {
                            handleSelectCategory(category)
                        }}
                    >
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar
