import { CartProvider } from 'react-use-cart';

interface CartWrapperProps {
    children: React.ReactNode;
    cartId: string;
    
}

function CartWrapper({ children, cartId }: CartWrapperProps) {
  return <CartProvider id={cartId}>{children}</CartProvider>;
}

export default CartWrapper