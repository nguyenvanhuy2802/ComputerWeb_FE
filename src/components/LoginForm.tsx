import React, {useState} from "react";
import {LoginData} from '../types/User';
import  "../css/loginForm.css";

interface LoginFormProps {
    onLogin: (data: LoginData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin}) => {
    const [formData, serFormData] = useState<LoginData>({username: '', password: ''});
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        serFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập đầy đủ Username và Password!!");
            return;
        }
        setError('');
        onLogin(formData);
    };
    return (
        <div className={"container"}>
            <div className={"login-box"}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input type="text" id={"username"} name={"username"} value={formData.username}
                               onChange={handleChange} required placeholder=""/>
                        <label htmlFor={"username"}>Username</label>
                    </div>
                    <div className="input-box">
                        <input type="password" id={"password"} name={"password"} value={formData.password}
                               onChange={handleChange} required placeholder=""/>
                        <label htmlFor={"password"}>Password</label>
                    </div>
                    <div className="forgot-pass">
                        <a href="#">Forgot your password?</a>
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <div className="signup-link">
                        <a href="#">Signup</a>
                    </div>
                </form>
            </div>
        </div>
    );

};
export default LoginForm;