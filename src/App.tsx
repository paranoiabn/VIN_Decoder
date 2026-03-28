import Home from './pages/Home'
import Variables from './pages/Variables'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import VariableDetail from './components/VariableDetail'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/variables' element={<Variables key="variables-page" />} />
        <Route path='/variables/:id' element={<VariableDetail  />}  /> 
      </Routes>
    </>
  )
}

export default App
