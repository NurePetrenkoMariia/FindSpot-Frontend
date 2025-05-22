import './AddPublicationPage.css';
import React, { useState, useEffect } from "react";

const fakeTouristObjects = [
    { id: 1, name: "Ейфелева вежа" },
    { id: 2, name: "Великий Британський музей" },
    { id: 3, name: "Піраміди в Єгипті" },
    { id: 4, name: "Тауерський міст" },
    { id: 5, name: "Колізей" },
    { id: 6, name: "Собор Святого Петра" },
];

function AddPublicationPage() {
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [touristObjects, setTouristObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setTouristObjects(fakeTouristObjects);
    }, []);

    const filteredObjects = touristObjects.filter(obj =>
        obj.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleFileChange = async (e) => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();

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
            title,
            imageUrl,
            description,
            tags: tags.split(",").map(t => t.trim()).filter(t => t.length > 0),
            touristObjectId: exactMatch.id,
        };

        // POST-запит 
        console.log("Нова публікація:", newPublication);

        setTitle("");
        setImageUrl("");
        setDescription("");
        setTags("");
        setSelectedObjectId(null);
        setSearchText("");
        setError("");
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
                            //required
                            />
                        </label>
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

        </div>
    );
}

export default AddPublicationPage;