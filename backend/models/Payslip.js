import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    salaryDetails: {
        basicSalary: Number,
        hra: Number,
        da: Number,
        deductions: Number,
        netSalary: Number
    },
    attendanceDays: {
        type: Number,
        default: 0
    },
    leaveDays: {
        type: Number,
        default: 0
    },
    pdfPath: String,
    generatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure one payslip per user per month
payslipSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Payslip = mongoose.model('Payslip', payslipSchema);

export default Payslip;
