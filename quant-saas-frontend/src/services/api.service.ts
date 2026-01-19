import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const fetchHealth = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health:', error);
    throw error;
  }
};

export const fetchMarketData = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/market_data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};
