import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UploadArea() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Simpan file
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidImage = (file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        return validTypes.includes(file.type);
    };


    const handleFile = (file: File) => {
        if (isValidImage(file)) {
            setFileName(file.name);
            setSelectedFile(file); // Simpan file ke state
        } else {
            alert("Only JPG and PNG files are supported.");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile || !isValidImage(selectedFile)) {
            alert("Please select a valid JPG or PNG image.");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("No token available, please login!");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'https://plantcare.up.railway.app/api/predict',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            navigate(`/history/${response.data.data.id}`);
        } catch (err: any) {
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data || "Something went wrong.";

                switch (status) {
                    case 400:
                        toast.error(`Bad Request: ${message}`);
                        break;
                    case 401:
                        toast.error("Unauthorized: Please log in again.");
                        break;
                    case 403:
                        toast.error("Forbidden: You don't have permission.");
                        break;
                    case 500:
                        toast.error("Server error. Please try again later.");
                        break;
                    default:
                        toast.error(`Error ${status}: ${message}`);
                }
            } else if (err.request) {
                // Request was made but no response received
                toast.error("No response from server. Please check your internet connection.");
            } else {
                // Something else happened
                toast.error(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div
                className={`flex flex-col justify-center items-center w-full h-52 border mt-5 rounded-lg border-dashed ${dragging ? 'border-green-600 bg-green-50' : 'border-gray-400 bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                <img src="/assets/upload.svg" alt="Upload Icon" className="w-10 h-10 mb-2" />
                <div>Drag and drop your plant image here</div>
                <div className="text-[#2E7D32]">or click to browse</div>
                <div className="text-gray-400">Supports: JPG, PNG</div>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {fileName && <div className="mt-2 text-gray-600">File Uploaded: {fileName}</div>}
            </div>

            {fileName && (
                <div className="mt-4">
                    <button
                        onClick={handleSubmit}
                        className={`w-full p-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2E7D32] hover:cursor-pointer'}`}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload and Predict'}
                    </button>
                </div>
            )}
        </div>
    );
}
