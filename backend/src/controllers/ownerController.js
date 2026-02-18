const Application = require('../models/Application');
const EmploymentState = require('../models/EmploymentState');
const Document = require('../models/Document');
const Organization = require('../models/Organization');
const User = require('../models/User');

exports.getHiringDashboard = async (req, res) => {
    try {
        const organizationId = req.organizationId;
        const [applications, openJobs] = await Promise.all([
            Application.find({ organizationId }).sort('-createdAt').limit(100),
            Application.aggregate([
                { $match: { organizationId } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const totalApplications = applications.length;
        const avgScore = totalApplications === 0
            ? 0
            : Math.round(applications.reduce((sum, app) => sum + (app.aiScore || 0), 0) / totalApplications);

        const topCandidates = applications
            .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
            .slice(0, 5)
            .map((item) => ({
                candidateName: item.candidateName,
                email: item.email,
                score: item.aiScore || 0,
                status: item.status,
            }));

        res.json({
            totalApplications,
            averageSkillMatch: avgScore,
            statusBreakdown: openJobs,
            candidateComparison: topCandidates,
        });
    } catch (error) {
        console.error('Owner getHiringDashboard error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getOrganizationChart = async (req, res) => {
    try {
        const rows = await EmploymentState.find({
            organizationId: req.organizationId,
            status: { $in: ['ACTIVE', 'SUSPENDED'] },
        })
            .populate('userId', 'profile email')
            .populate('roleId', 'name')
            .sort('department designation');

        const nodes = rows.map((row) => ({
            employmentId: row._id,
            userId: row.userId?._id,
            name: `${row.userId?.profile?.firstName || ''} ${row.userId?.profile?.surname || row.userId?.profile?.lastName || ''}`.trim(),
            email: row.userId?.email,
            role: row.roleId?.name || '',
            designation: row.designation || '',
            department: row.department || 'General',
            status: row.status,
        }));

        res.json({
            generatedAt: new Date(),
            totalNodes: nodes.length,
            nodes,
        });
    } catch (error) {
        console.error('Owner getOrganizationChart error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getPerformanceHeatmap = async (req, res) => {
    try {
        const rows = await EmploymentState.find({
            organizationId: req.organizationId,
            status: 'ACTIVE',
        }).populate('userId', 'profile');

        const heatmap = rows.map((row) => {
            const signal = ((row.designation?.length || 3) * 13 + (row.department?.length || 5) * 7) % 100;
            return {
                userId: row.userId?._id,
                name: `${row.userId?.profile?.firstName || ''} ${row.userId?.profile?.surname || row.userId?.profile?.lastName || ''}`.trim(),
                score: signal,
                level: signal >= 75 ? 'HIGH' : signal >= 45 ? 'MEDIUM' : 'LOW',
            };
        });

        res.json({
            generatedAt: new Date(),
            highPerformers: heatmap.filter((x) => x.level === 'HIGH').length,
            lowPerformers: heatmap.filter((x) => x.level === 'LOW').length,
            heatmap,
        });
    } catch (error) {
        console.error('Owner getPerformanceHeatmap error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.generateContract = async (req, res) => {
    try {
        const { userId, type = 'OFFER_LETTER' } = req.body;
        if (!userId) return res.status(400).json({ message: 'userId is required' });

        const [employee, org] = await Promise.all([
            User.findById(userId).select('profile email'),
            Organization.findById(req.organizationId).select('name'),
        ]);
        if (!employee || !org) {
            return res.status(404).json({ message: 'Employee or organization not found' });
        }

        const doc = await Document.create({
            organizationId: req.organizationId,
            userId,
            title: `${type.replace(/_/g, ' ')} - ${employee.profile?.firstName || 'Employee'}`,
            type,
            fileUrl: `https://docs.smarthr.local/contracts/${req.organizationId}/${userId}/${Date.now()}.pdf`,
            uploadedBy: req.user._id,
        });

        res.status(201).json({
            message: 'Contract generated',
            document: doc,
        });
    } catch (error) {
        console.error('Owner generateContract error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getEmployeeVault = async (req, res) => {
    try {
        const docs = await Document.find({
            organizationId: req.organizationId,
            userId: req.params.userId,
        }).sort('-createdAt');
        res.json(docs);
    } catch (error) {
        console.error('Owner getEmployeeVault error', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
