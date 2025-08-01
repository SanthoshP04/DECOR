import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import axios from "axios";
import { SET_LOADER_PROGRESS } from "../constants/cartConstants";

// add to Cart
export const addToCart = (name, id, quantity) => async (dispatch, getState) => {
    dispatch({
        type: SET_LOADER_PROGRESS,
        headerLoading: 0
    });

    try {
        const { data } = await axios.get(`/api/v1/product/${name}/${id}`);

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity
            }
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
    } catch (error) {
        console.error("Error adding to cart:", error);
    } finally {
        dispatch({
            type: SET_LOADER_PROGRESS,
            headerLoading: 100
        });
    }
};

// Remove from cart
export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: id
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Clear entire cart
export const clearCart = () => async (dispatch) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: null // Special value to clear all
    });

    localStorage.removeItem("cartItems");
};

// Save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
};

// import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
// import axios from "axios";
// import { SET_LOADER_PROGRESS } from "../constants/cartConstants";

// // add to Cart
// export const addToCart = (name, id, quantity) => async (dispatch, getState) => {
//     dispatch({
//         type: SET_LOADER_PROGRESS,
//         headerLoading: 0
//     });

//     const { data } = await axios.get(
//         `/api/v1/product/${name}/${id}`
//     );

//     dispatch({
//         type: ADD_TO_CART,
//         payload: {
//             product: data.product._id,
//             name: data.product.name,
//             price: data.product.price,
//             image: data.product.images[0].url,
//             stock: data.product.stock,
//             quantity
//         }
//     });

//     dispatch({
//         type: SET_LOADER_PROGRESS,
//         headerLoading: 50
//     });

//     localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

//     dispatch({
//         type: SET_LOADER_PROGRESS,
//         headerLoading: 100
//     });
// };

// // Remove from cart
// export const removeFromCart = (id) => async (dispatch, getState) => {
//     dispatch({
//         type: REMOVE_FROM_CART,
//         payload: id
//     });

//     localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
// };

// // Save shipping info
// export const saveShippingInfo = (data) => async (dispatch) => {
//     dispatch({
//         type: SAVE_SHIPPING_INFO,
//         payload: data
//     });

//     localStorage.setItem("shippingInfo", JSON.stringify(data));
// };