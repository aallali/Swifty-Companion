// import storage from "../Storage/storage";
import axios from "axios";
import { secrets } from "./secrets";
import storage from "../storage";
const { log } = console;
const { uid, client } = secrets;

/**
 * load saved list from data storage
 * @returns {login:string,image:string, fullName:string}[]
 */
export function getSavedList() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await storage.load({
        key: "savedList",
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export function updateSavedList(newList) {
  return new Promise(async (resolve, reject) => {
    try {
      await storage.save({ key: "savedList", data: newList });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * fetch a new token from the 42 api
 * @returns token
 */
function refreshToken() {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api.intra.42.fr/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: uid,
          client_secret: client,
        },
        { timeout: 2000 }
      )
      .then(async (tk) => {
        await storage.save({ key: "42Token", data: tk.data });
        resolve(tk.data.access_token);
      });
  });
}

/**
 * check token saved in storage if not expired (refresh it if the case) then return it to request Profile
 * @returns token
 */
async function getToken() {
  let tokenToReturn;
  try {
    const data = await storage.load({
      key: "42Token",
    });
    const token = data?.access_token;
    const date = (data?.created_at + data?.expires_in) * 1000;
    if (!token || !date || Date.now() >= date) tokenToReturn = refreshToken();
    else tokenToReturn = token;
  } catch (er) {
    if (er.name === "NotFoundError" || er.name === "ExpiredError")
      tokenToReturn = await refreshToken();
  }
  return new Promise((resolve, reject) => {
    resolve(tokenToReturn);
  });
}

/**
 * request the login information from 42 api with the token from getToken
 * @param {string} login
 * @returns
 */
export async function requestProfile(login) {
  const token = await getToken();
  let data;
  log(`Token : ${token}`);
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.intra.42.fr/v2/users/" + login.toLocaleLowerCase(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((userResponse) => {
        let dt = userResponse.data;
        axios
          .get(
            "https://api.intra.42.fr/v2/users/" +
              userResponse.data.id +
              "/coalitions",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (res) => {
            data = {
              image: dt.image_url,
              first_name: dt.first_name,
              last_name: dt.last_name,
              login: dt.login,
              email: dt.email,
              campus:
                dt.campus && dt.campus.length
                  ? `${dt.campus[0].name}/${dt.campus[0].country}`
                  : undefined,
              evaluation_points: dt.correction_point,
              phone_number: dt.phone,
              grade:
                dt.cursus_users &&
                dt.cursus_users.length &&
                dt.cursus_users[dt.cursus_users.length - 1].grade,
              coalition:
                res.data && res.data.length > 0
                  ? {
                      title: res.data[0].name,
                      svg: res.data[0].image_url,
                      color: res.data[0].color,
                      cover: res.data[0].cover_url,
                      allCoalitions: [
                        res.data.map((l) => ({
                          title: l.name,
                          svg: l.image_url,
                          color: l.color,
                          cover: l.cover_url,
                        })),
                      ],
                    }
                  : undefined,
              wallet: dt.wallet,
              cursus: dt.cursus_users?.map((l) => ({
                id: l.cursus.id,
                title: l.cursus.name,
                level: l.level,
              })),
              projects: dt.projects_users,
              level: 0,
              location: dt.location,
              pool:
                dt.pool_month && dt.pool_year
                  ? `${dt.pool_month}/${dt.pool_year}`
                  : undefined,
            };
            if (dt.cursus_users && dt.cursus_users.length > 0) {
              data.level = data.cursus[data.cursus.length - 1].level;
              data.skills = dt.cursus_users[dt.cursus_users.length - 1].skills;
            }
            await storage.save({ key: "currentUser", data });
            resolve(data);
          });
      })
      .catch((err) => {
        reject(`User Not found (#${err.response.status})`);
      });
  });
}

// alert("User Dosnt exist");
// storage.clearMap();
// storage.remove({
//     key: '42Token'
// });
