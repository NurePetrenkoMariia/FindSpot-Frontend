import './AddPublicationPage.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function AddPublicationPage() {
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [touristObjects, setTouristObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchTouristObjects = async () => {
            try {
                const response = await axios.get('/api/BlogPosts/tourist-objects', {
                    withCredentials: true
                });
                setTouristObjects(response.data);
            } catch (error) {
                setError("Не вдалося завантажити туристичні об'єкти");
            }
        };

        fetchTouristObjects();
    }, []);

    const filteredObjects = touristObjects.filter(obj =>
        obj.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/Image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.data.link) {
                setImageUrl(response.data.link);
            } else {
                setError('Помилка при завантаженні зображення');
            }
        } catch (err) {
            setError('Помилка при завантаженні зображення');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        const exactMatch = touristObjects.find(
            (obj) => obj.name.toLowerCase() === searchText.trim().toLowerCase()
        );

        if (!title || !description) {
            setError("Будь ласка, заповніть всі обов'язкові поля.");
            return;
        }

        if (!exactMatch) {
            setError("Туристичний об'єкт має бути обраний зі списку.");
            return;
        }

        const newPublication = {
            pageTitle: title,
            shortDescription: description,
            content: content,
            featuredImageUrl: imageUrl,
            publishedDate: new Date().toISOString(),
            touristObjectId: exactMatch.id,
            tags: tags.split(",").map(t => ({ name: t.trim() })).filter(t => t.name.length > 0),
        };

        try {
            const response = await axios.post('/api/BlogPosts', newPublication, {
                withCredentials: true
            });

            if (response.status === 201) {
                setSuccessMessage("Публікацію успішно додано!");
                setTitle("");
                setImageUrl("");
                setDescription("");
                setContent("");
                setTags("");
                setSelectedObjectId(null);
                setSearchText("");
                setTimeout(() => {
                    window.location.href = `/posts/`;
                }, 1000)
            }
        } catch (error) {
            setError("Помилка при додаванні публікації");
        }
    };

    return (
        <div className="add-publication">
            <div className='add-publication_card'>
                <h2 className='add-publication_card-title'>Створіть нову публікацію</h2>

                <form onSubmit={handleSubmit} className='add-publication_form'>
                    <div className="add-publication_card-field">
                        <label>
                            Назва*:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <div className="add-publication_card-field">
                        <label>
                            Фото*:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Превʼю"
                                width="200"
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </div>

                    <div className="add-publication_card-field">
                        <label>
                            Короткий опис*:
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <div className="add-publication_card-field">
                        <label>
                            Текст*:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="add-publication_card-field">
                        <label>
                            Теги (через кому):
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="приклад: історія, архітектура, музей"
                            />
                        </label>
                    </div>

                    <div className="add-publication_card-field autocomplete">
                        <div className='add-publication_card-field-search'>
                            <label htmlFor="object-search">Туристичний об'єкт*:</label>
                            <input
                                id="object-search"
                                type="text"
                                value={searchText}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    setSearchText(input);
                                    setShowSuggestions(true);

                                    const exactMatch = touristObjects.find(
                                        (obj) => obj.name.toLowerCase() === input.toLowerCase()
                                    );

                                    if (exactMatch) {
                                        setSelectedObjectId(exactMatch.id);
                                        setShowSuggestions(false);
                                    } else {
                                        setSelectedObjectId(null);
                                        setShowSuggestions(true);
                                    }
                                }}
                                placeholder="Почніть вводити назву"
                                autoComplete="off"
                            />
                        </div>
                        <div className='add-publication_card-field-list'>
                            {filteredObjects.length > 0 && showSuggestions && (
                                <ul className="autocomplete-suggestions">
                                    {filteredObjects.map((obj) => (
                                        <li
                                            key={obj.id}
                                            onClick={() => {
                                                setSearchText(obj.name);
                                                setSelectedObjectId(obj.id);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            {obj.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                    </div>

                    <button type="submit" className="add-publication_card-button">
                        Додати публікацію
                    </button>
                </form>
            </div>
            {error && (
                <div className="form-error-message">
                    {error}
                </div>
            )}

            {successMessage &&
                <div className="form-success-message">{successMessage}</div>
            }

        </div>
    );
}

export default AddPublicationPage;