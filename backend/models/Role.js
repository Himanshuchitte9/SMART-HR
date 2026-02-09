import { query, getDBType, mongoose } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const roleSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    institute_id: { type: String, ref: 'Institute' },
    name: String,
    parent_role_id: { type: String, ref: 'Role' },
    level: Number,
    created_at: { type: Date, default: Date.now }
});
const MongoRole = mongoose.models.Role || mongoose.model('Role', roleSchema);

const Role = {
    create: async (data, parentRole) => {
        const id = uuidv4();
        const { institute_id, name } = data;
        let parent_role_id = parentRole ? (parentRole.id || parentRole._id) : null;
        let level = parentRole ? (parentRole.level + 1) : 1;

        if (getDBType() === 'PG') {
            const text = `
                INSERT INTO roles (id, institute_id, name, parent_role_id, level)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [id, institute_id, name, parent_role_id, level];
            const res = await query(text, values);
            return res.rows[0];
        } else {
            const role = new MongoRole({ ...data, _id: id, parent_role_id, level });
            return await role.save();
        }
    },

    findByInstituteId: async (instituteId) => {
        if (getDBType() === 'PG') {
            // Get all roles for an institute, ordered by level
            const text = 'SELECT * FROM roles WHERE institute_id = $1 ORDER BY level ASC';
            const res = await query(text, [instituteId]);
            return res.rows;
        } else {
            return await MongoRole.find({ institute_id: instituteId }).sort({ level: 1 });
        }
    },

    findById: async (id) => {
        if (getDBType() === 'PG') {
            const text = 'SELECT * FROM roles WHERE id = $1';
            const res = await query(text, [id]);
            return res.rows[0];
        } else {
            return await MongoRole.findById(id);
        }
    }
};

export default Role;
