$(document).ready(function(){
    const spinner = $('#spinner');
    const web3 = new Web3();

    $('input[name="ageRestrictions"]').mask('00');
    $('input[name="value"]').mask('099.999999999999999999');

    const markdownEditor1 = new SimpleMDE({
        element: $("#ico-description-textarea")[0] ,
        hideIcons: ["side-by-side", "image", "guide", "quote", "heading", "ordered-list"],
        showIcons: ["heading-2"],
        spellChecker: false
    });
    const markdownEditor2 = new SimpleMDE({
        element: $("#investors-advantages-textarea")[0] ,
        hideIcons: ["side-by-side", "image", "guide", "quote", "heading", "ordered-list"],
        showIcons: ["heading-2"],
        spellChecker: false
    });

    $('form#build').on('submit', async function (event) {
        event.preventDefault();
        try {
            spinner.show();
            let fd = new FormData();

            fd.append("keywords", $('input[name="keywords"]').val());
            fd.append("youtubeID", $('input[name="youtubeID"]').val());
            fd.append("email", $('input[name="email"]').val());

            fd.append("idApp", $('input[name="idApp"]').val());

            fd.append("social", JSON.stringify({
                googlePlus: $('input[name="googlePlus"]').val(),
                facebook: $('input[name="facebook"]').val(),
                linkedin: $('input[name="linkedin"]').val(),
                instagram: $('input[name="instagram"]').val(),
                vk: $('input[name="vk"]').val(),
                youtube: $('input[name="youtube"]').val(),
                telegram: $('input[name="telegram"]').val(),
                git: $('input[name="git"]').val()
            }));

            fd.append("urlICO", $('input[name="urlICO"]').val());
            fd.append("privacyPolicy", $('input[name="privacyPolicy"]').val());

            fd.append("description", markdownEditor1.value());
            fd.append("advantages", markdownEditor2.value());

            let logo = document.getElementById('logo');
            fd.append("logo", logo.files[0]);

            let gallery = document.getElementById('gallery');
            for (let i = 0; i < gallery.files.length; i++) {
                fd.append("gallery", gallery.files[i]);
            }

            let banner = document.getElementById('banner');
            fd.append("banner", banner.files[0]);

            let whitepaper = document.getElementById('whitepaper');
            fd.append("whitepaper", whitepaper.files[0]);

            let onepage = document.getElementById('onepage');
            fd.append("onepage", onepage.files[0]);

            let options = {
                method: 'post',
                url: '/ico-add/build',
                data: fd
            };
            let res = (await axios(options)).data;

            console.log('res:', res);
            if (res.status === 200) {
                let options = {
                    method: 'post',
                    url: '/ico-add/load'
                };
                let res = (await axios(options)).data;
                console.log(res);
                spinner.hide();
                if (res.status === 200) {
                    let idApp = $('input[name="idApp"]').val();
                    window.location.href = '/ico-add/registration?idApp=' + idApp + '&hashTag=' + res.result.hashTag + '&hash=' + res.result.hash;
                } else if (res.status === 500) {
                    toastr.error(res.message);
                }
            } else if (res.status === 500) {
                spinner.hide();
                toastr.error(res.message);
            }
        } catch(e) {
            spinner.hide();
            console.log('error:', e);
            toastr.error(e.message);
        }
    });

    // $('#load').on('click', async function (event) {
    //     event.preventDefault();
    //     spinner.show();
    //     let options = {
    //         method: 'post',
    //         url: '/app-add/load'
    //     };
    //     let res = (await axios(options)).data;
    //     spinner.hide();
    //     if (res.status === 200) {
    //         $('.app-add__step').removeClass('active');
    //         $('#app-add__step--3').addClass('active');
    //         $('#accept__hashIPFS').html(res.result);
    //     } else if (res.status === 500) {
    //         toastr.error(res.message);
    //     }
    // });

    // $(function() {
    //     // Multiple images preview in browser
    //     let imagesPreview = function(input, placeToInsertImagePreview) {
    //
    //         if (input.files) {
    //             let filesAmount = input.files.length;
    //
    //             for (let i = 0; i < filesAmount; i++) {
    //                 let reader = new FileReader();
    //
    //                 reader.onload = function(event) {
    //                     $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
    //                 };
    //
    //                 reader.readAsDataURL(input.files[i]);
    //             }
    //         }
    //
    //     };
    //
    //     $('#gallery-photo-add').on('change', function() {
    //         imagesPreview(this, 'div.gallery');
    //     });
    // });

    // const markdownEditor1 = new SimpleMDE({
    //     element: $("#app-add-edit__slogan")[0] ,
    //     toolbar: false
    // });
    // const markdownEditor2 = new SimpleMDE({
    //     element: $("#app-add-edit__shortdescr")[0] ,
    //     toolbar: false
    // });





    // let data = [
    //     {"product":""},
    //     {"product":" windows"},
    //     {"product":" mac"},
    //     {"product":" linux"},
    //     {"product":" RHEL"},
    //     {"product":" Test product list"}
    // ];
    //
    // let test  = $.map(data, function (obj) {
    //     obj.id = obj.id || obj.pk; // replace pk with your identifier
    //
    //     return obj;
    // });
    //
    // $('#byProductName').select2({
    //     placeholder: 'Type any portion of a single product name...',
    //     allowClear: true,
    //     minimumInputLength: 0,
    //     multiple: true,
    //     width: 300,
    //     data: test
    // });

    // $('#get').on('click', function () {
    //     console.log(markdownEditor.value());
    // });
});
