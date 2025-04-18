// UploadImage.tsx
import React, { useState } from "react";

const UploadImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:8080/api/auth/upload-imgur", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setImageUrl(data.link);
        console.log(data.link)
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange} />
    <button onClick={handleUpload}>Upload</button>
    {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
);
};

export default UploadImage;
