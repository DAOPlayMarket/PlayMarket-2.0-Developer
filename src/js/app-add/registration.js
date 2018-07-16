$(document).ready(function(){
    const spinner = $('#spinner');

    $('form#registration').on('submit', async function (event) {
        event.preventDefault();
        try {
            let options = {
                method: 'post',
                url: '/app-add/registration',
                data: {
                    password: $('input[name="password"]').val(),
                    hashTag: $('input[name="hashTag"]').val(),
                    hash: $('input[name="hash"]').val()
                }
            };
            let res = (await axios(options)).data;
            console.log('res:', res);
            if (res.status === 200) {

                // window.location.href = '/app-add/confirmation/';
            } else if (res.status === 500) {
                spinner.hide();
                toastr.error(res.message);
            }
        } catch(e) {
            spinner.hide();
            console.log('error:', e);
            toastr.error(e.message);
        }
    })
});
