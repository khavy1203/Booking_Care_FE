import axios from "../axios";

const fetchRolesByGroup = async (groupId) => {
    return await axios.get(`/api/v1/role/by-group/${groupId}`);
}
const assignRolesToGroup = async (data) => {
    return await axios.post('/api/v1/role/assign-to-group', { data });
}
const fetchAllRole = async () => {
    return await axios.get('/api/v1/role/read');
}
export {
    fetchRolesByGroup,
    assignRolesToGroup,
    fetchAllRole
}