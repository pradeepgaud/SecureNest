
import './App.css'
import Footer from './Compoentes/Footer'
import Manager from './Compoentes/Manager'
import Navbar from './Compoentes/Navbar'

function App() {
  

  return (
    <>
    <Navbar/>
     <div className='min-h-[87vh]'>
     <Manager/>
     </div>
     <Footer/>

    </>
  )
}

export default App
