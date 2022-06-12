import axios from "../axios";

const fetchTopDoctorHome = (limit) => {
  return axios.get(`/api/v1/top-doctor-home?limit=${limit}`);
};

const fetchInfoDoctor = (doctorId) => {
  return axios.get(`/api/v1/doctor-detail/${doctorId}`);
};

export { fetchTopDoctorHome, fetchInfoDoctor };
