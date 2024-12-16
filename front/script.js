const fileInput = document.getElementById('file-input');
const uploadedImage = document.getElementById('uploaded-image');

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
            document.getElementById('text-box').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
});

