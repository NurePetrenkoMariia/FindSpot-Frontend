import React, { useEffect, useState } from "react";
//import axios from "axios";
import './PublicationsListPage.css';

function PublicationsListPage() {

    const [error, setError] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [appliedCountries, setAppliedCountries] = useState([]);

    const fakeCountries = ["Україна", "Англія", "Єгипет", "Ірландія", "Франція", "Італія"];

    const fakePublications = [
        {
            id: 1,
            title: "Title",
            description: "Description",
            imageUrl: "https://placehold.co/300x200",
            location: "Париж, Франція",
            country: "Франція",
            averageRating: 4.8,
            createdAt: "2025-05-20T12:00:00Z"
        },
        {
            id: 2,
            title: "Title",
            description: "Description",
            imageUrl: "https://placehold.co/300x200",
            location: "Київ, Україна",
            country: "Україна",
            averageRating: 4.2,
            createdAt: "2025-05-19T08:00:00Z"
        },

    ];
    const filteredPublications = appliedCountries.length === 0
        ? fakePublications
        : fakePublications.filter((pub) => appliedCountries.includes(pub.country));

     const handleCountryChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setSelectedCountries((prev) => [...prev, value]);
        } else {
            setSelectedCountries((prev) =>
                prev.filter((country) => country !== value)
            );
        }
    };

    const handleApplyFilters = () => {
        setAppliedCountries(selectedCountries);
    };

    return (
        <>
            <div className='top-section'>
                <h2 className="top-section-page-name">Cписок публікацій</h2>
                <div className="top-section-search">
                    <input type="text" className='top-section-search_input-field' placeholder="Пошук" />
                    <button className="top-section-search_button">Шукати</button>
                </div>
            </div>
            <div className='blogPosts-container'>
                <aside className="blogPosts-container-filters">
                    <h2>Фільтри</h2>
                    <p>Оберіть країну</p>
                    {fakeCountries.map((country) => (
                        <label key={country}>
                            <input
                                type="checkbox"
                                value={country}
                                checked={selectedCountries.includes(country)}
                                onChange={handleCountryChange}
                            />
                            {country}
                        </label>
                    ))}
                </aside>
                <div className="blogPosts-container-content">
                    <div className="blogPosts-container-sort">
                        <label>Сортувати за: </label>
                        <select
                        /*value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}*/
                        >
                            <option value="">Оберіть параметри сортування</option>
                            <option value="newest">Від нових до старих</option>
                            <option value="oldest">Від старих до нових</option>
                            <option value="rating_desc">Від найвищої до найнижчої оцінки</option>
                            <option value="rating_asc">Від найнижчої до найвищої оцінки</option>
                        </select>
                    </div>
                    <div className="blogPost-container_buttons">
                        <button className='blogPost-container_buttons_filter'  onClick={handleApplyFilters}>
                            Застосувати фільтри
                        </button>
                        <button className='blogPost-container_buttons_add' /*onClick={handleAdding}*/>
                            Створити новий пост
                        </button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {filteredPublications.length === 0 ? (
                        <p className='no-blogPosts'>Публікацій ще немає</p>
                    ) : (
                        <div className='blogPost-container_list'>
                            {filteredPublications.map((post) => (
                                <div key={post.id} className="blogPost-container_list_item">
                                    <img src={post.imageUrl} alt="Фото" />
                                    <div className='blogPost-container_list_item_text'>
                                        <strong>{post.title}</strong>
                                        <p>{post.country}</p>
                                        <p>{post.description}</p>
                                    </div>
                                    <button className="blogPost-container_list-details_button">Деталі публікації</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PublicationsListPage;