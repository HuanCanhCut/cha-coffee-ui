import classNames from 'classnames/bind'
import style from './Menu.module.scss'
import Button from '~/components/Button'

const cx = classNames.bind(style)

const MenuItem = ({ data, onClick }) => {
    const classes = cx('menu-item', {
        separate: data.separate,
    })

    return (
        <Button className={classes} to={data.to} leftIcon={data.icon} onClick={onClick}>
            {data.title}
        </Button>
    )
}

export default MenuItem
