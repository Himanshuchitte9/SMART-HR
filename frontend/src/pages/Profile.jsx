import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { usersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase } from 'lucide-react';

export default function Profile() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await usersAPI.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card">
                    <div className="flex items-center mb-8">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mr-6">
                            <User className="w-10 h-10 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                            <p className="text-gray-600">{profile?.purpose}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <Mail className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{profile?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Phone className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Mobile</p>
                                <p className="font-medium text-gray-900">{profile?.mobile}</p>
                            </div>
                        </div>

                        {profile?.address && (
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="font-medium text-gray-900">{profile.address}</p>
                                </div>
                            </div>
                        )}

                        {profile?.qualification && (
                            <div className="flex items-start">
                                <GraduationCap className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600">Qualification</p>
                                    <p className="font-medium text-gray-900">{profile.qualification}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start">
                            <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Experience</p>
                                <p className="font-medium text-gray-900">{profile?.experience_years} years</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <User className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-medium text-gray-900">{profile?.gender || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Member since {new Date(profile?.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
