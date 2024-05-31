import classNames from 'classnames/bind'
import styles from './Home.module.scss'

const cx = classNames.bind(styles)

const Home = () => {
    return (
        <div className={cx('wrapper', 'col')}>
            <h1>Home container</h1>
        </div>
    )
}

export default Home
