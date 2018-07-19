$(document).ready(function(){
    const md = window.markdownit();
    const web3 = new Web3();

    let icoDecimals__input = $('#icoDecimals__input');
    let icoDecimals__val = icoDecimals__input.val();

    let icoTotalSupply__input = $('#icoTotalSupply__input');
    let icoTotalSupply__val = icoTotalSupply__input.val();
    let icoTotalSupply__converted = (icoTotalSupply__val / math.pow(10, icoDecimals__val));
    let icoTotalSupply = $('.icoTotalSupply__FORMATTED');
    icoTotalSupply.html(icoTotalSupply__converted);
    icoTotalSupply.mask('000 000 000 000 000 000', {reverse: true});

    let icoTotalForSale__input = $('#icoTotalForSale__input');
    let icoTotalForSale__val = icoTotalForSale__input.val();
    let icoTotalForSale__converted = (icoTotalForSale__val / math.pow(10, icoDecimals__val));
    let icoTotalForSale = $('.icoTotalForSale__FORMATTED');
    icoTotalForSale.html(icoTotalForSale__converted);
    icoTotalForSale.mask('000 000 000 000 000 000', {reverse: true});

    let icoSoftCup = $('.icoSoftCup__FORMATTED');
    icoSoftCup.html(icoTotalSupply__converted / 100);
    icoSoftCup.mask('000 000 000 000 000 000', {reverse: true});

    let icoHardCapUsd__input = $('#icoHardCapUsd__input');
    let icoHardCapUsd__val = icoHardCapUsd__input.val();
    let icoHardCapUsd = $('.icoHardCapUsd__FORMATTED');
    let icoHardCapUsd__converted = (icoHardCapUsd__val / math.pow(10, 6));
    icoHardCapUsd.html(icoHardCapUsd__converted);
    icoHardCapUsd.mask('000 000 000 000 000 000', {reverse: true});

    let currentPeriod__input = $('#currentPeriod__input');
    let currentPeriod__val = currentPeriod__input.val();
    let currentPeriod = $('.currentPeriod__FORMATTED');
    currentPeriod.html(parseInt(currentPeriod__val) + 1);

    let tokensSold__input = $('#tokensSold__input');
    let tokensSold__val = tokensSold__input.val();
    let tokensSold__converted = (tokensSold__val / math.pow(10, icoDecimals__val)).toFixed(0);
    let tokensSold = $('.tokensSold__FORMATTED');
    tokensSold.html(tokensSold__converted);
    tokensSold.mask('000 000 000 000 000 000', {reverse: true});


    let icoStages__input = $('#icoStages__input');
    let icoStages__val = JSON.parse(icoStages__input.val());

    let endDateCurrentPeriod__val = icoStages__val[currentPeriod__val].endDate;
    let currentTime = moment().unix();

    const timerDays = $('#timerDays');
    const timerHours = $('#timerHours');
    const timerMinutes = $('#timerMinutes');
    const timerSeconds = $('#timerSeconds');
    timer(currentTime, endDateCurrentPeriod__val, (res) => {
        timerDays.html(res.days);
        timerHours.html(res.hours);
        timerMinutes.html(res.minutes);
        timerSeconds.html(res.seconds);
    });

    let priceInCurrentPeriod__val = icoStages__val[currentPeriod__val].price;
    let priceInCurrentPeriod__converted = (priceInCurrentPeriod__val / math.pow(10, 6));
    let priceInCurrentPeriod = $('.priceInCurrentPeriod__FORMATTED');
    priceInCurrentPeriod.html(priceInCurrentPeriod__converted);

    let progressBar_width = 100 / (icoTotalForSale__val / tokensSold__val);
    let progressBar = $('#progress-bar');
    progressBar.css("width", progressBar_width + "%");

    $('.gallery-slider').owlCarousel({
        margin: 10,
        loop: false,
        autoWidth: true,
        items: 4,
        nav: true,
        dots: false
    });
    let md_descr =  $('#ico__description__input').val();
    $('#ico__description-area').html(md.render(md_descr));

    let startDate = $('#startDate__input').val();
    $('#startDate').html(moment.unix(startDate).format("DD.MM.YYYY [(]HH:mm:ss[)]"));

    let endDate = $('#endDate__input').val();
    $('#endDate').html(moment.unix(endDate).format("DD.MM.YYYY [(]HH:mm:ss[)]"));

    // let currentTime = moment().unix();


    function timer(currentTime, endTime, cb) {
        let diffTime = endTime - currentTime;

        let duration = moment.duration(diffTime * 1000, 'milliseconds');
        let interval = 1000;

        let timerInterval = setInterval(()=> {
            duration = moment.duration(duration - interval, 'milliseconds');

            let years = duration.years();
            let months = duration.months();
            let days = duration.days();
            let hours = duration.hours();
            let minutes = duration.minutes();
            let seconds = duration.seconds();
            if ((years + months + days + hours + minutes + seconds) === 0) {
                clearInterval(timerInterval);
                cb(null);
            } else {
                cb({
                    years: years,
                    months: months,
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                });
            }
        }, interval);
    }
});

