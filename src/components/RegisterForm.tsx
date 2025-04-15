import React, {useState} from 'react';
import {RegisterData} from "../types/User";
import "../css/registerForm.css";
import {Link} from "react-router-dom";
import {uploadAvatar} from "../api/imageApi";
import {validateRegisterData} from "../validation/validation";

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
        profileImage: '',
    });

    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target;

        if (name === 'avatar' && files && files[0]) {
            setAvatarFile(files[0]);
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateRegisterData(formData, avatarFile);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        let avatarUrl = '';
        try {
            if (avatarFile) {
                avatarUrl = await uploadAvatar(avatarFile);
                console.log("Upload avatar success!:", avatarUrl);
            }
        } catch (err) {
            console.error("Upload avatar failed", err);
            setErrors({ avatar: "Upload avatar failed" });
            setLoading(false);
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;

        const finalData: RegisterData = {
            ...dataToSend,
            profileImage: avatarUrl,
        };

        try {
            await onRegister(finalData);
        } catch (error) {
            console.error("onRegister failed", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={"register-container"}>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p className="loading-text">Loading...</p>
                </div>
            )}
            <div className="register-box">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Full Name', name: 'name', type: 'text' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Phone', name: 'phone', type: 'tel' },
                        { label: 'Address', name: 'address', type: 'text' },
                        { label: 'Username', name: 'username', type: 'text' },
                        { label: 'Password', name: 'password', type: 'password' },
                        { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
                    ].map(({ label, name, type }) => (
                        <div className="input-group" key={name}>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={(formData as any)[name]}
                                onChange={handleChange}
                                required
                                placeholder={""}
                            />
                            <label>{label}</label>
                            {errors[name] && <span className="error-text">{errors[name]}</span>}
                        </div>
                    ))}
                    <div className="input-group file-upload">
                        <input type="file" accept="image/*" id="avatar" name="avatar" onChange={handleChange} required />
                        <label className="file-label">Avatar</label>
                        {errors.avatar && <span className="error-text">{errors.avatar}</span>}
                    </div>

                    <button type="submit" className="btn">Register</button>
                    <p className="login-link">Already have an account? <Link to="/">Login here</Link></p>
                </form>
            </div>
        </div>
    );
};
export default RegisterForm;