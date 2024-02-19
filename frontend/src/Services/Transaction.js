import axios from "axios";

const apiUrl = 'http://localhost:3001/api/transactions';


export const getTransactions = async (searchText, month, pageNumber) => {
  const params = {
    search: searchText,
    month: month,
    page: pageNumber,
  };

  try {
    const res = await axios.get(`${apiUrl}/list`, { params });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const getBarChartData = async (month) => {
  const params = {
    month: month,
  };

  try {
    const res = await axios.get(`${apiUrl}/bar-chart`, { params });
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getStatistics = async (month) => {
  const params = {
    month: month,
  };

  try {
    const res = await axios.get(`${apiUrl}/statistics`, { params });
    return res;
  } catch (error) {
    return null;
  }
};
