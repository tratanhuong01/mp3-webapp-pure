import constants from "./constants.js";


let timeMain = 0;
let currentMain = 0;
let interval;
let musicCurrent;
let indexMain = 0;
let randomLoop = null;
let indexLoop = null;

const formatTime = (duration) => {
    duration = Math.floor(duration);
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
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

//
constants.container && constants.catelog && (() => {
    [...constants.catelog].forEach((el, index) => {
        el.addEventListener('click', function () {
            const data = this.getAttribute('data-path');
            [...constants.container].forEach(el_ => {
                el_.classList.remove('active');
            })
            constants.container[0].classList.add('active');
            if (location.pathname.indexOf(data) !== -1) {
            }
        });
        [...constants.container].forEach(el_ => {
            el_.classList.remove('active');
        })
        constants.container[0].classList.add('active');

    });
})()
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

export default async function api() {
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
                playMusic(res[0])
            }
        })
};