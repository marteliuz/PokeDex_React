import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Index from './Views/Index'
import Detalle from './Views/Detalle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/pokemon/:id' element={<Detalle />} />
      </Routes>   
    </BrowserRouter>
  )
}

export default App
