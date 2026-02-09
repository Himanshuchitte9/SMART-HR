import { query, getDBType, mongoose } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// --- MongoDB Schema ---
const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 }, // Use UUID even in Mongo for consistency
    name: String,
    email: { type: String, unique: true },
    mobile: { type: String, unique: true },
    password: String,
    gender: String,
    address: String,
    qualification: String,
    experience_years: Number,
    purpose: { type: String, enum: ['OWNER', 'EMPLOYEE', 'SUPERADMIN'] },
    status: { type: String, default: 'ACTIVE' },
    created_at: { type: Date, default: Date.now }
});
const MongoUser = mongoose.models.User || mongoose.model('User', userSchema);

// --- Model Methods ---
const User = {
    create: async (userData) => {
        const id = uuidv4();
        const { name, email, mobile, password, gender, address, qualification, experience_years, purpose } = userData;

        if (getDBType() === 'PG') {
            const text = `
                INSERT INTO users (id, name, email, mobile, password, gender, address, qualification, experience_years, purpose)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *;
            `;
            const values = [id, name, email, mobile, password, gender, address, qualification, experience_years, purpose];
            const res = await query(text, values);
            return res.rows[0];
        } else {
            const user = new MongoUser({ ...userData, _id: id });
            return await user.save();
        }
    },

    findByEmail: async (email) => {
        if (getDBType() === 'PG') {
            const text = 'SELECT * FROM users WHERE email = $1';
            const res = await query(text, [email]);
            return res.rows[0];
        } else {
            return await MongoUser.findOne({ email });
        }
    },

    findById: async (id) => {
        if (getDBType() === 'PG') {
            const text = 'SELECT * FROM users WHERE id = $1';
            const res = await query(text, [id]);
            return res.rows[0];
        } else {
            return await MongoUser.findById(id);
        }
    }
};

export default User;
