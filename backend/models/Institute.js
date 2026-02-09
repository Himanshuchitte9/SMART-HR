import { query, getDBType, mongoose } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// --- MongoDB Schema ---
const instituteSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: String,
    type: { type: String, enum: ['school', 'college', 'corporate', 'office', 'custom'] },
    address: String,
    owner_id: { type: String, ref: 'User' },
    status: { type: String, default: 'PENDING' }, // PENDING, APPROVED, REJECTED
    created_at: { type: Date, default: Date.now }
});
const MongoInstitute = mongoose.models.Institute || mongoose.model('Institute', instituteSchema);

// --- Model Methods ---
const Institute = {
    create: async (data) => {
        const id = uuidv4();
        const { name, type, address, owner_id } = data;

        if (getDBType() === 'PG') {
            const text = `
                INSERT INTO institutes (id, name, type, address, owner_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [id, name, type, address, owner_id];
            const res = await query(text, values);
            return res.rows[0];
        } else {
            const inst = new MongoInstitute({ ...data, _id: id });
            return await inst.save();
        }
    },

    findAllWarning: async () => {
        // Only for SuperAdmin use mainly
        if (getDBType() === 'PG') {
            const text = 'SELECT * FROM institutes';
            const res = await query(text);
            return res.rows;
        } else {
            return await MongoInstitute.find();
        }
    },

    findByOwnerId: async (ownerId) => {
        if (getDBType() === 'PG') {
            const text = 'SELECT * FROM institutes WHERE owner_id = $1';
            const res = await query(text, [ownerId]);
            return res.rows;
        } else {
            return await MongoInstitute.find({ owner_id: ownerId });
        }
    },

    updateStatus: async (id, status) => {
        if (getDBType() === 'PG') {
            const text = 'UPDATE institutes SET status = $1 WHERE id = $2 RETURNING *';
            const res = await query(text, [status, id]);
            return res.rows[0];
        } else {
            return await MongoInstitute.findByIdAndUpdate(id, { status }, { new: true });
        }
    }
};

export default Institute;
