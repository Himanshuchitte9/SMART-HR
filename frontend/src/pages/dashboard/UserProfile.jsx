import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import api from '../../services/api';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/user/profile');
            setProfile(data);
            setFormData(data.profile);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async () => {
        try {
            const { data } = await api.patch('/user/profile', formData);
            setProfile(data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Universal Identity</h1>
                <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold">
                            {profile.profile?.firstName?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{profile.profile?.firstName} {profile.profile?.lastName}</h2>
                            <p className="text-muted-foreground">{profile.email}</p>
                            <div className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
                                Reputation Score: 780
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>First Name</Label>
                                <Input
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Bio</Label>
                                <Input
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleUpdate}>Save Changes</Button>
                        </div>
                    ) : (
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="font-semibold block">Bio</span>
                                <p className="text-muted-foreground">{profile.profile?.bio || 'No bio added yet.'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills & Experience Placeholder */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Node.js', 'Team Leadership', 'Project Management'].map(skill => (
                                <span key={skill} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                    {skill}
                                </span>
                            ))}
                            <Button variant="ghost" size="sm" className="h-6 text-xs">+ Add</Button>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Experience</h3>
                        <div className="border-l-2 border-muted pl-4 space-y-4">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary"></div>
                                <h4 className="font-medium">Senior Developer at Tech Corp</h4>
                                <p className="text-xs text-muted-foreground">2023 - Present</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted"></div>
                                <h4 className="font-medium">Junior Developer at Startup Inc</h4>
                                <p className="text-xs text-muted-foreground">2021 - 2023</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
