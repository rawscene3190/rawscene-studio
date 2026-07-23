document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = Array.from(
        document.querySelectorAll('.gallery-button')
    );

    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
    const closeButton = lightbox?.querySelector('.lightbox-close');
    const prevButton = lightbox?.querySelector('.lightbox-prev');
    const nextButton = lightbox?.querySelector('.lightbox-next');

    if (
        !galleryButtons.length ||
        !lightbox ||
        !lightboxImage ||
        !lightboxCounter ||
        !closeButton ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }

    const galleryImages = galleryButtons.map((button) => {
        const image = button.querySelector('img');

        return {
            src: image?.getAttribute('src') || '',
            alt: image?.getAttribute('alt') || 'RAWSCENE gallery image'
        };
    });

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function showImage(index) {
        currentIndex = (index + galleryImages.length) % galleryImages.length;

        const currentImage = galleryImages[currentIndex];

        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;

        lightboxCounter.textContent =
            `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
    }

    function openLightbox(index) {
        showImage(index);

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');

        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    }

    function showPreviousImage() {
        showImage(currentIndex - 1);
    }

    function showNextImage() {
        showImage(currentIndex + 1);
    }

    galleryButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeLightbox();
        }

        if (event.key === 'ArrowLeft') {
            showPreviousImage();
        }

        if (event.key === 'ArrowRight') {
            showNextImage();
        }
    });

    lightbox.addEventListener(
        'touchstart',
        (event) => {
            touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    lightbox.addEventListener(
        'touchend',
        (event) => {
            touchEndX = event.changedTouches[0].screenX;

            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) < 50) {
                return;
            }

            if (swipeDistance > 0) {
                showPreviousImage();
            } else {
                showNextImage();
            }
        },
        { passive: true }
    );
});
