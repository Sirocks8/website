
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

    // OPEN PHOTO
    document.addEventListener("click", (event) => {

        const clickedImage = event.target.closest(".repair-image img");

        if (!clickedImage) return;

        lightboxImage.src =
            clickedImage.currentSrc || clickedImage.src;

        lightboxImage.alt =
            clickedImage.alt || "Repair photo";

        repairLightbox.classList.add("active");
        document.body.style.overflow = "hidden";

    });

    // CLOSE PHOTO
    function closeLightbox() {
        repairLightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Click outside the photo
    repairLightbox.addEventListener("click", closeLightbox);

    // Clicking the photo itself should not close it
    lightboxImage.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // ESCAPE KEY
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeLightbox();
        }

    });

});
