const Attendance = require('./../Models/AttendanceModel');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const User = require('./../Models/UserModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'merra@allshore.io',
        pass: 'ypcm kyyz tbgj hzvu'
    }
});

async function sendNoShowNotificationEmail(employeeEmail, employeeName, noShowCount,dateString) {
    const mailOptions = {
        from: 'merra@allshore.io',
        to: employeeEmail,
        subject: 'Allshore Dinner No-Show reminder',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>No Show Warning</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;  
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .header {
                    padding: 10px;
                    border-radius: 8px 8px 0 0;
                    color: white;
                }
                .logo-container {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .logo-container img {
                    max-width: 150px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    background-color: #53afbf;
                    padding: 10px;
                    border-radius: 8px 8px 0 0;
                    color: white;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .content p {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .content .warning {
                    font-size: 18px;
                    font-weight: bold;
                    color: #e74c3c;
                }
                .content .no-show-section {
                    display: flex;
                    align-items: center;
                    margin: 20px 0;
                }
                .content .no-show-section p {
                    font-size: 18px;
                    font-weight: bold;
                    margin-right: 10px;
                    color: #333333;
                }
                .content .no-show-count {
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #f1c40f;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777777;
                }
                .footer a {
                    color: #53afbf;
                    font-weight: bold;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo-container">
                    <img src="https://allshoretech.com/assets/images/allshorelogo_1.png" alt="Company Logo" style="width: 150px; height: auto; display: block; margin: 0 auto; border-radius: 10px;">
                </div>
                <div class="header">
                    <h1>No Show Warning</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>${employeeName}</strong>,</p>
                    <p>You have missed the dinner attendance on ${dateString}.</p>
                    <div class="no-show-section">
                        <p>Your current No Show count is:</p>
                        <div class="no-show-count">${noShowCount}</div>
                    </div>
                    <p class="warning">If you reach 3 No Shows, you will be blocked from applying for future dinners.</p>
                    <p>Thank you!</p>
                </div>
                <div class="footer">
                    <p>For more information, please contact support at <a href="mailto:merra@allshore.io">merra@allshore.io</a></p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`No Show notification sent to ${employeeEmail}`);
    } catch (error) {
        console.error('Error sending No Show notification:', error);
    }
}




async function sendReminderEmail(employeeEmail, employeeName) {
    const mailOptions = {
        from: 'merra@allshore.io',
        to: employeeEmail,
        subject: 'Dinner Attendance Reminder',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dinner Attendance Reminder</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .header {
                    background-color: #53afbf;
                    padding: 10px;
                    border-radius: 8px 8px 0 0;
                    color: white;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .content p {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777777;
                }
                .footer a {
                    color: #53afbf;
                    font-weight: bold;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo-container">
                    <img src="https://allshoretech.com/assets/images/allshorelogo_1.png" alt="Company Logo" style="width: 150px; height: auto; display: block; margin: 0 auto; border-radius: 10px;">
                </div>
                <div class="header">
                    <h1>Dinner Attendance Reminder</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>${employeeName}</strong>,</p>
                    <p>This is a reminder to apply for your dinner attendance by <strong>7:00 pm today</strong>.</p>
                    <p>Thank you!</p>
                </div>
                <div class="footer">
                    <p>For more information, please contact support at <a href="mailto:merra@allshore.io">merra@allshore.io</a></p>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${employeeEmail}`);
    } catch (error) {
        console.error('Error sending reminder:', error);
    }
}



// Function to send reminders to all employees
async function sendRemindersToAllEmployees() {
    try {
        const employees = await User.find(); // Adjust the query based on your user model
        employees.forEach(employee => {
            console.log(employee)
            sendReminderEmail(employee.email, employee.fullName);
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Schedule the cron job for weekdays at 7 PM

cron.schedule('45 18 * * 1-5', () => {
    console.log('Sending dinner reminders...');
    sendRemindersToAllEmployees();
});
    

cron.schedule('0 22 * * 1-5', async () => {
    console.log('Checking for No Shows...');
    try {
        const today = new Date();
        const formattedDate = today.toDateString(); // Format "Tue Oct 22 2024"

        // Fetch all attendances where date is today, attending is true, but couponUsed is false
        const attendances = await Attendance.find({ date: formattedDate, attending: true, couponUsed: 'no' });
        
        // Extract employee IDs who haven't used their coupons (i.e., potential no-shows)
        const userIdsWithNoShow = new Set(attendances.map(attendance => attendance.employeeId));

        // Fetch all users who are relevant to today's dinner
        const users = await User.find({ _id: { $in: [...userIdsWithNoShow] } });

        for (const user of users) {
            // User did not use their coupon but had opted to attend dinner
            user.noShowCount += 1;
            await user.save();
            await sendNoShowNotificationEmail(user.email, user.fullName, user.noShowCount, formattedDate);

            // Check if the user should be blocked due to 3 or more no-shows
            if (user.noShowCount >= 3 && !user.isBlocked) {
                user.isBlocked = true;
                await user.save();
                console.log(`User ${user.fullName} has been blocked due to multiple No Shows.`);
            }
        }
    } catch (error) {
        console.error('Error checking No Shows:', error);
    }
});






function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toDateString();
}


async function sendOtpEmail(employeeName,employeeEmail, otp,date) {
    let mailOptions = {
        from: 'merra@allshore.io',
        to: employeeEmail, 
        subject: 'Your OTP for Dinner Attendance Confirmation',
        html: `
           <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>OTP Confirmation</title>
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
                        .otp-code {
                            display: inline-block;
                            padding: 12px 24px;
                            font-size: 24px;
                            color: #ffffff;
                            background-color: #53afbf;
                            border-radius: 5px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            margin: 20px 0;
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
                            color: #fa5c3c;
                            font-weight: bold;
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
                            <h1>Your OTP for Dinner on ${formatDate(date)}</h1>
                        </div>
                        <div class="content">
                            <p>Hello, ${employeeName}</p>
                            <p>Your One-Time Password (OTP) for confirming your dinner attendance is:</p>
                            <div class="otp-code">${otp}</div>
                            <p>Please use this OTP to confirm your attendance. If you didn't request this, please contact support immediately.</p>
                        </div>
                        <div class="footer">
                            <p>Thank you for using DinnerPlanner!</p>
                            <p>Need help? <a href="mailto:merra@allshore.io">Contact Support</a></p>
                        </div>
                    </div>
                </body>
            </html>
        `,
        };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${employeeEmail}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

exports.recordAttendance = async (req, res) => {
    const { employeeId, employeeName, employeeEmail, date, attending, mealPreference } = req.body;
    try {
        // Get the current date and time
        const currentDate = new Date();
        
        // Create a deadline for the current day's attendance update (7:30 PM the day before)
        const attendanceDate = new Date(date);
        const deadline = new Date(attendanceDate);
        deadline.setHours(19, 30, 0); // Set deadline to 7:30 PM on the previous day
        deadline.setDate(deadline.getDate() - 1); // Move deadline to the day before the attendance date
        // Check if the current time is past the deadline
        if (currentDate > deadline) {
            return res.status(400).json({ message: `You cannot apply for dinner for ${formatDate(date)} after the deadline` , deadline: `${formatDate(deadline)} 7:30 PM` });
        }
        // Check if the date is a Wednesday
        const isWednesday = new Date(date).getDay() === 3;
        if (isWednesday && (mealPreference=="" || !mealPreference) && attending === true) {
            return res.status(400).json({ message: "Meal preference must be provided on Wednesdays." });
        }

        // Check for existing attendance record
        let attendance = await Attendance.findOne({ employeeId, date });

        const otp = generateOTP();

        // If attendance does not exist, create a new record
        if (!attendance) {
            attendance = new Attendance({
                employeeId,
                employeeName,
                employeeEmail,
                date,
                OTP: otp,
                attending,
                mealPreference: isWednesday ? mealPreference : null, // Only store meal preference if it's Wednesday
                couponUsed: 'no'
            });

            await attendance.save();

            if (attending === true) {
                await sendOtpEmail(employeeName, employeeEmail, otp, date);
                return res.status(201).json({ message: "Attendance recorded successfully and OTP sent to email.", attendance });
            } else {
                return res.status(201).json({ message: "Attendance recorded successfully", attendance });
            }
        } else {
            // If attendance exists, update the record
            const initialAttending = attendance.attending;

            attendance.attending = attending;
            if (isWednesday) {
                attendance.mealPreference = mealPreference;
            }

            // If the employee changed their response from 'not attending' to 'attending', handle OTP logic
            if (!initialAttending && attending === true) {
                if (attendance.OTP) {
                    // OTP exists, send the old OTP
                    await sendOtpEmail(attendance.employeeName, attendance.employeeEmail, attendance.OTP, date);
                } else {
                    // No OTP exists, generate a new one
                    attendance.OTP = otp;
                    await sendOtpEmail(attendance.employeeName, attendance.employeeEmail, otp, date);
                }
            }

            await attendance.save();

            return res.status(200).json({
                message: "Attendance response updated successfully." + (initialAttending === false && attending === true ? " OTP has been sent to your email." : ""),
                attendance
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};





// Get attendance for a specific employee
exports.getSpecificEmployeeAttendance = async (req, res) => {
    const { employeeId, date } = req.body;

    try {
        const records = await Attendance.find({ employeeId, date });
        if(records.length>0){
            res.status(200).json(records);
        }
        else {
            res.status(200).json('no attendance recorded for this user');
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getYesResponses = async (req, res) => {
    const { date } = req.body;

    try {
        const attendances = await Attendance.find({ attending: true, date });
        res.status(200).json(attendances);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getAllResponses = async (req, res) => {
    const { date } = req.body;

    try {
        const attendances = await Attendance.find({ date });
        res.status(200).json(attendances);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getResponseCount = async (req, res) => {
    const { date } = req.body;

    try {
        const attendingCount = await Attendance.countDocuments({ attending: true, date });
        const VegCount = await Attendance.countDocuments({ attending: true, date, mealPreference: "veg" });
        
        const NonVegCount = await Attendance.countDocuments({ attending: true, date, mealPreference: "non-veg" });
        res.status(200).json({ attendingCount, VegCount, NonVegCount });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getCouponUsedCount = async (req, res) => {
    const { date } = req.body;

    try {
        const couponUsedCount = await Attendance.countDocuments({ couponUsed: 'yes', date });
        res.status(200).json({ couponUsedCount });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getUsedCouponResponses = async (req, res) => {
    const { date } = req.body;

    try {
        const attendances = await Attendance.find({ date });
        const filteredAttendedances = attendances.filter(attendance => attendance.couponUsed == "yes")
        res.status(200).json(filteredAttendedances);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.verifyOTP = async (req, res) => {
    const { otp, date } = req.body;

    try {
        // Find the attendance record by OTP and date
        const attendance = await Attendance.findOne({ OTP: otp, date });

        if (!attendance) {
            return res.status(404).json({ message: "Invalid OTP or no attendance record found for the given date" });
        }

        if (attendance.attending === false) {
            return res.status(400).json({ message: `Employee did not apply for food on ${date}`});
        }

        // Check if the OTP has already been used
        if (attendance.couponUsed === 'yes') {
            return res.status(400).json({ message: "Coupon has already been used" });
        }

        // Update the couponUsed field to 'yes'
        attendance.couponUsed = 'yes';
        await attendance.save();

        // Return the employee details and success message
        res.status(200).json({ 
            message: "OTP verified successfully, coupon used status updated", 
            employeeDetails: {
                employeeId: attendance.employeeId,
                employeeName: attendance.employeeName,
                employeeEmail: attendance.employeeEmail,
                attending: attendance.attending,
                mealPreference: attendance.mealPreference,
            }
        });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

