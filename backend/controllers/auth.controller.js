import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password, gender, address, qualification, experience_years, purpose } = req.body;

        // Check if user exists
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            gender,
            address,
            qualification,
            experience_years,
            purpose
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser.id || newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.purpose,
                token: generateToken(newUser.id || newUser._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id || user._id,
                name: user.name,
                email: user.email,
                role: user.purpose,
                token: generateToken(user.id || user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const { name, mobile, gender, address, qualification, experience_years } = req.body;

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (gender) updateData.gender = gender;
        if (address) updateData.address = address;
        if (qualification) updateData.qualification = qualification;
        if (experience_years) updateData.experience_years = experience_years;

        // Add profile picture if uploaded
        if (req.file) {
            updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
        }

        // Update user
        const updatedUser = await User.update(userId, updateData);

        if (updatedUser) {
            res.json({
                message: 'Profile updated successfully',
                user: {
                    _id: updatedUser.id || updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    mobile: updatedUser.mobile,
                    gender: updatedUser.gender,
                    address: updatedUser.address,
                    qualification: updatedUser.qualification,
                    experience_years: updatedUser.experience_years,
                    profilePicture: updatedUser.profilePicture,
                    role: updatedUser.purpose
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, updateProfile };
