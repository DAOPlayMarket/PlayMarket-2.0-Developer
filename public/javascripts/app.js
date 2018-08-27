(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {
    var md = window.markdownit();

    var md_descr = $('#longdescr').val();
    $('#app__description-area').html(md.render(md_descr));

    $('.gallery-slider').owlCarousel({
        margin: 10,
        loop: false,
        autoWidth: true,
        items: 4,
        nav: true,
        dots: false
    });
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7QUFDeEIsUUFBTSxLQUFLLE9BQU8sVUFBUCxFQUFYOztBQUVBLFFBQUksV0FBWSxFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBaEI7QUFDQSxNQUFFLHdCQUFGLEVBQTRCLElBQTVCLENBQWlDLEdBQUcsTUFBSCxDQUFVLFFBQVYsQ0FBakM7O0FBRUEsTUFBRSxpQkFBRixFQUFxQixXQUFyQixDQUFpQztBQUM3QixnQkFBUSxFQURxQjtBQUU3QixjQUFNLEtBRnVCO0FBRzdCLG1CQUFXLElBSGtCO0FBSTdCLGVBQU8sQ0FKc0I7QUFLN0IsYUFBSyxJQUx3QjtBQU03QixjQUFNO0FBTnVCLEtBQWpDO0FBUUgsQ0FkRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zdCBtZCA9IHdpbmRvdy5tYXJrZG93bml0KCk7XHJcblxyXG4gICAgbGV0IG1kX2Rlc2NyID0gICQoJyNsb25nZGVzY3InKS52YWwoKTtcclxuICAgICQoJyNhcHBfX2Rlc2NyaXB0aW9uLWFyZWEnKS5odG1sKG1kLnJlbmRlcihtZF9kZXNjcikpO1xyXG5cclxuICAgICQoJy5nYWxsZXJ5LXNsaWRlcicpLm93bENhcm91c2VsKHtcclxuICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIGF1dG9XaWR0aDogdHJ1ZSxcclxuICAgICAgICBpdGVtczogNCxcclxuICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgZG90czogZmFsc2VcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuIl19
