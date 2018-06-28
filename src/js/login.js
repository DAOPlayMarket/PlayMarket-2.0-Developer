import config from './lib/config'

$(document).ready(function(){
    const spinner = $('#spinner');

    $('input#login__keystore').on('change', async function() {
        let formData = new FormData();
        let input = document.getElementById('login__keystore');
        formData.append("keystore", input.files[0]);
        let options = {
            method: 'post',
            url: '/login/load',
            data: formData
        };
        let res = (await axios(options)).data;
        if (res.status === 200) {
            location.reload();
        }
    });
    $('.login__address-list__item span').on('click', async function() {
        spinner.show();
        let options = {
            method: 'post',
            url: '/login',
            data: {
                address: $(this).data('address'),
                filename: $(this).data('filename')
            }
        };
        let res = (await axios(options)).data;
        if (res.status === 200) {
            if (res.registered) {
                window.location.href = '/';
            } else {
                window.location.href = '/registration';
            }
        }
    });
});






