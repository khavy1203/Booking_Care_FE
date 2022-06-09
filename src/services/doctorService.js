import axios from "../axios";

const fetchTopDoctorHome = (limit) => {
  return axios.get(`/api/v1/top-doctor-home?limit=${limit}`);
};

export { fetchTopDoctorHome };
