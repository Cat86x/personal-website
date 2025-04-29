const GalleryButton = document.getElementById('gallery');

if  (GalleryButton) {
    GalleryButton.addEventListener('click', () => {
        window.location.href = '/gallery.html';
    });
} else {
    console.error('Button with ID "gallery" not found!');
}