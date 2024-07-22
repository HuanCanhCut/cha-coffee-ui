import classNames from 'classnames/bind'
import styles from './ChangeQuantity.module.scss'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

export default forwardRef(function ChangeQuantity({ children = null, handleChange, size = 'small' }, ref) {
    const classes = cx('change-quantity', {
        [size]: size,
    })

    return (
        <div className={classes}>
            <motion.button className={cx('add-to-cart')} whileTap={{ scale: 0.9 }} onClick={() => handleChange('sub')}>
                <FontAwesomeIcon icon={faMinus} />
            </motion.button>
            <div ref={ref} className={cx('quantity')}>
                {children}
            </div>
            <motion.button className={cx('add-to-cart')} whileTap={{ scale: 0.9 }} onClick={() => handleChange('add')}>
                <FontAwesomeIcon icon={faPlus} />
            </motion.button>
        </div>
    )
})
