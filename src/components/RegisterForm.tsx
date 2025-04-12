import react, {useState} from 'react';
import {RegisterData} from "../types/User";
import  "../css/registerForm.css";

interface RegisterFormProps {
    onRegister: (data: RegisterData) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onRegister}) => {
    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '',
    });

    const [error, setError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;

        if (name === 'avatar' && files) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setFormData({...formData, avatar: fileReader.result as string});
            }
            fileReader.readAsDataURL(files[0])
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu không khớp!");
            return;
        }
        setError('');
        onRegister(formData);
    };

    return (
        <div className={"register-container"}>
            <div className="register-box">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text"
                               id={"name"} name={"name"} value={formData.name} onChange={handleChange} required
                               placeholder=""/>
                        <label>Full Name</label>
                    </div>
                    <div className="input-group">
                        <input type="email" id={"email"} name={"email"} value={formData.email} onChange={handleChange}
                               required placeholder=""/>
                        <label>Email</label>
                    </div>
                    <div className="input-group">
                        <input type="tel" id={"phone"} name={"phone"} value={formData.phone} onChange={handleChange}
                               required placeholder=""/>
                        <label>Phone</label>
                    </div>
                    <div className="input-group">
                        <input type="text" id={"address"} name={"address"} value={formData.address} onChange={handleChange}
                               required placeholder=""/>
                        <label>Address</label>
                    </div>
                    <div className="input-group">
                        <input type="text" id={"username"} name={"username"} value={formData.username} onChange={handleChange}
                               required placeholder=""/>
                        <label>Username</label>
                    </div>
                    <div className="input-group">
                        <input type="password" id={"password"} name={"password"} value={formData.password} onChange={handleChange}
                               required placeholder=""/>
                        <label>Password</label>
                    </div>
                    <div className="input-group">
                        <input type="password" id={"confirmPassword"} name={"confirmPassword"} value={formData.confirmPassword} onChange={handleChange}
                               required placeholder=""/>
                        <label>Confirm Password</label>
                    </div>
                    <div className="input-group file-upload">
                        <input type="file" accept="image/*" id={"avatar"} name={"avatar"} value={formData.avatar}
                               onChange={handleChange} required placeholder=""/>
                        <label className="file-label">Avatar</label>
                    </div>
                    <button type="submit" className="btn">Register</button>
                    <p className="login-link">Already have an account? <a href="login.html">Login here</a></p>
                </form>
            </div>
        </div>
    );
};
export default RegisterForm;