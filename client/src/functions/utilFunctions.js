export const getToken = (document) => {
  let token;
  const cookies = document.cookie.split("=");
  cookies.forEach((term, i) => {
    if (term === 'token') {
      token = cookies[i + 1]
    }
  });
  return token;
}

export const getObjectSize = (obj) => {
  const keys = Object.keys(obj);
  return keys.length;
}

export const authenticate = async () => {
  const authenticateReq = await fetch('http://localhost:8080/profile', {
    method: 'GET',
    credentials: 'include'
  })


  if(authenticateReq.status === 401){
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    return [false, null];
  }

  const userInfo = await authenticateReq.json();

  return [true, userInfo];
}