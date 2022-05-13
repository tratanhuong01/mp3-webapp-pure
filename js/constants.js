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
    URL_API: 'https://mp3-app-pure.herokuapp.com',
    numberSong: document.querySelector('.number-song'),
    tbody: document.querySelector('.footer__left > div:nth-child(2) > table > tbody'),
    audio: {
        buttonLoopRandom: document.querySelector('.button-loop-random'),
        buttonLeft: document.querySelector('.button-left'),
        buttonPlay: document.querySelector('.button-play'),
        buttonRight: document.querySelector('.button-right'),
        buttonLoopIndex: document.querySelector('.button-loop-index'),
        imageAudio: document.querySelector('.image-audio'),
        artistAudio: document.querySelector('.artist-audio'),
        nameAudio: document.querySelector('.name-audio'),
        dot: document.querySelector('.audio__time--dot'),
        current: document.querySelector('.audio__time--current'),
        duration: document.querySelector('.audio__time--duration'),
        main: document.querySelector('.audio__time'),
    },
    audioPlay: document.querySelector('#audio-play'),
    container: document.querySelectorAll('.container'),
    catelog: document.querySelectorAll('.sidebar__catelog--item')
}

export default constants;