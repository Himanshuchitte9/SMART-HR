import React from 'react';
import { useAuthStore } from '../../store/authStore';
import {
    Briefcase,
    CheckCircle2,
    MessageSquare,
    Users,
    UserPlus,
    DollarSign,
    Calendar,
    Settings,
    Activity
} from 'lucide-react';

const DashboardHome = () => {
    const { user } = useAuthStore();

    // Mock Data
    const stats = [
        { label: 'Total Employments', value: '1', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
        { label: 'Pending Tasks', value: '5', icon: CheckCircle2, color: 'from-amber-500 to-orange-500' },
        { label: 'New Messages', value: '3', icon: MessageSquare, color: 'from-pink-500 to-rose-500' },
        { label: 'Team Size', value: '12', icon: Users, color: 'from-violet-500 to-purple-500' },
    ];

    const activities = [
        { action: 'Logged in successfully', time: 'Just now', color: 'bg-emerald-500' },
        { action: 'Updated organization settings', time: '2 hours ago', color: 'bg-blue-500' },
        { action: 'Viewed payroll report', time: 'Yesterday', color: 'bg-violet-500' },
        { action: 'Invited new employee', time: '2 days ago', color: 'bg-rose-500' },
    ];

    const quickActions = [
        { label: 'Add Employee', icon: UserPlus },
        { label: 'Run Payroll', icon: DollarSign },
        { label: 'Create Event', icon: Calendar },
        { label: 'Settings', icon: Settings },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl glass-card p-8 text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-rose-600/50 z-0"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
                        Welcome back, <span className="bg-gradient-to-r from-violet-200 to-rose-200 bg-clip-text text-transparent">{user?.profile?.firstName || 'User'}</span>
                    </h1>
                    <p className="text-violet-100 text-lg max-w-2xl">
                        Your Universal Identity is active. Manage your organization, employees, and payroll all in one place.
                    </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="group relative overflow-hidden rounded-2xl glass-card p-6 transition-all hover:scale-[1.02] hover:shadow-xl">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.label}</h3>
                            <stat.icon className="h-6 w-6 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="pt-2">
                            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Dashboard Sections */}
            <div className="grid gap-6 md:grid-cols-7">
                {/* Recent Activity */}
                <div className="col-span-4 rounded-2xl glass-card p-6">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {activities.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className={`w-3 h-3 ${item.color} rounded-full ring-4 ring-white/10 group-hover:ring-white/20 transition-all`}></div>
                                <div>
                                    <p className="text-sm font-medium">{item.action}</p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-span-3 rounded-2xl glass-card p-6">
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-accent" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action) => (
                            <button key={action.label} className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:scale-105 transition-all gap-2">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
