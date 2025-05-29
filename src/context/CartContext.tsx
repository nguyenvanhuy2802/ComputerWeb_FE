import React, {createContext, useContext, useEffect, useState} from "react";
import {countCartItems} from "../api/cartItemApi";
import {useUser} from "./UserContext";

interface CartContextType {
    cartCount: number;
    refreshCartCount: () => Promise<void>;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [cartCount, setCartCount] = useState(0);
    const {cart} = useUser();

    const refreshCartCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !cart) return;
            const count = await countCartItems(cart.cartId);
            setCartCount(count);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng giỏ hàng:", error);
        }
    };

    useEffect(() => {
        if (cart) {
            refreshCartCount();
        }
    }, [cart]);


    return (
        <CartContext.Provider value={{cartCount, refreshCartCount, setCartCount}}>
            {children}
        </CartContext.Provider>
    );
};
