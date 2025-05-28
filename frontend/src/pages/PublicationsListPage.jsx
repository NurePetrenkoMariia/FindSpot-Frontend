import React, { useEffect, useState } from "react";
import axios from "axios";
import './PublicationsListPage.css';
import { useNavigate,useSearchParams } from "react-router-dom";

function PublicationsListPage() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [appliedSearchQuery, setAppliedSearchQuery] = useState(initialSearch);

    const [error, setError] = useState(null);

    const [selectedCountries, setSelectedCountries] = useState([]);
    const [appliedCountries, setAppliedCountries] = useState([]);

    const [publications, setPublications] = useState([]);

    const fakeCountries = ["Україна", "Англія", "Єгипет", "Ірландія", "Франція", "Італія"];

    useEffect(() => {
        const fetchPublications = async () => {

            try {
                const response = await axios.get("/api/BlogPosts");
                setPublications(response.data);
                setError(null);
            } catch (err) {
                setError("Помилка при завантаженні публікацій");
            }
        };
        fetchPublications();
    }, []);

    const filteredPublications = publications.filter((pub) => {
        const countryMatch =
            appliedCountries.length === 0 ||
            appliedCountries.includes(pub.touristObject?.countryName || "");

        const titleMatch = pub.pageTitle
            .toLowerCase()
            .includes(appliedSearchQuery.toLowerCase());

        const tagsMatch = pub.tags?.some(tag =>
            tag.name.toLowerCase().includes(appliedSearchQuery.toLowerCase())
        );

        return countryMatch && (titleMatch || tagsMatch);
    });

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

    const handleDetails = (postId) => {
        navigate(`/posts/${postId}`);
    }
    return (
        <>
            <div className='top-section'>
                <h2 className="top-section-page-name">Cписок публікацій</h2>
                <div className="top-section-search">
                    <input
                        type="text"
                        className='top-section-search_input-field'
                        placeholder="Пошук"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="top-section-search_button"
                        onClick={() => setAppliedSearchQuery(searchQuery)}>
                        Шукати
                    </button>
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
                        <button className='blogPost-container_buttons_filter' onClick={handleApplyFilters}>
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
                                    <img src={post.featuredImageUrl} alt="Фото" />
                                    <div className='blogPost-container_list_item_text'>
                                        <strong>{post.pageTitle}</strong>
                                        <div className="blogPost-container_list_item_tags">
                                            {post.tags?.map((tag) => (
                                                <span key={tag.id} className="tag">{tag.name}</span>
                                            ))}
                                        </div>
                                        <p>{post.touristObject?.country || "Невідомо"}</p>
                                        <p>{post.shortDescription}</p>
                                    </div>
                                    <button className="blogPost-container_list-details_button" onClick={() => handleDetails(post.id)}>Деталі публікації</button>
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