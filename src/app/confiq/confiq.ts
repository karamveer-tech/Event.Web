//const hostname = window.location.hostname;

let baseUrl = 'https://localhost:7129'; // default dev URL

// // Production / staging overrides
// if (hostname === '148.113.192.114') {
//   baseUrl = 'http://148.113.192.114:5000';
// }

export const CONFIG = {
  API_BASE_URL: baseUrl,
  ENDPOINTS: {
    CREATE_EVENT: '/api/Event/create-event',
    GET_EVENTS: '/api/Event/get-all-events',
    GET_EVENT_BY_ID: '/api/Event/get-event-by-id',
    UPDATE_EVENT: '/api/Event/update-event',
    DELETE_EVENT: '/api/Event/delete-event'
  }
};