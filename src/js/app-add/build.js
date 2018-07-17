$(document).ready(function(){
    const spinner = $('#spinner');
    const web3 = new Web3();

    $('input[name="ageRestrictions"]').mask('00');
    $('input[name="value"]').mask('099.999999999999999999');
    $('input[name="version"]').mask('000');

    const markdownEditor = new SimpleMDE({
        element: $("#longdescr-textarea")[0] ,
        hideIcons: ["side-by-side", "image", "guide", "quote", "heading", "ordered-list"],
        showIcons: ["heading-2"],
        spellChecker: false
    });

    $('.select2').select2({
        width: '300px',
        minimumResultsForSearch: -1,
        placeholder: $(this).data('placeholder')
    });

    $('#idCTG').on('change', async function (event) {
        event.preventDefault();
        let options = {
            method: 'post',
            url: '/helpers/get-subcategories',
            data: {
                idCTG: $(this).val()
            }
        };
        let res = (await axios(options)).data;
        let output = "";
        $.each(res.subcategories, function(key, val) {
            console.log(val.name);
            output += '<option value="' + val.id + '">' + val.name + '</option>';
        });
        console.log(output);
        $("#subCategory").html(output);
    });


    $('form#build').on('submit', async function (event) {
        event.preventDefault();
        try {
            spinner.show();
            let fd = new FormData();

            fd.append("nameApp", $('input[name="name"]').val());
            fd.append("idCTG", $('select[name="idCTG"]').val());
            fd.append("subCategory", $('select[name="subCategory"]').val());
            fd.append("slogan", $('input[name="slogan"]').val());
            fd.append("shortDescr", $('textarea[name="shortDescr"]').val());
            fd.append("keywords", $('input[name="keywords"]').val());
            fd.append("youtubeID", $('input[name="youtubeID"]').val());
            fd.append("email", $('input[name="email"]').val());
            fd.append("packageName", $('input[name="packageName"]').val());
            fd.append("version", $('input[name="version"]').val());
            fd.append("ageRestrictions", $('input[name="ageRestrictions"]').val());
            fd.append("price", web3.toWei($('input[name="price"]').val(), 'ether'));
            fd.append("publish", $('input[name="publish"]').is(':checked'));
            fd.append("advertising", $('input[name="advertising"]').is(':checked'));
            fd.append("forChildren", $('input[name="forChildren"]').is(':checked'));

            fd.append("urlApp", $('input[name="urlApp"]').val());
            fd.append("privacyPolicy", $('input[name="privacyPolicy"]').val());
            fd.append("longDescr", markdownEditor.value());

            let gallery = document.getElementById('gallery');
            for (let i = 0; i < gallery.files.length; i++) {
                fd.append("gallery", gallery.files[i]);
            }

            let banner = document.getElementById('banner');
            fd.append("banner", banner.files[0]);

            let logo = document.getElementById('logo');
            fd.append("logo", logo.files[0]);

            let app = document.getElementById('apk');
            fd.append("apk", app.files[0]);

            let options = {
                method: 'post',
                url: '/app-add/build',
                data: fd
            };
            let res = (await axios(options)).data;
            console.log('res:', res);
            if (res.status === 200) {
                let options = {
                    method: 'post',
                    url: '/app-add/load'
                };
                let res = (await axios(options)).data;
                console.log(res);
                spinner.hide();
                if (res.status === 200) {
                    window.location.href = '/app-add/registration?hashTag=' + res.result.hashTag + '&hash=' + res.result.hash;
                } else if (res.status === 500) {
                    spinner.hide();
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
});
