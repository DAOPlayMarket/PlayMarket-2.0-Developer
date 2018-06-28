$(document).ready(function(){
    const md = window.markdownit();

    $('.gallery-slider').owlCarousel({
        margin: 10,
        loop: false,
        autoWidth: true,
        items: 4,
        nav: true,
        dots: false
    });
    let md_descr =  $('#ico__description__input').val();
    $('#ico__description-area').html(md.render(md_descr));
});

