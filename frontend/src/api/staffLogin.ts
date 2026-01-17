import axios from "axios";

const BASE_URL = "http://localhost:4000";

export async function staffLogin(
  email: string,
  password: string
) {
  const response = await axios.post(
    `${BASE_URL}/staff/login`,
    {
      email,
      password,
    }
  );

  return response.data; // { token }
}
