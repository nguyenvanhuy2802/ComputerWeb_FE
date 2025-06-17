import {useLocation, useNavigate} from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

export function useRequireLogin() {
    const { userId } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    return () => {
        if (!userId) {
            toast.info("Vui lòng đăng nhập!");
            navigate("/login");
            return false;
        }
        return true;
    };
}
