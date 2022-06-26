import axios from "../axios";

const fetchAllTimes = () => {
  return axios.get(`/api/v1/timeframe/read`);
};

export { fetchAllTimes };
