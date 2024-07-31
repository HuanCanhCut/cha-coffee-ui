import classNames from 'classnames/bind'
import styles from './Tab.module.scss'
import React, { memo, useMemo } from 'react'

import Button from '~/components/Button'

const cx = classNames.bind(styles)

export default memo(function Tab({ formState, setFormState }) {
    const tabs = useMemo(() => {
        return [
            {
                type: 'delivery',
                title: 'Giao hàng',
            },
            {
                type: 'come',
                title: 'Tự đến lấy',
            },
        ]
    }, [])

    const handleChangeTab = (type) => {
        return () => {
            setFormState((prev) => {
                return {
                    ...prev,
                    currentTab: type,
                }
            })
        }
    }

    return (
        <React.Fragment>
            {tabs.map((tab, index) => (
                <React.Fragment key={index}>
                    <Button
                        outline
                        className={cx('tab', {
                            active: tab.type === formState.currentTab,
                        })}
                        onClick={handleChangeTab(tab.type)}
                    >
                        {tab.title}
                    </Button>
                </React.Fragment>
            ))}
        </React.Fragment>
    )
})
