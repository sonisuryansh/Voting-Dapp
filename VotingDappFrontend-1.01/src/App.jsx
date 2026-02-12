import Web3Provider from './context/web3Provider'
import { routes } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import './App.css'
function App() {
  return (
    <>
     <Web3Provider>
      <RouterProvider router={routes}></RouterProvider>
     </Web3Provider>
    </>
  )
}

export default App
