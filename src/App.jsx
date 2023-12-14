import { useState, useEffect } from 'react'
import './App.css'
import Museums from './components/Museums'

const baseUrl = 'https://api.mm.dev.heriobbdev.es/api';


function App() {

  const [museums, setMuseums] = useState([])
  

  const getMuseums = async() => {
    const response = await fetch(`${baseUrl}/museums`)
    const data = await response.json()
    setMuseums(data['hydra:member'])
  };

  useEffect(() => {
    getMuseums()
  }, [])

  return (
   <Museums museums={museums} baseUrl={baseUrl}/>

  )

}

export default App
