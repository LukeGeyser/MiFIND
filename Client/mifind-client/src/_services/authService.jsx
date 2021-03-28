import { BehaviorSubject } from 'rxjs';

const userTokenDetails = new BehaviorSubject(JSON.parse(localStorage.getItem('tkn')));

async function Login(username, password){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'username': username, 'password': password })
    };

    let loginData = await new Promise(function (resolve, reject) {
        setTimeout(function () {
            fetch(`http://localhost:443/api/v1/auth/login`, requestOptions)
                .then((data) => {
                    let jsonData = data.json()
                    resolve(jsonData);
                }).catch((error) => {
                    reject(error);
                });
        }, 0);
    }); 
    localStorage.setItem('tkn', JSON.stringify(loginData.access_token));
    userTokenDetails.next(loginData.access_token);
    return loginData;
}

function canAccess(){
    if (userTokenDetails.value === null)
        return false;

    return true;
}

function Logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('tkn');
    userTokenDetails.next(null);
}

export const authService = {
    Login,
    userTokenDetails,
    canAccess,
    Logout,
};