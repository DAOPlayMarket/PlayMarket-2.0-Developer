$(document).ready(function(){
    $('form').on('submit', async function (event) {
        event.preventDefault();

        let fd = new FormData();

        fd.append("nameApp", $('input[name="name"]').val());
        fd.append("slogan", $('input[name="slogan"]').val());
        fd.append("shortDescr", $('input[name="shortDescr"]').val());

        let gallery = document.getElementById('gallery');
        for (let i = 0; i < gallery.files.length; i++) {
            fd.append("gallery", gallery.files[i]);
        }

        let logo = document.getElementById('logo');
        fd.append("logo", logo.files[0]);

        let app = document.getElementById('app');
        fd.append("app", app.files[0]);

        let options = {
            method: 'post',
            url: '/app/add',
            data: fd
        };
        let res = (await axios(options)).data;
        console.log(res);
    });
    // const markdownEditor1 = new SimpleMDE({
    //     element: $("#app-add-edit__slogan")[0] ,
    //     toolbar: false
    // });
    // const markdownEditor2 = new SimpleMDE({
    //     element: $("#app-add-edit__shortdescr")[0] ,
    //     toolbar: false
    // });



    // const markdownEditor3 = new SimpleMDE({
    //     element: $("#app-add-edit__longdescr")[0] ,
    //     hideIcons: ["side-by-side", "image", "guide", "quote"]
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
