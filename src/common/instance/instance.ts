// export const settings = {
//   withCredentials: true,
//   headers: {
//     "API-KEY": "ccce7055-9c90-4467-bfd9-5c1357460985"
//   }
// }

import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "ccce7055-9c90-4467-bfd9-5c1357460985",
  },
});
