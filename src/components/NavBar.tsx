import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
    const [user, setUser] = useState({ email: '', username: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate(); // ← pindah ke atas, sebelum digunakan

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/auth/login');
                return;
            }

            try {
                const response = await axios.get("https://plantcare.up.railway.app/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        toast.error("Token invalid, please login!");
                        navigate('/auth/login');
                    } else {
                        toast.error(error.response?.data?.message || "Failed to fetch user.");
                    }
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <nav className='sticky top-0 z-50 bg-white border-b border-b-gray-200 px-5 py-3'>
            <div className='flex justify-between items-center'>
                <div className="flex items-center justify-center gap-2">
                    <img src="/assets/icon.svg" alt="Logo PlantCare" className="h-8 w-8" />
                    <span className='font-semibold text-lg'>PlantCare AI</span>
                </div>
                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <ul className='hidden md:flex items-center gap-10'>
                    <li><Link to='/' className="hover:underline">Dashboard</Link></li>
                    <li><Link to='/history' className="hover:underline">History</Link></li>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='flex items-center gap-2 focus:outline-none'
                        >
                            <img src="/assets/user.svg" alt="User Icon" className='h-6 w-6 self-center' />
                            <div className='flex flex-col text-sm items-start text-left'>
                                <span className='font-bold'>{user.email}</span>
                                <span>{user.username}</span>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </ul>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-3">
                    <ul className='flex flex-col gap-4'>
                        <li><Link to='/' onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link></li>
                        <li><Link to='/history' onClick={() => setIsMobileMenuOpen(false)}>History</Link></li>
                        <li className='flex items-start gap-2'>
                            <img src="/assets/user.svg" alt="User Icon" className='h-6 w-6' />
                            <div className='flex flex-col text-sm'>
                                <span className='font-bold'>{user.email}</span>
                                <span>{user.username}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
