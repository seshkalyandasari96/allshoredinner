const express = require('express');
const { signup, login, forgotPassword,resetPassword,deleteUser,editUser,getAllUsers  } = require('./../Controllers/UserController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/deleteUser', deleteUser);
router.post('/editUser', editUser);
router.post('/getAllUsers', getAllUsers);

module.exports = router;
