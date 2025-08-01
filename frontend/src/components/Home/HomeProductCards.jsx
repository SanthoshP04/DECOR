import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const HomeProductCard = ({ product, styles = [] }) => {
    const navigate = useNavigate();

    const handleClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product?._id) {
            navigate(`/products/${product._id}`);  // Updated URL path
        }
    }, [navigate, product]);

    if (!product) return null;

    const hasDiscount = product.discount > 0;
    const hasOriginalPrice = product.originalPrice > product.price;
    const rating = product.ratings || 0;

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card 
                className="h-100 product-card border-0 shadow-sm"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={handleClick}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <div className="position-relative overflow-hidden">
                    <Card.Img 
                        variant="top" 
                        src={product.images?.[0]?.url || '/assets/placeholder.jpg'}
                        alt={product.name || 'Product image'}
                        className="img-fluid"
                        style={{ height: '200px', objectFit: 'cover' }}
                        loading="lazy"
                    />
                    {hasDiscount && (
                        <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                    <Card.Title className={`${styles[0]?.cardTitleColor || 'text-dark'} ${styles[0]?.cardTitleSize || 'h6'} mb-2`}>
                        {product.name}
                    </Card.Title>
                    
                    <Card.Text className={`${styles[0]?.cardTextColor || 'text-muted'} ${styles[0]?.cardTextSize || 'small'} mb-3`}>
                        {product.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                {hasOriginalPrice && (
                                    <span className="text-muted text-decoration-line-through me-2">
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                                <span className="fw-bold text-primary">
                                    ₹{product.price}
                                </span>
                            </div>
                            
                            <div className="d-flex align-items-center">
                                <span className="text-warning me-1">★</span>
                                <span className="small">{rating}</span>
                            </div>
                        </div>
                        
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="w-100"
                            onClick={handleClick}
                        >
                            View Details
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

HomeProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        originalPrice: PropTypes.number,
        discount: PropTypes.number,
        ratings: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string
        }))
    }),
    styles: PropTypes.arrayOf(PropTypes.shape({
        cardTitleColor: PropTypes.string,
        cardTitleSize: PropTypes.string,
        cardTextColor: PropTypes.string,
        cardTextSize: PropTypes.string
    }))
};

export default HomeProductCard;
// import React from 'react';
// import "./HomeProductCards.css";
// import Card from 'react-bootstrap/Card';
// import Stack from 'react-bootstrap/esm/Stack';
// import ReactStars from "react-rating-stars-component";
// import { Link } from 'react-router-dom';
// import Col from 'react-bootstrap/esm/Col';

// const HomeProductCards = ({ product, styles }) => {

//     const options = {
//         color: "rgb(20,20,20,0.1)",
//         activeColor: "tomato",
//         size: window.innerWidth < 600 ? 20 : 25,
//         isHalf: true
//     };

//     return (
//         <>
//             {
//                 product ?
//                     styles && styles.map((style, index) => {
//                         return (
//                             <Col key={index}>
//                                 <Card className="home-product-cards text-decoration-none border-0 card-shadow p-0 font-lato text-center mx-auto" as={Link} to={`/product/${product._id}`}>
//                                     <Card.Img variant="top" src={product.images[0].url} alt={product.name} className="card-image m-auto object-fit-contain" />
//                                     <Card.Body className="text-dark">
//                                         <Card.Title className={`text-overflow fw-bold  my-2 ${style.cardTitleColor} ${style.cardTitleSize}`}>{product.name}</Card.Title>
//                                         <Stack className="home-product-stars">
//                                             <ReactStars {...options} value={product.ratings} edit={false} />
//                                         </Stack>
//                                         <Card.Text>
//                                             ₹<span className={`${style.cardTextColor} ${style.cardTextSize}`}>{product.price}</span>
//                                         </Card.Text>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>
//                         )
//                     })
//                     :
//                     <span className="text-center text-dark font-20">No products to show</span>
//             }
//         </>
//     )
// }

// export default HomeProductCards;
