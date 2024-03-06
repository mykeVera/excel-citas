import Cookie from 'js-cookie';

const SetCookie = (cookie_name, cookie_value) => {
    //https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
    //let timeExpire = new Date(new Date().getTime() + 1 * 60 * 1000); //1 min
    //let timeExpire = new Date(new Date().getTime() + 15 * 60 * 1000); //15 min
    //let timeExpire = 1; // 1 day
    let timeExpire = 0.333333; // 8 horas
    Cookie.set(cookie_name,cookie_value,{
        expires:timeExpire,
        secure:false, //O trueo false, Indica si la transmisión de la cookie requiere un protocolo seguro (https).
        sameSite:'strict',
        path:'/'
    });
}

export default SetCookie;
