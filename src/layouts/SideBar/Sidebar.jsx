import classNames from 'classnames/bind'
import styles from './Sidebar.module.scss'

const cx = classNames.bind(styles)

const Sidebar = ({ products }) => {
    const categories = Object.keys(products)

    return (
        <aside className={cx('wrapper')}>
            <h2>Thực đơn</h2>
            <div className={cx('categories-wrapper')}>
                {categories.map((category) => (
                    <button
                        className={cx('category-item', {
                            active: category.toLowerCase() === 'cà phê',
                        })}
                        key={category}
                    >
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar
