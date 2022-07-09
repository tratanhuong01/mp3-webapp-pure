
const loadStatusLogin = (isPageLogin, isPageApp, isPageManger) => {
    if (localStorage && localStorage.getItem("checked")) {
        let checked = localStorage.getItem("checked");
        checked = JSON.parse(checked);
        if (!isPageApp) {
            if (checked.typeAccount === 0) {
                window.location.href = 'app.html';
            }
        }
        if (!isPageManger) {
            if (checked.typeAccount === 1) {
                window.location.href = 'manager.html';
            }
        }
    }
    else {
        if (!isPageLogin) {
            window.location.href = "login.html";
        }
    }
}

const renderInfo = (auth) => {
    if (localStorage.getItem("checked")) {
        let checked = JSON.parse(localStorage.getItem("checked"));
        auth.innerHTML = `
            <span style="font-size:16px;margin-right:1em;color:gray;font-weight:bold;text-decoration:underline;">
            ${checked.typeAccount === 0 ? 'User' : 'Admin'}</span>
            <i class='bx bx-log-in log-out-app'></class>
        `
        const logOutApp = document.querySelector('.log-out-app');

        if (logOutApp) {
            logOutApp.addEventListener('click', () => {
                localStorage.removeItem('checked');
                window.location.href = 'login.html';
            })
        }
    }
}