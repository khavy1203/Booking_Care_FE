import axios from "../axios";

const createNewSpecialty = (data) => {
  return axios.post("/api/v1/specialty/create", data);
};

export { createNewSpecialty };
