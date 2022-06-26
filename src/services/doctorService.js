import axios from "../axios";

const fetchTopDoctorHome = (limit) => {
  return axios.get(`/api/v1/top-doctor-home?limit=${limit}`);
};

const fetchInfoDoctor = (doctorId) => {
  return axios.get(`/api/v1/doctor-detail?id=${doctorId}`);
};

const fetchInfoDoctorModal = (doctorId) => {
  return axios.get(`/api/v1/doctor-modal?id=${doctorId}`);
};


export { fetchTopDoctorHome, fetchInfoDoctor, fetchInfoDoctorModal };
