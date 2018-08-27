import tx from './utils/tx'

import wallet from 'ethereumjs-wallet'

$(document).ready(function(){
    const spinner = $('#spinner');

    const INPUT__authKeystore = $('input#auth__keystore');
    const INPUT__registrationName = $('input#registration__name');
    const INPUT__registrationInfo = $('input#registration__info');
    const INPUT__registrationPassword = $('input#registration__password');

    const SECTION__keystore = $('.auth-keystore');
    const SECTION__main = $('.auth-main');
    const SECTION__verification = $('.auth-verification');

    const BLOCK__info = $('.auth-main__info');
    const BLOCK__action = $('.auth-main__action');

    const ACTION__login = $('.auth-main__action--login');
    const ACTION__registration = $('.auth-main__action--registration');

    const VALUE__authAddress = $('#auth__address');
    const VALUE__authRegistered = $('#auth__registered');
    const VALUE__loginName = $('#login__name');

    let KEYSTORE = null;

    INPUT__authKeystore.on('change', async function(e) {
        spinner.show();
        SECTION__main.removeClass('active');

        ACTION__login.removeClass('active');
        ACTION__registration.removeClass('active');

        VALUE__authAddress.text('');
        VALUE__authRegistered.text('');
        VALUE__loginName.text('');
        // VALUE__loginInfo.text('');

        INPUT__registrationName.val('');
        INPUT__registrationPassword.val('');

        let f = e.target.files[0];
        if (f) {
            let r = new FileReader();
            r.readAsText(f);
            r.onload = async function(e) {
                let contents = e.target.result;
                let json;
                try {
                    json = JSON.parse(contents);
                    try {
                        let address = '0x' + json.address;
                        let options = {
                            method: 'post',
                            url: '/auth',
                            data: {
                                method: 'check-developer-registration',
                                address: address
                            }
                        };
                        let res = (await axios(options)).data;
                        spinner.hide();
                        if (res.status === 200) {
                            SECTION__main.addClass('active');
                            VALUE__authAddress.text(address);
                            if (res.registered) {
                                ACTION__login.addClass('active');
                                VALUE__authRegistered.text(VALUE__authRegistered.data('lang-1'));
                                VALUE__loginName.text(res.name);
                                // VALUE__loginInfo.text(res.info);
                            } else {
                                ACTION__registration.addClass('active');
                                KEYSTORE = json;
                                VALUE__authRegistered.text(VALUE__authRegistered.data('lang-0'));
                            }
                        } else if (res.status === 500){
                            return toastr.error(res.msg);
                        }
                    } catch(e) {
                        spinner.hide();
                        return toastr.error(e.message);
                    }

                } catch (e) {
                    spinner.hide();
                    return toastr.error('This is not a valid wallet file.');
                }
            };
        } else {
            spinner.hide();
        }
    });

    $('#login__btn').on('click', async function () {
        spinner.show();
        try {
            let options = {
                method: 'post',
                url: '/auth',
                data: {
                    method: 'login',
                    address: VALUE__authAddress.text(),
                    name: VALUE__loginName.text()
                }
            };
            let res = (await axios(options)).data;
            spinner.hide();
            if (res.status === 200) {
                window.location.href = '/';
            }
        } catch (e) {
            spinner.hide();
            return toastr.error(e.message);
        }
    });

    $('#registration__btn').on('click', async function () {
        spinner.show();
        try {
            let wallet = await tx.getWallet(KEYSTORE, INPUT__registrationPassword.val(), true);
            let name = INPUT__registrationName.val();
            // let info = INPUT__registrationInfo.val();
            let info = '';
            let signedTx = await tx.getSignedTxForContract({
                wallet: wallet,
                data: {
                    contract: 'main',
                    function: 'registrationDeveloper',
                    params: [name, info]
                }
            });

            let options = {
                method: 'post',
                url: '/auth',
                data: {
                    method: 'registration',
                    signedTx: signedTx
                }
            };
            let res = (await axios(options)).data;
            spinner.hide();
            if (res.status === 200) {
                SECTION__keystore.addClass('hidden');
                SECTION__main.removeClass('active');
                SECTION__verification.addClass('active');

                ACTION__login.removeClass('active');
                ACTION__registration.removeClass('active');

                let timer = setInterval(async () => {
                    let tx = await checkTx(res.result.hash);
                    if (tx.status === 200) {
                        if (!tx.result.panding) {
                            SECTION__verification.removeClass('active');
                            SECTION__main.addClass('active');
                            clearTimeout(timer);
                            if (tx.result.success) {
                                ACTION__login.addClass('active');
                            } else {
                                toastr.error('Transaction failed');
                                ACTION__registration.addClass('active');
                            }
                        }
                    } else {
                        toastr.error(tx.result.message);
                        clearTimeout(timer);
                    }
                }, 10000);
            } else {
                toastr.error(res.message);
            }
        } catch (e) {
            spinner.hide();
            return toastr.error(e.message);
        }
    });

    async function checkTx(hash) {
        let options = {
            method: 'post',
            url: '/helpers/check-tx',
            data: {
                hash: hash
            }
        };
        return (await axios(options)).data;
    }

    // $('input#login__keystore').on('change', async function() {
    //     let formData = new FormData();
    //     let input = document.getElementById('login__keystore');
    //     formData.append("keystore", input.files[0]);
    //     let options = {
    //         method: 'post',
    //         url: '/auth/login/load',
    //         data: formData
    //     };
    //     let res = (await axios(options)).data;
    //     console.log('res:', res);
    //     if (res.status === 200) {
    //         location.reload();
    //     }
    // });
    // $('.login__address-list__item span').on('click', async function() {
    //     spinner.show();
    //     let options = {
    //         method: 'post',
    //         url: '/auth/login',
    //         data: {
    //             address: $(this).data('address'),
    //             filename: $(this).data('filename')
    //         }
    //     };
    //     let res = (await axios(options)).data;
    //     // console.log(res);
    //
    //     spinner.hide();
    //     if (res.status === 200) {
    //         if (res.registered) {
    //             window.location.href = '/';
    //         } else {
    //             window.location.href = 'auth/registration';
    //         }
    //     }
    // });
});






