import React, { useState } from 'react';
import "./LatestProductsTabs.css";
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const LatestProductsTabs = ({ latestProducts, bestSellerProducts, filteredRatingProducts }) => {
    const [activeTab, setActiveTab] = useState('tab1');
    const navigate = useNavigate();

    const tabs = [
        {
            tab: "tab1",
            name: "New Arrival",
            products: latestProducts
        },
        {
            tab: "tab2",
            name: "Best Seller",
            products: bestSellerProducts
        },
        {
            tab: "tab3",
            name: "Featured",
            products: filteredRatingProducts
        }
    ];

    const createProductSlug = (productName) => {
        return productName
            .toLowerCase()
            .replace(/[^a-z0-9\s-()]/g, '')  // Keep allowed characters
            .replace(/\s+/g, '-')            // Spaces to hyphens
            .replace(/-+/g, '-')             // Remove consecutive hyphens
            .replace(/^-|-$/g, '');          // Trim hyphens
    };

    const handleProductClick = (product) => {
        const slug = createProductSlug(product.name);
        navigate(`/product/${slug}/${product._id}`);
    };

    if (!latestProducts?.length && !bestSellerProducts?.length && !filteredRatingProducts?.length) {
        return <span className="text-center text-dark font-20">No products to show</span>;
    }

    return (
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="home-products-tab justify-content-center flex-column flex-md-row border-0 mb-4">
                {tabs.map((tab) => (
                    <Nav.Item key={tab.tab}>
                        <Nav.Link 
                            eventKey={tab.tab} 
                            className={`border-0 font-lato text-center my-2 mx-0 mx-md-3 ${activeTab === tab.tab ? 'active-tab' : ''}`}
                        >
                            {tab.name}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            <Tab.Content>
                {tabs.map((item) => (
                    <Tab.Pane key={item.tab} eventKey={item.tab}>
                        <Row className="mb-5 pb-4 justify-content-center g-4">
                            {item.products?.slice(0, 6).map(product => (
                                <Col key={product._id} xs={6} sm={4} md={4} lg={2}>
                                    <Card 
                                        className="home-latest-product-cards text-decoration-none border-0 p-0 m-auto h-100 d-flex flex-column"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className="card-image-wrapper">
                                            <img
                                                src={product.images?.[0]?.url || '/assets/placeholder.jpg'}
                                                alt={product.name}
                                                className="card-image"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = '/assets/placeholder.jpg';
                                                }}
                                            />
                                            {product.discount > 0 && (
                                                <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>
                                        <Card.Body className="text-dark d-flex flex-column justify-content-between px-2 pb-2 pt-2 flex-grow-0">
                                            <Card.Title 
                                                className="product-name text-center mb-1"
                                                style={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {product.name}
                                            </Card.Title>
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                {product.originalPrice > product.price && (
                                                    <span className="text-muted text-decoration-line-through">
                                                        ₹{product.originalPrice}
                                                    </span>
                                                )}
                                                <span className="font-16 text-blue-300-color fw-bold">
                                                    ₹{product.price}
                                                </span>
                                            </div>
                                            <Button 
                                                variant="primary" 
                                                size="sm" 
                                                className="w-100 mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProductClick(product);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Tab.Container>
    );
};

export default LatestProductsTabs;
// import React, { useState } from 'react';
// import "./LatestProductsTabs.css"
// import Nav from 'react-bootstrap/Nav';
// import Tab from 'react-bootstrap/Tab';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// import { Link } from 'react-router-dom';

// const LatestProductsTabs = ({ latestProducts, bestSellerProducts, filteredRatingProducts }) => {
//     const [activeTab, setActiveTab] = useState('tab1');

//     const handleTabSelect = (tab) => {
//         setActiveTab(tab);
//     };

//     const tabs = [
//         {
//             tab: "tab1",
//             products: latestProducts
//         },
//         {
//             tab: "tab2",
//             products: bestSellerProducts
//         },
//         {
//             tab: "tab3",
//             products: filteredRatingProducts
//         }
//     ];

//     return (
//         <>
//             {
//                 (latestProducts || bestSellerProducts || filteredRatingProducts).length === 0 ?
//                     <span className="text-center text-dark font-20">No products to show</span>
//                     :
//                     <Tab.Container defaultActiveKey={activeTab} onSelect={handleTabSelect}>
//                         <Nav variant="tabs" className="home-products-tab justify-content-center flex-column flex-md-row border-0 mb-5">
//                             <Nav.Item>
//                                 <Nav.Link eventKey="tab1" className="border-0 font-lato text-center my-2 mx-0 mx-md-3">New Arrival</Nav.Link>
//                             </Nav.Item>
//                             <Nav.Item>
//                                 <Nav.Link eventKey="tab2" className="border-0 font-lato text-center my-2 mx-0 mx-md-3">Best Seller</Nav.Link>
//                             </Nav.Item>
//                             <Nav.Item>
//                                 <Nav.Link eventKey="tab3" className="border-0 font-lato text-center my-2 mx-0 mx-md-3">Featured</Nav.Link>
//                             </Nav.Item>
//                         </Nav>

//                         <Tab.Content>
//                             {
//                                 tabs && tabs.map((item, index) => {
//                                     return (
//                                         <Tab.Pane key={index} eventKey={item.tab}>
//                                             <Row className="mb-5 pb-4 justify-content-center g-4">
//                                                 {
//                                                     (item.products) && item.products.slice(0, 6).map(product => {
//                                                         return (
//                                                             <Col key={product._id}>
//                                                                 <Card className=" home-latest-product-cards text-decoration-none border-0 p-0 m-auto" as={Link} to={`/product/${product._id}`}>
//                                                                     <Card.Img variant="top" src={product.images[0].url} alt={product.name} className="card-image m-auto object-fit-contain" />
//                                                                     <Card.Body className="text-dark d-flex justify-content-between px-0 pb-0">
//                                                                         <Card.Title className="text-overflow text-secondary-color me-3 mb-0">{product.name}</Card.Title>
//                                                                         <Card.Text>
//                                                                             ₹<span className="font-16 text-blue-300-color">{product.price}</span>
//                                                                         </Card.Text>
//                                                                     </Card.Body>
//                                                                 </Card>
//                                                             </Col>
//                                                         )
//                                                     })
//                                                 }
//                                             </Row>
//                                         </Tab.Pane>
//                                     )
//                                 })
//                             }
//                         </Tab.Content>
//                     </Tab.Container>
//             }
//         </>
//     )
// }

// export default LatestProductsTabs;
