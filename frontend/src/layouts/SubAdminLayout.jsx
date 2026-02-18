import React from 'react';
import {
    LayoutDashboard, Users, BrainCircuit, Network, TrendingUp, Rss, User, Settings, LifeBuoy, MessageCircle,
} from 'lucide-react';
import PanelShell from './PanelShell';

const menuItems = [
    { label: 'Dashboard', path: '/subadmin/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/subadmin/profile', icon: User },
    { label: 'Employees', path: '/subadmin/employees', icon: Users },
    { label: 'Recruitment', path: '/subadmin/recruitment', icon: BrainCircuit },
    { label: 'Org Chart', path: '/subadmin/org-chart', icon: Network },
    { label: 'Performance', path: '/subadmin/performance', icon: TrendingUp },
    { label: 'Feed', path: '/subadmin/feed', icon: Rss },
    { label: 'Network', path: '/subadmin/network', icon: Users },
    { label: 'Chat', path: '/subadmin/chat', icon: MessageCircle },
    { label: 'Help', path: '/subadmin/help', icon: LifeBuoy },
    { label: 'Settings', path: '/subadmin/settings', icon: Settings },
];

const SubAdminLayout = () => (
    <PanelShell
        panelName="SubAdmin Panel"
        brand="SMARTHR-360"
        subtitle="Department Administration"
        menuItems={menuItems}
    />
);

export default SubAdminLayout;
