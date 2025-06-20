import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../helpers/AuthHelper';
import { useParams } from "react-router-dom";
import "./PublicationDetailsPage.css";
import ReactModal from 'react-modal';
import { useNavigate } from "react-router-dom";

function PublicationDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [touristObject, setTouristObject] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ content: '', rating: 0, featuredImageUrl: null });
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reviewBeingEdited, setReviewBeingEdited] = useState(null);
    const [checkedLists, setCheckedLists] = useState({
        wantToVisit: false,
        visited: false,
    });
    const { user, isLoggedIn } = useAuth();
    const userId = user?.id;

    const handleSaveToList = async () => {
        if (!isLoggedIn || !userId) {
            alert("Щоб зберегти, увійдіть в акаунт");
            return;
        }

        try {
            const requests = [];
            if (checkedLists.wantToVisit) {
                const data = {
                    userId: user.id.toString(),
                    blogPostId: post.id,
                    status: 'wantToVisit'
                };
                console.log("Відправка WantToVisit:", data);
                requests.push(
                    axios.post('/api/UserBlogPost/add', data, {
                        withCredentials: true
                    })
                );
            }
            if (checkedLists.visited) {
                requests.push(axios.post('/api/UserBlogPost/add', {
                    userId: user.id.toString(),
                    blogPostId: post.id,
                    status: 'visited'
                }));
            }

            await Promise.all(requests);
            alert("Додано до списку!");
            closeSaveModal();
        } catch (error) {
            console.error("Помилка при додаванні до списку", error);
            alert("Не вдалося додати до списку");
        }
    };

    const handleReviewSubmit = async () => {

        if (!isLoggedIn || !user) {
            alert("Щоб залишити коментар, увійдіть в акаунт");
            return;
        }

        if (newReview.content.length > 1500) {
            alert("Коментар не може перевищувати 1500 символів.");
            return;
        }

        try {
            const formData = {
                content: newReview.content,
                rating: newReview.rating,
                featuredImageUrl: newReview.featuredImageUrl || null
            };

            await sendReviewToServer(formData);
        } catch (error) {
            if (error.response?.status === 403 &&
                typeof error.response.data === 'string' &&
                error.response.data.includes("leave a review")) {
                alert("Ви можете залишити відгук лише про місця, які відвідали.");
            } else {
                console.error("Помилка при надсиланні відгуку:", error);
                alert(error.response?.data || "Не вдалося залишити коментар");
            }
        }
    }

    const sendReviewToServer = async (data) => {
        console.log("Дані, які надсилаються на сервер:", data);
        try {
            const response = await axios.post(`/api/Reviews/${post.id}`, data, {
                withCredentials: true
            });

            if (newReview.featuredImageUrl && !user.accountVerified) {
                alert("Лише верифіковані користувачі можуть додавати фото до коментарів.");
                return;
            }

            setReviews([...reviews, response.data]);
            closeModal();
            setNewReview({ content: '', rating: 0, featuredImageUrl: null });
            alert("Коментар додано успішно");
        } catch (error) {
            if (error.response?.status === 403) {
                alert("Ви можете залишити відгук лише про місця, які відвідали.");
            } else {
                console.error("Помилка при надсиланні:", error);
                alert(error.response?.data || "Сталася помилка");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postResponse = await axios.get(`/api/BlogPosts/${id}`);
                setPost(postResponse.data);
                console.log("Дані публікації:", postResponse.data);

                if (postResponse.data.touristObjectId) {
                    const objectResponse = await axios.get(`/api/TouristObjects/${postResponse.data.touristObjectId}`);
                    setTouristObject(objectResponse.data);
                }

                const reviewsResponse = await axios.get(`/api/Reviews/blog/${id}`);
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Помилка при завантаженні даних:", error);
            }
        };

        fetchData();
    }, [id]);

    const openSaveModal = () => setIsSaveModalOpen(true);
    const closeSaveModal = () => {
        setCheckedLists({ wantToVisit: false, visited: false });
        setIsSaveModalOpen(false);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openEditModal = (review) => {
        setReviewBeingEdited({ ...review });
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setReviewBeingEdited(null);
        setIsEditModalOpen(false);
    };

    if (!post) {
        return <div className="details-page__loading">Завантаження...</div>;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/api/Image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            setNewReview((prevForm) => ({
                ...prevForm,
                featuredImageUrl: res.data.link,
            }));
            setSelectedFile(null);
        } catch (error) {
            console.error('Помилка при завантаженні зображення:', error);
            alert('Не вдалося завантажити зображення');
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Ви дійсно хочете видалити цю публікацію?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/BlogPosts/${post.id}`, {
                withCredentials: true
            });

            alert("Публікацію видалено");
            navigate(`/posts`);
        } catch (error) {
            console.error("Помилка при видаленні публікації:", error);
            alert("Не вдалося видалити публікацію");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm("Ви дійсно хочете видалити цей коментар?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`/api/Reviews/${reviewId}`, {
                withCredentials: true
            });

            setReviews(reviews.filter(review => review.id !== reviewId));

            alert("Коментар видалено");

        }
        catch (error) {
            alert("Не вдалося видалити коментар!")
        }
    }

    const handleEditReviewSubmit = async () => {
        try {
            const updatedReview = {
                content: reviewBeingEdited.content,
                rating: reviewBeingEdited.rating,
                featuredImageUrl: reviewBeingEdited.featuredImageUrl,
            };

            await axios.put(`/api/Reviews/${reviewBeingEdited.id}`, updatedReview, {
                withCredentials: true
            });

            setReviews(reviews.map(r =>
                r.id === reviewBeingEdited.id ? { ...r, ...updatedReview } : r
            ));

            alert("Відгук оновлено успішно!");
            closeEditModal();
        }
        catch (error) {
            console.error("Помилка при редагуванні відгуку:", error);
            alert("Не вдалося оновити відгук");
        }
    }

    return (
        <div className="details-page">
            <ReactModal
                isOpen={isSaveModalOpen}
                onRequestClose={closeSaveModal}
                contentLabel="Додати в список"
                className="modal modal-lists"
                overlayClassName="modal-overlay"
            >
                <h2>Додати публікацію до списку</h2>
                <label>
                    <input
                        type="checkbox"
                        checked={checkedLists.wantToVisit}
                        onChange={(e) => setCheckedLists({ ...checkedLists, wantToVisit: e.target.checked })}
                    />
                    Хочу відвідати
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={checkedLists.visited}
                        onChange={(e) => setCheckedLists({ ...checkedLists, visited: e.target.checked })}
                    />
                    Відвідано
                </label>
                <div className="modal-lists-buttons">
                    <button onClick={closeSaveModal} className="lists-cancel-btn">Скасувати</button>
                    <button onClick={handleSaveToList} className="lists-save-btn">Зберегти</button>
                </div>
            </ReactModal>
            <div className="details-page_card">
                <div className="details-page_header">
                    <div>
                        <h2 className="details-page_title">{post.pageTitle}</h2>
                        <p className="details-page_date">
                            {new Date(post.publishedDate).toLocaleDateString()}
                        </p>
                    </div>
                    <button className="details-page_save-btn" onClick={openSaveModal}>Зберегти</button>
                </div>

                <div className="details-page_tags_buttons-section">
                    <div className="details-page_tags">
                        {post.tags?.map((tag, index) => (
                            <span key={index} className="details-page_tag">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                    {user && (
                        <div className="details-page__actions">
                            {user.id === post.userId && (
                                <>
                                    <button className="btn-post-edit" onClick={() => navigate(`/edit-publication/${post.id}`)}>Редагувати</button>
                                    <button className="btn-post-delete" onClick={handleDelete}>Видалити</button>
                                </>
                            )}

                            {(user.roles?.includes("Admin") || user.roles?.includes("Moderator")) && user.id !== post.userId && (
                                <button className="btn-post-delete" onClick={handleDelete}>Видалити</button>
                            )}
                        </div>
                    )}
                </div>
                <img
                    src={post.featuredImageUrl}
                    alt="Зображення публікації"
                    className="details-page_image"
                />

                {touristObject && (
                    <div className="details-page_object-info">
                        <h3>{touristObject.name}</h3>
                        <p>
                            <strong>Графік роботи:</strong>{" "}
                            {touristObject.openingTime.slice(0, 5)} –{" "}
                            {touristObject.closingTime.slice(0, 5)}
                        </p>
                        <p>
                            <strong>Адреса:</strong> {touristObject.city}, {touristObject.country},{" "}
                            {touristObject.address}
                        </p>
                    </div>
                )}

                <div className="details-page_content">
                    <p>{post.content}</p>
                </div>
            </div>
            <div className="details-page_reviews">
                <h3 className="details-page_reviews-title">Коментарі</h3>
                <button className="details-page_add-review-btn" onClick={openModal}>Додати коментар</button>

                {reviews.length === 0 ? (
                    <p>Коментарів ще немає</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            {console.log("Review:", review)}
                            <div className="review-card_header">
                                <strong>{review.userName || "Анонім"}</strong>
                                <span className="review-card_date">
                                    {new Date(review.dateAdded).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="review-card_rating">
                                {[...Array(5)].map((_, index) => (
                                    <span key={index} style={{ color: index < review.rating ? "#FFD700" : "#ccc" }}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="review-card_content">{review.content}</p>
                            {review.featuredImageUrl && (
                                <img
                                    src={review.featuredImageUrl}
                                    alt="Фото до коментаря"
                                    className="review-card_image"
                                />
                            )}
                            {user && (review.userId === user.id) && (
                                <div className="review-buttons-container">
                                    <button className="btn-post-delete" onClick={() => handleDeleteReview(review.id)}>
                                        Видалити
                                    </button>
                                    <button className="details-page_save-btn" onClick={() => openEditModal(review)}>
                                        Редагувати
                                    </button>
                                </div>
                            )}
                            {user && (review.userId != user.id && (user.roles?.includes("Admin") || user.roles?.includes("Moderator"))) && (
                                <div className="review-buttons-container">
                                    <button className="btn-post-delete" onClick={() => handleDeleteReview(review.id)}>
                                        Видалити
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                <ReactModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Додати коментар"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Напишіть свій коментар</h2>

                    <textarea
                        placeholder="Ваш коментар..."
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    />
                    {user?.accountVerified && (
                        <div className="review-image-upload">
                            <label>Фото:</label>
                            <input
                                type="file"
                                id="review-photo-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                    <div>
                        <label>Оцінка: </label>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                style={{
                                    cursor: 'pointer',
                                    color: star <= newReview.rating ? '#FFD700' : '#ccc',
                                    fontSize: '24px',
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <button onClick={closeModal}>Скасувати</button>
                    <button onClick={handleReviewSubmit} disabled={newReview.featuredImageUrl === null && selectedFile !== null}>Зберегти</button>
                </ReactModal>
                <ReactModal isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    contentLabel="Редагувати коментар"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Змініть свій коментар</h2>
                    {reviewBeingEdited && (
                        <>
                            <textarea
                                placeholder="Ваш коментар..."
                                value={reviewBeingEdited.content}
                                onChange={(e) => setReviewBeingEdited({ ...reviewBeingEdited, content: e.target.value })}
                            />
                            {user?.accountVerified && (
                                <div className="review-image-upload">
                                    <label>Фото:</label>
                                    <input
                                        type="file"
                                        id="review-photo-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            )}
                            <div>
                                <label>Оцінка: </label>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setReviewBeingEdited({ ...reviewBeingEdited, rating: star })}
                                        style={{
                                            cursor: 'pointer',
                                            color: star <= reviewBeingEdited.rating ? '#FFD700' : '#ccc',
                                            fontSize: '24px',
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <button onClick={closeEditModal}>Скасувати</button>
                            <button onClick={handleEditReviewSubmit} disabled={newReview.featuredImageUrl === null && selectedFile !== null}>Зберегти</button>
                        </>
                    )}
                </ReactModal>
            </div>
        </div >
    );
}

export default PublicationDetailsPage;
