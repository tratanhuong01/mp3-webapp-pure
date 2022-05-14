window.onload = () => {

    reset();

    sidebarEvent();
    // api

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
        reset();
        if (window.innerWidth < 1280 && constants.sidebar && constants.sidebar.main) {
            constants.sidebar.main.classList.add('transition');
        }
        else {
            constants.sidebar.main.classList.remove('transition');
        }
    }
    resize();
    window.addEventListener('resize', resize);
    // resize

    // window click 
    window.addEventListener('click', function (event) {
        if (event.target.closest('.popover__color') || (event.target.closest('.button-change-color') || (
            constants.popover.color.button && !constants.popover.color.button.classList.contains('active')
        ))) {
            return;
        }
        else {
            constants.popover.color.button && constants.popover.color.button.classList.remove('active')
        }
    });
    // window click 

    // change color website
    if (constants.popover.color) {
        (() => {
            const { button, list } = constants.popover.color;
            if (button && list) {
                button.addEventListener('click', function (event) {
                    if (!event.target.closest(`.${list.parentElement.className}`)) {
                        button.classList.contains('active') ? button.classList.remove('active') :
                            button.classList.add('active');
                    }
                });
                [...list.children].forEach(item => {
                    item.addEventListener('click', () => {
                        [...list.children].forEach(item => item.classList.remove('active'));
                        const root = document.querySelector(':root');
                        root.style.setProperty('--color', item.getAttribute('data-color'));
                        item.classList.add('active');
                    })
                });
            }
        })();
    }
    // change color website

}