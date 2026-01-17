import { staffAxios } from "./staffAxios";

export async function approveApplication(
  applicationId: number,
  concessionNumber: string
) {
  const response = await staffAxios.post(
    `/staff/concessions/${applicationId}/approve`,
    { concessionNumber }
  );

  return response.data;
}

export async function rejectApplication(
  applicationId: number,
  reason: string
) {
  const response = await staffAxios.post(
    `/staff/concessions/${applicationId}/reject`,
    { reason }
  );

  return response.data;
}
