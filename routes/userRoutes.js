const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/userController');
const authController = require('../controller/authController');
const router = express.Router();

// to use req.query the querys are set the ther url request from the client side the neccessar y
// are handled at the server side

router.post('/signup', authController.signup); // or router.route("/signup").post(authController.signup)
router.post('/login', authController.login);
router.post('forgetpassword', authController.forgetPassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
