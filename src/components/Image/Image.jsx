import classNames from 'classnames'
import { forwardRef, useState } from 'react'
import style from './Image.module.scss'
import noImage from '~/assets/noImage.jpg'

// eslint-disable-next-line react/prop-types

export default forwardRef(function Image({ src, alt, className, fallback: customFallback = noImage, ...props }, ref) {
    const [fallback, setFallback] = useState('')

    const handleError = () => {
        setFallback(customFallback)
    }

    return (
        <img
            ref={ref}
            className={classNames(style.wrapper, className)}
            src={fallback || src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    )
})
