import bcrypt from "bcrypt";

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const hashOtp = async (otp: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const verifyOtpHash = async (otp: string, hash: string) => {
  return bcrypt.compare(otp, hash);
};
