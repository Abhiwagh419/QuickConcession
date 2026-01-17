import { staffAxios } from "./staffAxios";

export async function getStaffApplications(status?: string) {
  const response = await staffAxios.get("/staff/concessions", {
    params: status ? { status } : {},
  });

  return response.data;
}
