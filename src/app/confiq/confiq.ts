//const hostname = window.location.hostname;

//let baseUrl = 'https://localhost:7129'; // default dev URL
let baseUrl = 'http://148.113.192.114:5000';
// // Production / staging overrides
// if (hostname === '148.113.192.114') {
//   baseUrl = 'http://148.113.192.114:5000';
// }

export const CONFIG = {
  API_BASE_URL: baseUrl,
  ENDPOINTS: {
    CREATE_EVENT: '/api/Event/create-event',
    GET_EVENTS: '/api/Event/get-all-events',
    GET_USER_EVENTS: '/api/Event/get-user-events',
    GET_EVENT_BY_ID: '/api/Event/get-event-by-id',
    UPDATE_EVENT: '/api/Event/update-event',
    DELETE_EVENT: '/api/Event/delete-event',
    GET_USER_DETAILS_BY_EMAIL: '/api/User/get-user-by-email',
    GET_USER_DETAILS_BY_ID: '/api/User/get-user-by-id',
     BOOK_EVENT: '/api/User/book-event',
     GET_BOOKED_TICKETS_COUNT: '/api/User/get-booked-ticket',
     GET_MY_BOOKINGS: '/api/User/get-my-bookings',
  }
};