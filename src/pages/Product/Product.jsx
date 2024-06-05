import classNames from 'classnames/bind'
import style from './Product.module.scss'

const cx = classNames.bind(style)

const Product = () => {
    const handleAddProduct = async () => {
        const product = {
            _id: 3,
            name: 'Cafe Latte 2',
            price: 20000,
            type: 'Coffee',
            best_seller: true,
        }
        try {
            const response = await fetch('http://localhost:3000/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: JSON.stringify(product),
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <input type="text" name="_id" placeholder="Mã sản phẩm" />
            <input type="text" name="name" placeholder="Tên sản phẩm" />
            <input type="text" name="price" placeholder="Giá sản phẩm" />
            <input type="text" name="type" placeholder="Loại sản phẩm" />
            <input type="text" name="best_seller" placeholder="Bán chạy" />

            <button className={cx('add-product')} onClick={handleAddProduct}>
                Add Product
            </button>
        </div>
    )
}

export default Product
