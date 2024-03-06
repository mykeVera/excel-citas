import GetCookie from "./getCookie";

const getU = GetCookie('_userIn_');
const jsonU = JSON.parse(getU);

export const config = {
    headers: {
        Authorization: `Bearer `+jsonU.token
    }
};