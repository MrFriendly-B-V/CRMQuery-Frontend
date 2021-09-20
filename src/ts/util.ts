import { loadConfig } from "./config"

export interface ILogin {
    active:         boolean
    name:           string
    picture:        string
}

class Login implements ILogin {
    active:     boolean
    name:       string
    picture:    string
}

export async function getLogin(): Promise<ILogin> {
    let config = await loadConfig()
    let sessionId = getCookie('sessionid')
    if(sessionId == '') {
        let login = new Login()
        login.active = false
        return login
    }

    let fetched = await fetch(`${config.authserverHost}/session/describe/${sessionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    switch(fetched.status) {
        case 200:
            let json = <ILogin> await fetched.json()
            return json
        case 401:
            let login = new Login()
            login.active = false
            return login
        default:
            alert('Failed to load login data')
            throw new Error('Failed to load login data')
    }
}

export async function handleLogin() {
    let sessionIdGet = findGetParameter('session_id')
    if(sessionIdGet != null) {
        setCookie('sessionid', sessionIdGet, 30*24*60*60)
        let onlyUrl = window.location.href.replace(window.location.search, '')
        window.location.href = onlyUrl
    }

    let login = await getLogin()
    let config = await loadConfig()
    if(!login.active) {
        const callback = btoa(window.location.href)
        window.location.href = `${config.authserverHost}/oauth2/login?api_name=reporterr&return_uri=${callback}`
        return
    }

    setUserDetails(login)
}

export async function setUserDetails(login: ILogin) {
    document.getElementById('userName').innerHTML = login.name;
    (<HTMLImageElement> document.getElementById('userAvatar')).src = login.picture 
}

/**
 * Get the value of a cookie
 * @param name the name of the cookie
 * @returns Retuns the value of the cookie, or '' if the cookie was not found
 */
 export function getCookie(name: string): string {
    let re = new RegExp('[; ]'+name+'=([^\\s;]*)');
    let sMatch = (' '+document.cookie).match(re);
    if (name && sMatch) return unescape(sMatch[1]);
    return '';
}

/**
 * Get the value of a GET parameter
 * @param parameterName The name of the parameter
 * @returns The value of the requested parameter. Null if parameter doesn't exist
 */
export function findGetParameter(parameterName: string): string {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

/**
 * Set a cookie
 * @param name The name of the cookie
 * @param value The value of the cookie
 * @param ttl The TTL of the cookie in seconds
 */
export function setCookie(name: string, value: string, ttl: number): void {
    let date = new Date();
    date.setTime(date.getTime() + (ttl * 1000));
    let expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}