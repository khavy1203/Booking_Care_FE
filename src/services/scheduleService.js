import axios from "../axios";

const createNewSchedule = async (data) => {
  return await axios.post("/api/v1/schedule/create", { ...data });
};

export { createNewSchedule };
