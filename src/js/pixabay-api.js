import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

export const fetchPhotosByQuery = async (searchQuery, page) => {
  const requestParams = {
    q: searchQuery,
    key: '47683521-7bc13f64e806eb93b38e1f294',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 15,
    page: page,
  };

  try {
    const response = await axios.get('/', { params: requestParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Pixabay:', error);
    throw error;
  }
};
