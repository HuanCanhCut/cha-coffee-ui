import classNames from 'classnames/bind'
import style from './DefaultLayout.module.scss'
import Header from '../components/Header'
import Sidebar from '../components/SideBar/Sidebar'

const cx = classNames.bind(style)

// eslint-disable-next-line react/prop-types
const DefaultLayout = ({ children }) => {
    return (
        <div className={cx('wrapper', 'grid', 'wide')}>
            <Header />
            <div className={cx('container', 'row')}>
                <Sidebar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    )
}

export default DefaultLayout
