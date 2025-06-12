import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VerifyEmail from './components/VerifyEmail'
function App() {
  const [count, setCount] = useState(0)
  return (
    <Router>
      <Routes>
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/" element={
          <>
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Hand-Hand Nachbarschafts-App</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Klicke auf die Logos, um mehr zu erfahren
            </p>
          </>
        } />
      </Routes>
    </Router>
  )
}
export default App





//  import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import VerifyEmail from './components/VerifyEmail'
// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <Router>
//       <Routes>
//         <Route path="/verify" element={<VerifyEmail />} />
//         <Route path="/" element={
//           <>
//             <div>
//               <a href="https://vite.dev" target="_blank">
//                 <img src={viteLogo} className="logo" alt="Vite logo" />
//               </a>
//               <a href="https://react.dev" target="_blank">
//                 <img src={reactLogo} className="logo react" alt="React logo" />
//               </a>
//             </div>
//             <h1>Hand-Hand Nachbarschafts-App</h1>
//             <div className="card">
//               <button onClick={() => setCount((count) => count + 1)}>
//                 count is {count}
//               </button>
//               <p>
//                 Edit <code>src/App.jsx</code> and save to test HMR
//               </p>
//             </div>
//             <p className="read-the-docs">
//               Klicke auf die Logos, um mehr zu erfahren
//             </p>
//           </>
//         } />
//       </Routes>
//     </Router>
//   )
// }
// export default App
