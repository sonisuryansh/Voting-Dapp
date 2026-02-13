import Web3Provider from './context/web3Provider'
import { useEffect } from 'react'
import { routes } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import './App.css'

// Capture token returned by backend OAuth redirect and store in localStorage
const HandleAuthToken = () => {
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const token = url.searchParams.get('token')
      if (token) {
        localStorage.setItem('token', token)
        // remove token from URL without reload
        url.searchParams.delete('token')
        window.history.replaceState({}, document.title, url.pathname + url.search)
      }
    } catch (e) {
      // ignore
    }
  }, [])
  return null
}
function App() {
  return (
    <>
     <Web3Provider>
      <HandleAuthToken />
      <RouterProvider router={routes}></RouterProvider>
     </Web3Provider>
    </>
  )
}

export default App
