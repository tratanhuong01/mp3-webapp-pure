//

const imageSong = document.querySelector('.info-song__image');
const nameSong = document.querySelector('.info-song__name');
const albumSong = document.querySelector('.info-song__album');
const artistSong = document.querySelector('.info-song__artist');
const audio = document.querySelector('#song-main');
const listAudio = document.querySelector('.list-audio');
const listNameAudio = document.getElementsByClassName('list-name-audio');
const listNameAudioWrapper = document.getElementsByClassName('list-name-audio__wrapper');
const durationAudio = document.getElementsByClassName('duration-audio');
const buttonPrevious = document.querySelector('.control-audio__prev');
const buttonPlay = document.querySelector('.control-audio__center');
const buttonNext = document.querySelector('.control-audio__next');
const timeNumberLeft = document.querySelector('.control-time__number__left');
const timeNumberRight = document.querySelector('.control-time__number__right');
const timeLineCurrent = document.querySelector('.control-time__current');
const timeLineMain = document.querySelector('.control-time__main');
const rangeVolume = document.querySelector('.volume-range');
const repeatAudio = document.querySelector('.repeat-audio');
const imageDemo = document.querySelector('.image-demo');
const infoSong = document.querySelector('.info-song');

const formatTime = (duration) => {
    duration = Math.floor(duration);
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}
let index = -1;
let isPlay = false;
let timeVideo = 0;
let current = 0;
let repeat = false;

let interval;

rangeVolume.addEventListener('mousemove', (e) => {
    audio.volume = e.target.value / 100
})

window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 32:
            handlePlay();
            break;
        case 37:
            handlePreviousOrNext("", true);
            break;
        case 39:
            handlePreviousOrNext();
            break;
        default:
            break;
    }
})

const handleCurrentTime = (e) => {
    if (e.offsetX < 0) {
        current = 0;
    }
    else {
        current = (Math.floor((e.offsetX / timeLineMain.offsetWidth) * timeVideo));
        audio.currentTime = current;
    }
}

repeatAudio.addEventListener('click', () => {
    if (repeat) {
        repeatAudio.style.color = "var(--color-main)";
    }
    else {
        repeatAudio.style.color = "var(--background-color-button)";
    }
    repeat = !repeat;
})

timeLineMain.addEventListener('click', handleCurrentTime);

timeLineCurrent.addEventListener('click', handleCurrentTime);

const intervalRun = () => {
    ++current;
    if (current > timeVideo) {
        clearInterval(interval);
        if (repeat) {
            current = 0;
            splitLoadInfoSong(JSON.stringify(list[index]).replaceAll(`"`, `@@@@`), true, index);
        }
        else {
            handlePreviousOrNext("");
        }
        return;
    }
    timeLineCurrent.style.width = `${(current / timeVideo) * 100}%`;
    timeNumberLeft.innerHTML = formatTime(current);
    timeNumberRight.innerHTML = formatTime(timeVideo);
};

const handlePlay = (e, test) => {
    if (test) {
        interval = setInterval(intervalRun, 1000);
        isPlay = true;
        audio.play();
        buttonPlay.innerHTML = `<i class='bx bx-pause' style="transform: scale(3.5);margin-left: 0px;"></i>`
    }
    else {
        if (isPlay) {
            clearInterval(interval)
            audio.pause();
            buttonPlay.innerHTML = `<i class='bx bx-play' style="transform: scale(3.5);margin-left: 5px;"></i>`
        }
        else {
            interval = setInterval(intervalRun, 1000);
            audio.play();
            buttonPlay.innerHTML = `<i class='bx bx-pause' style="transform: scale(3.5);margin-left: 0px;"></i>`
        }
        isPlay = !isPlay;
    }
}

buttonPlay.addEventListener('click', handlePlay)

const handlePreviousOrNext = (e, prev) => {
    current = 0;
    timeVideo = 0;
    clearInterval(interval);
    let newIndex = index;
    if (prev) {
        if (newIndex - 1 < 0) {
            newIndex = list.length - 1;
        }
        else {
            --newIndex;
        }
    }
    else {
        if (newIndex + 1 === list.length) {
            newIndex = 0;
        }
        else {
            ++newIndex;
        }
    }
    if (newIndex > 2) {
        listAudio.scrollTop += (prev ? -92 : 92);
    }
    loadInfoSong(JSON.stringify(list[newIndex]).replaceAll(`"`, `@@@@`), true, newIndex);
};

buttonPrevious.addEventListener('click', () => handlePreviousOrNext("e", true));

buttonNext.addEventListener('click', handlePreviousOrNext)

const loadInfoSong = (song, string, pos) => {
    clearInterval(interval);
    if (!song || index === pos) return;
    if (index === -1) {
        buttonPlay.classList.remove('disbaled-button');
        buttonPlay.disabled = false;
        buttonPrevious.disabled = false;
        buttonNext.disabled = false;
        infoSong.style.display = 'flex';
        imageDemo.style.display = 'none';
    }
    splitLoadInfoSong(song, string, pos)
}

const splitLoadInfoSong = (song, string, pos) => {
    if (string) {
        song = JSON.parse(song.replaceAll(`@@@@`, `"`));
        index = pos;
    }
    imageSong.src = song.image;
    nameSong.innerHTML = song.name;
    albumSong.innerHTML = song.album;
    artistSong.innerHTML = song.artist;
    audio.src = song.audio;
    [...listNameAudio].forEach((el, i) => {
        listNameAudioWrapper[i].classList.remove("active-item");
        el.innerHTML = "";
        if (pos === i) {
            el.innerHTML = `    <span>-</span><span style="font-weight : bold;padding : 0px 12px;"> Now playing </span> `;
            listNameAudioWrapper[i].classList.add("active-item");
        }
    });
    const audioFake = new Audio(song.audio);
    audioFake.oncanplaythrough = () => {
        timeVideo = Math.floor(audioFake.duration);
        current = 0;
        if (string) {
            handlePlay("e", true);
            audioFake.remove();
        }
    }
}

[...list].forEach((song, index) => {
    listAudio.innerHTML += `<div onclick="loadInfoSong('${JSON.stringify(song).replaceAll(`"`, `@@@@`)}',true,${index})" class="list-audio__item">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="27px"
        height="27px">
        <path fill-rule="evenodd" fill="rgb(83, 88, 97)"
            d="M13.545,26.840 C6.295,26.840 0.420,20.835 0.420,13.421 C0.420,6.012 6.295,0.003 13.545,0.003 C20.794,0.003 26.674,6.012 26.673,13.421 C26.673,20.834 20.794,26.840 13.545,26.840 ZM13.777,7.237 C10.315,7.237 7.497,10.117 7.497,13.656 C7.497,17.195 10.315,20.073 13.777,20.073 C17.237,20.073 20.053,17.194 20.053,13.656 C20.053,10.117 17.237,7.237 13.777,7.237 ZM13.777,19.373 C10.691,19.373 8.182,16.808 8.182,13.656 C8.182,10.501 10.691,7.939 13.777,7.939 C16.859,7.939 19.365,10.501 19.366,13.656 C19.366,16.808 16.859,19.373 13.777,19.373 ZM13.777,9.457 C11.507,9.457 9.666,11.336 9.666,13.656 C9.666,15.974 11.506,17.857 13.777,17.857 C16.043,17.857 17.883,15.974 17.884,13.656 C17.884,11.336 16.044,9.457 13.777,9.457 Z" />
        </svg>
        <div style="padding-left: 16px;" class="list-name-audio__wrapper">
            <p class="list-name-audio__p"><span>${song.name}</span><span class="list-name-audio"></span></p>
            <span class="info-song__artist">
                Singers - ${song.artist}
            </span>
        </div>
    </div>
    <span class="duration-audio">...</span>
</div>`
});

[...durationAudio].forEach((item, index) => {
    const audioNew = new Audio(list[index].audio);
    audioNew.oncanplaythrough = () => {
        let duration = audioNew.duration;
        audioNew.remove();
        item.innerHTML = formatTime(duration);
    }
});


