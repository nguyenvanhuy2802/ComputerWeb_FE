import React, {useState} from "react";
import {LoginData} from '../types/User';
import  "../css/loginForm.css";
import { Link } from 'react-router-dom';
import {validateLoginData} from "../validation/validation";

interface LoginFormProps {
    onLogin: (data: LoginData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
    const [formData, serFormData] = useState<LoginData>({username: '', password: ''});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        serFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      const validationErrors = validateLoginData(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            await onLogin(formData);
        } catch (error) {
            console.error("onLogin failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"container"}>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p className="loading-text">Loading...</p>
                </div>
            )}
            <div className={"login-box"}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="text" id={"username"} name={"username"} value={formData.username}
                               onChange={handleChange} required placeholder=""/>
                        <label>Username</label>
                        {errors["username"] && <span className="error-text">{errors["username"]}</span>}

                    </div>
                    <div className="input-box">
                        <input type="password" id={"password"} name={"password"} value={formData.password}
                               onChange={handleChange} required placeholder=""/>
                        <label>Password</label>
                        {errors["password"] && <span className="error-text">{errors["password"]}</span>}

                    </div>
                    <div className="forgot-pass">
                        <a href="#">Forgot your password?</a>
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <div className="signup-link">
                        <div className="signup-link">
                            <Link to="/register">Signup</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
);

};
export default LoginForm;