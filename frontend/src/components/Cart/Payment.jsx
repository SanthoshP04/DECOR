import React, { useRef, useState, useEffect } from 'react';
import "./Payment.css";
import MetaData from '../MetaData';
import HeaderLoading from '../Header/HeaderLoading';
import HeaderAlert from '../Header/HeaderAlert';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/esm/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CartTotals from './CartTotals';
import CartItems from './CartItems';
import { createOrder } from '../../store/actions/orderAction';
import { clearCart } from '../../store/actions/cartAction';

const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user, error, message, headerLoading } = useSelector(state => state.user);
    const { error: orderError } = useSelector(state => state.newOrder);
    
    const [stripeValidation, setStripeValidation] = useState({
        cardError: "",
        expiryError: "",
        cvvError: ""
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [showTestCards, setShowTestCards] = useState(false);

    // Validate order info exists
    useEffect(() => {
        if (!orderInfo) {
            navigate("/checkout");
        }
    }, [orderInfo, navigate]);

    const paymentData = {
        amount: Math.round(orderInfo?.grandTotal * 100)
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemPrice: orderInfo?.totalPrice,
        taxPrice: orderInfo?.gstPrice,
        shippingPrice: orderInfo?.shippingPrice,
        totalPrice: orderInfo?.grandTotal
    };

    const handleStripeValidation = (e, field) => {
        setStripeValidation(prev => ({
            ...prev,
            [field]: e.error?.message || ""
        }));
    };

    const isFormValid = () => {
        return (
            !stripeValidation.cardError &&
            !stripeValidation.expiryError &&
            !stripeValidation.cvvError
        );
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements || !isFormValid()) {
            return;
        }

        setIsProcessing(true);
        payBtn.current.disabled = true;
        setPaymentError(null);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            };
            
            // In a real app, this would call your backend
            // For testing, we'll simulate a successful payment
            if (process.env.NODE_ENV === 'development') {
                console.log("Simulating payment in development mode");
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful payment
                order.paymentInfo = {
                    id: `test_pi_${Math.random().toString(36).substr(2, 10)}`,
                    status: "succeeded"
                };
                
                await dispatch(createOrder(order));
                dispatch(clearCart());
                navigate("/success");
                return;
            }

            const { data } = await axios.post(
                "/api/v1/payment/process",
                paymentData,
                config
            );

            const result = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: "IN"
                        }
                    }
                },
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            if (result.paymentIntent.status === "succeeded") {
                order.paymentInfo = {
                    id: result.paymentIntent.id,
                    status: result.paymentIntent.status
                };
                
                await dispatch(createOrder(order));
                dispatch(clearCart());
                navigate("/success");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setPaymentError(error.message || "Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
            payBtn.current.disabled = false;
        }
    };

    if (!orderInfo) {
        return null;
    }

    return (
        <>
            <MetaData title={`Payment - Hekto (TEST MODE)`} />
            <HeaderLoading progressLoading={headerLoading} />
            
            {(error || orderError || paymentError) && (
                <HeaderAlert 
                    error={error || orderError || paymentError} 
                    message={message || "Payment processing failed"} 
                />
            )}

            <Container className="my-5">
                <Row>
                    <Col lg={8} className="mb-5 mb-lg-0 pe-md-5">
                        <h1 className="fw-bold font-22 text-blue-500-color mb-4">Payment (TEST MODE)</h1>
                        
                        <Alert variant="warning" className="mb-4">
                            <strong>Development Mode:</strong> This is a test environment. No real payments will be processed.
                            <Button 
                                variant="link" 
                                size="sm" 
                                className="p-0 ms-2"
                                onClick={() => setShowTestCards(!showTestCards)}
                            >
                                {showTestCards ? 'Hide test cards' : 'Show test cards'}
                            </Button>
                        </Alert>

                        {showTestCards && (
                            <Alert variant="info" className="mb-4">
                                <h5 className="fw-bold">Test Card Details</h5>
                                <ul className="mb-0">
                                    <li>
                                        <strong>Card number:</strong> 4242 4242 4242 4242
                                    </li>
                                    <li>
                                        <strong>Expiry:</strong> Any future date (e.g., 12/34)
                                    </li>
                                    <li>
                                        <strong>CVC:</strong> Any 3 digits (e.g., 123)
                                    </li>
                                    <li>
                                        <strong>Postal code:</strong> Any 5 digits
                                    </li>
                                </ul>
                            </Alert>
                        )}

                        <Form className="card-details bg-gray-300-color px-4 py-5" onSubmit={submitHandler}>
                            <h2 className="fw-bold font-18 text-blue-500-color mb-4">Contact Information</h2>
                            <address>
                                <span className="fw-bold font-16 d-block">{user.name}</span>
                                <span className="font-16 d-block">
                                    {shippingInfo.address}, {shippingInfo.landmark && `${shippingInfo.landmark},`} 
                                    {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.pinCode}
                                </span>
                                <span className="font-16 d-block">+91 {shippingInfo.phoneNo}</span>
                                <span className="font-16 d-block">{user.email}</span>
                            </address>

                            <h2 className="fw-bold font-18 text-blue-500-color mb-4 mt-5">Card Details</h2>
                            
                            <Form.Group className="mb-3" controlId="cardNumber">
                                <Form.Label>Card Number</Form.Label>
                                <CardNumberElement 
                                    className="form-control py-2 card-details-input mb-2" 
                                    onChange={(e) => handleStripeValidation(e, "cardError")} 
                                    options={{ 
                                        style: { 
                                            base: { 
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                        },
                                        showIcon: true
                                    }}
                                />
                                {stripeValidation.cardError && (
                                    <span className="text-danger">{stripeValidation.cardError}</span>
                                )}
                            </Form.Group>
                            
                            <Stack className="flex-column flex-md-row mb-4" gap={3}>
                                <Form.Group className="w-100" controlId="cardExpiry">
                                    <Form.Label>Expiration Date</Form.Label>
                                    <CardExpiryElement 
                                        className="form-control py-2 card-details-input mb-1" 
                                        onChange={(e) => handleStripeValidation(e, "expiryError")}
                                        options={{ 
                                            style: { 
                                                base: { 
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                    {stripeValidation.expiryError && (
                                        <span className="text-danger">{stripeValidation.expiryError}</span>
                                    )}
                                </Form.Group>
                                
                                <Form.Group className="w-100" controlId="cardCVV">
                                    <Form.Label>CVC</Form.Label>
                                    <CardCvcElement 
                                        className="form-control py-2 card-details-input mb-1" 
                                        onChange={(e) => handleStripeValidation(e, "cvvError")}
                                        options={{ 
                                            style: { 
                                                base: { 
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                    {stripeValidation.cvvError && (
                                        <span className="text-danger">{stripeValidation.cvvError}</span>
                                    )}
                                </Form.Group>
                            </Stack>
                            
                            <Button 
                                type="submit" 
                                className="w-100 font-lato font-14 fw-bold bg-green-100-color border-0 p-2 mb-2" 
                                ref={payBtn}
                                disabled={!stripe || !isFormValid() || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Processing...
                                    </>
                                ) : (
                                    `Test Payment ₹${orderInfo?.grandTotal.toFixed(2)}`
                                )}
                            </Button>
                        </Form>
                    </Col>

                    <Col lg={4}>
                        <h2 className="fw-bold font-22 text-blue-500-color text-center mb-4">Order Summary</h2>
                        <div className="payment-order-details overflow-auto mb-5">
                            {cartItems.map(item => (
                                <CartItems key={item.product} item={item} />
                            ))}
                        </div>
                        <CartTotals 
                            cartItems={cartItems} 
                            totalPrice={orderInfo.totalPrice} 
                            shippingPrice={orderInfo.shippingPrice} 
                            gstPrice={orderInfo.gstPrice} 
                            grandTotal={orderInfo.grandTotal} 
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Payment;
// import React, { useRef, useState } from 'react';
// import "./Payment.css";
// import MetaData from '../MetaData';
// import HeaderLoading from '../Header/HeaderLoading';
// import HeaderAlert from '../Header/HeaderAlert';
// import Container from 'react-bootstrap/Container';
// import Stack from 'react-bootstrap/esm/Stack';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import {
//     CardNumberElement,
//     CardCvcElement,
//     CardExpiryElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import CartTotals from './CartTotals';
// import CartItems from './CartItems';
// import { createOrder } from '../../store/actions/orderAction';

// const Payment = () => {
//     const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const stripe = useStripe();
//     const elements = useElements();
//     const payBtn = useRef(null);

//     const { shippingInfo, cartItems } = useSelector(state => state.cart);
//     const { user, error, message, headerLoading } = useSelector(state => state.user);
//     const [stripeValidation, setStripeValidation] = useState({
//         cardError: "",
//         expiryMonthError: "",
//         cvvError: ""
//     });

//     const paymentData = {
//         amount: Math.round(orderInfo.grandTotal * 100)
//     };

//     const order = {
//         shippingInfo,
//         orderItems: cartItems,
//         itemPrice: orderInfo.totalPrice,
//         taxPrice: orderInfo.gstPrice,
//         shippingPrice: orderInfo.shippingPrice,
//         totalPrice: orderInfo.grandTotal
//     };

//     // Handling stripe validation
//     const handleStripeValidation = (e, name) => {
//         if (e.error && e.error.message) {
//             setStripeValidation({ ...stripeValidation, [name]: e.error.message });
//         } else {
//             setStripeValidation({ ...stripeValidation, [name]: "" });
//         }
//     };

//     const submitHandler = async (e) => {
//         e.preventDefault();

//         payBtn.current.disabled = true;

//         try {
//             const config = {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             };
//             const { data } = await axios.post(
//                 "/api/v1/payment/process",
//                 paymentData,
//                 config
//             );

//             const client_secret = data.client_secret;

//             if (!stripe || !elements) return;

//             const result = await stripe.confirmCardPayment(client_secret, {
//                 payment_method: {
//                     card: elements.getElement(CardNumberElement),
//                     billing_details: {
//                         name: user.name,
//                         email: user.email,
//                         address: {
//                             line1: shippingInfo.address,
//                             city: shippingInfo.city,
//                             state: shippingInfo.state,
//                             postal_code: shippingInfo.pinCode
//                         }
//                     }
//                 },
//             });

//             if (result.error) {
//                 payBtn.current.disabled = false;
//             } else {
//                 if (result.paymentIntent.status === "succeeded") {
//                     order.paymentInfo = {
//                         id: result.paymentIntent.id,
//                         status: result.paymentIntent.status
//                     };
//                     dispatch(createOrder(order));
//                     navigate("/success");
//                 }
//             }
//         } catch (error) {
//             payBtn.current.disabled = false;
//         }
//     };

//     return (
//         <>
//             {/* Title tag */}
//             <MetaData title={`Payment -@Hekto`} />

//             {/* React top loading bar */}
//             <HeaderLoading progressLoading={headerLoading} />

//             {/* Header alert */}
//             {
//                 (error) &&
//                 <HeaderAlert error={error} message={message} />
//             }

//             <Container className="my-5">
//                 <Row>
//                     <Col lg={8} className="mb-5 mb-lg-0 pe-md-5">
//                         <h5 className="fw-bold font-22 text-blue-500-color mb-4">Payment</h5>
//                         <Form className="card-details bg-gray-300-color px-4 py-5" onSubmit={(e) => submitHandler(e)}>
//                             <h5 className="fw-bold font-18 text-blue-500-color mb-4">Contact Information</h5>
//                             <span className="fw-bold font-16">{user.name}</span>
//                             <p className="font-16 m-0">{shippingInfo.address}, {shippingInfo.landmark ? `${shippingInfo.landmark},` : ""} {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.pinCode}</p>
//                             <p className="font-16 m-0">+91 {shippingInfo.phoneNo}</p>
//                             <p className="font-16 mb-5">{user.email}</p>

//                             <h5 className="fw-bold font-18 text-blue-500-color mb-4">Card Details</h5>
//                             <Form.Group className="mb-3" controlId="cardNumber">
//                                 <Form.Label>Card Number</Form.Label>
//                                 <CardNumberElement className="form-control py-2 card-details-input mb-2" onChange={(e) => handleStripeValidation(e, "cardError")} />
//                                 {
//                                     stripeValidation.cardError ?
//                                         <span className="text-danger">
//                                             {stripeValidation.cardError}
//                                         </span>
//                                         : null
//                                 }
//                             </Form.Group>
//                             <Stack className="flex-column flex-md-row mb-4" gap={3}>
//                                 <Form.Group className="w-100" controlId="cardExpiry">
//                                     <Form.Label>Card Expiry</Form.Label>
//                                     <CardExpiryElement className="form-control py-2 card-details-input mb-1" onChange={(e) => handleStripeValidation(e, "expiryMonthError")} />
//                                     {
//                                         stripeValidation.expiryMonthError ?
//                                             <span className="text-danger">
//                                                 {stripeValidation.expiryMonthError}
//                                             </span>
//                                             : null
//                                     }
//                                 </Form.Group>
//                                 <Form.Group className="w-100" controlId="cardCVV">
//                                     <Form.Label>Card CVV</Form.Label>
//                                     <CardCvcElement className="form-control py-2 card-details-input mb-1" onChange={(e) => handleStripeValidation(e, "cvvError")} />
//                                     {
//                                         stripeValidation.cvvError ?
//                                             <span className="text-danger">
//                                                 {stripeValidation.cvvError}
//                                             </span>
//                                             : null
//                                     }
//                                 </Form.Group>
//                             </Stack>
//                             <Button type="submit" className="w-100 font-lato font-14 fw-bold bg-green-100-color border-0 p-2 mb-2" ref={payBtn}>Pay ₹{orderInfo && Math.floor(orderInfo.grandTotal)}.00</Button>
//                         </Form>
//                     </Col>

//                     <Col lg={4}>
//                         <h5 className="fw-bold font-22 text-blue-500-color text-center mb-4">Order Summary</h5>
//                         <div className="payment-order-details overflow-auto mb-5">
//                             {
//                                 cartItems && cartItems.map(item => {
//                                     return (
//                                         <CartItems key={item.product} item={item} />
//                                     )
//                                 })
//                             }
//                         </div>
//                         <CartTotals cartItems={cartItems} totalPrice={orderInfo.totalPrice} shippingPrice={orderInfo.shippingPrice} gstPrice={orderInfo.gstPrice} grandTotal={orderInfo.grandTotal} />
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     )
// };

// export default Payment;
