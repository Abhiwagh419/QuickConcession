import { staffAxios } from "./staffAxios";

export async function getStaffApplications() {
  const response = await staffAxios.get("/staff/concessions");

  return response.data as {
    pending: any[];
    personal: any[];
  };
}