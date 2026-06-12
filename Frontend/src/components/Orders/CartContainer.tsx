import React from 'react'; // 🟢 Removed useState since we no longer need local loading state
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 🟢 1. ADD THIS IMPORT
import type { RootState } from '../../store/store';
import { removeFromCart, updateCartQuantity } from '../../store/cartSlice';
import Cart from './Cart';

const CartContainer: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 🟢 2. ADD THIS LINE TO INITIALIZE NAVIGATE

    // Pull the live cart array and calculated totals from Redux
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

    // Define action dispatches mapped to match your presentation props
    const handleRemoveItem = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        dispatch(updateCartQuantity({ productId, quantity }));
    };

    // 🟢 3. REPLACE YOUR OLD handleCheckout FUNCTION WITH THIS ONE:
    const handleCheckout = () => {
        // Directly point the browser history router to the frontend checkout page path
        navigate('/checkout');
    };

    return (
        <Cart
            items={items}
            totalAmount={totalAmount}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            isLoading={false} // 🟢 Set to false since redirection happens instantly
        />
    );
};

export default CartContainer;