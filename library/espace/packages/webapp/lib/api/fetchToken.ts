import axios from 'axios';

interface TokenResponse {
  token: string;
}

export const fetchToken = async (): Promise<string> => {
  try {
    const response = await axios.post<TokenResponse>('http://things.espace.example.com/api/auth/login/public', {
      "publicId" : "dd439990-97af-11ee-9cbe-29fda9ebe589"
    });
    return response.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};