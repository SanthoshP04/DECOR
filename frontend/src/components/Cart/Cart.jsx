import React from 'react';
import "./Cart.css";
import MetaData from '../MetaData';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CartItems from './CartItems';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/actions/cartAction';
import CartTotals from './CartTotals';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);

    const checkoutHandler = () => {
        navigate("/login?redirect=shipping");
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <>
            <MetaData title={`Cart -@Hekto`} />
            
            {cartItems.length === 0 ? (
                <Container className="cart-page d-flex flex-column align-items-center justify-content-center">
                    <span className="font-22">No products in your cart</span>
                    <Button as={Link} to="/products" className="bg-secondary-color border-0 my-2 py-2 px-3 rounded-0 text-white">
                        View Products
                    </Button>
                </Container>
            ) : (
                <Container className="cart-page my-5">
                    <Row>
                        <Col md={8} className="mb-5 mb-lg-0 pe-md-5">
                            <h5 className="fw-bold font-22 text-blue-500-color mb-4">Order Summary</h5>
                            <div className="product-cart-items overflow-auto pe-0 pe-md-5 mb-4">
                                {cartItems.map(item => (
                                    <CartItems key={item.product} item={item} />
                                ))}
                            </div>
                            <Button 
                                className="bg-secondary-color text-white border-0 my-2 py-2 px-3 rounded-0" 
                                onClick={() => dispatch(clearCart())}
                            >
                                Clear Cart
                            </Button>
                        </Col>

                        <Col md={4}>
                            <h5 className="fw-bold font-22 text-blue-500-color text-center mb-4">Cart Totals</h5>
                            <CartTotals 
                                cartItems={cartItems} 
                                checkoutHandler={checkoutHandler} 
                                totalPrice={totalPrice} 
                            />
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    )
}

export default Cart;
// import React from 'react';
// import "./Cart.css";
// import MetaData from '../MetaData';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import CartItems from './CartItems';
// import Button from 'react-bootstrap/Button';
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from 'react-router-dom';
// import { removeFromCart } from '../../store/actions/cartAction';
// import CartTotals from './CartTotals';

// const Cart = () => {

//     const dispatch = useDispatch();

//     const navigate = useNavigate();

//     const { cartItems } = useSelector((state) => state.cart);

//     const clearCart = () => {
//         localStorage.removeItem("cartItems");
//         for (let item of cartItems) {
//             dispatch(removeFromCart(item.product));
//         }
//     };

//     const checkoutHandler = () => {
//         navigate("/login?redirect=shipping");
//     };

//     const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

//     return (
//         <>
//             {/* Title tag */}
//             <MetaData title={`Cart -@Hekto`} />

//             {/* Cart Items */}
//             {
//                 cartItems.length === 0 ? (
//                     <>
//                         <Container className="cart-page d-flex flex-column align-items-center justify-content-center">
//                             <span className="font-22">No products in your cart</span>
//                             <Button className="bg-secondary-color border-0 my-2 py-2 px-3 rounded-0"><Link to={"/products"} className="text-decoration-none text-white">View Products</Link></Button>
//                         </Container>
//                     </>
//                 ) :
//                     (
//                         <>
//                             <Container className="cart-page my-5">
//                                 <Row>
//                                     <Col md={8} className="mb-5 mb-lg-0 pe-md-5">
//                                         <h5 className="fw-bold font-22 text-blue-500-color mb-4">Order Summary</h5>
//                                         <div className="product-cart-items overflow-auto pe-0 pe-md-5 mb-4">
//                                             {
//                                                 cartItems && cartItems.map(item => {
//                                                     return (
//                                                         <CartItems key={item.product} item={item} />
//                                                     )
//                                                 })
//                                             }
//                                         </div>
//                                         <Button className="bg-secondary-color text-white border-0 my-2 py-2 px-3 rounded-0" onClick={clearCart}>Clear Cart</Button>
//                                     </Col>

//                                     <Col md={4}>
//                                         <h5 className="fw-bold font-22 text-blue-500-color text-center mb-4">Cart Totals</h5>
//                                         <CartTotals cartItems={cartItems} checkoutHandler={checkoutHandler} totalPrice={totalPrice} />
//                                     </Col>
//                                 </Row>
//                             </Container>
//                         </>
//                     )
//             }
//         </>
//     )
// }

// export default Cart;
