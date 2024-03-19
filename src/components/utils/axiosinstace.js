import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const API_URL = 'https://ipoultry.digiterrain.live/api/v1';

//const API_URL = 'http://localhost:5000/api/v1';
const apiInstance = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
     if (error) {
       prom.reject(error);
     } else {
       prom.resolve(token);
     }
  });

  failedQueue = [];
};
// Add an interceptor to inject the Authorization header
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 401 && !originalRequest._retry) || error.response.status === 403 && !originalRequest._retry) {
      alert(isRefreshing)
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const res = await axios.post(API_URL + '/refresh_token', { refreshToken });
        if (res.status === 201) {
          localStorage.setItem('token', res.data.accessToken);
          apiInstance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
          processQueue(null, res.data.accessToken);
          return apiInstance(originalRequest);
        } else {
          throw new Error();
        }
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = "/login"; // Redirect to login page
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
// const handleRequest = async (url, data) => {
//   try {
//     const response = data 
//       ? await apiInstance.post(url, data)
//       : await apiInstance.get(url);
//     return response.data;
//   } catch (error) {
//     // Handle error more gracefully and log only in development if needed
//     throw error;
//   }
// };
const handleRequest = async (url, data, method, requireAuth = true) => {
  try {
    let response;
    const headers = {};

    // Conditionally add the auth token to the headers
    if (requireAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authorization token is missing');
      }
    }
    switch (method) {
      case 'POST':
        response = await apiInstance.post(url, data, { headers });
        break;
      case 'PUT':
        response = await apiInstance.put(url, data, { headers });
        break;
      case 'DELETE':
        response = await apiInstance.delete(url, { headers });
        break;
      case 'GET':
      default:
        response = await apiInstance.get(url, { headers });
        break;
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getFromApi = async (endpoint, requireAuth) => {
  try {
    const headers = {};
    if (requireAuth) {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      headers.authorization = `Bearer ${token}`;
    }
    const response = await axios.get(`${API_URL}${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Redirect to login if 401 is received
      window.location.href = "/login";  // Redirect to login page
    }
    console.error(error);
    throw error;
  }
};


export const getSignalData = (deviceID) => getFromApi(`/misc/signalstrength/${deviceID}`, true);
export const getDashBoardValues = (farmID, date) => getFromApi(`/dashboard/${farmID}/${date}`, true);

export const addbarn = (data) => handleRequest(`/farmMaster/`, data, 'POST', true);
export const addBatch = (data) => handleRequest(`/batchMaster/`, data, 'POST', true);
export const farmAction = (data) => handleRequest(`/farmaction/`, data, 'POST', true);

export const updateFanStatus = (data) => handleRequest(`/misc/updateSwitch/`, data, 'PUT', true);
export const addDailyParams = (data) => handleRequest(`/addweight/`, data, 'POST', true);

export const addUser = (data) => handleRequest(`/addUser/`, data, 'POST', true);
export const addCredentials = (data) => handleRequest(`/credentials/add`, data, 'PUT', false);

export const udpatePassword = (data) => handleRequest(`/forgotpassword/update`, data, 'POST',false );

export const callibrations = (data) => handleRequest(`/callibrations/`, data, 'POST', true);
export const controlsystem = (data) => handleRequest(`/controlsystem/add`, data, 'POST', true);

export const updateCSStatus = (data) => handleRequest(`/controlsystem/updateStatus`, data, 'POST', true);
export const addIntegrator = (data) => handleRequest(`/integrators/add`, data, 'POST', true);
export const modifyIntegrator = (data) => handleRequest(`/integrators/modify`, data, 'POST', true);

export const getListofFarmers_admin = () => getFromApi(`/misc/listoffarmers/`, true);
export const getListofFarms = (input) => getFromApi(`/misc/listoffarms/${input}`, true);


export const getListofFarms_active = (input) => getFromApi(`/misc/listoffarmsDashboard/${input}`, true);


export const getListofTemplates = () => getFromApi(`/misc/listoftemplates`, true);
export const getListofAssignedDevices = (input) => getFromApi(`/assigndevices/listofavailabledevices/${input}/true`, true);

export const getListofBarns = () => getFromApi(`https://ipoultry.digiterrain.live/listofbarns`, true);

export const getFarmMasterView = () => getFromApi(`/farmMaster/view`, true);
export const getassignedusers = (input) => getFromApi(`/misc/assignedusers/${input}`, true);

export const getTemplatesPhases = (input) => getFromApi(`/templates/phases/${input}`, true);
export const getTemplates = () => getFromApi(`/templates`, true);
export const getFansByFarm = (input) => getFromApi(`/misc/faninfo/${input}`, true);
export const getIdealComparison = (input) => getFromApi(`/analytics/idealscomparison/${input}`, true);
export const getBreeds = () => getFromApi(`/analytics/breeds/`, true);
export const getIdealscomparisonbygender = (input) => getFromApi(`/analytics/idealscomparisonbygender/${input}`, true);

export const getListofBatches = (farmID, type) => getFromApi(`/misc/listofbatches/${farmID}/${type}`, true);
export const getMortlalityData = (batchID, filter) => getFromApi(`/analytics/ml/mortality/${batchID}/${filter}`, true);
export const getAllUsers = () => getFromApi(`/fetchAllUsers`, true);
export const getImeiNumber = (batchID) => getFromApi(`/misc/imeinumber/${batchID}`, true);
export const getBatchOperationsData = (batchID) => getFromApi(`/batchOperations/${batchID}`, true);

export const getBatchReadings = (date, batchID) => getFromApi(`/readings/${date}/${batchID}`, true);

export const getThresholds = (batchID, phaseID) => getFromApi(`/minmax/${batchID}/${phaseID}`, true);
export const getBatchSummary = (batchID) => getFromApi(`/batchSummary/${batchID}/`, true);
export const getExpensesList = (batchID) => getFromApi(`/expenses/list/${batchID}/`, true);
export const getBatchWeights = (batchID) => getFromApi(`/closeBatch/getBatchWeights/${batchID}/`, true);
export const getExpensesStatus = (batchID) => getFromApi(`/expenses/status/${batchID}/`, true);
export const getDashboardBatchSummary = (farmID, date, batchID, phase) => getFromApi(`/dashboard/batchSummary/${farmID}/${date}/${batchID}/${phase}`, true);

export const getDailyOperationsStatus = (farmID, date) => getFromApi(`/addweight/status/${farmID}/${date}`, true);

export const getGrowthCurve = (batchID) => getFromApi(`/analytics/growthCurve/${batchID}`, true);

export const getConnectionsList = () => getFromApi(`/misc/listofdeviceswithstatus`, true);
export const getEmailValidation = (input) => getFromApi(`/forgotpassword/${input}`, false);
export const getUserOptions = (input) => getFromApi(`/misc/userOptions/${input}`, true);


export const getDevices = (input) => getFromApi(`/misc/deviceListByFarmer/${input}`, true);
export const getUserProfile = () => getFromApi(`/misc/userProfile/`, true);
export const getVideos = () => getFromApi(`/misc/videosList/`, true);

export const getControlSystemData = (input) => getFromApi(`/controlsystem/data/${input}`, true);

export const getIntegratorsList = () => getFromApi(`/integrators/list`, true);
