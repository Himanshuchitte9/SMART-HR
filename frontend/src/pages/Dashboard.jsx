import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { institutesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Building2, Users, GitBranch, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInstitutes();
    }, []);

    const loadInstitutes = async () => {
        try {
            const response = await institutesAPI.getMyInstitutes();
            setInstitutes(response.data);
        } catch (error) {
            console.error('Failed to load institutes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            APPROVED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Approved' },
            REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Rejected' },
        };
        const badge = badges[status] || badges.PENDING;
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                <Icon className="w-4 h-4 mr-1" />
                {badge.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        {user?.purpose === 'OWNER' ? 'Manage your institutes and teams' : 'View your work and applications'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Institutes</p>
                                <p className="text-3xl font-bold mt-2">{institutes.length}</p>
                            </div>
                            <Building2 className="w-12 h-12 text-blue-200" />
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Active Roles</p>
                                <p className="text-3xl font-bold mt-2">-</p>
                            </div>
                            <GitBranch className="w-12 h-12 text-purple-200" />
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Team Members</p>
                                <p className="text-3xl font-bold mt-2">-</p>
                            </div>
                            <Users className="w-12 h-12 text-green-200" />
                        </div>
                    </div>
                </div>

                {/* Institutes List */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">My Institutes</h2>
                        {user?.purpose === 'OWNER' && (
                            <button
                                onClick={() => navigate('/institutes')}
                                className="btn-primary flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Institute
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-gray-600">Loading institutes...</p>
                        </div>
                    ) : institutes.length === 0 ? (
                        <div className="text-center py-12">
                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No institutes found</p>
                            {user?.purpose === 'OWNER' && (
                                <button onClick={() => navigate('/institutes')} className="btn-primary">
                                    Create Your First Institute
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {institutes.map((institute) => (
                                <div
                                    key={institute.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/roles/${institute.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                                                <Building2 className="w-6 h-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{institute.name}</h3>
                                                <p className="text-sm text-gray-500">{institute.type}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(institute.status)}
                                    </div>
                                    {institute.address && (
                                        <p className="text-sm text-gray-600 mb-2">{institute.address}</p>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            Created {new Date(institute.created_at).toLocaleDateString()}
                                        </span>
                                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                                            View Roles →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
