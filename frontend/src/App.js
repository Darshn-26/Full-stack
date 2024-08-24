import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import React from 'react';
import Home from './Home';
import Dashboard from './Dashboard'; // Import the new Dashboard component
import Sample from './Sample';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginRegister />} />
          <Route path='/register' element={<LoginRegister />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} /> {/* Dashboard Route */}
          <Route path='/sample' element={<Sample />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
