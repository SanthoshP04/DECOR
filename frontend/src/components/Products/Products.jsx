import React, { useEffect, useState, useMemo, useCallback } from 'react';
import MetaData from '../MetaData';
import InitLoader from "../Utils/InitLoader";
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Stack from 'react-bootstrap/esm/Stack';
import HeaderLoading from '../Header/HeaderLoading';
import HeaderAlert from '../Header/HeaderAlert';
import ProductsCard from './ProductsCard';
import ProductFilters from './ProductFilters';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilteredProducts } from '../../store/actions/productAction';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { BsFilterLeft, BsGridFill, BsListUl, BsSearch, BsX } from 'react-icons/bs';
import { FiRefreshCw } from 'react-icons/fi';
import './Products.css';

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();

    // State management
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(50000);
    const [ratings, setRatings] = useState(0);
    const [sortOption, setSortOption] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [searchInput, setSearchInput] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    // Redux state
    const { 
        products, 
        productsCount, 
        filteredProductsCount, 
        resultPerPage, 
        loading: productsLoading, 
        headerLoading: productsHeaderLoading, 
        error: productsError, 
        message 
    } = useSelector((state) => state.products);

    // Initialize search input when URL keyword changes
    useEffect(() => {
        if (urlKeyword) {
            try {
                const decodedKeyword = decodeURIComponent(urlKeyword);
                setSearchInput(decodedKeyword);
            } catch (error) {
                console.warn('Failed to decode URL keyword:', error);
                setSearchInput(urlKeyword);
            }
        } else {
            setSearchInput("");
        }
    }, [urlKeyword]);

    // Memoized calculations
    const totalPages = useMemo(() => {
        const count = category ? filteredProductsCount : productsCount;
        return Math.ceil(count / (resultPerPage || 1)); // Prevent division by zero
    }, [category, filteredProductsCount, productsCount, resultPerPage]);

    const hasActiveFilters = useMemo(() => {
        return !!(category || price < 50000 || ratings > 0 || urlKeyword);
    }, [category, price, ratings, urlKeyword]);

    // Handle scroll for header effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Memoized event handlers
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    }, [currentPage, totalPages]);

    const resetFilters = useCallback(() => {
        setCategory("");
        setPrice(50000);
        setRatings(0);
        setSortOption("featured");
        setCurrentPage(1);
        setSearchInput("");
        navigate('/products');
    }, [navigate]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        const trimmedQuery = searchInput.trim();
        
        if (!trimmedQuery && !urlKeyword) {
            return; // No search query and no existing keyword
        }
        
        setIsSearching(true);
        setCurrentPage(1);
        
        try {
            const currentKeyword = urlKeyword ? decodeURIComponent(urlKeyword) : "";
            if (trimmedQuery !== currentKeyword) {
                navigate(trimmedQuery ? `/products/${encodeURIComponent(trimmedQuery)}` : '/products');
            }
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            setTimeout(() => setIsSearching(false), 500);
        }
    }, [searchInput, urlKeyword, navigate]);

    const clearSearch = useCallback(() => {
        if (urlKeyword) {
            setSearchInput("");
            setCurrentPage(1);
            navigate('/products');
        }
    }, [urlKeyword, navigate]);

    const removeFilter = useCallback((filterType) => {
        setCurrentPage(1);
        switch (filterType) {
            case 'category':
                setCategory("");
                break;
            case 'price':
                setPrice(50000);
                break;
            case 'ratings':
                setRatings(0);
                break;
            case 'search':
                clearSearch();
                break;
            default:
                console.warn('Unknown filter type:', filterType);
                break;
        }
    }, [clearSearch]);

    // Generate pagination items
    const paginationItems = useMemo(() => {
        if (totalPages <= 1) return [];
        
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we don't have enough pages at the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Add ellipsis for start if needed
        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
        }

        // Add visible page numbers
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        // Add ellipsis for end if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    }, [currentPage, totalPages, handlePageChange]);

    // Debounced fetch products effect
    useEffect(() => {
        const fetchTimer = setTimeout(() => {
            dispatch(getFilteredProducts(
                urlKeyword || "",
                currentPage, 
                price, 
                category, 
                ratings, 
                sortOption
            ));
        }, 300);

        return () => clearTimeout(fetchTimer);
    }, [dispatch, urlKeyword, currentPage, price, category, ratings, sortOption]);

    // Reset page when filters change (but not when currentPage itself changes)
    useEffect(() => {
        setCurrentPage(1);
    }, [category, price, ratings, sortOption, urlKeyword]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Loading state
    if (productsLoading) {
        return <InitLoader />;
    }

    return (
        <>
            <MetaData title={"All Products: Shop Online in India for Furniture, Home Decor, Homeware Products @Zoro"} />
            <HeaderLoading progressLoading={productsHeaderLoading || isSearching} />
            
            {productsError && (
                <HeaderAlert error={productsError} message={message} />
            )}

            {/* Floating filter button for mobile */}
            <Button 
                variant="primary" 
                className="d-md-none floating-filter-btn shadow-lg"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    borderRadius: '50px',
                    padding: '12px 20px',
                    boxShadow: '0 4px 20px rgba(0,123,255,0.4)'
                }}
                aria-label={showFilters ? 'Hide filters' : 'Show filters'}
            >
                <BsFilterLeft size={20} />
                <span className="ms-2">{showFilters ? 'Hide' : 'Filters'}</span>
            </Button>

            <Container className="products-page">
                {/* Products header */}
                <div className={`products-header bg-white p-4 rounded-3 mb-4 sticky-top shadow-sm ${isScrolled ? 'scrolled' : ''}`}>
                    <Stack direction="horizontal" className="justify-content-between align-items-center flex-wrap">
                        <div className="mb-3 mb-md-0">
                            <h2 className="fw-bold mb-1 text-primary">
                                {urlKeyword ? `Results for "${decodeURIComponent(urlKeyword)}"` : "Our Product Collection"}
                            </h2>
                            <p className="text-muted mb-0">
                                Showing <span className="fw-bold text-success">{filteredProductsCount || 0}</span> products
                                {urlKeyword && (
                                    <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="ms-2 text-danger"
                                        onClick={clearSearch}
                                        aria-label="Clear search"
                                    >
                                        <BsX className="me-1" />
                                        Clear search
                                    </Button>
                                )}
                            </p>
                        </div>
                        
                        <Stack direction="horizontal" gap={3} className="flex-wrap">
                            {/* Desktop search */}
                            <Form onSubmit={handleSearch} className="d-none d-md-flex">
                                <Stack direction="horizontal" gap={2}>
                                    <Form.Control
                                        type="search"
                                        placeholder="Search products..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{ 
                                            minWidth: '200px',
                                            border: '2px solid #e9ecef',
                                            borderRadius: '25px',
                                            padding: '8px 16px'
                                        }}
                                        className="shadow-sm"
                                        aria-label="Search products"
                                    />
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                                        className="d-flex align-items-center justify-content-center"
                                        disabled={isSearching}
                                        aria-label="Search"
                                    >
                                        {isSearching ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <BsSearch />
                                        )}
                                    </Button>
                                </Stack>
                            </Form>
                            
                            {/* View mode toggle */}
                            <div className="btn-group d-none d-sm-flex" role="group" aria-label="View mode">
                                <Button 
                                    variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="d-flex align-items-center"
                                    aria-pressed={viewMode === 'grid'}
                                >
                                    <BsGridFill className="me-1" />
                                    Grid
                                </Button>
                                <Button 
                                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="d-flex align-items-center"
                                    aria-pressed={viewMode === 'list'}
                                >
                                    <BsListUl className="me-1" />
                                    List
                                </Button>
                            </div>
                            
                            {/* Mobile filter toggle */}
                            <Button 
                                variant="outline-primary" 
                                className="d-md-none"
                                onClick={() => setShowFilters(!showFilters)}
                                aria-expanded={showFilters}
                                aria-controls="mobile-filters"
                            >
                                <BsFilterLeft className="me-1" />
                                {showFilters ? 'Hide Filters' : 'Filters'}
                            </Button>
                            
                            {/* Sort dropdown */}
                            <Form.Select 
                                size="sm" 
                                style={{ 
                                    width: '180px',
                                    borderRadius: '10px',
                                    border: '2px solid #e9ecef'
                                }}
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="shadow-sm"
                                aria-label="Sort products"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rating</option>
                                <option value="newest">Newest Arrivals</option>
                            </Form.Select>
                        </Stack>
                    </Stack>
                </div>

                <Row className="g-4">
                    {/* Filters column */}
                    <Col md={3} className={`filters-column ${showFilters ? 'mobile-show' : ''}`}>
                        <div className="bg-white p-4 rounded-3 shadow-sm sticky-top" style={{ top: '100px' }} id="mobile-filters">
                            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold text-primary">Filters</h5>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="text-danger d-flex align-items-center p-1"
                                    onClick={resetFilters}
                                    style={{ textDecoration: 'none' }}
                                    aria-label="Reset all filters"
                                >
                                    <FiRefreshCw className="me-1" size={14} />
                                    Reset All
                                </Button>
                            </Stack>
                            
                            {/* Mobile search */}
                            <Form onSubmit={handleSearch} className="mb-4 d-md-none">
                                <Stack direction="horizontal" gap={2}>
                                    <Form.Control
                                        type="search"
                                        placeholder="Search products..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        style={{ borderRadius: '15px' }}
                                        aria-label="Search products"
                                    />
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        style={{ borderRadius: '50%' }}
                                        disabled={isSearching}
                                        aria-label="Search"
                                    >
                                        {isSearching ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <BsSearch />
                                        )}
                                    </Button>
                                </Stack>
                            </Form>
                            
                            <ProductFilters 
                                price={price} 
                                setPrice={setPrice} 
                                setCategory={setCategory} 
                                setRatings={setRatings} 
                                currentCategory={category}
                            />
                        </div>
                    </Col>

                    {/* Products column */}
                    <Col md={9}>
                        {/* Active filters display */}
                        {hasActiveFilters && (
                            <div className="active-filters mb-4 p-3 bg-light rounded-3 border-start border-primary border-4">
                                <h6 className="mb-3 fw-bold text-primary">Active Filters:</h6>
                                <Stack direction="horizontal" gap={2} className="flex-wrap">
                                    {urlKeyword && (
                                        <Badge 
                                            pill 
                                            bg="info" 
                                            className="d-flex align-items-center p-2"
                                            style={{ fontSize: '0.9rem' }}
                                        >
                                            Search: "{decodeURIComponent(urlKeyword)}"
                                            <Button 
                                                variant="link" 
                                                className="text-white p-0 ms-2 fw-bold" 
                                                style={{ 
                                                    lineHeight: 1,
                                                    fontSize: '1.2rem',
                                                    textDecoration: 'none'
                                                }}
                                                onClick={() => removeFilter('search')}
                                                aria-label="Remove search filter"
                                            >
                                                ×
                                            </Button>
                                        </Badge>
                                    )}
                                    {category && (
                                        <Badge 
                                            pill 
                                            bg="primary" 
                                            className="d-flex align-items-center p-2"
                                            style={{ fontSize: '0.9rem' }}
                                        >
                                            Category: {category}
                                            <Button 
                                                variant="link" 
                                                className="text-white p-0 ms-2 fw-bold" 
                                                style={{ 
                                                    lineHeight: 1,
                                                    fontSize: '1.2rem',
                                                    textDecoration: 'none'
                                                }}
                                                onClick={() => removeFilter('category')}
                                                aria-label="Remove category filter"
                                            >
                                                ×
                                            </Button>
                                        </Badge>
                                    )}
                                    {price < 50000 && (
                                        <Badge 
                                            pill 
                                            bg="success" 
                                            className="d-flex align-items-center p-2"
                                            style={{ fontSize: '0.9rem' }}
                                        >
                                            Max Price: ₹{price.toLocaleString()}
                                            <Button 
                                                variant="link" 
                                                className="text-white p-0 ms-2 fw-bold" 
                                                style={{ 
                                                    lineHeight: 1,
                                                    fontSize: '1.2rem',
                                                    textDecoration: 'none'
                                                }}
                                                onClick={() => removeFilter('price')}
                                                aria-label="Remove price filter"
                                            >
                                                ×
                                            </Button>
                                        </Badge>
                                    )}
                                    {ratings > 0 && (
                                        <Badge 
                                            pill 
                                            bg="warning" 
                                            text="dark"
                                            className="d-flex align-items-center p-2"
                                            style={{ fontSize: '0.9rem' }}
                                        >
                                            Min Rating: {ratings}★
                                            <Button 
                                                variant="link" 
                                                className="text-dark p-0 ms-2 fw-bold" 
                                                style={{ 
                                                    lineHeight: 1,
                                                    fontSize: '1.2rem',
                                                    textDecoration: 'none'
                                                }}
                                                onClick={() => removeFilter('ratings')}
                                                aria-label="Remove rating filter"
                                            >
                                                ×
                                            </Button>
                                        </Badge>
                                    )}
                                </Stack>
                            </div>
                        )}

                        {/* Products display */}
                        {products && products.length > 0 ? (
                            <>
                                {viewMode === 'grid' ? (
                                    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
                                        {products.map((product) => (
                                            <ProductsCard key={product._id} product={product} viewMode={viewMode} />
                                        ))}
                                    </Row>
                                ) : (
                                    <div className="list-view">
                                        {products.map((product) => (
                                            <ProductsCard key={product._id} product={product} viewMode={viewMode} />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-5 d-flex justify-content-center">
                                        <Pagination className="shadow-sm" aria-label="Product pages navigation">
                                            <Pagination.First 
                                                onClick={() => handlePageChange(1)} 
                                                disabled={currentPage === 1}
                                                aria-label="Go to first page"
                                            />
                                            <Pagination.Prev 
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                                                disabled={currentPage === 1}
                                                aria-label="Go to previous page"
                                            />
                                            {paginationItems}
                                            <Pagination.Next 
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                                                disabled={currentPage === totalPages}
                                                aria-label="Go to next page"
                                            />
                                            <Pagination.Last 
                                                onClick={() => handlePageChange(totalPages)} 
                                                disabled={currentPage === totalPages}
                                                aria-label="Go to last page"
                                            />
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            // No products found
                            <div className="text-center py-5">
                                <img 
                                    src="/assets/no-products.svg" 
                                    alt="No products found" 
                                    style={{ width: '200px', opacity: 0.7 }}
                                    className="mb-4"
                                />
                                <h5 className="text-muted mb-3">No products match your filters</h5>
                                <Button 
                                    variant="primary" 
                                    className="mt-3 px-4 py-2"
                                    onClick={resetFilters}
                                    style={{ borderRadius: '25px' }}
                                >
                                    <FiRefreshCw className="me-2" />
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Products;

// import React, { useEffect, useState } from 'react';
// import MetaData from '../MetaData';
// import InitLoader from "../Utils/InitLoader";
// import Container from 'react-bootstrap/esm/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Pagination from 'react-bootstrap/Pagination';
// import Stack from 'react-bootstrap/esm/Stack';
// import HeaderLoading from '../Header/HeaderLoading';
// import HeaderAlert from '../Header/HeaderAlert';
// import ProductsCard from './ProductsCard';
// import ProductFilters from './ProductFilters';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { getFilteredProducts } from '../../store/actions/productAction';

// const Products = () => {
//     const dispatch = useDispatch();

//     // For search filter
//     const { keyword } = useParams();

//     // For category filter
//     const [category, setCategory] = useState("");

//     // For price filter
//     const [price, setPrice] = useState(50000);

//     // For ratings filter
//     const [ratings, setRatings] = useState(0);

//     const { products, productsCount, filteredProductsCount, resultPerPage, loading: productsLoading, headerLoading: productsHeaderLoading, error: productsError, message } = useSelector(
//         (state) => state.products
//     );

//     // For pagination
//     let items = [];
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = Math.ceil((category ? filteredProductsCount : productsCount) / resultPerPage);
//     for (let number = 1; number <= totalPages; number++) {
//         items.push(
//             <Pagination.Item key={number} active={number === Number(currentPage)}>
//                 {number}
//             </Pagination.Item>,
//         );
//     };
//     const handlePageChange = (e) => {
//         setCurrentPage(e.target.innerText);
//     };

//     useEffect(() => {
//         dispatch(getFilteredProducts(keyword, currentPage, price, category, ratings));
//     }, [dispatch, keyword, currentPage, price, category, ratings]);

//     // Scroll to top
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     return (
//         productsLoading ?
//             <InitLoader />
//             :
//             <>
//                 {/* Title tag */}
//                 <MetaData title={"All Products: Shop Online in India for Furniture, Home Decor, Homeware Products @Hekto"} />

//                 {/* React top loading bar */}
//                 <HeaderLoading progressLoading={productsHeaderLoading} />

//                 {/* Header alert */}
//                 {
//                     (productsError) &&
//                     <HeaderAlert error={productsError} message={message} />
//                 }

//                 {/* Products */}
//                 <Container>
//                     <Stack className="flex-column flex-md-row align-items-start align-items-xs-center justify-content-between my-5">
//                         <Stack className="mb-4 mb-md-0">
//                             <h2 className="font-22 text-primary-color fw-bold">{keyword ? "Searched Products" : "All Products"}</h2>
//                             <span className="font-12 font-lato text-gray-100-color">About {filteredProductsCount} products (0.62 seconds)</span>
//                         </Stack>
//                         <span className="text-start text-xs-center text-md-end">Per Page: <input disabled type="number" placeholder={resultPerPage} className="w-25" /></span>
//                     </Stack>
//                     <hr />
//                     <Row className="mb-5">
//                         <Col md={3}>
//                             <ProductFilters price={price} setPrice={setPrice} setCategory={setCategory} setRatings={setRatings} />
//                         </Col>
//                         <Col md={9}>
//                             {/* Products */}
//                             <Container className="p-4 text-center">
//                                 {
//                                     products && products.length > 0 ?
//                                         <Row xs={1} md={2} xl={3} className="g-4">
//                                             {products && products.map(product => <ProductsCard key={product._id} product={product} />)}
//                                         </Row>
//                                         : <span>No products to show</span>
//                                 }
//                                 {
//                                     resultPerPage < (category ? filteredProductsCount : productsCount) &&
//                                     <div className="my-4">
//                                         <Pagination size="lg" onClick={handlePageChange} className="justify-content-center">{items}</Pagination>
//                                     </div>
//                                 }
//                             </Container >
//                         </Col>
//                     </Row>
//                 </Container>
//             </>
//     )
// }

// export default Products
