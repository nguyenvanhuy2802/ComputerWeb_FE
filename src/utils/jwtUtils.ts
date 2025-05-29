import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    role?: string;
}

export const getUserRoleFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role || null;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
