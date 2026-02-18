import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
    Loader2, Users, Building2, Activity, Server,
    AlertTriangle, CheckCircle, TrendingUp, ShieldAlert,
    Ticket, Bell
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/admin/analytics');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SuperAdmin Governance</h1>
                    <p className="text-muted-foreground">Platform health, compliance, and organization oversight.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Bell className="mr-2 h-4 w-4" /> Announcements</Button>
                    <Button variant="destructive"><ShieldAlert className="mr-2 h-4 w-4" /> Security Mode</Button>
                </div>
            </div>

            {/* Platform Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Organizations"
                    value={stats.totalOrgs}
                    subValue={`${stats.activeOrgs} Active`}
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    subValue={`${stats.totalEmployments} Employed`}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="API Requests"
                    value={stats.apiRequests?.toLocaleString()}
                    subValue="Last 24h"
                    icon={<Server className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="System Health"
                    value="99.9%"
                    subValue={`Error Rate: ${stats.errorRate}%`}
                    icon={<Activity className="h-4 w-4 text-green-500" />}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Global Audit Logs */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            Global Activity Stream
                        </h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {stats.recentLogs?.map(log => (
                            <div key={log.id} className="flex items-start gap-4 text-sm border-b border-muted pb-3 last:border-0 last:pb-0">
                                <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="font-medium">{log.action}</p>
                                    <p className="text-muted-foreground">{log.user}</p>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance & Ticket Monitor */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-primary" />
                            Support & Compliance
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="font-medium text-orange-500">Pending KYC Verifications</p>
                                    <p className="text-xs text-muted-foreground">3 Companies waiting</p>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary">Review</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex gap-3">
                                <Ticket className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-blue-500">Open Support Tickets</p>
                                    <p className="text-xs text-muted-foreground">12 Active Tickets</p>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary">Manage</Button>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-500">System Status</p>
                                    <p className="text-xs text-muted-foreground">All systems operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Overview */}
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <h3 className="font-semibold mb-4">Subscription Distribution</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold">{stats.planStats?.free || 0}</div>
                        <div className="text-sm text-muted-foreground">Free Plan</div>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{stats.planStats?.pro || 0}</div>
                        <div className="text-sm text-muted-foreground">Pro Plan</div>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-2xl font-bold text-purple-500">{stats.planStats?.enterprise || 0}</div>
                        <div className="text-sm text-muted-foreground">Enterprise</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

const StatsCard = ({ title, value, subValue, icon }) => (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{title}</h3>
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subValue}</p>
        </div>
    </div>
);

export default AdminDashboard;
