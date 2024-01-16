import axios from 'axios';

interface TokenResponse {
  token: string;
}

export const fetchToken = async (): Promise<string> => {
  try {
    const response = await axios.post<TokenResponse>(String(process.env.TB_PUBLIC_ENDPOINT), {
      "publicId" : String(process.env.TB_PUBLIC_TOKEN)
    });
    return response.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};