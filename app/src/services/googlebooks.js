const axios = require("axios");

const baseURL = "https://www.googleapis.com/books/v1";

const googleBooksAPI = axios.create({ baseURL: baseURL });

const debug = false;

if (debug) {
  googleBooksAPI.interceptors.request.use(
    function (config) {
      console.log(config);
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
}

module.exports = { googleBooksAPI };
