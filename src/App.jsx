import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { allRoutes } from '~/routes'
import socketIOClient from 'socket.io-client'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import DefaultLayout from './layouts/DefaultLayout'
import * as authServices from './services/authService'
import { actions } from './redux'
import { showToast } from './project/services.'
import { listentEvent } from './helpers/event'
import './index.css'

function App() {
    const dispatch = useDispatch()

    const socketRef = useRef()

    useEffect(() => {
        socketRef.current = socketIOClient.connect(import.meta.env.VITE_APP_SERVER_URL)

        socketRef.current.on('notify', (data) => {
            showToast({ message: data.message, type: 'info', duration: 5000 })
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

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
