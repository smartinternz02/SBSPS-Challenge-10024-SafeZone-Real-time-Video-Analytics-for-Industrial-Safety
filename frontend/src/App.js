import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Login from './components/LoginPage/Login.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import Statistics from './components/Dashboard/Statistics.js';
import { UserProvider } from './components/Dashboard/UserContext.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider> {/* Wrap your entire application with UserProvider */}
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path='/dashboard/:loginType' element={<Dashboard />} />
            <Route path="/statistics" element={Statistics} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
