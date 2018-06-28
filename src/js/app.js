$(document).ready(function(){
    const md = window.markdownit();

    let md_descr =  $('#longdescr').val();
    $('.app-main__middle__longdescr').html(md.render(md_descr));

    $('.gallery-slider').owlCarousel({
        margin: 10,
        loop: false,
        autoWidth: true,
        items: 4,
        nav: true,
        dots: false
    })
});

