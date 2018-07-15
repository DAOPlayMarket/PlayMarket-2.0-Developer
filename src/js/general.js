$(document).ready(function(){
    const spinner = $('#spinner');
    new ClipboardJS('.clipboard-btn');

    $('.image-popup').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        zoom: {
            enabled: true,
            duration: 200,
            easing: 'ease-in-out'
        }

    });
    $('.copy-btn').on('click', function () {
        toastr.success($(this).data('notifiсation'));
    });

    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});






