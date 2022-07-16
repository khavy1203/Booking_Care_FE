import axios from "../axios";

const fetchAllClinics = async (page, limit) => {
    return await axios.get(`/api/v1/clinic/read?page=${page}&limit=${limit}`);
};
const fetchAllClinicsNoPage = async () => {
    return await axios.get(`/api/v1/clinic/read`);
};

const createNewClinic = async (clinicData) => {
    return await axios.post("/api/v1/clinic/create", {
        ...clinicData,
    });
};
const updateCurrentClinic = async (ClinicData) => {
    return await axios.put("/api/v1/clinic/update", {
        ...ClinicData,
    });
};

const deleteClinic = async (clinic) => {
    return await axios.delete("/api/v1/clinic/delete", { data: { id: clinic.id } });
};

export {

    fetchAllClinics,
    createNewClinic,
    updateCurrentClinic,
    deleteClinic,
    fetchAllClinicsNoPage,


};