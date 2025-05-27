import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("https://plantcare.up.railway.app/api/auth/signup", form);
            toast.success("Registration successfully!");
            navigate('/auth/login');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="hidden md:block relative w-1/2 h-screen">
                <img
                    src="/assets/hero_image_register.png"
                    className="h-screen w-full object-cover"
                    alt="Hero Image Login"
                />

                <div className="absolute inset-0 bg-[#2E7D32] opacity-80 z-10"></div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-start text-white z-20  space-y-4">
                    <img
                        src="/assets/logo.svg"
                        alt="Logo"
                        className="w-32"
                    />
                    <div className="text-5xl font-bold">Plant Disease Detection</div>
                    <div className="text-base max-w-xs">Protect your plants with AI-powered disease detection</div>
                </div>

            </div>


            <div className="flex justify-center items-center w-full h-screen md:w-1/2">
                <div className="w-3/4 sm:w-1/2">
                    <div className=" mb-6">
                        <div className="font-bold text-3xl mb-2">Create an Account</div>
                        <div className="text-lg text-gray-600">Join our community of plant enthusiasts</div>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-gray-600">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

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
                                className={`w-full ${loading ? 'bg-gray-500' : 'bg-[#2E7D32] hover:bg-[#669968]'} text-white py-3 rounded-lg focus:outline-none `}
                            >
                                {loading ? "Loading" : "Register"}
                            </button>

                            <div className="text-center mt-3">
                                Already have an account? <Link to="/auth/login" className="text-blue-500 underline">Login</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}
