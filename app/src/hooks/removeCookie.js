import Cookie from 'js-cookie';

const RemoveCookie = (cookie_name) => {
    Cookie.remove(cookie_name);
}

export default RemoveCookie;
