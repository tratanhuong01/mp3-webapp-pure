// import constants from "./constants.js";


let constants = {
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
    container: document.querySelector('.container'),
    catelog: document.querySelectorAll('.sidebar__catelog--item'),
    loadingContent: document.querySelector('.loading-content'),
}

let timeMain = 0;
let currentMain = 0;
let interval;
let musicCurrent;
let indexMain = 0;
let randomLoop = null;
let indexLoop = null;


const reset = () => {
    constants = ({
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
        container: document.querySelector('.container'),
        catelog: document.querySelectorAll('.sidebar__catelog--item'),
        loadingContent: document.querySelector('.loading-content')
    })
}

const formatTime = (duration) => {
    duration = Math.floor(duration);
    const hour = Math.floor(duration / 3600);
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    return `${hour === 0 ? '' : `${hour < 10 ? `0${hour}` : hour}:`}${min < 10 ? `0${min}` : min >= 60 ? '00' : min}:${sec < 10 ? `0${sec}` : sec >= 60 ? '00' : sec}`
}

//
const handleClickDuration = () => {
    clearInterval(interval);
    if (constants.audio.main) {
        const { audio: { dot, duration, current, main }, audioPlay } = constants;
        constants.audio.main.removeEventListener('click', handleClickDuration);
        constants.audio.main.addEventListener('click', (event) => {
            if (!event.target.closest('.audio__time--dot')) {
                if (event.offsetX <= 0) {
                    currentMain = 0;
                }
                else {
                    currentMain = (Math.floor(((event.offsetX - 8) / (main.offsetWidth)) * timeMain));
                    currentMain = currentMain < 0 ? 0 : currentMain;
                    audioPlay.currentTime = currentMain;
                }
                current.innerHTML = formatTime(currentMain);
                duration.innerHTML = formatTime(timeMain);
                dot.style.left = `${((((currentMain)) / timeMain) * 100)}%`;
            }
        })
    }
}
//

const updatePlay = () => {
    const { audioPlay, audio: { buttonPlay } } = constants;
    if (buttonPlay.classList.contains('pause')) {
        buttonPlay.children[0].classList.remove('bx-pause')
        buttonPlay.children[0].classList.add('bx-play')
        buttonPlay.classList.remove('pause')
        buttonPlay.classList.add('play');
        clearInterval(interval);
        audioPlay.pause();
    }
    else {
        buttonPlay.children[0].classList.add('bx-pause')
        buttonPlay.children[0].classList.remove('bx-play')
        buttonPlay.classList.add('pause')
        buttonPlay.classList.remove('play')
        audioPlay.play();
        setInterVal();
    }
}

const setInterVal = () => {
    const { audio: { dot, duration, current } } = constants;
    if (current && duration) {
        interval = setInterval(() => {
            currentMain++;
            if (timeMain === currentMain) {
                clearInterval(interval);
                currentMain = 0;
                timeMain = 0;
                dot.style.left = `${(0)}%`;
                buttonPrevNext(undefined, true)
            }
            else {
                dot.style.left = `${((currentMain / timeMain) * 100)}%`;
            }
            current.innerHTML = formatTime(currentMain);
            duration.innerHTML = formatTime(timeMain);

        }, 1000);
    }
}

const playMusic = (data) => {
    const { audio: { imageAudio, nameAudio, artistAudio, dot, duration, current, buttonPlay }, audioPlay } = constants;
    if (imageAudio && nameAudio && artistAudio && dot && audioPlay && current && duration) {
        musicCurrent = data ? data : musicCurrent;
        clearInterval(interval);
        if (data) {
            nameAudio.innerHTML = data.name;
            imageAudio.src = data.image;
            artistAudio.innerHTML = data.artistMusic.nameArtist;
            audioPlay.src = data.audio;
            const audioFake = new Audio(data.audio);
            audioFake.oncanplaythrough = () => {
                timeMain = Math.floor(audioFake.duration);
                currentMain = 0;
                current.innerHTML = formatTime(currentMain);
                duration.innerHTML = formatTime(timeMain);
                dot.style.left = `${((currentMain / timeMain) * 100)}%`;
                audioFake.remove();
                if (buttonPlay.classList.contains('play')) {
                    buttonPlay && buttonPlay.click();
                }
            }
        }
        updatePlay();
    }
}

const stopMusic = () => {
    clearInterval(interval);
    const { audioPlay, audio: { buttonPlay } } = constants;
    buttonPlay.children[0].classList.remove('bx-pause')
    buttonPlay.children[0].classList.add('bx-play')
    buttonPlay.classList.remove('pause')
    buttonPlay.classList.add('play');
    clearInterval(interval);
    audioPlay.pause();
}

const addEventPageHome = () => {

    //
    constants.audio.buttonPlay && constants.audio.buttonPlay.addEventListener('click', function () {
        const listPlay = document.querySelectorAll('.list-music table tbody .item-music-play');
        if (!constants.audio.buttonPlay.classList.contains('play')) {
            [...listPlay].forEach(el_ => {
                el_.classList.add('bx-play', 'text-gray')
                el_.classList.remove('bx-pause', 'text-main');
            });
        }
        else {
            const listPlayItem = document.querySelector(`#item-music-play-${musicCurrent ? musicCurrent.id : ''}`)
            if (listPlayItem) {
                listPlayItem.classList.remove('bx-play', 'text-gray')
                listPlayItem.classList.add('bx-pause', 'text-main')
            }
        }
        playMusic();
    });
    //

    const buttonPrevNext = (isNext, index_) => {
        const list = document.querySelectorAll('.list-music table tbody .footer__left--item');
        const listPlay = document.querySelectorAll('.list-music table tbody .item-music-play');
        let indexCurrent_ = [...list].findIndex(dt => dt.classList.contains('active'));
        if (!index_) {
            if (indexCurrent_ !== -1) {
                if (isNext) {
                    indexCurrent_ = (indexCurrent_ + 1) >= list.length ? 0 : (indexCurrent_ + 1);
                }
                else {
                    indexCurrent_ = indexCurrent_ = (indexCurrent_ - 1) < 0 ? list.length - 1 : (indexCurrent_ - 1);
                }
            }
        }
        else {
            if (!indexLoop) {
                if (randomLoop) {
                    indexCurrent_ = Math.floor(Math.random() * ((list.length - 1) - 0 + 1) + 0);
                }
                else {
                    indexCurrent_ = (indexCurrent_ + 1) >= list.length ? 0 : (indexCurrent_ + 1);
                    console.log(indexCurrent_);
                }
            }

        }
        [...list].forEach(el => {
            el.classList.remove('active');
            el.parentElement.parentElement.classList.remove('active');
        });
        [...listPlay].forEach(el_ => {
            el_.classList.add('bx-play', 'text-gray')
            el_.classList.remove('bx-pause', 'text-main');
        });
        if (list[indexCurrent_]) {
            listPlay[indexCurrent_].classList.remove('bx-play', 'text-gray')
            listPlay[indexCurrent_].classList.add('bx-pause', 'text-main')
            list[indexCurrent_].classList.add('active');
            list[indexCurrent_].parentElement.parentElement.classList.add('active');
            const data = JSON.parse(list[indexCurrent_].getAttribute('data-item'));
            playMusic(data);
        }
    }

    //
    constants.audio.buttonLeft && constants.audio.buttonLeft.addEventListener('click', function () {
        buttonPrevNext()
    });
    //

    //
    constants.audio.buttonRight && constants.audio.buttonRight.addEventListener('click', function () {
        buttonPrevNext(true)
    });
    //

    //
    constants.audio.buttonLoopRandom && constants.audio.buttonLoopRandom.addEventListener('click', function () {
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            randomLoop = false;
        } else {
            this.classList.add('active');
            randomLoop = true;
        }
        constants.audio.buttonLoopIndex.classList.remove('active');
        indexLoop = null;
    });
    //

    //
    constants.audio.buttonLoopIndex && constants.audio.buttonLoopIndex.addEventListener('click', function () {
        if (this.classList.contains('active')) {
            this.classList.remove('active');
            indexLoop = false;
        } else {
            this.classList.add('active');
            indexLoop = true;
        }
        constants.audio.buttonLoopRandom.classList.remove('active');
        randomLoop = null;
    });
    //

}

//
const sidebarEvent = () => {
    const fetchApiCatelog = async (data) => {
        switch (data) {
            case "album":
                apiBox('album');
                break;
            case "artist":
                apiBox('artist');
                break;
            case "wishlist":

                break;
            case "videos":

                break;
            case "currently":

                break;
            default:
                api();
                addEventPageHome();
                break;
        }
    }
    constants.container && constants.catelog && (() => {
        [...constants.catelog].forEach((el) => {
            el.addEventListener('click', function () {
                let href = window.location.href;
                href = (href.replace("http://", "").replace("https://", "").replace("/app.html", "").replace("#", "").replace(window.location.host, ""));
                const data = this.getAttribute('data-path');
                if (href === "" && data !== "") {
                    stopMusic();
                }
                clearTimeout(timeOut);
                [...constants.catelog].forEach(el__ => el__.classList.remove('active'));
                constants.loadingContent && constants.loadingContent.classList.remove('hidden');
                el.classList.add('active');
                window.location.href = '#' + data;
                constants.container.classList.remove('active');
                timeOut = setTimeout(async () => {
                    clearTimeout(timeOut);
                    await fetch(`components/${data === "" ? 'home' : data}.html`)
                        .then(res => res.text())
                        .then(res => {
                            constants.container.innerHTML = res;
                            reset();
                            fetchApiCatelog(data);
                            constants.loadingContent && constants.loadingContent.classList.add('hidden')
                            constants.container.classList.add('active')
                        })
                }, 1000);
            });
        });
        timeOut = setTimeout(async () => {
            let href = window.location.href;
            href = (href.replace("http://", "").replace("https://", "").replace("/app.html", "").replace("#", "").replace(window.location.host, ""));
            constants.container.classList.remove('active');
            [...constants.catelog].forEach(el_ => el_.classList.remove('active'));
            const index_ = [...constants.catelog].findIndex(dt => dt.getAttribute("data-path") === href);
            index_ !== -1 && constants.catelog[index_].classList.add('active');
            clearTimeout(timeOut);
            await fetch(`https://${window.location.host}/mp3-webapp-pure/components/${href === "" ? 'home' : href}.html`)
                .then(res => res.text())
                .then(res => {
                    constants.container.innerHTML = res;
                    reset();
                    fetchApiCatelog(href);
                    constants.loadingContent && constants.loadingContent.classList.add('hidden')
                    constants.container.classList.add('active')
                })

            clearTimeout(timeOut);
        }, 2000);
    })()
}
//

// list-music
const loadItemMusic = () => {
    if (constants.audio) {
        const { audioPlay, audio: { imageAudio, nameAudio, artistAudio } } = constants;
        const list = document.querySelectorAll('.list-music table tbody .footer__left--item');
        const listHeart = document.querySelectorAll('.list-music table tbody .item-music-heart');
        const listPlay = document.querySelectorAll('.list-music table tbody .item-music-play');
        const listDuration = document.querySelectorAll('.list-music table tbody .item-music-duration');
        if (list && listPlay && listDuration && listHeart && imageAudio && nameAudio && artistAudio && audioPlay) {
            [...list].forEach((el, index) => {
                if (index === 0) {
                    el.parentElement.parentElement.classList.add('active');
                    el.classList.add('active');
                }
                const data = JSON.parse(el.getAttribute('data-item'));
                handleClickDuration();
                const audioFake = new Audio(data.audio);
                audioFake.oncanplaythrough = () => {
                    listDuration[index].innerHTML = formatTime(Math.floor(audioFake.duration));
                };
                el.addEventListener('click', () => {
                    if (indexMain !== index) {
                        [...list].forEach(el_ => {
                            el_.parentElement.parentElement.classList.remove('active');
                            el_.classList.remove('active');
                        })
                        el.parentElement.parentElement.classList.add('active');
                        el.classList.add('active');
                        playMusic(data);
                        [...listPlay].forEach(el_ => {
                            el_.classList.add('bx-play', 'text-gray')
                            el_.classList.remove('bx-pause', 'text-main');
                        });
                        listPlay[index].classList.remove('bx-play', 'text-gray')
                        listPlay[index].classList.add('bx-pause', 'text-main')
                    }
                    indexMain = index;
                });
            });
            [...listHeart].forEach(el => {
                el.addEventListener('click', () => {
                    if (el.classList.contains('text-gray')) {
                        el.classList.remove('text-gray');
                        el.classList.add('text-main');
                    }
                    else {
                        el.classList.add('text-gray');
                        el.classList.remove('text-main');
                    }
                });
            });
        }
    }
}
// list-music

const loadFeatureSlide = () => {
    // box 
    if (constants.box) {
        (() => {
            let current = 0;
            let currentStatus;
            const { wrapper, button } = constants.box;
            if (wrapper && button) {
                const { left, right } = constants.box.button;
                wrapper.addEventListener('transitionend', () => {
                    if (currentStatus) {
                        wrapper.classList.remove('transition');
                    }
                });
                const addEventClickBox = (btn) => {
                    btn && btn.addEventListener('click', async function () {
                        const width = window.innerWidth;
                        const step = constants.box.step(width);
                        const length = wrapper.children.length;
                        let lengthCurrent = length - ((current === 0 ? 1 : current) * step);
                        current = lengthCurrent <= step ? lengthCurrent === 0 ? (current + step) : (current + lengthCurrent) : (current + step);
                        if (!currentStatus) {
                            wrapper.style.transform = `translateX(-${(100 / step) * (current < 0 ? 0 : current)}%)`;
                            wrapper.classList.add('transition');
                        }
                        else {
                            wrapper.style.transform = `translateX(${-(100 / step)}%)`;
                            const timeOutEndTransition = setTimeout(() => {
                                wrapper.classList.add('transition');
                                wrapper.style.transform = `translateX(${(0)}%)`;
                                clearTimeout(timeOutEndTransition);
                            }, 0);
                        }
                        current = current < 0 || lengthCurrent < 0 ? 0 : current;
                        currentStatus = (lengthCurrent >= 0 && lengthCurrent <= step) ? true : false;
                    });
                }
                addEventClickBox(left);
                addEventClickBox(right);
            }
        })();
    }
    // box
}

const api = async () => {
    await fetch(`${constants.URL_API}/artists`, { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            let stringHTML = '';
            for (let index = 0; index < res.length; index++) {
                stringHTML += `<div class="box__item">
                                <div class="box__item--image img-wrap">
                                    <img src="${res[index].imageArtist}"
                                        alt="">
                                </div>
                                <p class="box__item--title">
                                    ${res[index].nameArtist}
                                </p>
                                <p class="box__item--desc">
                                    Developing...
                                </p>
                            </div>`;
            }
            constants.box.wrapper ? constants.box.wrapper.innerHTML = stringHTML : '';
        });
    await fetch(`${constants.URL_API}/musics/list?search=`, { method: "GET" })
        .then(res => res.json())
        .then(res => {
            constants.numberSong.innerHTML = `${res.length} Songs`;
            let stringHTML = "";
            for (let index = 0; index < res.length; index++) {
                stringHTML += ` <tr>
                                <td class="text-gray">${(index + 1) < 10 ? `0${index + 1}` : (index + 1)}</td>
                                <td>
                                    <div class="footer__left--item" data-index="${index}" data-item='${JSON.stringify(res[index])}'>
                                        <img src="${res[index].image}"
                                            alt="" srcset="">
                                        <i id="item-music-play-${res[index].id}" class="bx bx-play item-music-play"></i>
                                        <div>
                                            <p>${res[index].name}</p>
                                            <span>${res[index].artistMusic.nameArtist}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class='item-music-duration'>--:--</td>
                                <td><i class="bx bxs-heart item-music-heart text-gray"></i></td>
                            </tr>`;
            }
            constants.tbody ? constants.tbody.innerHTML = stringHTML : '';
            loadItemMusic();
            if (res.length > 0) {
                let href = window.location.href;
                href = (href.replace("http://", "").replace("https://", "").replace("/app.html", "").replace("#", "").replace(window.location.host, ""));
                const timeOut = setTimeout(() => {
                    if (href === "")
                        playMusic(res[0])
                    clearTimeout(timeOut);
                }, 1000);
            }
        });

    loadFeatureSlide();
};

const apiBox = async (data) => {
    await fetch(`${constants.URL_API}/${data}s`, { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            let stringHTML = "";
            for (let index = 0; index < res.length; index++) {
                stringHTML += `<div class="box__item--child">
                            <div class="box__item--image img-wrap">
                                <img src="${res[index][data === "artist" ? 'imageArtist' : 'imageAlbum']}"
                                    alt="">
                            </div>
                            <p class="box__item--title">
                                ${res[index][data === "artist" ? 'nameArtist' : 'nameAlbum']}
                            </p>
                            ${data === "artist" ? `<p class="box__item--desc">
                            Developing...
                        </p>` : ''}
                        </div>`;
            }
            const container__album = document.querySelector('.container__album');
            container__album ? container__album.innerHTML = stringHTML : '';
        })
}
