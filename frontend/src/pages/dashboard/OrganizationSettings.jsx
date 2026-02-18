import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Building2, Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

const OrganizationSettings = () => {
    const { organization, setOrganization } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchOrgSettings();
    }, []);

    const fetchOrgSettings = async () => {
        try {
            const { data } = await api.get('/organization');
            setOrganization(data); // Update store
            setValue('name', data.name);
            setValue('branding.primaryColor', data.settings?.branding?.primaryColor || '#000000');
        } catch (error) {
            console.error('Failed to fetch org settings:', error);
        } finally {
            setFetching(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = {
                name: data.name,
                branding: {
                    primaryColor: data.branding.primaryColor
                }
            };
            const { data: updatedOrg } = await api.patch('/organization', payload);
            setOrganization(updatedOrg);
            alert('Organization settings updated successfully!');
        } catch (error) {
            console.error('Failed to update org:', error);
            alert('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="text-center p-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Organization Found</h3>
                <p className="text-muted-foreground">You don't seem to have an active organization context.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
                    <p className="text-muted-foreground">Manage your company profile and branding.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* General Settings Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Building2 className="h-24 w-24" />
                    </div>

                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        General Information
                    </h3>

                    <div className="grid gap-6 max-w-xl">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Organization Name</Label>
                            <Input
                                id="name"
                                placeholder="Acme Corp"
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Primary Brand Color</Label>
                            <div className="flex gap-4 items-center">
                                <div className="relative">
                                    <input
                                        type="color"
                                        className="h-12 w-12 rounded-lg border-2 border-border cursor-pointer overflow-hidden p-0"
                                        {...register('branding.primaryColor')}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        placeholder="#000000"
                                        {...register('branding.primaryColor')}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">This color will be used for your invoices and employee portal.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="min-w-[140px]">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default OrganizationSettings;
