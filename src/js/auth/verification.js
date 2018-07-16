$(document).ready(function(){
    let timer = setInterval(async () => {
        let result = await checkDeveloperRegistration();
        if (result.status === 200) {
            if (!result.result.panding) {
                if (result.result.registered) {
                    $('.verification').addClass('success');
                    clearTimeout(timer);
                }
            }
        } else {
            toastr.error(result.result.message);
            $('.verification').addClass('error');
            clearTimeout(timer);
        }
    }, 10000);

    async function checkDeveloperRegistration() {
        let options = {
            method: 'get',
            url: '/auth/verification/check',
        };
        return (await axios(options)).data;
    }


});
