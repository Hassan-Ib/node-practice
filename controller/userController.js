const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '<get all user>',
  });
};
const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '<get user >',
  });
};
const createUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: '<user created>',
  });
};
const updateUser = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: '<user updated>',
  });
};
const deleteUser = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: '<user deleted>',
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
