import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Building2, Users, GitBranch, User } from 'lucide-react';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            SmartHR
                        </h1>
                        <div className="ml-10 flex space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/institutes')}
                                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                            >
                                Institutes
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.purpose}</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <User className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
