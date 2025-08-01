import React, { forwardRef } from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';

const CartTotals = forwardRef((props, ref) => {
    const { 
        cartItems = [], // Default empty array if undefined
        id, 
        checkoutHandler, 
        submitbuttonref, 
        shippingSubmit, 
        totalPrice = 0, 
        shippingPrice = 0, 
        gstPrice = 0, 
        grandTotal = 0 
    } = props;

    const location = useLocation();

    // Early return if cartItems is not an array (additional safety)
    if (!Array.isArray(cartItems)) {
        return (
            <Stack className="w-100 bg-gray-200-color border-0 p-4 rounded">
                <div className="text-danger">Cart items not available</div>
            </Stack>
        );
    }

    return (
        <Stack className="w-100 bg-gray-200-color border-0 p-4 rounded">
            <Stack direction="horizontal" className="align-items-start my-3">
                <span className="font-lato fw-semibold font-18 text-blue-500-color">Subtotal:</span>
                <Stack direction="vertical">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <span key={item.product} className="font-lato font-16 text-blue-400-color text-end">
                                ₹{(item.price * item.quantity).toFixed(2)} ({item.quantity} {item.quantity === 1 ? 'item' : 'items'})
                            </span>
                        ))
                    ) : (
                        <span className="font-lato font-16 text-blue-400-color text-end">
                            ₹0.00 (0 items)
                        </span>
                    )}
                </Stack>
            </Stack>
            
            {(location.pathname === "/shipping" || location.pathname === `/order/${id}`) && (
                <>
                    <Stack direction="horizontal" className="align-items-start my-3">
                        <span className="font-lato fw-semibold font-18 text-blue-500-color">Shipping:</span>
                        <span className="font-lato font-16 text-blue-400-color text-end">
                            ₹{shippingPrice.toFixed(2)}
                        </span>
                    </Stack>
                    <Stack direction="horizontal" className="align-items-start my-3">
                        <span className="font-lato fw-semibold font-18 text-blue-500-color">GST:</span>
                        <span className="font-lato font-16 text-blue-400-color text-end">
                            ₹{gstPrice.toFixed(2)}
                        </span>
                    </Stack>
                </>
            )}
            
            <hr className="mb-4" />
            
            <Stack direction="horizontal" className="justify-content-between my-3">
                <span className="font-lato fw-semibold font-18 text-blue-500-color">Total:</span>
                <span className="font-lato font-16 text-blue-400-color">
                    ₹{(location.pathname === "/cart" ? totalPrice : grandTotal).toFixed(2)}
                </span>
            </Stack>

            {(location.pathname !== "/process/payment" && location.pathname !== `/order/${id}`) && (
                <>
                    <hr className="mb-4" />
                    <Stack direction="horizontal" className="mb-4">
                        <img 
                            src={process.env.PUBLIC_URL + "/assets/style/check.png"} 
                            alt="check symbol" 
                            loading="lazy"
                        />
                        <span className="font-lato font-12 text-gray-100-color ms-2">
                            Shipping & taxes calculated at checkout
                        </span>
                    </Stack>
                    <Button 
                        className="w-100 font-lato font-14 fw-bold bg-green-100-color border-0 p-2 mb-2"
                        ref={submitbuttonref || ref}
                        onClick={checkoutHandler || shippingSubmit}
                        disabled={cartItems.length === 0} // Disable if cart is empty
                    >
                        {location.pathname === "/shipping" ? "Proceed To Payment" : "Proceed To Checkout"}
                    </Button>
                </>
            )}
        </Stack>
    );
});

export default CartTotals;

// import React, { forwardRef } from 'react';
// import Stack from 'react-bootstrap/esm/Stack';
// import Button from 'react-bootstrap/Button';
// import { useLocation } from 'react-router-dom';

// const CartTotals = forwardRef((props, ref) => {
//     const { cartItems, id, checkoutHandler, submitbuttonref, shippingSubmit, totalPrice, shippingPrice, gstPrice, grandTotal } = props;

//     const location = useLocation();

//     return (
//         <>
//             <Stack className="w-100 bg-gray-200-color border-0 p-4 rounded">
//                 <Stack direction="horizontal" className="align-items-start my-3">
//                     <span className="font-lato fw-semibold font-18 text-blue-500-color">Subtotal:</span>
//                     <Stack direction="vertical">
//                         {
//                             cartItems && cartItems.map(item =>
//                                 <span key={item.product} className="font-lato font-16 text-blue-400-color text-end">₹{item.price * item.quantity}.00 ({item.quantity} items)</span>
//                             )
//                         }
//                     </Stack>
//                 </Stack>
//                 {
//                     (location.pathname === "/shipping" || location.pathname === `/order/${id}`) &&
//                     <Stack direction="horizontal" className="align-items-start my-3">
//                         <span className="font-lato fw-semibold font-18 text-blue-500-color">Shipping:</span>
//                         <Stack direction="vertical">
//                             <span className="font-lato font-16 text-blue-400-color text-end">₹{Math.floor(shippingPrice)}.00</span>
//                         </Stack>
//                     </Stack>
//                 }
//                 {
//                     (location.pathname === "/shipping" || location.pathname === `/order/${id}`) &&
//                     <Stack direction="horizontal" className="align-items-start my-3">
//                         <span className="font-lato fw-semibold font-18 text-blue-500-color">GST:</span>
//                         <Stack direction="vertical">
//                             <span className="font-lato font-16 text-blue-400-color text-end">₹{Math.floor(gstPrice)}.00</span>
//                         </Stack>
//                     </Stack>
//                 }
//                 <hr className="mb-4" />
//                 <Stack direction="horizontal" className="justify-content-between my-3">
//                     <span className="font-lato fw-semibold font-18 text-blue-500-color">Total:</span>
//                     <span className="font-lato font-16 text-blue-400-color">₹{(location.pathname === "/cart") ? Math.floor(totalPrice) : Math.floor(grandTotal)}.00</span>
//                 </Stack>
//                 {
//                     (location.pathname !== "/process/payment" && location.pathname !== `/order/${id}`) &&
//                     <>
//                         <hr className="mb-4" />
//                         <Stack direction="horizontal" className="mb-4">
//                             <img src={process.env.PUBLIC_URL + "/assets/style/check.png"} alt="check symbol" />
//                             <span className="font-lato font-12 text-gray-100-color ms-2">Shipping & taxes calculated at checkout</span>
//                         </Stack>
//                         <Button className="w-100 font-lato font-14 fw-bold bg-green-100-color border-0 p-2 mb-2" submitbuttonref={submitbuttonref} onClick={checkoutHandler || shippingSubmit}>{(location.pathname === "/shipping") ? "Proceed To Payment" : "Proceed To Checkout"}</Button>
//                     </>
//                 }
//             </Stack>
//         </>
//     )
// });

// export default CartTotals
