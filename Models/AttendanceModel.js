const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    employeeId: { type: String, required: true },
    employeeName:{ type: String, required: true },
    employeeEmail:{ type: String, required: true },
    date: { type: String, required: true },
    // day: { type: String, required: true },
    OTP:{ type: String, required: true },
    attending: { type: Boolean, required: true },
    mealPreference: { type: String, required: false }, // Only for Wednesdays
    couponUsed: { type: String, required: true },

});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
