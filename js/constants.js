const constants = {
    sidebar: {
        main: document.querySelector('.sidebar'),
        overlay: document.querySelector('.sidebar__overlay'),
        mobile: document.querySelector('.header__mobile i')
    },
    box: {
        button: {
            left: document.querySelector('.box__button--left'),
            right: document.querySelector('.box__button--right'),
        },
        wrapper: document.querySelector('.box__wrapper'),
        step: (width) => width >= 1500 ? 6 : (width < 1500 && width >= 1280) ? 4 : (width < 1280 && width >= 768) ? 4 :
            (width >= 640 && width < 768) ? 3 : (width >= 450 && width < 640) ? 2 : 1
    },
    popover: {
        color: {
            button: document.querySelector('.button-change-color'),
            list: document.querySelector('.popover__color ul')
        }
    },
    URL_API: 'https://api-mp3-app.herokuapp.com',
    numberSong: document.querySelector('.number-song'),
    tbody: document.querySelector('.footer__left > div:nth-child(2) > table > tbody')
}

export default constants;