import classNames from 'classnames/bind'
import style from './EditProduct.module.scss'
import ReactModal from 'react-modal'
import { memo, useMemo, useReducer, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import * as productServices from '~/services/productsService'

import Image from '../Image'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import Button from '../Button'
import Select from '../Select/Select'
import { CheckboxTick } from '../Icons'
import { showToast } from '~/project/services.'
import { sendEvent } from '~/helpers/event'
import { useSelector } from 'react-redux'
import { getProducts } from '~/redux/selector'

const cx = classNames.bind(style)

const reducer = (state, action) => {
    switch (action.type) {
        case 'NAME':
            return state.map((item) => {
                if (item.type === 'name') {
                    return { ...item, value: action.payload }
                }
                return item
            })
        case 'DESCRIPTION':
            return state.map((item) => {
                if (item.type === 'description') {
                    return { ...item, value: action.payload }
                }
                return item
            })
        case 'PRICE':
            return state.map((item) => {
                if (item.type === 'price') {
                    return { ...item, value: action.payload }
                }
                return item
            })
        default:
            return state
    }
}

export default memo(function EditProduct({ isOpen, onClose = () => {}, title, product = {} }) {
    const products = useSelector(getProducts)
    const accessToken = JSON.parse(localStorage.getItem('token'))

    const categories = Object.keys(products)

    const fields = [
        {
            label: 'Tên sản phẩm',
            value: product?.name,
            type: 'name',
            inputType: 'text',
            action: 'NAME',
        },
        {
            label: 'Mô tả sản phẩm',
            value: product?.description,
            type: 'description',
            inputType: 'text',
            action: 'DESCRIPTION',
        },
        {
            label: 'Giá',
            value: product?.price,
            type: 'price',
            inputType: 'number',
            action: 'PRICE',
        },
    ]

    const tabs = useMemo(() => {
        return [
            {
                label: 'Thêm vào danh mục có sẵn.',
                type: 'add-available',
            },
            {
                label: 'Thêm danh mục mới.',
                type: 'add-new',
            },
        ]
    }, [])

    const submitButtonRef = useRef(null)

    const [fieldValue, dispatch] = useReducer(reducer, fields)
    const [currentTab, setCurrentTab] = useState(tabs[0].type)
    const [currentCategory, setCurrentCategory] = useState(product.category)
    const [isBestSeller, setIsBestSeller] = useState(product.best_seller)
    const [file, setFile] = useState()

    const handleChangeImage = (e) => {
        URL.revokeObjectURL(file?.preview)

        const newFile = e.target.files[0]

        if (newFile) {
            newFile.preview = URL.createObjectURL(newFile)
        }
        setFile(newFile)
    }

    const handleChange = (e, item) => {
        dispatch({ type: item.action, payload: e.target.value })
    }

    const handleChangeBestSeller = () => {
        setIsBestSeller(!isBestSeller)
    }

    const handleUpdate = async (productID) => {
        if (submitButtonRef.current) {
            submitButtonRef.current.disabled = true
        }

        const formData = new FormData()

        let name, description, price

        for (let i = 0; i < fieldValue.length; ++i) {
            switch (fieldValue[i].type) {
                case 'name':
                    name = fieldValue[i].value
                    break
                case 'description':
                    description = fieldValue[i].value
                    break
                case 'price':
                    price = fieldValue[i].value
                    break
                default:
                    break
            }
        }

        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('category', currentCategory)
        formData.append('best_seller', isBestSeller)
        if (file) {
            formData.append('image', file)
        }

        try {
            const response = await productServices.updateProduct({ accessToken, productID, formData })
            onClose({ type: 'edit' })

            if (response) {
                showToast({ message: 'Cập nhật sản phẩm thành công' })

                sendEvent({
                    eventName: 'product:update-product',
                    detail: product,
                })
                sendEvent({
                    eventName: 'socket:send-notify',
                    detail: `${product.name} đã được cập nhật thông tin bởi quản lí.`,
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            if (submitButtonRef.current) {
                submitButtonRef.current.disabled = false
            }
        }
    }

    const handleSetCategory = (category) => {
        setCurrentCategory(category)
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            overlayClassName={'overlay'}
            ariaHideApp={false}
            className={'modal'}
            closeTimeoutMS={200}
        >
            <PopperWrapper className={cx('popper-wrapper')}>
                <div className={cx('wrapper')}>
                    <h3>{title}</h3>
                    <button className={cx('close-modal')} onClick={onClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <main className={cx('image-wrapper')}>
                        <div className={cx('image-container')}>
                            <label htmlFor="change-image">
                                <Image src={file?.preview || product?.image} className={cx('image')} />
                            </label>
                            <label htmlFor="change-image" className={cx('change-image')}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </label>
                            <input type="file" onChange={handleChangeImage} id="change-image" hidden accept="image/*" />
                        </div>
                    </main>
                    <main className={cx('field-container')}>
                        {fieldValue.map((field, index) => {
                            return (
                                <input
                                    type={field.inputType}
                                    key={index}
                                    className={cx('field')}
                                    value={field.value}
                                    onChange={(e) => {
                                        handleChange(e, field)
                                    }}
                                />
                            )
                        })}

                        <div className={cx('category-selector')}>
                            <div className={cx('tabs')}>
                                {tabs.map((tab, index) => {
                                    return (
                                        <button
                                            className={cx('tab', {
                                                active: currentTab === tab.type,
                                            })}
                                            key={index}
                                            onClick={() => setCurrentTab(tab.type)}
                                        >
                                            {tab.label}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className={cx('category')}>
                                {currentTab === 'add-new' ? (
                                    <input
                                        type="text"
                                        className={cx('field')}
                                        placeholder="Nhập tên danh mục"
                                        value={currentCategory}
                                        onChange={(e) => {
                                            handleSetCategory(e.target.value)
                                        }}
                                    />
                                ) : (
                                    <Select
                                        options={categories}
                                        value={currentCategory}
                                        handleSetValue={handleSetCategory}
                                        className={cx('select-category')}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={cx('best-seller-wrapper')}>
                            <label className={cx('best-seller')}>Best seller?</label>
                            <div className={cx('best-seller-input-group')}>
                                <label className={cx('best-seller-input')} htmlFor="best-seller">
                                    <div className={cx('is-best-seller')}>
                                        <div
                                            className={cx('checkbox', {
                                                notChecked: !isBestSeller,
                                            })}
                                            onClick={() => {
                                                handleChangeBestSeller()
                                            }}
                                        >
                                            <input type="checkbox" className={cx('checkbox-input')} id="best-seller" />

                                            {isBestSeller && (
                                                <CheckboxTick width="12" height="12" className={cx('checkbox-icon')} />
                                            )}
                                        </div>
                                        <label htmlFor="best-seller">Có</label>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <Button
                            ref={submitButtonRef}
                            className={cx('update')}
                            primary
                            onClick={() => {
                                handleUpdate(product._id)
                            }}
                        >
                            Cập nhật
                        </Button>
                    </main>
                </div>
            </PopperWrapper>
        </ReactModal>
    )
})
