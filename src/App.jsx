import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { allRoutes } from '~/routes'
import * as authServices from './services/authService'
import './index.css'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from './redux'

function App() {
    const dispatch = useDispatch()
    const accessToken = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                if (!accessToken) return
                const response = await authServices.getCurrentUser({ accessToken })

                if (response) {
                    dispatch(actions.currentUser(response.data))
                } else {
                    dispatch(actions.currentUser(null))
                }
            } catch (error) {
                console.log(error)
            }
        }

        getCurrentUser()
    }, [accessToken, dispatch])

    return (
        <Router>
            <div className="App">
                <Routes>
                    {allRoutes.map((route, index) => {
                        const Page = route.component

                        return <Route key={index} path={route.path} element={<Page />} />
                    })}
                </Routes>
            </div>
        </Router>
    )
}

export default App
