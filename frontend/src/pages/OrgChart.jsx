import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { rolesAPI, institutesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { GitBranch } from 'lucide-react';

export default function OrgChart() {
    const { instituteId } = useParams();
    const [institute, setInstitute] = useState(null);
    const [orgChart, setOrgChart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [instituteId]);

    const loadData = async () => {
        try {
            const [instituteRes, chartRes] = await Promise.all([
                institutesAPI.getById(instituteId),
                rolesAPI.getOrgChart(instituteId),
            ]);
            setInstitute(instituteRes.data);
            setOrgChart(chartRes.data);
        } catch (error) {
            console.error('Failed to load org chart:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderNode = (node, depth = 0) => {
        return (
            <div key={node.id} className="mb-4">
                <div
                    className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    style={{ marginLeft: `${depth * 40}px` }}
                >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                        <GitBranch className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{node.name}</h3>
                        <p className="text-sm text-gray-600">Level {node.level}</p>
                        {node.description && (
                            <p className="text-sm text-gray-500 mt-1">{node.description}</p>
                        )}
                    </div>
                </div>

                {node.children && node.children.length > 0 && (
                    <div className="mt-4">
                        {node.children.map((child) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {institute?.name} - Organization Chart
                    </h1>
                    <p className="text-gray-600">Visual representation of role hierarchy</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600">Loading organization chart...</p>
                    </div>
                ) : orgChart.length === 0 ? (
                    <div className="card text-center py-12">
                        <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No roles found in this institute</p>
                    </div>
                ) : (
                    <div className="card">
                        {orgChart.map((node) => renderNode(node))}
                    </div>
                )}
            </div>
        </div>
    );
}
