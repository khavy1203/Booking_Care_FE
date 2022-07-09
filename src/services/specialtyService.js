import axios from "../axios";

const createNewSpecialty = (data) => {
  return axios.post("/api/v1/specialty/create", data);
};
const fetchAllSpecialties = async (page, limit) => {
  return await axios.get(`/api/v1/specialty/read?page=${page}&limit=${limit}`);
};
const fetchAllSpecialtysNoPage = async () => {
  return await axios.get(`/api/v1/specialty/read`);
};

const updateCurrentSpecialty = async (SpecialtyData) => {
  return await axios.put("/api/v1/specialty/update", {
    ...SpecialtyData,
  });
};

const deleteSpecialty = async (specialty) => {
  return await axios.delete("/api/v1/specialty/delete", { data: { id: specialty.id } });
};

export {
  createNewSpecialty,
  fetchAllSpecialties,
  fetchAllSpecialtysNoPage,
  updateCurrentSpecialty,
  deleteSpecialty
};
