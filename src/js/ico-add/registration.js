$(document).ready(function(){
    const spinner = $('#spinner');

    $('form#registration').on('submit', async function (event) {
        event.preventDefault();
        try {
            let options = {
                method: 'post',
                url: '/ico-add/registration',
                data: {
                    password: $('input[name="password"]').val(),
                    hashTag: $('input[name="hashTag"]').val(),
                    hash: $('input[name="hash"]').val(),
                    idApp: $('input[name="idApp"]').val()
                }
            };
            let res = (await axios(options)).data;
            spinner.hide();
            console.log('res:', res);
            if (res.status === 200) {
                let idApp = $('input[name="idApp"]').val();
                window.location.href = '/ico-add/contract?idApp=' + idApp;
            } else if (res.status === 500) {
                toastr.error(res.message);
            }
        } catch(e) {
            spinner.hide();
            console.log('error:', e);
            toastr.error(e.message);
        }
    })
});
