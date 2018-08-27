// import lib from '../lib'
//
// const web3 = new Web3();

import wallet from 'ethereumjs-wallet'

$(document).ready(function(){
    const spinner = $('#spinner');


    $('input#login__keystore').on('change', async function(e) {
        $('.login__add--info__box--registered').removeClass('active');
        $('#login__registration, #login__continue').removeClass('active');
        let f = e.target.files[0];
        spinner.show();
        if (f) {
            let r = new FileReader();
            r.readAsText(f);
            r.onload = async function(e) {
                let contents = e.target.result;
                let json;
                try {
                    json = JSON.parse(contents);
                    let address = json.address;
                    $('.login__add--info__box--value[data-type="address"]').text('0x' + address);

                    let options = {
                        method: 'post',
                        url: '/auth',
                        data: {
                            method: 'check-developer-registration',
                            address: '0x' + json.address
                        }
                    };
                    let res = (await axios(options)).data;
                    if (res.status === 200) {
                        if (res.registered) {

                            $('.login__add--info__box--value[data-type="registered"]').text($('.login__add--info__box--value[data-type="registered"]').data('lang-1'));

                            $('.login__add--info__box--registered').addClass('active');
                            $('.login__add--info__box--value[data-type="name"]').text(res.name);
                            // $('.login__add--info__box--value[data-type="info"]').text(res.info);
                            $('#login__continue').addClass('active');
                        } else {
                            $('.login__add--info__box--value[data-type="registered"]').text($('.login__add--info__box--value[data-type="registered"]').data('lang-2'));
                            $('#login__registration').addClass('active');
                        }
                    } else if (res.status === 500){
                        return toastr.error(res.msg);
                    }

                    $('.login__add--accept').show();
                    spinner.hide();

                    // try {
                    //     let myWallet = wallet.fromV3(json, '11111111', true);
                    //     spinner.hide();
                    // } catch (e) {
                    //     spinner.hide();
                    //     return toastr.error('Key derivation failed - possibly wrong passphrase.');
                    // }

                } catch (err) {
                    spinner.hide();
                    $('.login__add--accept').hide();
                    return toastr.error('This is not a valid wallet file.');
                }
            };
        } else {
            spinner.hide();
            $('.login__add--accept').hide();
        }
    });

    $('#login__continue').on('click', async function () {
        try {
            let options = {
                method: 'post',
                url: '/auth',
                data: {
                    method: 'login',
                    address: $('.login__add--info__box--value[data-type="address"]').text(),
                    name: $('.login__add--info__box--value[data-type="name"]').text()
                }
            };
            let res = (await axios(options)).data;
            if (res.status === 200) {
                window.location.href = '/';
            }
        } catch (e) {
            console.log(e);
        }
    });

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






