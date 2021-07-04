const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controller/userController');

const router = express.Router();

// to use req.query the querys are set the ther url request from the client side the neccessar y
// are handled at the server side
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;
