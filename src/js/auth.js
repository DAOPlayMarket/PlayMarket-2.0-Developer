import tx from './utils/tx'

import wallet from 'ethereumjs-wallet'

$(document).ready(function(){
    const spinner = $('#spinner');

    const SECTION__keystore = $('.auth-entry__keystore-box');
    const SECTION__main = $('.auth-entry__main-box');

    const INPUT__authKeystore = $('input#input__authKeystore');
    const INPUT__registrationName = $('input#input__registrationName');
    const INPUT__registrationPassword = $('input#input__registrationPassword');

    const VALUE__authAddress = $('#value__authAddress');
    const VALUE__authRegistered = $('#value__authRegistered');

    const BLOCK__login = $('.auth-entry__main-box__login');
    const BLOCK__registration = $('.auth-entry__main-box__registration');

    const BUTTON__login = $('#button__login');
    const BUTTON__registration = $('#button__registration');

    const verificationSpinner = $('.auth-entry__main-box__spinner');

    let keystore = null;
    let address = null;
    let name = null;

    INPUT__authKeystore.on('change', async function(e) {
        spinner.show();

        keystore = null;
        address = null;
        name = null;

        SECTION__keystore.removeClass('keystore-is-valid');
        SECTION__main.removeClass('active');

        BLOCK__login.removeClass('active');
        BLOCK__registration.removeClass('active');

        VALUE__authAddress.text('');
        VALUE__authRegistered.text('');

        INPUT__registrationName.val('');
        INPUT__registrationPassword.val('');

        let f = e.target.files[0];
        if (f) {
            let r = new FileReader();
            r.readAsText(f);
            r.onload = async function(e) {
                let contents = e.target.result;
                try {
                    let json = JSON.parse(contents);
                    try {
                        SECTION__keystore.addClass('keystore-is-valid');
                        keystore = json;
                        address = '0x' + json.address;

                        let options = {
                            method: 'post',
                            url: '/auth',
                            data: {
                                method: 'check-developer-registration',
                                address: address
                            }
                        };
                        let res = (await axios(options)).data;
                        console.log(res);

                        spinner.hide();
                        if (res.status === 200) {
                            SECTION__main.addClass('active');
                            VALUE__authAddress.text(address);
                            if (res.registered) {
                                VALUE__authRegistered.text(VALUE__authRegistered.data('lang-true'));
                                name = res.name;
                                BLOCK__login.addClass('active');
                            } else {
                                VALUE__authRegistered.text(VALUE__authRegistered.data('lang-false'));
                                BLOCK__registration.addClass('active');
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

    BUTTON__login.on('click', async function () {
        spinner.show();
        try {
            let options = {
                method: 'post',
                url: '/auth',
                data: {
                    method: 'login',
                    address: address,
                    name: name
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

    BUTTON__registration.on('click', async function () {
        try {
            let wallet = await tx.getWallet(keystore, INPUT__registrationPassword.val(), true);
            let regName = INPUT__registrationName.val();
            // let regInfo = INPUT__registrationInfo.val();
            let regInfo = '';
            let signedTx = await tx.getSignedTxForContract({
                wallet: wallet,
                data: {
                    contract: 'main',
                    function: 'registrationDeveloper',
                    params: [regName, regInfo]
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
            console.log(res);
            if (res.status === 200) {
                verificationSpinner.addClass('active');
                BLOCK__registration.removeClass('active');

                let timer = setInterval(async () => {
                    let tx = await checkTx(res.result.hash);
                    console.log(tx);
                    if (tx.status === 200) {
                        if (!tx.result.panding) {
                            clearTimeout(timer);
                            verificationSpinner.removeClass('active');
                            if (tx.result.success) {
                                VALUE__authRegistered.text(VALUE__authRegistered.data('lang-true'));
                                BLOCK__registration.removeClass('active');
                                BLOCK__login.addClass('active');
                            } else {
                                toastr.error('Transaction failed');
                            }
                        }
                    } else {
                        verificationSpinner.removeClass('active');
                        clearTimeout(timer);
                        toastr.error(tx.result.message);
                    }
                }, 5000);
            } else {
                toastr.error(res.message);
            }
        } catch (e) {
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
});






