import Cookie from 'js-cookie';

const GetCookie = (cookie_name) => {
    return Cookie.get(cookie_name);
}

export default GetCookie;
