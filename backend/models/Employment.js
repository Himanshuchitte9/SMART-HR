import { query, getDBType, mongoose } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const employmentSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    user_id: { type: String, ref: 'User' },
    institute_id: { type: String, ref: 'Institute' },
    role_id: { type: String, ref: 'Role' },
    manager_id: { type: String, ref: 'User' },
    work_type: { type: String, enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT'] },
    status: { type: String, default: 'ACTIVE' },
    start_date: Date,
    end_date: Date,
    created_at: { type: Date, default: Date.now }
});
const MongoEmployment = mongoose.models.Employment || mongoose.model('Employment', employmentSchema);

const Employment = {
    create: async (data) => {
        const id = uuidv4();
        const { user_id, institute_id, role_id, manager_id, work_type, start_date, end_date } = data;

        if (getDBType() === 'PG') {
            const text = `
                INSERT INTO employment_map (id, user_id, institute_id, role_id, manager_id, work_type, status, start_date, end_date)
                VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE', $7, $8)
                RETURNING *;
            `;
            const values = [id, user_id, institute_id, role_id, manager_id, work_type, start_date, end_date];
            const res = await query(text, values);
            return res.rows[0];
        } else {
            const emp = new MongoEmployment({ ...data, _id: id });
            return await emp.save();
        }
    },

    findByUser: async (userId) => {
        if (getDBType() === 'PG') {
            const text = `
                SELECT e.*, i.name as institute_name, r.name as role_name 
                FROM employment_map e
                JOIN institutes i ON e.institute_id = i.id
                JOIN roles r ON e.role_id = r.id
                WHERE e.user_id = $1
             `;
            const res = await query(text, [userId]);
            return res.rows;
        } else {
            return await MongoEmployment.find({ user_id: userId }).populate('institute_id').populate('role_id');
        }
    }
};

export default Employment;
