import axios from "axios";

axios.defaults.baseURL = 'https://recipe-hub-backend-project-3024dae0e274.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true