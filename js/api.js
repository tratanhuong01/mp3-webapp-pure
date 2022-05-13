import constants from "./constants.js";

export default async function api() {
    await fetch(`${constants.URL_API}/musics/list?search=`, { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            let albumName = [];
            for (let index = 0; index < res.length; index++) {
                const pos = albumName.findIndex(dt => dt === res[index].artist);
                if (pos === -1) {
                    albumName.push(res[index].artist);
                }
            }
            let stringHTML = '';
            for (let index = 0; index < albumName.length; index++) {
                stringHTML += `<div class="box__item">
                                    <div class="box__item--image img-wrap">
                                        <img src="https://media.2dep.vn/resize_560x699/upload/thutra/2022/04/28/tu-a-den-z-ve-theres-no-one-at-all-cua-son-tung-m-tp-loi-bai-hat-va-cau-chuyen-trong-mv-1651160431-4.jpeg"
                                            alt="">
                                    </div>
                                    <p class="box__item--title">
                                        ${albumName[index]}
                                    </p>
                                    <p class="box__item--desc">
                                        SonTung MTP
                                    </p>
                                </div>`;
            }
            constants.numberSong.innerHTML = `${res.length} Songs`;
            constants.box.wrapper ? constants.box.wrapper.innerHTML = stringHTML : '';
            stringHTML = "";
            for (let index = 0; index < res.length; index++) {
                stringHTML += ` <tr>
                                    <td class="text-gray">${(index + 1) < 10 ? `0${index + 1}` : (index + 1)}</td>
                                    <td>
                                        <div class="footer__left--item">
                                            <img src="${res[index].image}"
                                                alt="" srcset="">
                                            <i class="bx bx-play"></i>
                                            <div>
                                                <p>${res[index].name}</p>
                                                <span>${res[index].artist}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>03:02</td>
                                    <td><i class="bx bxs-heart text-gray"></i></td>
                                </tr>`;
            }
            constants.tbody ? constants.tbody.innerHTML = stringHTML : '';
        });
};