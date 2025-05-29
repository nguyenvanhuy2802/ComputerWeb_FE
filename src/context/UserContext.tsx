import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUserId } from "../api/userApi";
import { getCartByCustomerId } from "../api/cartApi";

interface UserContextType {
    userId: number | null;
    cart: { cartId: number } | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [cart, setCart] = useState<{ cartId: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await getCurrentUserId();
                setUserId(id);
                const cartData = await getCartByCustomerId(id);
                setCart(cartData);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng hoặc giỏ hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ userId, cart, loading }}>
            {children}
        </UserContext.Provider>
    );
};
