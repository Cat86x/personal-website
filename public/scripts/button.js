const SomethingButton = document.getElementById('something_button');

if (SomethingButton) {
    SomethingButton.addEventListener('click', () => {
        window.location.href = '/something.html';
    });
} else {
    console.error('Button with ID "myButton" not found!');
}