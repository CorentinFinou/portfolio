// Zoom sur l'image du CV
const cvImg = document.getElementById('cv-img');
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('zoomed-img');
const closeModal = document.querySelector('.close-modal');

if (cvImg && modal && modalImg) {
    cvImg.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = cvImg.src;
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
