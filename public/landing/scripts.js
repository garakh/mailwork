'use strict';
$(function () {
    
    var bgIndex = 1;
    setInterval(function () {
        $('#mask-img' + bgIndex).removeClass('active');
        bgIndex++;
        if (bgIndex > 6)
            bgIndex = 1;


        $('#mask-img' + bgIndex).addClass('active');
    }, 5000);
});