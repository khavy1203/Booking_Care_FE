import axios from "../axios";

const handleLoginApi = async (account, password) => {
  //gọi server nodejs
  return await axios.post("/api/v1/login", {
    account,
    password,
  });
};
const handleRegisterUser = async (email, phone, username, password) => {
  return await axios.post("/api/v1/register", {
    email,
    phone,
    username,
    password,
  });
};
const fetchAllUser = async (page, limit) => {
  return await axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
};

const fetchGroup = async () => {
  return await axios.get("/api/v1/group/read");
};
const createNewUser = async (userData) => {
  return await axios.post("/api/v1/user/create", {
    ...userData,
  });
};
const updateCurrentUser = async (userData) => {
  return await axios.put("/api/v1/user/update", {
    ...userData,
  });
};

const deleteUser = async (user) => {
  return await axios.delete("/api/v1/user/delete", { data: { id: user.id } });
};

//Update password
const updatePassword = async (userData) => {
  return await axios.put("/api/v1/user/updatepassword", {
    ...userData,
  });
};
const getUserAccount = async () => {
  return await axios.get("/api/v1/user/account");
};
const logoutUser = async () => {
  return await axios.post("/api/v1/logout");
};

const updateInforUser = async (userData) => {
  return await axios.put("/api/v1/user/updateInforUser", {
    ...userData,
  });
};

const forgotPasswordUser = async (userData) => {
  return await axios.post("/api/v1/user/forgotPasswordUser", {
    ...userData,
  });
};

const newResetPassword = async (id, hashEmail, dataNewPassword) => {
  return await axios.post("/api/v1/reset-password", {
    id,
    hashEmail,
    dataNewPassword,
  });
};
const getUserById = async (id) => {
  return await axios.get(`/api/v1/user/getUserById?id=${id}`);
};

const searchUser = async (dt, page, limit) => {
  return await axios.get(
    `/api/v1/user/searchUser?search=${dt}&page=${page}&limit=${limit}`
  );
};
export {
  handleLoginApi,
  fetchAllUser,
  createNewUser,
  updateCurrentUser,
  deleteUser,
  handleRegisterUser,
  fetchGroup,
  logoutUser,
  getUserAccount,
  updateInforUser,
  forgotPasswordUser,
  newResetPassword,
  updatePassword,
  getUserById,
  searchUser,
};
