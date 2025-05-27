import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://plantcare.up.railway.app/api/auth/signin", form);
            toast.success("Login successfully!");
            localStorage.setItem("token", response.data.data.token);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Login failed.";
            toast.error(errorMessage);
        }
    };
    return (
        <div className="flex">
            <div className="hidden md:block relative w-1/2 h-screen">
                <img
                    src="/assets/hero_image_login.png"
                    className="h-screen w-full object-cover"
                    alt="Hero Image Login"
                />

                <div className="absolute inset-0 bg-[#2E7D32] opacity-50 z-10"></div>

                <img
                    src="/assets/logo.svg"
                    alt="Logo"
                    className="absolute top-6 left-6 w-32 z-20"
                />
            </div>


            <div className="flex justify-center items-center w-full h-screen md:w-1/2">
                <div className="w-3/4 sm:w-1/2">
                    <div className=" mb-6">
                        <div className="font-bold text-3xl mb-2">Welcome Back</div>
                        <div className="text-lg text-gray-600">Login to access your plant health dashboard</div>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-600">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-600">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                type="submit"
                                className="w-full bg-[#2E7D32] text-white py-3 rounded-lg focus:outline-none hover:bg-[#2E7D32]"
                            >
                                Login
                            </button>


                            <div className="text-center mt-3">
                                Don't have an account? <Link to="/auth/register" className="text-blue-500 underline">Register</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
