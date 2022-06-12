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

//video 83: api lấy profile bác sĩ
const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const logoutUser = async () => {
  return await axios.post("/api/v1/logout");
};
export {
  handleLoginApi,
  fetchAllUser,
  createNewUser,
  updateCurrentUser,
  deleteUser,
  handleRegisterUser,
  fetchGroup,
  getProfileDoctorById,
  logoutUser,
};
