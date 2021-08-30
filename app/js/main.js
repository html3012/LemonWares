$(function () {
    $('.btn-burger').on('click', function () {
        $('.btn-burger__line').toggleClass('btn-burger__line--active');
        $('.header__wrap').toggleClass('header__wrap--active');
        $('.logo-white').toggleClass('logo-white--active');
        $('body').toggleClass('lock');
    });

    var mixer = mixitup('.filter__inner', {
        load: {
            filter: '.basic'
        }
    });

});