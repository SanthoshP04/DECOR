import React, { useEffect, useMemo, useCallback } from 'react';
import "./Home.css";
import MetaData from '../MetaData';
import Stack from 'react-bootstrap/esm/Stack';
import Carousels from "./Carousels";
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import { getAllProducts } from '../../store/actions/productAction';
import { getAllOrders } from '../../store/actions/orderAction';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import HomeProductCards from './HomeProductCards';
import LatestProductsTabs from './LatestProductsTabs';
import DiscountProductsTabs from './DiscountProductsTabs';
import BlogCards from './BlogCards';
import LatestTrendingProducts from './LatestTrendingProducts';

// Utility function to create product slugs
const createProductSlug = (productName) => {
    if (!productName) return 'product';
    return productName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

// Enhanced HomeProductCards component with proper navigation
const EnhancedHomeProductCards = ({ product, styles }) => {
    const navigate = useNavigate();

    const handleProductClick = (e) => {
        e.preventDefault();
        if (product && product._id) {
            const slug = createProductSlug(product.name);
            navigate(`/product/${slug}/${product._id}`);
        }
    };

    if (!product) return null;

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card 
                className="h-100 product-card border-0 shadow-sm"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={handleProductClick}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <div className="position-relative overflow-hidden">
                    <Card.Img 
                        variant="top" 
                        src={product.images && product.images[0] ? product.images[0].url : '/assets/placeholder.jpg'}
                        alt={product.name}
                        className="img-fluid"
                        style={{ height: '200px', objectFit: 'cover' }}
                        loading="lazy"
                    />
                    {product.discount > 0 && (
                        <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                            -{product.discount}%
                        </span>
                    )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                    <Card.Title 
                        className={`${styles?.[0]?.cardTitleColor || 'text-dark'} ${styles?.[0]?.cardTitleSize || 'h6'} mb-2`}
                        style={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {product.name}
                    </Card.Title>
                    
                    <Card.Text 
                        className={`${styles?.[0]?.cardTextColor || 'text-muted'} ${styles?.[0]?.cardTextSize || 'small'} mb-3`}
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {product.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                {product.originalPrice && product.originalPrice > product.price && (
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
                                <span className="small">{product.ratings || 0}</span>
                            </div>
                        </div>
                        
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(e);
                            }}
                        >
                            View Details
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.products);
    const { isAuthenticated } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.allOrders);

    const styles = useMemo(() => [
        {
            "featuredProductsStyles": [
                {
                    "cardTitleColor": "text-secondary-color",
                    "cardTitleSize": "font-18",
                    "cardTextColor": "text-blue-300-color",
                    "cardTextSize": "font-17"
                }
            ],
            "trendingProductsStyles": [
                {
                    "cardTitleColor": "text-primary-color",
                    "cardTitleSize": "font-16",
                    "cardTextColor": "text-primary-color",
                    "cardTextSize": "font-14"
                }
            ],
        }
    ], []);

    const trendingCards = useMemo(() => [
        {
            image: "/assets/content/hekto-latest-trending-chair-offer.webp",
            alt: "23% off on chairs offer",
            title: "23% off on Chairs",
            link: "Shop Now",
            bgColor: "bg-pink-200-color"
        },
        {
            image: "/assets/content/hekto-latest-trending-tv-offer.webp",
            alt: "50% off on TV units offer",
            title: "50% off on Tv Units",
            link: "View Collection",
            bgColor: "bg-purple-100-color"
        },
        {
            image: "/assets/content/hekto-latest-trending-sofa-offer.webp",
            alt: "70% off on sofas offer",
            title: "70% off on Sofas",
            link: "View Sofas",
            bgColor: "bg-green-200-color"
        },
    ], []);

    // Filter and sort products
    const filteredRatingProducts = useMemo(() => 
        products?.filter(product => product.ratings > 3) || []
    , [products]);

    const latestProducts = useMemo(() => 
        [...(products || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    , [products]);

    const bestSellerProducts = useMemo(() => {
        if (!products || !orders) return [];
        
        return [...products].map(product => {
            const totalQuantitySold = orders.reduce((quantitySold, order) => {
                return quantitySold + order.orderItems.reduce((subtotal, item) => {
                    return item.product === product._id ? subtotal + item.quantity : subtotal;
                }, 0);
            }, 0);
            return { ...product, totalQuantitySold };
        }).sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
    }, [products, orders]);

    // Generate carousel items with useCallback
    const generateCarouselItems = useCallback((products, useEnhanced = false) => {
        if (!products?.length) return [];
        
        const itemsPerSlide = window.innerWidth > 1143 ? 4 : 
                             window.innerWidth > 858 ? 3 : 
                             window.innerWidth > 576 ? 2 : 1;
        
        const totalSlides = Math.ceil(products.length / itemsPerSlide);
        
        return Array.from({ length: totalSlides }, (_, slideNumber) => {
            const startIndex = slideNumber * itemsPerSlide;
            const slideProducts = products.slice(startIndex, startIndex + itemsPerSlide);
            
            return (
                <Carousel.Item key={slideNumber}>
                    <Row className="mb-5 pb-4 justify-content-center">
                        {slideProducts.map((product) => 
                            useEnhanced ? (
                                <EnhancedHomeProductCards 
                                    key={product._id} 
                                    product={product} 
                                    styles={styles[0].featuredProductsStyles} 
                                />
                            ) : (
                                <HomeProductCards 
                                    key={product._id} 
                                    product={product} 
                                    styles={styles[0].featuredProductsStyles} 
                                />
                            )
                        )}
                    </Row>
                </Carousel.Item>
            );
        });
    }, [styles]);

    useEffect(() => {
        dispatch(getAllProducts());
        if (isAuthenticated) {
            dispatch(getAllOrders());
        }
    }, [dispatch, isAuthenticated]);

    const featuredCarouselItems = useMemo(() => 
        generateCarouselItems(filteredRatingProducts, true)
    , [filteredRatingProducts, generateCarouselItems]);

    // Handle trending card clicks
    const handleTrendingCardClick = (e) => {
        e.preventDefault();
        navigate('/products');
    };

    return (
        <>
            <MetaData title={"Online Furniture Shopping Store: Shop Online in India for Furniture, Home Decor, Homeware Products @Hekto"} />
            
            <Carousels />

            <Container>
                <Stack className="mt-5 pt-5">
                    <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Featured Products</h2>
                    {featuredCarouselItems.length ? (
                        <Carousel className="featured-products-carousel" controls={true} indicators={true}>
                            {featuredCarouselItems}
                        </Carousel>
                    ) : (
                        <div className="text-center p-5">
                            <span className="text-muted font-20">No featured products available</span>
                        </div>
                    )}
                </Stack>

                <Stack className="mt-5 pt-5">
                    <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Latest Products</h2>
                    <LatestProductsTabs 
                        latestProducts={latestProducts} 
                        bestSellerProducts={bestSellerProducts} 
                        filteredRatingProducts={filteredRatingProducts} 
                        createProductSlug={createProductSlug}
                    />
                </Stack>
            </Container>

            <Stack className="latest-trending-product mt-5 pt-5 bg-gray-400-color">
                <Container>
                    <Row className="align-items-center">
                        <LatestTrendingProducts products={products} createProductSlug={createProductSlug} />
                    </Row>
                </Container>
            </Stack>

            <Container>
                <Stack className="trending-products mt-5 pt-5">
                    <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Trending Products</h2>
                    
                    {bestSellerProducts.length ? (
                        <>
                            <Row className="justify-content-center g-4 mb-4">
                                {bestSellerProducts.slice(0, 4).map((product) => (
                                    <EnhancedHomeProductCards 
                                        key={product._id} 
                                        product={product} 
                                        styles={styles[0].trendingProductsStyles} 
                                    />
                                ))}
                            </Row>
                            <Row xs={1} md={2} lg={3} className="justify-content-center g-4 mt-3">
                                {trendingCards.map((data, index) => (
                                    <Col key={index}>
                                        <Stack 
                                            className={`trending-product-offers-card ${data.bgColor} p-4 position-relative`}
                                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                            onClick={handleTrendingCardClick}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <span className="font-26 text-primary-color">{data.title}</span>
                                            <span className="font-16 font-lato fw-semibold text-secondary-color" style={{ cursor: 'pointer' }}>
                                                {data.link}
                                            </span>
                                            <img
                                                className="d-block img-fluid trending-product-offers-chair"
                                                src={process.env.PUBLIC_URL + data.image}
                                                alt={data.alt}
                                                loading="lazy"
                                            />
                                        </Stack>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    ) : (
                        <div className="text-center p-5">
                            <span className="text-muted font-20 mb-5">No trending products available</span>
                        </div>
                    )}
                </Stack>

                <Stack className="mt-5 pt-5 discount-products-tab">
                    <h2 className="mb-0 fs-1 fw-bold text-center text-blue-700-color">Discounted Products</h2>
                    <DiscountProductsTabs createProductSlug={createProductSlug} />
                </Stack>
            </Container>

            <Stack className="mt-5 pt-5 newsletter-section justify-content-center align-items-center">
                <span className="font-35 fw-bold text-primary-color text-center">
                    Get Latest Update By Subscribing to
                    <br className="d-none d-md-block" />&nbsp;Our Newsletter
                </span>
                <Button 
                    as={Link} 
                    to="/products" 
                    className="bg-secondary-color border-0 rounded-0 fw-semibold d-flex align-items-center justify-content-center mt-2"
                    aria-label="Shop now"
                >
                    Shop Now
                </Button>
            </Stack>

            <Container>
                <Stack className="home-blog-cards my-5 py-5">
                    <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Latest Blogs</h2>
                    <Row xs={1} sm={2} md={3} className="justify-content-center g-4">
                        <BlogCards />
                    </Row>
                </Stack>
            </Container>
        </>
    );
};

export default Home;
// import React, { useEffect } from 'react';
// import "./Home.css";
// import MetaData from '../MetaData';
// import Stack from 'react-bootstrap/esm/Stack';
// import Carousels from "./Carousels";
// import Container from 'react-bootstrap/esm/Container';
// import Button from 'react-bootstrap/Button';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Carousel from 'react-bootstrap/Carousel';
// import { getAllProducts } from '../../store/actions/productAction';
// import { getAllOrders } from '../../store/actions/orderAction';
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from 'react-router-dom';
// import HomeProductCards from './HomeProductCards';
// import LatestProductsTabs from './LatestProductsTabs';
// import DiscountProductsTabs from './DiscountProductsTabs';
// import BlogCards from './BlogCards';
// import LatestTrendingProducts from './LatestTrendingProducts';

// const Home = () => {
//     const dispatch = useDispatch();

//     const { products } = useSelector(
//         (state) => state.products
//     );
//     const { isAuthenticated } = useSelector((state) => state.user);

//     const { orders } = useSelector(
//         (state) => state.allOrders
//     );

//     const styles = [
//         {
//             "featuredProductsStyles": [
//                 {
//                     "cardTitleColor": "text-secondary-color",
//                     "cardTitleSize": "font-18",
//                     "cardTextColor": "text-blue-300-color",
//                     "cardTextSize": "font-17"
//                 }
//             ],
//             "trendingProductsStyles": [
//                 {
//                     "cardTitleColor": "text-primary-color",
//                     "cardTitleSize": "font-16",
//                     "cardTextColor": "text-primary-color",
//                     "cardTextSize": "font-14"
//                 }
//             ],
//         }
//     ];

//     const trendingCards = [
//         {
//             image: "/assets/content/hekto-latest-trending-chair-offer.webp",
//             alt: "hekto-latest-trending-chair-offer",
//             title: "23% off on Chairs",
//             link: "Shop Now",
//             bgColor: "bg-pink-200-color"
//         },
//         {
//             image: "/assets/content/hekto-latest-trending-tv-offer.webp",
//             alt: "hekto-latest-trending-tv-offer",
//             title: "50% off on Tv Units",
//             link: "View Collection",
//             bgColor: "bg-purple-100-color"
//         },
//         {
//             image: "/assets/content/hekto-latest-trending-sofa-offer.webp",
//             alt: "hekto-latest-trending-sofa-offer",
//             title: "70% off on Sofas",
//             link: "View Sofas",
//             bgColor: "bg-green-200-color"
//         },
//     ]

//     // Filter featured products to show ratings above 4
//     const filteredRatingProducts = products && products.filter(product => product.ratings > 3);

//     // Filter products to show latest products
//     const latestProducts = products && products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Filter products to show best seller products
//     // Calculate the total quantity sold for each product
//     const productQuantitySold = products && products.reduce((result, product) => {
//         const totalQuantitySold = orders && orders.reduce((quantitySold, order) => {
//             const orderQuantitySold = order.orderItems.reduce((subtotal, item) => {
//                 if (item.product === product._id) {
//                     return subtotal + item.quantity;
//                 }
//                 return subtotal;
//             }, 0);
//             return quantitySold + orderQuantitySold;
//         }, 0);

//         return [...result, { ...product, totalQuantitySold }];
//     }, []);

//     // Sort products based on totalQuantitySold in descending order
//     const bestSellerProducts = productQuantitySold.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);

//     // For product slideshow
//     function generateCarouselItems(products) {
//         const items = [];
//         let totalSlides;
//         if (window.innerWidth > 1143) {
//             totalSlides = Math.ceil(products.length / 4);
//         } else if (window.innerWidth > 858) {
//             totalSlides = Math.ceil(products.length / 3);
//         }
//         else if (window.innerWidth > 576) {
//             totalSlides = Math.ceil(products.length / 2);
//         } else {
//             totalSlides = Math.ceil(products.length / 1);
//         }

//         for (let slideNumber = 0; slideNumber < totalSlides; slideNumber++) {
//             let startIndex;
//             let endIndex;
//             if (window.innerWidth > 1143) {
//                 startIndex = slideNumber * 4;
//                 endIndex = startIndex + 4;
//             } else if (window.innerWidth > 858) {
//                 startIndex = slideNumber * 3;
//                 endIndex = startIndex + 3;
//             }
//             else if (window.innerWidth > 576) {
//                 startIndex = slideNumber * 2;
//                 endIndex = startIndex + 2;
//             }
//             else {
//                 startIndex = slideNumber * 1;
//                 endIndex = startIndex + 1;
//             }
//             const slideProducts = products.slice(startIndex, endIndex);

//             items.push(
//                 <Carousel.Item key={slideNumber} active={(slideNumber === 0).toString()}>
//                     <Row className="mb-5 pb-4 justify-content-center">
//                         {
//                             slideProducts.map((product) => (
//                                 <HomeProductCards key={product._id} product={product} styles={styles[0].featuredProductsStyles} />
//                             ))
//                         }
//                     </Row>
//                 </Carousel.Item>
//             );
//         }

//         return items;
//     };

//     useEffect(() => {
//         dispatch(getAllProducts());

//         if (isAuthenticated) {
//             dispatch(getAllOrders());
//         }
//     }, [dispatch, isAuthenticated]);

//     return (
//         <>
//             {/* Title tag */}
//             <MetaData title={"Online Furniture Shopping Store: Shop Online in India for Furniture, Home Decor, Homeware Products @Hekto"} />

//             {/* Carousel Banners */}
//             <Carousels />

//             {/* Products */}
//             <Container>
//                 <Stack className="mt-5 pt-5">
//                     <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Featured Products</h2>

//                     {
//                         generateCarouselItems(filteredRatingProducts).length === 0 ?
//                             <span className="text-center text-dark font-20">No products to show</span>
//                             :
//                             <Carousel className="featured-products-carousel">
//                                 {generateCarouselItems(filteredRatingProducts)}
//                             </Carousel>
//                     }
//                 </Stack>

//                 <Stack className="mt-5 pt-5">
//                     <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Latest Products</h2>

//                     <LatestProductsTabs latestProducts={latestProducts} bestSellerProducts={bestSellerProducts} filteredRatingProducts={filteredRatingProducts} />
//                 </Stack>
//             </Container>

//             <Stack className="latest-trending-product mt-5 pt-5 bg-gray-400-color">
//                 <Container>
//                     <Row className="align-items-center">
//                         <LatestTrendingProducts products={products} />
//                     </Row>
//                 </Container>
//             </Stack >

//             <Container>
//                 <Stack className="trending-products mt-5 pt-5">
//                     <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Trending Products</h2>

//                     {
//                         bestSellerProducts.length === 0 ?
//                             <span className="text-center text-dark font-20 mb-5">No products to show</span>
//                             :
//                             <Row md={3} lg={4} className="justify-content-center g-4">
//                                 {
//                                     bestSellerProducts && bestSellerProducts.slice(0, 4).map((product) => {
//                                         return (
//                                             <HomeProductCards key={product._id} product={product} styles={styles[0].trendingProductsStyles} />
//                                         )
//                                     })
//                                 }
//                             </Row>
//                     }
//                     <Row xs={1} md={2} lg={3} className="justify-content-center g-4 mt-3">
//                         {
//                             trendingCards && trendingCards.map((data, index) => {
//                                 return (
//                                     <Col key={index}>
//                                         <Stack className={`trending-product-offers-card ${data.bgColor} p-4 position-relative`}>
//                                             <span className="font-26 text-primary-color">{data.title}</span>
//                                             <Link to="/products" className="font-16 font-lato fw-semibold text-secondary-color">{data.link}</Link>
//                                             <img
//                                                 className=" d-block img-fluid trending-product-offers-chair"
//                                                 src={process.env.PUBLIC_URL + data.image}
//                                                 alt={data.alt}
//                                             />
//                                         </Stack>
//                                     </Col>
//                                 )
//                             })
//                         }
//                     </Row>
//                 </Stack>

//                 <Stack className="mt-5 pt-5 discount-products-tab">
//                     <h2 className="mb-0 fs-1 fw-bold text-center text-blue-700-color">Discounted Products</h2>

//                     <DiscountProductsTabs />
//                 </Stack>
//             </Container>

//             <Stack className="mt-5 pt-5 newsletter-section justify-content-center align-items-center">
//                 <span className="font-35 fw-bold text-primary-color text-center">Get Latest Update By Subscribing to
//                     <br className="d-none d-md-block" />&nbsp;0ur Newslater</span>
//                 <Button as={Link} to="/products" className=" bg-secondary-color border-0 rounded-0 fw-semibold d-flex align-items-center justify-content-center mt-2">
//                     Shop Now
//                 </Button>
//             </Stack>

//             <Container>
//                 <Stack className="home-blog-cards my-5 py-5">
//                     <h2 className="mb-5 fs-1 fw-bold text-center text-blue-700-color">Latest Blogs</h2>

//                     <Row xs={1} sm={2} md={3} className="justify-content-center g-4">
//                         <BlogCards />
//                     </Row >
//                 </Stack>
//             </Container>
//         </>
//     )
// }

// export default Home;
