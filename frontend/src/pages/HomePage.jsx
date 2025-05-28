import './HomePage.css';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleTransition = () => {
    navigate(`/posts`);
  }

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/posts?search=${encodeURIComponent(searchQuery)}`);
    } else {
      alert("Будь ласка, введіть текст для пошуку.");
    }
  };

  return (
    <>
      <div className='container'>
        <p className='container_p-moto'>Менше шукай, більше мандруй</p>
        <div className='container_search-block'>
          <input
            type="text"
            className='input-field'
            placeholder="Шукай туристичні місця"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="search-button"
            onClick={handleSearch}
          >
            Шукати
          </button>
        </div>
        <button
          className="container_button-go-to-list"
          onClick={handleTransition}
        >
          Перейти до публікацій
        </button>
      </div>
    </>
  )
}

export default HomePage
