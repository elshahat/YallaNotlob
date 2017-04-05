

$('#change').on('click', function() {
    $('div').each(function() {
        if($(this).hasClass('home')) {
            $(this).removeClass('home');
        } else {
            $(this).addClass('home');
        }
    });
});
