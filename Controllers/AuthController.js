const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
const Prof = require('../Models/Prof');
const Client = require('../Models/Client');

const checkCINAdminProf = async (req, res) => {
    try {
        const existingAdminCin = await Admin.findOne({ cinNumber: req.params.cinNumber });
        const existingProfCin = await Prof.findOne({ cinNumber: req.params.cinNumber });
        if (existingAdminCin || existingProfCin) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking cin:', error);
        res.status(500).json({ message: 'Error checking cin' });
    }
}

const checkPhoneAdminProf = async (req, res) => {
    try {
        const existingAdminPhone = await Admin.findOne({ phoneNumber: req.params.phoneNumber });
        const existingProfPhone = await Prof.findOne({ phoneNumber: req.params.phoneNumber });
        if (existingAdminPhone || existingProfPhone) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking phone number:', error);
        res.status(500).json({ message: 'Error checking phone number' });
    }
}

const checkUsername = async (req, res) => {
    try {
        const existingUserUsername = await User.findOne({ username: req.params.username });
        if (existingUserUsername) {
            return res.json({
                exists: true,
                name: existingUserUsername.name,
                lastname: existingUserUsername.lastname,
                email: existingUserUsername.email,
                username: existingUserUsername.username,
                password: existingUserUsername.password,
                dateOfBirth: existingUserUsername.dateOfBirth,
                profilePicture: existingUserUsername.profilePicture,
                isEmailVerified: existingUserUsername.isEmailVerified,
                role: existingUserUsername.role,

                phoneNumber: existingUserUsername.phoneNumber,
                cinNumber: existingUserUsername.cinNumber,

                parentCinNumber: existingUserUsername.parentCinNumber,
                parentPhoneNumber: existingUserUsername.parentPhoneNumber,
                instrument: existingUserUsername.instrument,
                otherInstruments: existingUserUsername.otherInstruments,
                fatherOccupation: existingUserUsername.fatherOccupation,
                motherOccupation: existingUserUsername.motherOccupation,
                isSubscribed: existingUserUsername.isSubscribed,
                schoolGrade: existingUserUsername.schoolGrade,
            });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: 'Error checking username' });
    }
}

const checkEmail = async (req, res) => {
    try {
        const existingUserEmail = await User.findOne({ email: req.params.email });
        if (existingUserEmail) {
            return res.json({
                exists: true,
                name: existingUserEmail.name,
                lastname: existingUserEmail.lastname,
                email: existingUserEmail.email,
                username: existingUserEmail.username,
                password: existingUserEmail.password,
                dateOfBirth: existingUserEmail.dateOfBirth,
                profilePicture: existingUserEmail.profilePicture,
                isEmailVerified: existingUserEmail.isEmailVerified,
                role: existingUserEmail.role,

                phoneNumber: existingUserEmail.phoneNumber,
                cinNumber: existingUserEmail.cinNumber,

                parentCinNumber: existingUserEmail.parentCinNumber,
                parentPhoneNumber: existingUserEmail.parentPhoneNumber,
                instrument: existingUserEmail.instrument,
                otherInstruments: existingUserEmail.otherInstruments,
                fatherOccupation: existingUserEmail.fatherOccupation,
                motherOccupation: existingUserEmail.motherOccupation,
                isSubscribed: existingUserEmail.isSubscribed,
                schoolGrade: existingUserEmail.schoolGrade,
            });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Error checking email' });
    }
}

const register = async (req, res) => {
    try {
        const { name, lastname, email, password, username } = req.body;

        if (!name || !lastname || !email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        let existingClientEmail = await Client.findOne({ email });
        if (existingClientEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingClientUsername = await Client.findOne({ username });
        if (existingClientUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            isEmailVerified: false,
            role: 'client',
        });
        await newClient.save();
        const token = jwt.sign({ userId: newClient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Client registered successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering Client' });
    }
};

const registerClient = async (req, res) => {
    try {
        const { name, lastname, email, password, username, dateOfBirth, profilePicture,
            parentCinNumber, parentPhoneNumber, instrument, otherInstruments, fatherOccupation, motherOccupation,
            schoolGrade } = req.body;

        if (!name || !lastname || !email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        let existingClientEmail = await Client.findOne({ email });
        if (existingClientEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingClientUsername = await Client.findOne({ username });
        if (existingClientUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: profilePicture ? profilePicture : "",
            isEmailVerified: false,
            role: 'client',


            parentPhoneNumber,
            parentCinNumber,
            instrument: instrument ? instrument : "",
            otherInstruments: otherInstruments ? otherInstruments : "",
            fatherOccupation: fatherOccupation ? fatherOccupation : "",
            motherOccupation: motherOccupation ? motherOccupation : "",
            isSubscribed: false,
            schoolGrade: schoolGrade ? schoolGrade : "",
        });
        await newClient.save();
        const token = jwt.sign({ userId: newClient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Client registered successfully', token, username: newClient.username });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering Client' });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const { name, lastname, email, password, username, cinNumber, phoneNumber, profilePicture, dateOfBirth } = req.body;

        if (!name || !lastname || !email || !password || !username || !cinNumber || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (cinNumber.length < 8) {
            return res.status(400).json({ message: 'CIN must be at least 8 characters long.' });
        }
        let existingAdminCIN = await Admin.findOne({ cinNumber });
        if (existingAdminCIN) {
            return res.status(400).json({ message: 'CIN is invalid.' });
        }
        if (phoneNumber.length < 8) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingAdminPhone = await Admin.findOne({ phoneNumber });
        if (existingAdminPhone) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingAdminEmail = await Admin.findOne({ email });
        if (existingAdminEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingAdminUsername = await Admin.findOne({ username });
        if (existingAdminUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: profilePicture ? profilePicture : "",
            isEmailVerified: false,
            role: 'admin',


            cinNumber,
            phoneNumber,
        });
        await newAdmin.save();
        const token = jwt.sign({ userId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Admin registered successfully', token, username: newAdmin.username });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
};

const registerProf = async (req, res) => {
    try {
        const { name, lastname, email, password, username, cinNumber, phoneNumber, profilePicture, dateOfBirth } = req.body;

        if (!name || !lastname || !email || !password || !username || !cinNumber || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (cinNumber.length < 8) {
            return res.status(400).json({ message: 'CIN must be at least 8 characters long.' });
        }
        let existingProfCIN = await Prof.findOne({ cinNumber });
        if (existingProfCIN) {
            return res.status(400).json({ message: 'CIN is invalid.' });
        }
        if (phoneNumber.length < 8) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingProfPhone = await Prof.findOne({ phoneNumber });
        if (existingProfPhone) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingProfEmail = await Prof.findOne({ email });
        if (existingProfEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingProfUsername = await Prof.findOne({ username });
        if (existingProfUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newProf = new Prof({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: profilePicture ? profilePicture : "",
            isEmailVerified: false,
            role: 'prof',


            cinNumber,
            phoneNumber,
        });
        await newProf.save();
        const token = jwt.sign({ userId: newProf._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(201).json({ message: 'Prof registered successfully', token, username: newProf.username });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering prof' });
    }
};

const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, username: user.username });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const loginWithUsername = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, username: user.username });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Error fetching admins' });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({ role: 'client' });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};

const getAllProfs = async (req, res) => {
    try {
        const profs = await Prof.find({ role: 'prof' });
        res.status(200).json(profs);
    } catch (error) {
        console.error('Error fetching profs:', error);
        res.status(500).json({ message: 'Error fetching profs' });
    }
};

module.exports = {
    registerClient, registerAdmin, registerProf, register,
    loginWithEmail, loginWithUsername,
    deleteUser,
    checkEmail, checkUsername, checkCINAdminProf, checkPhoneAdminProf,
    getAllAdmins, getAllClients, getAllProfs
}