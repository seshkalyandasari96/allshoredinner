const express = require('express');
const router = express.Router();
const attendanceController = require('./../Controllers/AttendanceController');

router.post('/recordAttendance', attendanceController.recordAttendance);
// router.post('/updateResponse', attendanceController.updateResponse);
router.post('/getSpecificEmployeeAttendance', attendanceController.getSpecificEmployeeAttendance);
router.post('/getYesResponses', attendanceController.getYesResponses);
router.post('/getAllResponses', attendanceController.getAllResponses);
router.post('/getResponseCount', attendanceController.getResponseCount);
router.post('/getCouponUsedCount', attendanceController.getCouponUsedCount);
router.post('/verifyOTP', attendanceController.verifyOTP);
router.post('/getUsedCouponResponses', attendanceController.getUsedCouponResponses);

module.exports = router;
