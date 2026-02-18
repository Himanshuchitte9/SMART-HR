import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { UserPlus, Search, User, Briefcase, MapPin, Loader2 } from 'lucide-react';

const NetworkPage = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const { data } = await api.get('/network/suggestions');
            setSuggestions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await api.post(`/network/connect/${userId}`);
            // Remove from list or change state
            setSuggestions(suggestions.filter(u => u._id !== userId));
            alert('Connection Request Sent');
        } catch (error) {
            alert('Failed to connect');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Network</h1>
                    <p className="text-muted-foreground">Grow your professional connections.</p>
                </div>
                <div className="relative w-full max-w-xs hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search people..."
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">People You May Know</h3>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
                ) : suggestions.length === 0 ? (
                    <p className="text-muted-foreground">No suggestions found.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {suggestions.map(user => (
                            <div key={user._id} className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col items-center text-center space-y-3 relative group">
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-t-xl z-0"></div>
                                <div className="h-20 w-20 rounded-full bg-background border-4 border-card flex items-center justify-center overflow-hidden z-10 relative">
                                    {user.profile?.avatar ? (
                                        <img src={user.profile.avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-10 w-10 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="z-10 relative">
                                    <h4 className="font-bold text-lg">{user.firstName} {user.lastName}</h4>
                                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                        <Briefcase className="h-3 w-3" /> {user.headline || 'Member'}
                                    </div>
                                    {user.profile?.city && (
                                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" /> {user.profile.city}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full pt-2 z-10 relative">
                                    <Button variant="outline" className="w-full" onClick={() => handleConnect(user._id)}>
                                        <UserPlus className="mr-2 h-4 w-4" /> Connect
                                    </Button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkPage;
