import config from './lib/config'

$(document).ready(function(){
    const spinner = $('#spinner');

    $('form.registration__form').on('submit', async function(event) {
        event.preventDefault();
        spinner.show();
        $(this).find('input[name="name"]').remove('error');
        $(this).find('input[name="password"]').remove('error');
        let options = {
            method: 'post',
            url: '/registration',
            data: {
                name: $(this).find('input[name="name"]').val(),
                password: $(this).find('input[name="password"]').val()
            }
        };
        let res = (await axios(options)).data;
        if (res.status === 200) {
            window.location.href = '/';
        }
        spinner.hide();
    });
});
