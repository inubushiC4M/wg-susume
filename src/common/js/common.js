//smooth scroll
document.addEventListener('DOMContentLoaded', function() {
    var scroll = new SmoothScroll('a[href*="#"]');
});

//modaal
$('.modal').modaal();
$('.my-link').modaal({
    hide_close: true,
    close_text: 'とじる'
});
