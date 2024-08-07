import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { allRoutes } from '~/routes'
import socketIOClient from 'socket.io-client'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { groupProductByCategory } from '~/project/services.'
import DefaultLayout from './layouts/DefaultLayout'
import * as authServices from './services/authService'
import { actions } from './redux'
import { showToast } from './project/services.'
import { listentEvent } from './helpers/event'
import './index.css'
import { authCurrentUser } from './redux/selector'

function App() {
    const dispatch = useDispatch()
    const currentUser = useSelector(authCurrentUser)

    useEffect(() => {
        if (!currentUser) {
            localStorage.removeItem('exp')
        }
    }, [currentUser])

    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = socketIOClient.connect(import.meta.env.VITE_APP_SERVER_URL)

        socketRef.current.on('notify', (data) => {
            showToast({ message: data.message, type: 'info', duration: 5000 })
        })

        socketRef.current.on('new-products', (newProducts) => {
            const groupProducts = groupProductByCategory(newProducts.data)

            dispatch(actions.addProducts(groupProducts))
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [dispatch])

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'socket:send-notify',
            handler: ({ detail: message }) => {
                socketRef.current.emit('notify', message)
            },
        })

        return remove
    }, [])

    useEffect(() => {
        const remove = listentEvent({
            eventName: 'product:update-product',
            handler: ({ detail: product }) => {
                socketRef.current.emit('get-products', {
                    id: product._id,
                    name: product.name,
                })
            },
        })

        return remove
    }, [])

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await authServices.getCurrentUser()

                if (response) {
                    dispatch(actions.currentUser(response.data.data))
                } else {
                    dispatch(actions.currentUser(null))
                }
            } catch (error) {
                console.log(error)
            }
        }

        getCurrentUser()
    }, [dispatch])

    return (
        <Router>
            <div className="App">
                <Routes>
                    {allRoutes.map((route, index) => {
                        const Page = route.component

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <DefaultLayout>
                                        <Page />
                                    </DefaultLayout>
                                }
                            />
                        )
                    })}
                </Routes>
            </div>
        </Router>
    )
}

export default App
