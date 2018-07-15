$(document).ready(function(){
    const spinner = $('#spinner');

    $('form.registration__form').on('submit', async function(event) {
        event.preventDefault();
        try {
            spinner.show();
            let options = {
                method: 'post',
                url: '/auth/registration',
                data: {
                    name: $(this).find('input[name="name"]').val(),
                    password: $(this).find('input[name="password"]').val()
                }
            };
            let res = (await axios(options)).data;
            spinner.hide();
            if (res.status === 200) {
                window.location.href = 'auth/verification';
            } else {
                toastr.error(res.message);
            }
        } catch(e) {
            spinner.hide();
            console.log('error:', e);
            toastr.error(e.message);
        }
    });
});
