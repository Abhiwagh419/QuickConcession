import axios from "axios";

export const verifyStaffOtp = async (email: string, otp: string) => {
  const response = await axios.post(
    "http://localhost:3000/staff/verify-otp",
    { email, otp }
  );

  return response.data;
};
