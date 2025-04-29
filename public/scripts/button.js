const SomethingButton = document.getElementById('something_button');
const GalleryButton = document.getElementById('gallery');

if (SomethingButton) {
    SomethingButton.addEventListener('click', () => {
        window.location.href = '/something.html';
    });
} else {
    console.error('Button with ID "something_button" not found!');
}

if  (GalleryButton) {
    GalleryButton.addEventListener('click', () => {
        window.location.href = '/gallery.html';
    });
} else {
    console.error('Button with ID "gallery" not found!');
}