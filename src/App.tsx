import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Header from './components/layout/header';
import Register from './components/pages/register';
import Home from './components/pages/home';
import Livros from './components/pages/livros';

import './App.css';
import Livro from './components/pages/livro';

function App() {

  let [currentUrl, setCurrentUrl] = useState(window.location.pathname);

  setInterval(() => setCurrentUrl(window.location.pathname), 100)

  return (
    <div className='flex gap-4 overflow-hidden'>
      <BrowserRouter>
        {currentUrl != '/' && <Header />}
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='home' element={<Home />} />
          <Route path='livros' element={<Livros />} />
          <Route path='livro/:id' element={<Livro />} />
        </Routes>
      </BrowserRouter>
      <Outlet />
    </div>
  );
}

export default App;