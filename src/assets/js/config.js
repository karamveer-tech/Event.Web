const hostname = window.location.hostname;
let baseUrl = "https://localhost:44315";

if (hostname === "148.113.192.114") {
  //baseUrl = "http://148.113.192.114:5000";
}
baseUrl = "http://148.113.192.114:5000";
const CONFIG = {
  API_BASE_URL: baseUrl,
};