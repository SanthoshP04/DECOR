import React, { memo, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import ReviewCard from './ReviewCard';
import { useDispatch } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import { newReview } from '../../store/actions/productAction';
import { RiStarFill, RiStarLine } from 'react-icons/ri';
import './ProductDetailsTab.css'; 

const ProductDetailsTab = memo((props) => {
    const dispatch = useDispatch();
    const { 
        tabContainerRef, 
        product, 
       
        id, 
        activeTab, 
        setActiveTab, 
        submitReviewToggle, 
        open, 
        setOpen 
    } = props;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        // Smooth scroll to tab content
        tabContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    const submitReviewHandler = () => {
        const reviewForm = new FormData();
        reviewForm.set("rating", rating);
        reviewForm.set("comment", comment);
        reviewForm.set("productId", id);

        dispatch(newReview(reviewForm));
        setRating(0);
        setComment("");
        setOpen("d-none");
    };

    // Custom star icons for ReactStars
    const customStars = {
        size: 30,
        count: 5,
        color: "#ddd",
        activeColor: "#ffc107",
        emptyIcon: <RiStarLine />,
        filledIcon: <RiStarFill />,
    };

    return (
        <Stack ref={tabContainerRef} className="product-details-tab my-5">
            <Container className="py-5">
                <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                    <Nav variant="tabs" className="product-details-nav mb-4">
                        <Nav.Item>
                            <Nav.Link 
                                eventKey="tab1" 
                                className={`tab-link ${activeTab === 'tab1' ? 'active' : ''}`}
                            >
                                <span className="tab-link-text">Description</span>
                                <span className="tab-link-underline"></span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link 
                                eventKey="tab2" 
                                className={`tab-link ${activeTab === 'tab2' ? 'active' : ''}`}
                            >
                                <span className="tab-link-text">Reviews ({product?.reviews?.length || 0})</span>
                                <span className="tab-link-underline"></span>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content className="tab-content-wrapper">
                        <Tab.Pane eventKey="tab1" className="tab-pane fade">
                            <div className="product-description">
                                <h3 className="description-title">Product Details</h3>
                                <p className="description-text" style={{ whiteSpace: "pre-line" }}>
                                    {product?.description}
                                </p>
                                
                                {product?.features && (
                                    <div className="product-features mt-4">
                                        <h4 className="features-title">Key Features</h4>
                                        <ul className="features-list">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="feature-item">
                                                    <span className="feature-icon">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="tab2" className="tab-pane fade">
                            <div className={`review-form-container ${open}`}>
                                <h3 className="review-form-title">Write a Review</h3>
                                <div className="rating-section">
                                    <h5 className="rating-title">Overall Rating</h5>
                                    <ReactStars 
                                        {...customStars} 
                                        value={rating} 
                                        onChange={ratingChanged} 
                                        edit={true} 
                                        classNames="rating-stars"
                                    />
                                </div>
                                
                                <div className="review-text-section">
                                    <h5 className="review-text-title">Your Review</h5>
                                    <Form.Control
                                        as="textarea"
                                        className="review-textarea"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience with this product..."
                                    />
                                </div>
                                
                                <div className="review-buttons">
                                    <Button 
                                        variant="primary" 
                                        className="submit-button"
                                        onClick={submitReviewHandler}
                                        disabled={!rating || !comment}
                                    >
                                        Submit Review
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="cancel-button"
                                        onClick={submitReviewToggle}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>

                            <div className="reviews-section">
                                <h3 className="reviews-title">
                                    Customer Reviews {product?.reviews?.length > 0 && `(${product.reviews.length})`}
                                </h3>
                                
                                {product?.reviews?.[0] ? (
                                    <Stack gap={4} className="reviews-list">
                                        {product.reviews.map((review, index) => (
                                            <ReviewCard key={index} review={review} />
                                        ))}
                                    </Stack>
                                ) : (
                                    <div className="no-reviews">
                                        <div className="no-reviews-icon">✍️</div>
                                        <h5 className="no-reviews-text">No reviews yet</h5>
                                        <p className="no-reviews-subtext">Be the first to share your thoughts!</p>
                                        <Button 
                                            variant="outline-primary" 
                                            className="write-first-review"
                                            onClick={submitReviewToggle}
                                        >
                                            Write the first review
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>
        </Stack>
    );
});

export default ProductDetailsTab;// import React, { memo, useState } from 'react';
// import Container from 'react-bootstrap/esm/Container';
// import Stack from 'react-bootstrap/Stack';
// import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Tab from 'react-bootstrap/Tab';
// import Button from 'react-bootstrap/Button';
// import ReviewCard from './ReviewCard';
// import { useDispatch } from 'react-redux';
// import ReactStars from "react-rating-stars-component";
// import { newReview } from '../../store/actions/productAction';

// const ProductDetailsTab = memo((props) => {

//     const dispatch = useDispatch();

//     const { tabContainerRef, product, options, id, activeTab, setActiveTab, submitReviewToggle, open, setOpen } = props;

//     const [rating, setRating] = useState(0);
//     const [comment, setComment] = useState("");

//     const handleTabSelect = (tab) => {
//         setActiveTab(tab);
//     };

//     const ratingChanged = (newRating) => {
//         setRating(newRating);
//     };

//     const submitReviewHandler = () => {
//         const reviewForm = new FormData();

//         reviewForm.set("rating", rating);
//         reviewForm.set("comment", comment);
//         reviewForm.set("productId", id);

//         dispatch(newReview(reviewForm));
//         setRating(0);
//         setComment("");
//         setOpen("d-none");
//     };

//     return (
//         <>
//             <Stack ref={tabContainerRef} className="product-details-info bg-gray-200-color my-5">
//                 <Container className="py-5">
//                     <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
//                         <Nav variant="tabs" className="home-products-tab justify-content-center justify-content-md-start flex-column flex-md-row border-0 mb-4">
//                             <Nav.Item>
//                                 <Nav.Link eventKey="tab1" className="border-0 font-lato text-center my-2 mx-0 mx-md-3 bg-transparent">Description</Nav.Link>
//                             </Nav.Item>
//                             <Nav.Item>
//                                 <Nav.Link eventKey="tab2" className="border-0 font-lato text-center my-2 mx-0 mx-md-3 bg-transparent">Reviews</Nav.Link>
//                             </Nav.Item>
//                         </Nav>

//                         <Tab.Content>
//                             <Tab.Pane eventKey={"tab1"} className="overflow-auto">
//                                 <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
//                             </Tab.Pane>
//                             <Tab.Pane eventKey={"tab2"} className="overflow-auto">
//                                 <Stack className={`mb-5 ${open}`}>
//                                     <h4>Create Review</h4>
//                                     <h5 className="mt-3">Overall rating</h5>
//                                     <ReactStars {...options} value={rating} onChange={ratingChanged} edit={true} />
//                                     <h5 className="mt-3">Add a written review</h5>
//                                     <Form.Control
//                                         as="textarea"
//                                         cols={30}
//                                         rows={5}
//                                         value={comment}
//                                         onChange={(e) => setComment(e.target.value)}
//                                     />
//                                     <Stack className="flex-column flex-md-row my-3">
//                                         <Button className="my-2 my-md-0 me-md-2 bg-secondary-color border-0 rounded-0" onClick={submitReviewHandler}>Submit</Button>
//                                         <Button className="my-2 my-md-0 bg-secondary-color border-0 rounded-0" onClick={submitReviewToggle}>Cancel</Button>
//                                     </Stack>
//                                 </Stack>

//                                 {
//                                     product.reviews && product.reviews[0] ?
//                                         <Stack className="reviews">
//                                             {
//                                                 product.reviews &&
//                                                 product.reviews.map((review, index) => <ReviewCard key={index} review={review} />)
//                                             }
//                                         </Stack> :
//                                         <span className="fw-bold">No reviews</span>
//                                 }
//                             </Tab.Pane>
//                         </Tab.Content>
//                     </Tab.Container>
//                 </Container>
//             </Stack>
//         </>
//     )
// });

// export default ProductDetailsTab;
