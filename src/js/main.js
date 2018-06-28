import config from './lib/config'

$(document).ready(function(){
    $('.image-popup').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        zoom: {
            enabled: true,
            duration: 200,
            easing: 'ease-in-out'
        }

    });
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });
});






