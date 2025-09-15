const User = require('../models/user');
const jwt = require('jsonwebtoken');

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { employeeCode, password } = req.body;

    if (!employeeCode || !password) {
        return res.status(400).json({ success: false, message: 'Please provide an employee code and password' });
    }

    try {
        const user = await User.findOne({ employeeCode }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token expires in 1 day
        });

        res.status(200).json({ success: true, token, role: user.role });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
    // This is a simplified version. A real implementation needs an email service.
    const { employeeCode, email } = req.body;

    try {
        const user = await User.findOne({ employeeCode, email });

        if (!user) {
            // We send a generic success message to prevent user enumeration
            return res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // TODO:
        // 1. Generate a reset token (e.g., using crypto.randomBytes)
        // 2. Hash the token and save it to the user in the database with an expiry date
        // 3. Create a reset URL with the unhashed token
        // 4. Use a service like Nodemailer to send an email with the URL to the user

        console.log(`Password reset requested for ${user.email}. In a real app, an email would be sent.`);

        res.status(200).json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};