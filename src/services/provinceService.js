import axios from "../axios";
const fetchProvinces = async () => {
    return await axios.get("/api/v1/provinces/read");
};
export {
    fetchProvinces
}