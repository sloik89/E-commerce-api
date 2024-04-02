const getAllUsers = async (req, res) => {
  console.log("users");
  res.send("get all users");
};
const getSingleUser = async (req, res) => {
  res.send("get single user");
};
const showCurrentUser = async (req, res) => {
  res.send("show current user");
};
const updateUser = async (req, res) => {
  res.send("update user");
};
const updateUserPassword = async (req, res) => {
  res.send("updata password");
};
export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
