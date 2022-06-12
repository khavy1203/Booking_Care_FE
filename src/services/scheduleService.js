import axios from "../axios";

const createNewSchedule = async (data) => {
  return await axios.post("/api/v1/schedule/create", { ...data });
};

const fetchSchedule = async (id) => {
  return await axios.get(`/api/v1/schedule/get-schedule/${id}`);
};

export { createNewSchedule, fetchSchedule };
