import constants from "./constants.js";

window.onload = () => {
    // sidebar
    if (constants.sidebar) {
        (() => {
            const { mobile, main, overlay } = constants.sidebar;
            if (mobile && main && overlay) {
                const clickOutSideSibar = () => {
                    main.classList.remove('active');
                    overlay.classList.remove('active');
                    overlay.removeEventListener('click', clickOutSideSibar);
                }
                mobile.addEventListener('click', function () {
                    if (main.classList.contains('active')) {
                        clickOutSideSibar()
                    }
                    else {
                        main.classList.add('active');
                        overlay.classList.add('active');
                        overlay.addEventListener('click', clickOutSideSibar);
                    }
                });
            }
        })();
    }
    // sidebar

    // resize
    const resize = function () {
        if (window.innerWidth < 1024 && constants.sidebar && constants.sidebar.main) {
            constants.sidebar.main.classList.add('transition');
        }
        else {
            constants.sidebar.main.classList.remove('transition');
        }
    }
    resize();
    window.addEventListener('resize', resize);
    // resize

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
                    btn && btn.addEventListener('click', function () {
                        const width = window.innerWidth;
                        const step = width >= 1500 ? 5 : (width < 1500 && width >= 1280) ? 4 : (width < 1280 && width >= 640) ? 3 :
                            (width >= 450 && width < 640) ? 2 : 1;
                        const length = wrapper.children.length;
                        const lengthCurrent = length - (current * step);
                        current = lengthCurrent <= step ? lengthCurrent === 0 ? (current + step) : -1 : (current + step);
                        currentStatus = lengthCurrent <= step ? true : false;
                        current = current === -1 ? 0 : current;
                        if (current !== 0) {
                            wrapper.style.transform = `translateX(-${(100 / step) * (current)}%)`;
                            wrapper.classList.add('transition');
                        }
                        else {
                            wrapper.style.transform = `translateX(${-(100 / step) * 2}%)`;
                            wrapper.classList.add('transition');
                            const timeOutEndTransition = setTimeout(() => {
                                wrapper.style.transform = `translateX(${(0)}%)`;
                                clearTimeout(timeOutEndTransition);
                            }, 600);
                        }

                    });
                }
                addEventClickBox(left);
                addEventClickBox(right);
            }
        })();
    }
    // box

}