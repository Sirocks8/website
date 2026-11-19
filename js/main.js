
// =========================
// POKEMON CARD FLIPPING
// =========================

const cards = document.querySelectorAll(".kaart");

cards.forEach((card) => {

    card.addEventListener("click", () => {

        // Flip the selected card
        card.classList.toggle("omgedraaid");

        // Update accessibility state
        const isFlipped = card.classList.contains("omgedraaid");

        card.setAttribute("aria-pressed", isFlipped);

    });

});
