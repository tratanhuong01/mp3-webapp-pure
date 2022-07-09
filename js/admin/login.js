
//auth
loadStatusLogin(true)
//auth

//form-login
const formLogin = document.querySelector('#form-login');
const hideOrShow = document.querySelector('.hideOrShow');
const inputUsername = document.querySelector('#username');
const inputPassword = document.querySelector('#password');
const buttonSubmitLogin = document.querySelector('#button-submit-login');
const errorUsername = document.querySelector('.error-username');
const errorPassword = document.querySelector('.error-password');
let isShow = false;

const onInputEvent = (input, error) => {
    input.addEventListener('input', (e) => {
        error();
    });
};

const errorUsernameData = () => {
    errorUsername.classList.add(inputUsername.value === "" ? 'error' : '1');
    errorUsername.innerHTML = inputUsername.value === "" ? 'Username required !!' : '';
}

const errorPasswordData = (fail) => {
    errorPassword.classList.add(inputPassword.value === "" ? 'error' : '1');
    if (fail) {
        errorPassword.innerHTML = inputPassword.value === "" ?
            'Username and password incorrect !!' : '';
    }
    else {
        errorPassword.innerHTML = inputPassword.value === "" ? 'Password required !!' : '';
    }
}

onInputEvent(inputUsername, errorUsernameData);
onInputEvent(inputPassword, errorPasswordData);

const statusButtonSubmitLogin = (disabled) => {
    buttonSubmitLogin.disabled = disabled ? true : false;
    buttonSubmitLogin.innerHTML = disabled ? '<i class="fas fa-spinner fa-spin"></i>' : 'Login';
    buttonSubmitLogin.style.backgroundColor = disabled ? 'gray' : 'rgb(146, 146, 40)';
}

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    statusButtonSubmitLogin(true);
    if (inputUsername.value.length > 0 && inputPassword.value.length > 0) {
        const formData = new FormData();
        formData.append('username', inputUsername.value);
        formData.append('password', inputPassword.value);
        fetch(`${API_URL}/accounts`, { method: "POST", body: formData })
            .then(res => res.json())
            .then(result => {
                if (result) {
                    if (result.length > 0) {
                        localStorage.setItem('checked', JSON.stringify(result[0]))
                        window.location.href = "app.html";
                    }
                    else {
                        errorPasswordData(true);
                        statusButtonSubmitLogin(false);
                    }
                }
            });
    }
    else {
        errorUsernameData();
        errorPasswordData();
        statusButtonSubmitLogin(false);
    }
});

hideOrShow.addEventListener('click', () => {
    isShow = !isShow;
    inputPassword.type = isShow ? 'text' : 'password';
    hideOrShow.classList.remove(`bx-${!isShow ? 'show' : 'hide'}`);
    hideOrShow.classList.add(`bx-${isShow ? 'show' : 'hide'}`);
});
//form-login