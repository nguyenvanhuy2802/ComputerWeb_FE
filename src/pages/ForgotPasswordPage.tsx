import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp, resetPassword } from "../api/forgotpassApi";
import "../css/ForgotPasswordPage.css";

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [email, setEmail] = useState("");
    const [tempToken, setTempToken] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const clearMsg = () => {
        setMessage("");
        setError("");
    };

    const onSendOtp = async (data: any) => {
        clearMsg();
        try {
            await sendOtp({ email: data.email });
            setEmail(data.email);
            setMessage("Đã gửi OTP về email.");
            setStep("otp");
        } catch {
            setError("Không thể gửi OTP. Vui lòng thử lại.");
        }
    };

    const onVerifyOtp = async (data: any) => {
        clearMsg();
        try {
            const result = await verifyOtp({ email, otp: data.otp });
            setTempToken(result.tempToken);
            setMessage("Xác thực thành công!");
            setStep("reset");
        } catch {
            setError("OTP không đúng hoặc đã hết hạn.");
        }
    };

    const onResetPassword = async (data: any) => {
        clearMsg();
        try {
            await resetPassword({
                email,
                tempToken,
                newPassword: data.newPassword
            });
            setMessage("Đặt lại mật khẩu thành công!");
            setTimeout(() => navigate("/login"), 1500);
        } catch {
            setError("Đặt lại mật khẩu thất bại.");
        }
    };

    return (
        <div className="forgot-wrapper">
            <form className="form-box" onSubmit={
                step === "email" ? handleSubmit(onSendOtp) :
                    step === "otp" ? handleSubmit(onVerifyOtp) :
                        handleSubmit(onResetPassword)
            }>
                <h2 className="text-center">Quên mật khẩu</h2>

                {message && <div className="success-msg">{message}</div>}
                {error && <div className="error-msg">{error}</div>}

                {step === "email" && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            //react-hook-form để validate cho đẹp
                            {...register("email", {
                                required: "Email bắt buộc",
                                pattern: { value: /^\S+@\S+$/, message: "Email không hợp lệ" },
                            })}
                        />
                        {errors.email && <span className="error-text">{errors.email.message?.toString()}</span>}
                        <button type="submit">Gửi OTP</button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <input
                            type="text"
                            placeholder="Nhập mã OTP (6 số)"
                            {...register("otp", {
                                required: "OTP bắt buộc",
                                pattern: { value: /^\d{6}$/, message: "OTP phải gồm 6 số" },
                            })}
                        />
                        {errors.otp && <span className="error-text">{errors.otp.message?.toString()}</span>}
                        <button type="submit">Xác thực OTP</button>
                    </>
                )}

                {step === "reset" && (
                    <>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            {...register("newPassword", {
                                required: "Mật khẩu không được bỏ trống",
                                minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
                            })}
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword.message?.toString()}</span>}

                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            {...register("confirmPassword", {
                                validate: (value) =>
                                    value === watch("newPassword") || "Mật khẩu không khớp",
                            })}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message?.toString()}</span>}
                        <button type="submit">Đặt lại mật khẩu</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
