import style from './Menu.module.scss'
import classNames from 'classnames/bind'
import Tippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'
import { useSpring, motion } from 'framer-motion'

import { Wrapper as PopperWrapper } from '../index'
import Header from './Header'
import MenuItem from './MenuItem'
import { useState } from 'react'

const cx = classNames.bind(style)

const defaultFn = () => {}

const Menu = ({ children, items = [], hideOnClick = false, onChange = defaultFn }) => {
    const [history, setHistory] = useState([{ data: items }])

    const springConfig = { damping: 15, stiffness: 300 }
    const initialScale = 0.5
    const opacity = useSpring(springConfig)
    const scale = useSpring(initialScale, springConfig)

    const current = history[history.length - 1]

    const handleChose = (isParent, item) => {
        // next menu page
        if (isParent) {
            setHistory((prev) => {
                return [...prev, item.children]
            })
        } else {
            onChange(item)
        }
    }

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = Boolean(item.children)
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={() => {
                        handleChose(isParent, item)
                    }}
                />
            )
        })
    }

    const renderResult = (attrs) => (
        <motion.div style={{ scale, opacity }} {...attrs}>
            <div className={cx('menu-list')} tabIndex={-1}>
                <PopperWrapper className={cx('menu-wrapper')}>
                    {history.length > 1 && (
                        <Header
                            title={current.title}
                            onBack={() => {
                                setHistory((prev) => {
                                    return prev.slice(0, prev.length - 1)
                                })
                            }}
                        ></Header>
                    )}
                    <div className={cx('menu-body')}>{renderItems()}</div>
                </PopperWrapper>
            </div>
        </motion.div>
    )

    const onMount = () => {
        scale.set(1)
        opacity.set(1)
    }

    // trở về page menu đầu tiên khi menu bị hide
    const handleResetMenu = ({ unmount }) => {
        scale.on('change', (value) => {
            if (value <= initialScale) {
                unmount()
            }
        })

        scale.set(initialScale)
        opacity.set(0)

        setHistory((prev) => {
            return prev.slice(0, 1)
        })
    }

    return (
        <div>
            <Tippy
                animation={true}
                interactive
                delay={[100, 400]}
                offset={[8, 12]}
                hideOnClick={hideOnClick}
                placement="bottom-end"
                render={renderResult}
                onMount={onMount}
                onHide={handleResetMenu}
            >
                {children}
            </Tippy>
        </div>
    )
}

export default Menu
