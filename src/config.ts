type _Config = {
  apiUrl: string;
};

const Config: _Config = {
  apiUrl: process.env.REACT_APP_API_URL || '',
};

export default Config;
