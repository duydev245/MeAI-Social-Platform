import useCustomRoutes from '@/routes/useCustomRoutes'
import './App.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  const routes = useCustomRoutes()

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  )
}

export default App
