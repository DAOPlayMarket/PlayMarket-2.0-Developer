(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    var md = window.markdownit();
    var web3 = new Web3();

    var icoDecimals__input = $('#icoDecimals__input');
    var icoDecimals__val = icoDecimals__input.val();

    var icoTotalSupply__input = $('#icoTotalSupply__input');
    var icoTotalSupply__val = icoTotalSupply__input.val();
    var icoTotalSupply__converted = icoTotalSupply__val / math.pow(10, icoDecimals__val);
    var icoTotalSupply = $('.icoTotalSupply__FORMATTED');
    icoTotalSupply.html(icoTotalSupply__converted);
    icoTotalSupply.mask('000 000 000 000 000 000', { reverse: true });

    var icoTotalForSale__input = $('#icoTotalForSale__input');
    var icoTotalForSale__val = icoTotalForSale__input.val();
    var icoTotalForSale__converted = icoTotalForSale__val / math.pow(10, icoDecimals__val);
    var icoTotalForSale = $('.icoTotalForSale__FORMATTED');
    icoTotalForSale.html(icoTotalForSale__converted);
    icoTotalForSale.mask('000 000 000 000 000 000', { reverse: true });

    var icoSoftCup = $('.icoSoftCup__FORMATTED');
    icoSoftCup.html(icoTotalSupply__converted / 100);
    icoSoftCup.mask('000 000 000 000 000 000', { reverse: true });

    var icoHardCapUsd__input = $('#icoHardCapUsd__input');
    var icoHardCapUsd__val = icoHardCapUsd__input.val();
    var icoHardCapUsd = $('.icoHardCapUsd__FORMATTED');
    var icoHardCapUsd__converted = icoHardCapUsd__val / math.pow(10, 6);
    icoHardCapUsd.html(icoHardCapUsd__converted);
    icoHardCapUsd.mask('000 000 000 000 000 000', { reverse: true });

    var currentPeriod__input = $('#currentPeriod__input');
    var currentPeriod__val = currentPeriod__input.val();
    var currentPeriod = $('.currentPeriod__FORMATTED');
    currentPeriod.html(parseInt(currentPeriod__val) + 1);

    var tokensSold__input = $('#tokensSold__input');
    var tokensSold__val = tokensSold__input.val();
    var tokensSold__converted = (tokensSold__val / math.pow(10, icoDecimals__val)).toFixed(0);
    var tokensSold = $('.tokensSold__FORMATTED');
    tokensSold.html(tokensSold__converted);
    tokensSold.mask('000 000 000 000 000 000', { reverse: true });

    var startDate = $('#startDate__input').val();
    $('#startDate').html(moment.unix(startDate).format("DD.MM.YYYY [(]HH:mm:ss[)]"));

    var endDate = $('#endDate__input').val();
    $('#endDate').html(moment.unix(endDate).format("DD.MM.YYYY [(]HH:mm:ss[)]"));

    var icoStages__input = $('#icoStages__input');
    var icoStages__val = JSON.parse(icoStages__input.val());

    var timerDays = $('#timerDays');
    var timerHours = $('#timerHours');
    var timerMinutes = $('#timerMinutes');
    var timerSeconds = $('#timerSeconds');

    var currentTime = moment().unix();

    var timerEndDate = currentTime < startDate ? startDate : icoStages__val[currentPeriod__val].endDate;

    timer(currentTime, timerEndDate, function (res) {
        timerDays.html(res.days);
        timerHours.html(res.hours);
        timerMinutes.html(res.minutes);
        timerSeconds.html(res.seconds);
    });

    var priceInCurrentPeriod__val = icoStages__val[currentPeriod__val].price;
    var priceInCurrentPeriod__converted = priceInCurrentPeriod__val / math.pow(10, 6);
    var priceInCurrentPeriod = $('.priceInCurrentPeriod__FORMATTED');
    priceInCurrentPeriod.html(priceInCurrentPeriod__converted);

    var progressBar_width = 100 / (icoTotalForSale__val / tokensSold__val);
    var progressBar = $('#progress-bar');
    progressBar.css("width", progressBar_width + "%");

    $('.gallery-slider').owlCarousel({
        margin: 10,
        loop: false,
        autoWidth: true,
        items: 4,
        nav: true,
        dots: false
    });
    var md_descr = $('#ico__description__input').val();
    $('#ico__description-area').html(md.render(md_descr));

    function timer(currentTime, endTime, cb) {
        var diffTime = endTime - currentTime;

        var duration = moment.duration(diffTime * 1000, 'milliseconds');
        var interval = 1000;

        var timerInterval = setInterval(function () {
            duration = moment.duration(duration - interval, 'milliseconds');

            var years = duration.years();
            var months = duration.months();
            var days = duration.days();
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();
            if (years + months + days + hours + minutes + seconds === 0) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaWNvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7QUFDeEIsUUFBTSxLQUFLLE9BQU8sVUFBUCxFQUFYO0FBQ0EsUUFBTSxPQUFPLElBQUksSUFBSixFQUFiOztBQUVBLFFBQUkscUJBQXFCLEVBQUUscUJBQUYsQ0FBekI7QUFDQSxRQUFJLG1CQUFtQixtQkFBbUIsR0FBbkIsRUFBdkI7O0FBRUEsUUFBSSx3QkFBd0IsRUFBRSx3QkFBRixDQUE1QjtBQUNBLFFBQUksc0JBQXNCLHNCQUFzQixHQUF0QixFQUExQjtBQUNBLFFBQUksNEJBQTZCLHNCQUFzQixLQUFLLEdBQUwsQ0FBUyxFQUFULEVBQWEsZ0JBQWIsQ0FBdkQ7QUFDQSxRQUFJLGlCQUFpQixFQUFFLDRCQUFGLENBQXJCO0FBQ0EsbUJBQWUsSUFBZixDQUFvQix5QkFBcEI7QUFDQSxtQkFBZSxJQUFmLENBQW9CLHlCQUFwQixFQUErQyxFQUFDLFNBQVMsSUFBVixFQUEvQzs7QUFFQSxRQUFJLHlCQUF5QixFQUFFLHlCQUFGLENBQTdCO0FBQ0EsUUFBSSx1QkFBdUIsdUJBQXVCLEdBQXZCLEVBQTNCO0FBQ0EsUUFBSSw2QkFBOEIsdUJBQXVCLEtBQUssR0FBTCxDQUFTLEVBQVQsRUFBYSxnQkFBYixDQUF6RDtBQUNBLFFBQUksa0JBQWtCLEVBQUUsNkJBQUYsQ0FBdEI7QUFDQSxvQkFBZ0IsSUFBaEIsQ0FBcUIsMEJBQXJCO0FBQ0Esb0JBQWdCLElBQWhCLENBQXFCLHlCQUFyQixFQUFnRCxFQUFDLFNBQVMsSUFBVixFQUFoRDs7QUFFQSxRQUFJLGFBQWEsRUFBRSx3QkFBRixDQUFqQjtBQUNBLGVBQVcsSUFBWCxDQUFnQiw0QkFBNEIsR0FBNUM7QUFDQSxlQUFXLElBQVgsQ0FBZ0IseUJBQWhCLEVBQTJDLEVBQUMsU0FBUyxJQUFW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QUFwQjtBQXVCSDtBQUNKLENBekhEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IG1kID0gd2luZG93Lm1hcmtkb3duaXQoKTtcclxuICAgIGNvbnN0IHdlYjMgPSBuZXcgV2ViMygpO1xyXG5cclxuICAgIGxldCBpY29EZWNpbWFsc19faW5wdXQgPSAkKCcjaWNvRGVjaW1hbHNfX2lucHV0Jyk7XHJcbiAgICBsZXQgaWNvRGVjaW1hbHNfX3ZhbCA9IGljb0RlY2ltYWxzX19pbnB1dC52YWwoKTtcclxuXHJcbiAgICBsZXQgaWNvVG90YWxTdXBwbHlfX2lucHV0ID0gJCgnI2ljb1RvdGFsU3VwcGx5X19pbnB1dCcpO1xyXG4gICAgbGV0IGljb1RvdGFsU3VwcGx5X192YWwgPSBpY29Ub3RhbFN1cHBseV9faW5wdXQudmFsKCk7XHJcbiAgICBsZXQgaWNvVG90YWxTdXBwbHlfX2NvbnZlcnRlZCA9IChpY29Ub3RhbFN1cHBseV9fdmFsIC8gbWF0aC5wb3coMTAsIGljb0RlY2ltYWxzX192YWwpKTtcclxuICAgIGxldCBpY29Ub3RhbFN1cHBseSA9ICQoJy5pY29Ub3RhbFN1cHBseV9fRk9STUFUVEVEJyk7XHJcbiAgICBpY29Ub3RhbFN1cHBseS5odG1sKGljb1RvdGFsU3VwcGx5X19jb252ZXJ0ZWQpO1xyXG4gICAgaWNvVG90YWxTdXBwbHkubWFzaygnMDAwIDAwMCAwMDAgMDAwIDAwMCAwMDAnLCB7cmV2ZXJzZTogdHJ1ZX0pO1xyXG5cclxuICAgIGxldCBpY29Ub3RhbEZvclNhbGVfX2lucHV0ID0gJCgnI2ljb1RvdGFsRm9yU2FsZV9faW5wdXQnKTtcclxuICAgIGxldCBpY29Ub3RhbEZvclNhbGVfX3ZhbCA9IGljb1RvdGFsRm9yU2FsZV9faW5wdXQudmFsKCk7XHJcbiAgICBsZXQgaWNvVG90YWxGb3JTYWxlX19jb252ZXJ0ZWQgPSAoaWNvVG90YWxGb3JTYWxlX192YWwgLyBtYXRoLnBvdygxMCwgaWNvRGVjaW1hbHNfX3ZhbCkpO1xyXG4gICAgbGV0IGljb1RvdGFsRm9yU2FsZSA9ICQoJy5pY29Ub3RhbEZvclNhbGVfX0ZPUk1BVFRFRCcpO1xyXG4gICAgaWNvVG90YWxGb3JTYWxlLmh0bWwoaWNvVG90YWxGb3JTYWxlX19jb252ZXJ0ZWQpO1xyXG4gICAgaWNvVG90YWxGb3JTYWxlLm1hc2soJzAwMCAwMDAgMDAwIDAwMCAwMDAgMDAwJywge3JldmVyc2U6IHRydWV9KTtcclxuXHJcbiAgICBsZXQgaWNvU29mdEN1cCA9ICQoJy5pY29Tb2Z0Q3VwX19GT1JNQVRURUQnKTtcclxuICAgIGljb1NvZnRDdXAuaHRtbChpY29Ub3RhbFN1cHBseV9fY29udmVydGVkIC8gMTAwKTtcclxuICAgIGljb1NvZnRDdXAubWFzaygnMDAwIDAwMCAwMDAgMDAwIDAwMCAwMDAnLCB7cmV2ZXJzZTogdHJ1ZX0pO1xyXG5cclxuICAgIGxldCBpY29IYXJkQ2FwVXNkX19pbnB1dCA9ICQoJyNpY29IYXJkQ2FwVXNkX19pbnB1dCcpO1xyXG4gICAgbGV0IGljb0hhcmRDYXBVc2RfX3ZhbCA9IGljb0hhcmRDYXBVc2RfX2lucHV0LnZhbCgpO1xyXG4gICAgbGV0IGljb0hhcmRDYXBVc2QgPSAkKCcuaWNvSGFyZENhcFVzZF9fRk9STUFUVEVEJyk7XHJcbiAgICBsZXQgaWNvSGFyZENhcFVzZF9fY29udmVydGVkID0gKGljb0hhcmRDYXBVc2RfX3ZhbCAvIG1hdGgucG93KDEwLCA2KSk7XHJcbiAgICBpY29IYXJkQ2FwVXNkLmh0bWwoaWNvSGFyZENhcFVzZF9fY29udmVydGVkKTtcclxuICAgIGljb0hhcmRDYXBVc2QubWFzaygnMDAwIDAwMCAwMDAgMDAwIDAwMCAwMDAnLCB7cmV2ZXJzZTogdHJ1ZX0pO1xyXG5cclxuICAgIGxldCBjdXJyZW50UGVyaW9kX19pbnB1dCA9ICQoJyNjdXJyZW50UGVyaW9kX19pbnB1dCcpO1xyXG4gICAgbGV0IGN1cnJlbnRQZXJpb2RfX3ZhbCA9IGN1cnJlbnRQZXJpb2RfX2lucHV0LnZhbCgpO1xyXG4gICAgbGV0IGN1cnJlbnRQZXJpb2QgPSAkKCcuY3VycmVudFBlcmlvZF9fRk9STUFUVEVEJyk7XHJcbiAgICBjdXJyZW50UGVyaW9kLmh0bWwocGFyc2VJbnQoY3VycmVudFBlcmlvZF9fdmFsKSArIDEpO1xyXG5cclxuICAgIGxldCB0b2tlbnNTb2xkX19pbnB1dCA9ICQoJyN0b2tlbnNTb2xkX19pbnB1dCcpO1xyXG4gICAgbGV0IHRva2Vuc1NvbGRfX3ZhbCA9IHRva2Vuc1NvbGRfX2lucHV0LnZhbCgpO1xyXG4gICAgbGV0IHRva2Vuc1NvbGRfX2NvbnZlcnRlZCA9ICh0b2tlbnNTb2xkX192YWwgLyBtYXRoLnBvdygxMCwgaWNvRGVjaW1hbHNfX3ZhbCkpLnRvRml4ZWQoMCk7XHJcbiAgICBsZXQgdG9rZW5zU29sZCA9ICQoJy50b2tlbnNTb2xkX19GT1JNQVRURUQnKTtcclxuICAgIHRva2Vuc1NvbGQuaHRtbCh0b2tlbnNTb2xkX19jb252ZXJ0ZWQpO1xyXG4gICAgdG9rZW5zU29sZC5tYXNrKCcwMDAgMDAwIDAwMCAwMDAgMDAwIDAwMCcsIHtyZXZlcnNlOiB0cnVlfSk7XHJcblxyXG4gICAgbGV0IHN0YXJ0RGF0ZSA9ICQoJyNzdGFydERhdGVfX2lucHV0JykudmFsKCk7XHJcbiAgICAkKCcjc3RhcnREYXRlJykuaHRtbChtb21lbnQudW5peChzdGFydERhdGUpLmZvcm1hdChcIkRELk1NLllZWVkgWyhdSEg6bW06c3NbKV1cIikpO1xyXG5cclxuICAgIGxldCBlbmREYXRlID0gJCgnI2VuZERhdGVfX2lucHV0JykudmFsKCk7XHJcbiAgICAkKCcjZW5kRGF0ZScpLmh0bWwobW9tZW50LnVuaXgoZW5kRGF0ZSkuZm9ybWF0KFwiREQuTU0uWVlZWSBbKF1ISDptbTpzc1spXVwiKSk7XHJcblxyXG4gICAgbGV0IGljb1N0YWdlc19faW5wdXQgPSAkKCcjaWNvU3RhZ2VzX19pbnB1dCcpO1xyXG4gICAgbGV0IGljb1N0YWdlc19fdmFsID0gSlNPTi5wYXJzZShpY29TdGFnZXNfX2lucHV0LnZhbCgpKTtcclxuXHJcbiAgICBjb25zdCB0aW1lckRheXMgPSAkKCcjdGltZXJEYXlzJyk7XHJcbiAgICBjb25zdCB0aW1lckhvdXJzID0gJCgnI3RpbWVySG91cnMnKTtcclxuICAgIGNvbnN0IHRpbWVyTWludXRlcyA9ICQoJyN0aW1lck1pbnV0ZXMnKTtcclxuICAgIGNvbnN0IHRpbWVyU2Vjb25kcyA9ICQoJyN0aW1lclNlY29uZHMnKTtcclxuXHJcbiAgICBsZXQgY3VycmVudFRpbWUgPSBtb21lbnQoKS51bml4KCk7XHJcblxyXG5cclxuXHJcbiAgICBsZXQgdGltZXJFbmREYXRlID0gKGN1cnJlbnRUaW1lIDwgc3RhcnREYXRlKSA/IHN0YXJ0RGF0ZSA6IGljb1N0YWdlc19fdmFsW2N1cnJlbnRQZXJpb2RfX3ZhbF0uZW5kRGF0ZTtcclxuXHJcbiAgICB0aW1lcihjdXJyZW50VGltZSwgdGltZXJFbmREYXRlLCAocmVzKSA9PiB7XHJcbiAgICAgICAgdGltZXJEYXlzLmh0bWwocmVzLmRheXMpO1xyXG4gICAgICAgIHRpbWVySG91cnMuaHRtbChyZXMuaG91cnMpO1xyXG4gICAgICAgIHRpbWVyTWludXRlcy5odG1sKHJlcy5taW51dGVzKTtcclxuICAgICAgICB0aW1lclNlY29uZHMuaHRtbChyZXMuc2Vjb25kcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgcHJpY2VJbkN1cnJlbnRQZXJpb2RfX3ZhbCA9IGljb1N0YWdlc19fdmFsW2N1cnJlbnRQZXJpb2RfX3ZhbF0ucHJpY2U7XHJcbiAgICBsZXQgcHJpY2VJbkN1cnJlbnRQZXJpb2RfX2NvbnZlcnRlZCA9IChwcmljZUluQ3VycmVudFBlcmlvZF9fdmFsIC8gbWF0aC5wb3coMTAsIDYpKTtcclxuICAgIGxldCBwcmljZUluQ3VycmVudFBlcmlvZCA9ICQoJy5wcmljZUluQ3VycmVudFBlcmlvZF9fRk9STUFUVEVEJyk7XHJcbiAgICBwcmljZUluQ3VycmVudFBlcmlvZC5odG1sKHByaWNlSW5DdXJyZW50UGVyaW9kX19jb252ZXJ0ZWQpO1xyXG5cclxuICAgIGxldCBwcm9ncmVzc0Jhcl93aWR0aCA9IDEwMCAvIChpY29Ub3RhbEZvclNhbGVfX3ZhbCAvIHRva2Vuc1NvbGRfX3ZhbCk7XHJcbiAgICBsZXQgcHJvZ3Jlc3NCYXIgPSAkKCcjcHJvZ3Jlc3MtYmFyJyk7XHJcbiAgICBwcm9ncmVzc0Jhci5jc3MoXCJ3aWR0aFwiLCBwcm9ncmVzc0Jhcl93aWR0aCArIFwiJVwiKTtcclxuXHJcbiAgICAkKCcuZ2FsbGVyeS1zbGlkZXInKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBhdXRvV2lkdGg6IHRydWUsXHJcbiAgICAgICAgaXRlbXM6IDQsXHJcbiAgICAgICAgbmF2OiB0cnVlLFxyXG4gICAgICAgIGRvdHM6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIGxldCBtZF9kZXNjciA9ICAkKCcjaWNvX19kZXNjcmlwdGlvbl9faW5wdXQnKS52YWwoKTtcclxuICAgICQoJyNpY29fX2Rlc2NyaXB0aW9uLWFyZWEnKS5odG1sKG1kLnJlbmRlcihtZF9kZXNjcikpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRpbWVyKGN1cnJlbnRUaW1lLCBlbmRUaW1lLCBjYikge1xyXG4gICAgICAgIGxldCBkaWZmVGltZSA9IGVuZFRpbWUgLSBjdXJyZW50VGltZTtcclxuXHJcbiAgICAgICAgbGV0IGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKGRpZmZUaW1lICogMTAwMCwgJ21pbGxpc2Vjb25kcycpO1xyXG4gICAgICAgIGxldCBpbnRlcnZhbCA9IDEwMDA7XHJcblxyXG4gICAgICAgIGxldCB0aW1lckludGVydmFsID0gc2V0SW50ZXJ2YWwoKCk9PiB7XHJcbiAgICAgICAgICAgIGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKGR1cmF0aW9uIC0gaW50ZXJ2YWwsICdtaWxsaXNlY29uZHMnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB5ZWFycyA9IGR1cmF0aW9uLnllYXJzKCk7XHJcbiAgICAgICAgICAgIGxldCBtb250aHMgPSBkdXJhdGlvbi5tb250aHMoKTtcclxuICAgICAgICAgICAgbGV0IGRheXMgPSBkdXJhdGlvbi5kYXlzKCk7XHJcbiAgICAgICAgICAgIGxldCBob3VycyA9IGR1cmF0aW9uLmhvdXJzKCk7XHJcbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gZHVyYXRpb24ubWludXRlcygpO1xyXG4gICAgICAgICAgICBsZXQgc2Vjb25kcyA9IGR1cmF0aW9uLnNlY29uZHMoKTtcclxuICAgICAgICAgICAgaWYgKCh5ZWFycyArIG1vbnRocyArIGRheXMgKyBob3VycyArIG1pbnV0ZXMgKyBzZWNvbmRzKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lckludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIGNiKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2Ioe1xyXG4gICAgICAgICAgICAgICAgICAgIHllYXJzOiB5ZWFycyxcclxuICAgICAgICAgICAgICAgICAgICBtb250aHM6IG1vbnRocyxcclxuICAgICAgICAgICAgICAgICAgICBkYXlzOiBkYXlzLFxyXG4gICAgICAgICAgICAgICAgICAgIGhvdXJzOiBob3VycyxcclxuICAgICAgICAgICAgICAgICAgICBtaW51dGVzOiBtaW51dGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZHM6IHNlY29uZHNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgaW50ZXJ2YWwpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbiJdfQ==
