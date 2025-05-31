import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicationsListPage from './pages/PublicationsListPage';
import AddPublicationPage from './pages/AddPublicationPage';
import PublicationDetailsPage from './pages/PublicationDetailsPage';
import ProfilePage from './pages/ProfilePage';
import MyListsPage from './pages/MyListsPage';

function App() {

  return (
    <>
      <div className="app_container">
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts" element={<PublicationsListPage />}/>
              <Route path="/posts/add" element={<AddPublicationPage />}/>
              <Route path="/posts/:id" element={<PublicationDetailsPage />}/>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-lists" element={<MyListsPage />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
