import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Stack from 'react-bootstrap/esm/Stack';
import { Link } from 'react-router-dom';

const LatestTrendingProducts = ({ products }) => {
    const firstProduct = products?.[0];

    const createProductSlug = (productName) => {
        if (!productName) return 'product';
        return productName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/-+/g, '-')          // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
    };

    return (
        <>
            <Col md="6 position-relative">
                <img
                    className="d-block img-fluid m-auto"
                    src={process.env.PUBLIC_URL + '/assets/content/hekto-latest-trending-bubble.webp'}
                    alt="Trending bubble"
                    loading="lazy"
                />
                <img
                    className="latest-trending-chair d-block img-fluid ps-md-5"
                    src={process.env.PUBLIC_URL + '/assets/content/hekto-latest-trending-chair.webp'}
                    alt="Latest trending chair"
                    loading="lazy"
                />
            </Col>
            <Col md="6 latest-trending-product-text mt-5 mt-md-0">
                <h3 className="text-primary-color fw-bold font-35 mb-3">
                    Unique Features Of Latest & Trending Products
                </h3>
                <ul className="text-gray-100-color font-lato ps-4 list-style-none mx-0 mb-4">
                    <li>All frames constructed with hardwood solids and laminates</li>
                    <li>Reinforced with double wood dowels, glue, screw - nails corner blocks and machine nails</li>
                    <li>Arms, backs and seats are structurally reinforced</li>
                </ul>
                <Stack className="flex-column-reverse flex-md-row" gap={3}>
                    <Button 
                        as={Link} 
                        to="/products" 
                        className="bg-secondary-color border-0 rounded-0 fw-semibold d-flex align-items-center justify-content-center flex-shrink-0"
                        aria-label="Shop now"
                    >
                        Shop Now
                    </Button>
                    {firstProduct && (
                        <Link
                            to={`/product/${createProductSlug(firstProduct.name)}/${firstProduct._id}`}
                            className="text-decoration-none"
                        >
                            <Stack className="text-primary-color latest-trending-product-container">
                                <span className="text-overflow line-clamp-1 fw-semibold latest-trending-product-name">
                                    {firstProduct.name}
                                </span>
                                <span>₹{firstProduct.price}</span>
                            </Stack>
                        </Link>
                    )}
                </Stack>
            </Col>
        </>
    );
};

export default LatestTrendingProducts;
// import React from 'react';
// import Button from 'react-bootstrap/esm/Button';
// import Col from 'react-bootstrap/esm/Col';
// import Stack from 'react-bootstrap/esm/Stack';
// import { Link } from 'react-router-dom';

// const LatestTrendingProducts = ({ products }) => {
//     return (
//         <>
//             <Col md="6 position-relative">
//                 <img
//                     className="d-block img-fluid m-auto"
//                     src={process.env.PUBLIC_URL + '/assets/content/hekto-latest-trending-bubble.webp'}
//                     alt={`hekto-latest-trending-bubble`}
//                 />
//                 <img
//                     className="latest-trending-chair d-block img-fluid ps-md-5"
//                     src={process.env.PUBLIC_URL + '/assets/content/hekto-latest-trending-chair.webp'}
//                     alt={`hekto-latest-trending-chair`}
//                 />
//             </Col>
//             <Col md="6 latest-trending-product-text mt-5 mt-md-0">
//                 <h3 className="text-primary-color fw-bold font-35 mb-3">Unique Features Of Latest &
//                     Trending Products</h3>
//                 <ul className="text-gray-100-color font-lato ps-4 list-style-none mx-0 mb-4">
//                     <li>All frames constructed with hardwood solids and laminates</li>
//                     <li>Reinforced with double wood dowels, glue, screw - nails corner
//                         blocks and machine nails</li>
//                     <li>Arms, backs and seats are structurally reinforced</li>
//                 </ul>
//                 <Stack className="flex-column-reverse flex-md-row" gap={3}>
//                     <Button as={Link} to="/products" className=" bg-secondary-color border-0 rounded-0 fw-semibold d-flex align-items-center justify-content-center flex-shrink-0">
//                         Shop Now
//                     </Button>
//                     {
//                         products && products.map((product, index) => {
//                             if (index === 0) {
//                                 return (
//                                     <Stack key={index} className="text-primary-color" >
//                                         <span className="text-overflow line-clamp-1 fw-semibold latest-trending-product-name">{product.name}</span>
//                                         <span>{product.price}</span>
//                                     </Stack>
//                                 )
//                             } else {
//                                 return "";
//                             }
//                         })
//                     }
//                 </Stack>
//             </Col>
//         </>
//     )
// }

// export default LatestTrendingProducts;
