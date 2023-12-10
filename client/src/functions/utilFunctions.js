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