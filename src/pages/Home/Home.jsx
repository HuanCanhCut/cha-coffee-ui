import classNames from 'classnames/bind'
import styles from './Home.module.scss'
import Header from '~/layouts/Header'

const cx = classNames.bind(styles)

const Home = () => {
    return (
        <div className={cx('wrapper')}>
            <Header />
        </div>
    )
}

export default Home
