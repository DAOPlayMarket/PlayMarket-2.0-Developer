import tx from '../utils/tx'

$(document).ready(function(){
    const spinner = $('#spinner');

    const hashTag = $('input[name="hashTag"]').val();
    const hash = $('input[name="hash"]').val();
    const publish = $('input[name="publish"]').val();

    const form__REGISTRATION = $('#registration');

    const INPUT__keystore = $('input#keystore');
    const INPUT__password = $('input#password');
    let KEYSTORE = null;

    INPUT__keystore.on('change', async function(e) {
        let f = e.target.files[0];
        if (f) {
            let r = new FileReader();
            r.readAsText(f);
            r.onload = async function(e) {
                let contents = e.target.result;
                try {
                    KEYSTORE = JSON.parse(contents);
                } catch (e) {
                    INPUT__keystore.val('');
                    return toastr.error('This is not a valid wallet file.');
                }
            };
        } else {
            spinner.hide();
        }
    });

    form__REGISTRATION.on('submit', async function (event) {
        event.preventDefault();
        try {
            console.log(KEYSTORE);
            let wallet = await tx.getWallet(KEYSTORE, INPUT__password.val(), true);
            let signedTx = await tx.getSignedTxForContract({
                wallet: wallet,
                data: {
                    contract: 'main',
                    function: 'registrationApplication',
                    params: [hash, hashTag, publish, price]
                }
            });
            console.log(signedTx);
            // let options = {
            //     method: 'post',
            //     url: '/app-add/registration',
            //     data: {
            //         // password: $('input[name="password"]').val(),
            //         hashTag: $('input[name="hashTag"]').val(),
            //         hash: $('input[name="hash"]').val()
            //     }
            // };
            // let res = (await axios(options)).data;
            // console.log('res:', res);
            // if (res.status === 200) {
            //
            //     // window.location.href = '/app-add/confirmation/';
            // } else if (res.status === 500) {
            //     spinner.hide();
            //     toastr.error(res.message);
            // }
        } catch(e) {
            return toastr.error(e.message);
        }
    });


});



