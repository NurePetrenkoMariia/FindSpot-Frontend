import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PublicationDetailsPage.css";
import ReactModal from 'react-modal';

function PublicationDetailsPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [touristObject, setTouristObject] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ content: '', rating: 0 });


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

               /* const reviewsResponse = await axios.get(`/api/Reviews/blog/${id}`);
                setReviews(reviewsResponse.data);*/
            } catch (error) {
                console.error("Помилка при завантаженні даних:", error);
            }
        };

        fetchData();
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (!post) {
        return <div className="details-page__loading">Завантаження...</div>;
    }

    return (
        <div className="details-page">
            <div className="details-page_card">
                <div className="details-page_header">
                    <div>
                        <h2 className="details-page_title">{post.pageTitle}</h2>
                        <p className="details-page_date">
                            {new Date(post.publishedDate).toLocaleDateString()}
                        </p>
                    </div>
                    <button className="details-page_save-btn">Зберегти</button>
                </div>

                <div className="details-page_tags">
                    {post.tags?.map((tag, index) => (
                        <span key={index} className="details-page_tag">
                            {tag.name}
                        </span>
                    ))}
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
                <button /*onClick={handleReviewSubmit}*/>Зберегти</button>
                <button onClick={closeModal}>Скасувати</button>
            </ReactModal>
        </div>

        </div >
    );
}

export default PublicationDetailsPage;
