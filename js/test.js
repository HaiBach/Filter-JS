"use strict";
(function () {
    var $filter = document.querySelector('.filterjs');
    $filter.addEventListener('changeafter', function () {
        console.log('changeAfter event');
    });
})();
