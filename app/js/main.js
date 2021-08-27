$(function () {
    $('.btn-burger').on('click', function () {
        $('.btn-burger__line').toggleClass('btn-burger__line--active');
        $('.header__nav').toggleClass('header__nav--active');
        $('.logo-white').toggleClass('logo-white--active');
        $('body').toggleClass('lock');
    });

});