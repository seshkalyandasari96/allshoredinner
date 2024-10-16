const User = require('./../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'DinnerPlanner';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'merra@allshore.io',
        pass: 'ypcm kyyz tbgj hzvu'
    }
});

console.log(jwtSecret, 'jwtSecret in controller');

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        userType: user.userType
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    return token;
}


exports.signup = async (req, res) => {
    const { fullName, employeeId, gender, userType, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const newUser = new User({
            fullName,
            employeeId,
            gender,
            userType,
            email,
            password,
            confirmPassword
        });
        console.log(newUser, 'newUser1')
        await newUser.save();

        const detailsForJWT = {
            id: newUser._id,
            email: newUser.email,
            userType: newUser.userType
        }
        const token = generateToken(detailsForJWT);
        console.log(token, 'token in signup');
        newUser.token = token;
        newUser.password = await bcrypt.hash(password, 10); // Hash new password
        newUser.confirmPassword = await bcrypt.hash(password, 10); // Hash new password\
        console.log(newUser, 'newUser2')
        await newUser.save();

        res.status(201).json({ message: "User created successfully", newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error, Please enter valid details", error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log(user, 'user after login');
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const detailsForJWT = {
            id: user._id,
            email: user.email,
            userType: user.userType
        }
        const token = generateToken(detailsForJWT);
        console.log(token, 'token in login');
        user.token = token;
        await user.save();
        console.log(user, 'user in login');

        res.status(200).json({ message: "Logged in successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const resetToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        // Modify the resetUrl to include the reset token as a query parameter
        const resetUrl = `https://allshoredinner-fyhsdqcwg5ake7f9.eastus-01.azurewebsites.net/Components/Forgotpassword?token=${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #fa5c3c;
                            margin: 0;
                            padding: 0;
                            -webkit-text-size-adjust: none;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #fa5c3c;
                            padding: 10px;
                            border-radius: 8px 8px 0 0;
                            text-align: center;
                            color: white;
                        }
                        .header img {
                            max-width: 150px;
                            margin-bottom: 10px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            color: #333333;
                            margin-bottom: 20px;
                        }
                        .btn-reset {
                            display: inline-block;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #53afbf;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .btn-reset:hover {
                            background-color: #fa5c3c;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 14px;
                            color: #777777;
                        }
                        .footer p {
                            margin: 0;
                        }
                        .footer a {
                            color: #4CAF50;
                            text-decoration: none;
                        }
                        .footer a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <img src="https://allshoretech.com/assets/images/allshorelogo_1.png" alt="Company Logo" style="width: 150px; height: auto; display: block; margin: 0 auto; border-radius: 10px;">
                    <div class="email-container">
                        <div class="header">
                            <!-- Add company logo here -->
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hi,</p>
                            <p>You recently requested to reset your password. Please click the button below to proceed with resetting your password:</p>
                            <a href="${resetUrl}" class="btn-reset">Reset Password</a>
                            <p>If you did not request a password reset, please ignore this email or contact support.</p>
                        </div>
                        <div class="footer">
                            <p>Thank you for using our DinnerPlanner!</p>
                            <p>Need help? <a href="mailto:merra@allshore.io">Contact Support</a></p>
                        </div>
                    </div>
                </body>
            </html>

            `
        });

        res.status(200).json({ message: 'Reset link sent to your email.', resetToken });
    } catch (err) {
        console.error('Error in forgot password:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.resetPassword = async (req, res) => {
    const { token } = req.body;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id);
        console.log(user, 'user in reset');

        if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = await bcrypt.hash(newPassword, 10); // Hash new password
        user.confirmPassword = await bcrypt.hash(newPassword, 10); // Hash new password\
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiration = undefined; // Clear expiration
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};





exports.deleteUser = async (req, res) => {
    const { adminEmail } = req.body; // Admin's email and employeeId from the request body
    const { employeeEmail } = req.body; // Email of the user to be deleted

    try {
        // Find the admin by email and employeeId
        const admin = await User.findOne({ email: adminEmail });
        console.log(adminEmail,admin,'aaaaaaaa')
        // Ensure the requesting user is an admin
        if (!admin || admin.userType !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can delete users.' });
        }

        // Find and delete the user by employeeEmail (the email of the user to be deleted)
        const userToDelete = await User.findOneAndDelete({ email: employeeEmail });

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.editUser = async (req, res) => {
    const { adminEmail } = req.body; // Admin's email and employeeId from the request body
    const { employeeEmail, fullName, gender } = req.body; // The user to be edited and the new details

    try {
        // Find the admin by email and employeeId
        const admin = await User.findOne({ email:adminEmail });

        // Ensure the requesting user is an admin
        if (!admin || admin.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can edit users.' });
        }

        // Find the user to edit by their email
        const employee = await User.findOne({ email: employeeEmail });

        if (!employee) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Update user details
        employee.fullName = fullName || employee.fullName;
        employee.gender = gender || employee.gender;
        await employee.save();

        res.status(200).json({ message: 'User updated successfully', employee });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -confirmPassword -token -resetToken -resetTokenExpiration'); // Exclude sensitive fields like passwords
        res.status(200).json({ message: 'All users fetched successfully', users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
