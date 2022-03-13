import axios from 'axios';

const url = 'http://localhost:7000';

export default async function axiosHelper(method, path, data) {
  try {
    const header = localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
    const response = await axios({
      method,
      url: `${url}${path}`,
      data,
      headers: {
        ...header,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}
