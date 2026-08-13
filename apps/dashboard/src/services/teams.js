import api from "../store/api/api";

const getTemplateId = () => localStorage.getItem("templateID");

const withCredentials = { withCredentials: true };

const jsonConfig = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

// const multipartConfig = {
//   headers: { "Content-Type": "multipart/form-data" },
//   withCredentials: true,
// };

const toQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const q = query.toString();
  return q ? `?${q}` : "";
};

// Team
export const createTeam = async (data) => {
  return await api.post(`/v1/team/create-team`, data, jsonConfig);
};
export const getTeams = async (data) => {
  return await api.post(`/v1/team/get-user-team`, data, jsonConfig);
};

// Invite flow

export const addTeamMembers = async (members) => {
  return await api.post(`/v1/team/add-team-members`, { members }, jsonConfig);
};

export const acceptTeamInvitation = (inviteId) => {
  return api.post(`/v1/team/accept-invitation/${inviteId}`, {}, jsonConfig);
};

// Members

export const getAllTeamMembers = async (params = {}) => {
  return await api.get(
    `/v1/team/get-team-members${toQuery(params)}`,
    withCredentials,
  );
};

export const getTeamMemberByInviteId = async (memberId) => {
  return await api.get(`/v1/team/get-team-member/${memberId}`);
};

export const getMemberProfiles = async (memberId) => {
  return await api.get(
    `/v1/team/get-member-profiles/${memberId}`,
    withCredentials,
  );
};

//templates
export const getAllTemplates = async (page = 1) => {
  return await api.get(`/v1/template/get-all-templates?page=${page}`, withCredentials);
};

export const getMemberForAssignee = async () => {
  return await api.get(
    `/v1/template/members/${getTemplateId()}`,
    withCredentials,
  );
};
export const assignTemplate = async (memberID) => {
  return await api.post(
    `/v1/template/assign-template/${getTemplateId()}`,
    { member_id: memberID },
    jsonConfig,
  );
};
export const unAssignTemplate = async (memberID) => {
  return await api.post(
    `/v1/template/unassign-template/${getTemplateId()}`,
    { member_id: memberID },
    jsonConfig,
  );
};
