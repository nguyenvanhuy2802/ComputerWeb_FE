import { useEffect } from "react";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google?: any; // thêm dòng này để tránh lỗi TS khi dùng `window.google`
    }
}

const GoogleTranslate: React.FC = () => {
    useEffect(() => {
        // Chỉ thêm script nếu chưa có
        if (!document.querySelector("#google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "vi", // ngôn ngữ gốc của trang
                    includedLanguages: "en,fr,ja,zh-CN", // ngôn ngữ bạn muốn hỗ trợ
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };
    }, []);

    return (
        <div className="google-translate-container">
            <div id="google_translate_element"></div>
        </div>
    );
};

export default GoogleTranslate;
