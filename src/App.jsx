import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { allRoutes } from '~/routes'
import './index.css'

function App() {
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
