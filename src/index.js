const axios = require('axios');
const { email, password, project_id } = require('../config');

const loginUrl = 'https://yapi.startdt.net/api/user/login_by_ldap';
const apiUrl = 'https://yapi.startdt.net/api/interface/list';

// 在set-cookie中获取_yapi_token以及_yapi_uid
function getCookie(cookieArr) {
  const [cookieString1, cookieString2] = cookieArr;
  const token = cookieString1.split(';')[0].split('=')[1];
  const u_id = cookieString2.split(';')[0].split('=')[1];
  return {
    token,
    u_id,
  };
}
// 设置header中的Cookie
function setCookie({ token, u_id }) {
  return `_yapi_token=${token}; _yapi_uid=${u_id}`;
}
// 登陆获取set-cookie
async function loginUser() {
  const res = await axios.post(loginUrl, {
    email,
    password,
  });
  return getCookie(res.headers['set-cookie']);
}
async function getApiData(cookieData) {
  const { data } = await axios.get(apiUrl, {
    params: {
      page: 1,
      limit: 20,
      project_id,
    },
    headers: {
      Cookie: setCookie(cookieData),
    },
  });
  return data;
}
async function init() {
  const cookieData = await loginUser();
  const data = await getApiData(cookieData);
  console.log(data);
}
init();
