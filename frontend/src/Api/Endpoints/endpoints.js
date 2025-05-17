import api from "../api";

export const getEmployees = async () => {
  try {
    const response = await api.get("/employees");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    const message ="Something went wrong while fetching employees";
    throw new Error(message);
  }
};
