import { jwtDecode } from 'jwt-decode';

export const isEmpty = (param: string | null | any) =>
  param === null || typeof param === 'undefined' || param.length == 0;

const clearSessionStorage = () => sessionStorage.removeItem('zpt');

function isAuthenticated(token: string) {
  if (!token || isEmpty(token)) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);
    const expirationTime = (decodedToken as any).exp * 1000; // convert to milliseconds

    if (Date.now() >= expirationTime) {
      clearSessionStorage();
      return false;
    }

    return true;
  } catch (error) {
    clearSessionStorage();
    return false;
  }
}

export default isAuthenticated;
