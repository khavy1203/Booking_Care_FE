import axios from "../axios";
const handleloginApi = (userEmail, userPassword) => {
  //gọi server nodejs
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  return axios.post(`/api/create-new-user`, data);
};

const deleteUserService = (userId) => {
  return axios.delete(`/api/delete-user`, {
    data: { id: userId },
  });
};

export { handleloginApi, getAllUsers, createNewUserService, deleteUserService };
