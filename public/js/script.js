// alert("alert");


//hamberger menu
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu_toggle');
    const navList = document.querySelector('.header_nav');
    const menuIcon = document.querySelector('.menu_icon');
    const closeIcon = document.querySelector('.close_icon');

    menuToggle.addEventListener('click', function() {
        // Toggle the active class on the nav list
        navList.classList.toggle('active');

        // Toggle the visibility of the menu icon and close icon
        if (navList.classList.contains('active')) {
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        } else {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    });
});


//searchbar
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchClose = document.querySelector('#searchClose');

    // Toggle search bar visibility
    searchBtn.addEventListener('click', function() {
        searchBar.classList.toggle('visible');
        searchBtn.style.display ='none';
       
    });

    // Close search bar
    searchClose.addEventListener('click', function() {
        searchBar.classList.remove('visible');
        searchBtn.style.display='block';
        
    });
});



