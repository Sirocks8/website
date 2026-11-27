
// ================================
// REPAIR PHOTO LIGHTBOX
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const repairLightbox = document.createElement("div");
    repairLightbox.className = "repair-lightbox";

    const lightboxImage = document.createElement("img");
    lightboxImage.alt = "Enlarged repair photo";

    repairLightbox.appendChild(lightboxImage);
    document.body.appendChild(repairLightbox);

    let currentImages = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    // DISPLAY PHOTO
    function showImage(index) {
        currentIndex = index;

        const image = currentImages[currentIndex];

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "Repair photo";
    }

    // OPEN PHOTO
    document.addEventListener("click", (event) => {

        const clickedImage = event.target.closest(".repair-image img");

        if (!clickedImage) return;

        const repairImages = clickedImage
            .closest(".repair-images")
            .querySelectorAll(".repair-image img");

        currentImages = Array.from(repairImages);
        currentIndex = currentImages.indexOf(clickedImage);

        showImage(currentIndex);

        repairLightbox.classList.add("active");
        document.body.style.overflow = "hidden";

    });

    // CLOSE PHOTO
    function closeLightbox() {
        repairLightbox.classList.remove("active");
        document.body.style.overflow = "";
        currentImages = [];
    }

    // Click outside the photo
    repairLightbox.addEventListener("click", closeLightbox);

    // Clicking the photo itself should not close it
    lightboxImage.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // MOBILE SWIPE NAVIGATION
    lightboxImage.addEventListener("touchstart", (event) => {

        if (!window.matchMedia("(max-width: 768px)").matches) return;

        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;

    }, { passive: true });

    lightboxImage.addEventListener("touchend", (event) => {

        if (!window.matchMedia("(max-width: 768px)").matches) return;
        if (currentImages.length < 2) return;

        const touchEndX = event.changedTouches[0].screenX;
        const touchEndY = event.changedTouches[0].screenY;

        const differenceX = touchEndX - touchStartX;
        const differenceY = touchEndY - touchStartY;

        // Ignore small movements and vertical scrolling gestures
        if (Math.abs(differenceX) < 50) return;
        if (Math.abs(differenceY) > Math.abs(differenceX)) return;

        if (differenceX < 0) {
            // Swipe left: next photo
            showImage((currentIndex + 1) % currentImages.length);
        } else {
            // Swipe right: previous photo
            showImage((currentIndex - 1 + currentImages.length) % currentImages.length);
        }

    }, { passive: true });

    // ESCAPE KEY
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeLightbox();
        }

    });

});
