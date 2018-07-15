$(document).ready(function(){
    const spinner = $('#spinner');

    $('form#contract').on('submit', async function (event) {
        event.preventDefault();
        try {
            let options = {
                method: 'post',
                url: '/ico-add/contract',
                data: {
                    icoName: $('input[name="icoName"]').val(),
                    icoSymbol: $('input[name="icoSymbol"]').val(),
                    icoStartDate: $('input[name="icoStartDate"]').val(),
                    address: $('input[name="address"]').val(),
                    icoHardCapUsd: $('input[name="icoHardCapUsd"]').val() * 1000000,
                    idApp: $('input[name="idApp"]').val(),
                    password: $('input[name="password"]').val(),
                }
            };
            let res = (await axios(options)).data;
            spinner.hide();
            console.log('res:', res);
            if (res.status === 200) {

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
