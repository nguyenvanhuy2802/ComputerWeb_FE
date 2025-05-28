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
        <div className="login-form-container">
            {loading && (
                <div className="login-form-loading-overlay">
                    <div className="login-form-loading-spinner" />
                    <p className="login-form-loading-text">Loading...</p>
                </div>
            )}
            <div className="login-form-box">
                <h2 className="login-form-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="login-form-input-box">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder=""
                        />
                        <label>Username</label>
                        {errors["username"] && (
                            <span className="login-form-error-text">{errors["username"]}</span>
                        )}
                    </div>
                    <div className="login-form-input-box">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder=""
                        />
                        <label>Password</label>
                        {errors["password"] && (
                            <span className="login-form-error-text">{errors["password"]}</span>
                        )}
                    </div>
                    <div className="login-form-forgot-pass">
                        <a href="/forgot-password">Forgot your password?</a>
                    </div>
                    <button type="submit" className="login-form-btn">Login</button>
                    <div className="login-form-signup-link">
                        <Link to="/register">Signup</Link>
                    </div>
                </form>
            </div>
        </div>
    );

};
export default LoginForm;