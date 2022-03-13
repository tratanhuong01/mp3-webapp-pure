const auth = document.querySelector('.music-manager p');
renderInfo(auth)
//
const tableMain = document.querySelector('.table-main');
const tbodyTableMain = document.querySelector('.table-main tbody');
const songMain = document.querySelector('#song-main');
const songModal = document.querySelector('#song-modal');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const buttonCloseModal = document.querySelector('#close-modal');
const buttonAddMusic = document.querySelector('.button-add');
const nameMusic = document.querySelector('#name-music');
const albumMusic = document.querySelector('#album-music');
const artistMusic = document.querySelector('#artist-music');
const inputUploadImage = document.querySelector('#image-music-input');
const inputUploadAudio = document.querySelector('#audio-music-input');
const imageMusicChange = document.querySelector('#image-music-change');
const infoImageMusic = document.querySelector('#info-image-music');
const infoAudioMusic = document.querySelector('#info-audio-music');
const listButtonPlayMain = document.getElementsByClassName('button-play-row');
const idForm = document.querySelector('#form-id');
const loadingModal = document.querySelector('#loading-modal');
const nameMusicWrap = document.querySelector('.name-music p');
const albumMusicWrap = document.querySelector('.album-music p');
const artistMusicWrap = document.querySelector('.artist-music p');
const imageMusicWrap = document.querySelector('.image-music p');
const audioMusicWrap = document.querySelector('.audio-music p');

let list = [];
let isPlayModal = false;
let isPlayMain = false;
let index = -1;
let indexPlay = -1;

const fetchData = (data) => {
    fetch(`${API_URL}/musics/list?search=${data ? data : ''}`, { method: "GET" })
        .then(res => res.json())
        .then(result => {
            let string = "";
            list = result;
            [...list].forEach((el, index) => {
                string += `
                    <tr id='row__${el.id}'>
                        <td>${el.name}</td>
                        <td>${el.artist}</td>
                        <td>${el.album}</td>
                        <td><img src='${el.image}' alt='' style='margin:auto;display:block;width:90px;height:90px;
                        object-fit:cover;'/></td>
                        <td><i onclick='handlePlay(${el.id})' class='bx bx-play button-play-row' style='font-size:32px;color:gray;display:block;margin:auto;
                        width:32px;cursor:pointer;'></i></td>
                        <td style='font-size: 21px;'>
                            <i onclick='loadInfoSong(${el.id})' class='bx bx-edit' style='color:orange;cursor:pointer;'></i>
                            <i onclick='deleteSong(${el.id})' class='bx bx-trash-alt' style='color:red;cursor:pointer;'></i>
                            <div class='loading-tr' id='loading-column-${el.id}' style='display:none;'>
                                <div class="loading-audio">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                            </div>
                        </td>
                    </tr>
                `
            });
            tbodyTableMain.innerHTML = string;
        });
}

fetchData();

const addEventClick = (button, close) => {
    button.addEventListener('click', () => {
        if (close) {
            closeModal();
            return;
        }
        modal.style.display = 'flex';
    });
}

const closeModal = () => {
    modal.style.display = 'none';
    resetForm();
    document.querySelector('.title-modal').innerHTML = 'Add'
}

const resetForm = () => {
    idForm.value = '';
    nameMusic.value = '';
    artistMusic.value = '';
    albumMusic.value = '';
    imageMusicChange.src = 'https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=';
    inputUploadImage.value = '';
    inputUploadAudio.value = '';
    infoAudioMusic.innerHTML = 'Select File';
    infoImageMusic.innerHTML = 'Select File';
    const reset = (list) => {
        [...list].forEach(wrap => {
            wrap.classList.remove('error');
            wrap.innerHTML = ''
        })
    }
    infoAudioMusic.style.display = 'none';
    infoImageMusic.style.display = 'none';
    reset([nameMusicWrap, albumMusicWrap, artistMusicWrap, imageMusicWrap, audioMusicWrap]);
    songModal.pause();
    loadingModal.style.display = 'none';
}

const addEventAudio = () => {
    infoAudioMusic.innerHTML = '<i class="bx bx-play button-play-audio-preview"></i>';
    const buttonPlayMusicPreview = document.querySelector('.button-play-audio-preview');
    buttonPlayMusicPreview.addEventListener('click', () => {
        if (isPlayMain) {
            [...listButtonPlayMain].forEach(el => {
                if (el.classList.contains('bx-pause')) {
                    el.classList.remove('bx-pause');
                    el.classList.add('bx-play');
                }
            });
        }
        isPlayMain = false;
        songMain.pause();
        if (isPlayModal) {
            songModal.pause();
            buttonPlayMusicPreview.classList.remove('bx-pause');
            buttonPlayMusicPreview.classList.add('bx-play');
        }
        else {
            songModal.play();
            buttonPlayMusicPreview.classList.add('bx-pause');
            buttonPlayMusicPreview.classList.remove('bx-play');
        }
        isPlayModal = !isPlayModal;
    })
}

const addEventChangeUploadFile = (input, isImage) => {
    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            if (isImage) {
                imageMusicWrap.classList.remove('error');
                imageMusicWrap.innerHTML = '';
                infoImageMusic.style.display = 'flex';
                imageMusicChange.src = URL.createObjectURL(e.target.files[0]);
                infoImageMusic.innerHTML = e.target.files[0].name;
            }
            else {
                audioMusicWrap.classList.remove('error');
                audioMusicWrap.innerHTML = '';
                infoAudioMusic.style.display = 'flex';
                songModal.src = URL.createObjectURL(e.target.files[0]);
                addEventAudio();
            }
        }
    })
}

const loadInfoSong = (id) => {
    const pos = [...list].findIndex(dt => dt.id === id);
    if (pos !== -1) {
        index = pos;
        document.querySelector('.title-modal').innerHTML = 'Edit'
        modal.style.display = 'flex';
        idForm.value = list[pos].id;
        nameMusic.value = list[pos].name;
        albumMusic.value = list[pos].album;
        artistMusic.value = list[pos].artist;
        imageMusicChange.src = list[pos].image;
        songModal.src = list[pos].audio;
        infoAudioMusic.style.display = 'flex';
        infoImageMusic.style.display = 'flex';
        addEventAudio();
    }
}

const deleteSong = (id) => {
    const element = document.querySelector(`#loading-column-${id}`);
    const position = [...list].findIndex(dt => dt.id === id);
    element.style.display = 'flex';
    if (position !== -1) {
        fetch(`${API_URL}/musics`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(list[position]),
            method: "DELETE"
        }).then(res => "").then(result => {
            list = [...list].filter(dt => dt.id !== id);
            document.querySelector('#row__' + id).remove();
        })
    }
}

const handlePlay = (id) => {
    const pos = [...list].findIndex(dt => dt.id === id);
    if (pos !== -1) {
        [...listButtonPlayMain].forEach(el => {
            if (el.classList.contains('bx-pause')) {
                el.classList.remove('bx-pause');
                el.classList.add('bx-play');
            }
        });
        const play = () => {
            songMain.src = list[pos].audio;
            listButtonPlayMain[pos].classList.remove('bx-play');
            listButtonPlayMain[pos].classList.add('bx-pause');
            songMain.play();
        }
        if (indexPlay === pos) {
            if (isPlayMain) {
                songMain.pause();
            }
            else {
                play();
            }
        }
        else {
            play();
        }
        isPlayMain = !isPlayMain;
        indexPlay = pos;
    }
}

addEventClick(buttonAddMusic);
addEventClick(buttonCloseModal, true);

addEventChangeUploadFile(inputUploadImage, true);
addEventChangeUploadFile(inputUploadAudio);

const error = (label, input, message) => {
    label.classList.add(input.value === "" ? 'error' : '1');
    label.innerHTML = input.value === "" ? `${message} !!` : '';
}

const eventOnChangeInput = (list) => {
    [...list].forEach((el) => {
        el[el.name].addEventListener('input', (e) => {
            error(el[`${el.name}Wrap`], el[el.name], el.message);
        })
    })
}

eventOnChangeInput([{ nameMusic, nameMusicWrap, name: 'nameMusic', message: 'Name music requried' },
{ albumMusic, albumMusicWrap, name: 'albumMusic', message: 'Album music requried' },
{ artistMusic, artistMusicWrap, name: 'artistMusic', message: 'Artist music requried' }])
//
//

const execute = (result) => {
    const data = `<td>${result.name}</td>
                <td>${result.artist}</td>
                <td>${result.album}</td>
                <td><img src='${result.image}' alt='' style='margin:auto;display:block;width:90px;height:90px;
                object-fit:cover;'/></td>
                <td><i onclick='handlePlay(${result.id})' class='bx bx-play button-play-row' style='font-size:32px;color:gray;display:block;margin:auto;
                width:32px;cursor:pointer;'></i></td>
                <td style='font-size: 21px;'>
                    <i onclick='loadInfoSong(${result.id})' class='bx bx-edit' style='color:orange;cursor:pointer;'></i>
                    <i onclick='deleteSong(${result.id})' class='bx bx-trash-alt' style='color:red;cursor:pointer;'></i>
                    <div class='loading-tr' id='loading-column-${result.id}' style='display:none;'>
                        <div class="loading-audio">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </td>`;
    if (idForm.value === "") {
        list = [...list, result];
        tbodyTableMain.innerHTML = `<tr id='row__${result.id}'>${data}</tr>` + tbodyTableMain.innerHTML;
    }
    else {
        list[index] = result;
        const item = document.querySelector(`#row__${idForm.value}`);
        item.innerHTML = data;
    }
    closeModal();
    resetForm();
}

modalContent.addEventListener('submit', (e) => {
    e.preventDefault();
    if (nameMusic.value !== "" && albumMusic.value !== "" && artistMusic.value !== "") {
        if (idForm.value === "") {
            let status = false;
            if (inputUploadAudio.value === "") {
                error(audioMusicWrap, inputUploadAudio, 'Audio music requried');
                status = true;
            }
            if (inputUploadImage.value === "") {
                error(imageMusicWrap, inputUploadImage, 'Image music requried');
                status = true;
            }
            if (status) return;
        }
        loadingModal.style.display = 'flex';
        let object = {
            id: idForm.value,
            name: nameMusic.value,
            album: albumMusic.value,
            artist: artistMusic.value,
            image: idForm.value ? list[index].image : '',
            audio: idForm.value ? list[index].audio : '',
            timeCreated: idForm.value ? list[index].timeCreated : null
        }
        if (idForm.value === "") {
            const formDataImage = new FormData();
            formDataImage.append("multipartFile", inputUploadImage.files[0]);
            formDataImage.append("id", new Date().getTime());
            formDataImage.append("publicId", "Mp3App/Image/");
            formDataImage.append("typeFile", "image");
            const formDataAudio = new FormData();
            formDataAudio.append("multipartFile", inputUploadAudio.files[0]);
            formDataAudio.append("id", new Date().getTime());
            formDataAudio.append("publicId", "Mp3App/Audio/");
            formDataAudio.append("typeFile", "video");
            const fetch1 = fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formDataImage
            }).then(res => res.json());
            const fetch2 = fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formDataAudio
            }).then(res => res.json());
            const dataAll = Promise.all([fetch1, fetch2]);
            dataAll.then(res => {
                object = { ...object, image: res[0].url, audio: res[1].url }
                fetch(`${API_URL}/musics`, {
                    headers: { "Content-Type": "application/json" },
                    method: idForm.value ? 'PUT' : 'POST',
                    body: JSON.stringify(object)
                }).then(res => res.json()).then(result => {
                    execute(result)
                });
            })
        }
        else {
            let promiseList = [];
            let formDataImage = new FormData();
            let formDataAudio = new FormData();
            if (inputUploadImage.files.length > 0) {
                formDataImage.append("multipartFile", inputUploadImage.files[0]);
                formDataImage.append("id", new Date().getTime());
                formDataImage.append("publicId", "Mp3App/Image/");
                formDataImage.append("typeFile", "image");
                promiseList.push(fetch(`${API_URL}/upload`, {
                    method: "POST",
                    body: formDataImage
                }).then(res => res.json()));
            }
            if (inputUploadAudio.files.length > 0) {
                formDataAudio.append("multipartFile", inputUploadAudio.files[0]);
                formDataAudio.append("id", new Date().getTime());
                formDataAudio.append("publicId", "Mp3App/Audio/");
                formDataAudio.append("typeFile", "video");
                promiseList.push(fetch(`${API_URL}/upload`, {
                    method: "POST",
                    body: formDataAudio
                }).then(res => res.json()))
            }
            if (inputUploadAudio.files.length === 0 && inputUploadImage.files.length === 0) {
                fetch(`${API_URL}/musics`, {
                    headers: { "Content-Type": "application/json" },
                    method: idForm.value ? 'PUT' : 'POST',
                    body: JSON.stringify(object)
                }).then(res => res.json()).then(result => {
                    execute(result);
                });
            }
            else {
                if (promiseList.length === 2) {
                    const promiseAll = Promise.all(promiseList);
                    promiseAll.then(res => {
                        fetch(`${API_URL}/musics`, {
                            headers: { "Content-Type": "application/json" },
                            method: idForm.value ? 'PUT' : 'POST',
                            body: JSON.stringify({ ...object, image: res[0].url, audio: res[1].url })
                        }).then(res => res.json()).then(result => {
                            execute(result);
                        });
                    })
                }
                else {
                    const promiseAll = Promise.all(promiseList);
                    promiseAll.then(res => {
                        fetch(`${API_URL}/musics`, {
                            headers: { "Content-Type": "application/json" },
                            method: idForm.value ? 'PUT' : 'POST',
                            body: JSON.stringify({
                                ...object, [inputUploadAudio.files.length > 0 ?
                                    'audio' : 'image']: res[0].url
                            })
                        }).then(res => res.json()).then(result => {
                            execute(result);
                        });
                    })
                }
            }
        }
    }
    else {
        if (nameMusic.value === "") {
            error(nameMusicWrap, nameMusic, 'Name music requried');
        }
        if (albumMusic.value === "") {
            error(albumMusicWrap, albumMusic, 'Album music requried');
        }
        if (artistMusic.value === "") {
            error(artistMusicWrap, artistMusic, 'Artist music requried');
        }
        if (id.value === "") {
            if (inputUploadAudio.value === "") {
                error(audioMusicWrap, inputUploadAudio, 'Audio music requried');
            }
            if (inputUploadImage.value === "") {
                error(imageMusicWrap, inputUploadImage, 'Image music requried');
            }
        }
    }
})

const fetchMusic = () => {
    fetch(`${API_URL}/musics`, {
        headers: { "Content-Type": "application/json" },
        method: id.value ? 'PUT' : 'POST',
        body: JSON.stringify({
            id: id.value,
            name: nameMusic.value,
            album: albumMusic.value,
            artist: artistMusic.value,
            image: id.value ? list[index].image : '',
            audio: id.value ? list[index].audio : '',
            timeCreated: id.value ? list[index].timeCreated : null
        })
    }).then(res => res.json()).then(result => {
        const data = `<td>${result.name}</td>
                <td>${result.artist}</td>
                <td>${result.album}</td>
                <td><img src='${result.image}' alt='' style='margin:auto;display:block;width:90px;height:90px;
                object-fit:cover;'/></td>
                <td><i onclick='handlePlay(${index})' class='bx bx-play button-play-row' style='font-size:32px;color:gray;display:block;margin:auto;
                width:32px;cursor:pointer;'></i></td>
                <td style='font-size: 21px;'>
                    <i onclick='loadInfoSong(${index})' class='bx bx-edit' style='color:orange;cursor:pointer;'></i>
                    <i onclick='deleteSong(${result.id})' class='bx bx-trash-alt' style='color:red;cursor:pointer;'></i>
                    <div class='loading-tr' id='loading-column-${result.id}' style='display:none;'>
                        <div class="loading-audio">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </td>`;
        if (id.value === "") {
            list = [...list, result];
            tbodyTableMain = `<tr id='row__${result.id}'>${data}</tr>` + tbodyTableMain.innerHTML;
        }
        else {
            list[index] = result;
            const item = document.querySelector(`#row__${id.value}`);
            item.innerHTML = data;
        }
        closeModal();
        resetForm();
    });
}