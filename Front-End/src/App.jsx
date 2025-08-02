import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserSignup />
    </>
  )
}

export default App
