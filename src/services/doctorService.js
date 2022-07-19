import axios from "../axios";

const fetchTopDoctorHome = (limit) => {
  return axios.get(`/api/v1/top-doctor-home?limit=${limit}`);
};

const fetchInfoDoctor = (doctorId) => {
  return axios.get(`/api/v1/doctor-detail?id=${doctorId}`);
};

const fetchInfoDoctorModal = async (doctorId) => {
  return await axios.get(`/api/v1/doctor-modal?id=${doctorId}`);
};

const registerDoctor = async (doctorData) => {
  return await axios.post("/api/v1/clinic/registerDoctor", {
    ...doctorData,
  });
};

const getAllDoctorsPagination = async (page, limit, special) => {
  return await axios.get(`/api/v1/doctor/getAllDoctors?page=${page}&limit=${limit}&special=${special}`);
};

export { fetchTopDoctorHome, fetchInfoDoctor, fetchInfoDoctorModal, registerDoctor, getAllDoctorsPagination };
