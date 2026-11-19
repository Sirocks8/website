
// ================================
// POKEMON GALLERY CONFIGURATION
// ================================

const GITHUB_USERNAME = "Sirocks8";
const GITHUB_REPOSITORY = "website";
const GITHUB_BRANCH = "main";
const PHOTO_FOLDER = "photos-pokemon";

const API_URL =
    `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/${PHOTO_FOLDER}?ref=${GITHUB_BRANCH}`;

const RAW_IMAGE_BASE =
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/${PHOTO_FOLDER}`;


// ================================
// HTML ELEMENTS
// ================================

const gallery = document.getElementById("pokemon-gallery");
const galleryCount = document.getElementById("gallery-count");
const galleryStatus = document.getElementById("gallery-status");
const searchInput = document.getElementById("pokemon-search");


// ================================
// POKEMON DATA
// ================================

let allPokemon = [];


// ================================
// CREATE A POKEMON CARD
// ================================

function createPokemonCard(name, images) {

    const displayName = name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

    const cardItem = document.createElement("div");
    cardItem.className = "item";

    const button = document.createElement("button");
    button.className = "kaart";
    button.type = "button";
    button.setAttribute(
        "aria-label",
        `Flip ${displayName} card`
    );
    button.setAttribute("aria-pressed", "false");

    const inner = document.createElement("span");
    inner.className = "kaart-binnen";

    const front = document.createElement("img");
    front.className = "front";
    front.src = `${RAW_IMAGE_BASE}/${encodeURIComponent(images.front)}`;
    front.alt = `${displayName} card front`;
    front.loading = "lazy";

    const back = document.createElement("img");
    back.className = "back";
    back.src = `${RAW_IMAGE_BASE}/${encodeURIComponent(images.back)}`;
    back.alt = `${displayName} card back`;
    back.loading = "lazy";

    inner.append(front, back);
    button.appendChild(inner);

    // CARD FLIPPING

    button.addEventListener("click", () => {

        button.classList.toggle("omgedraaid");

        const flipped =
            button.classList.contains("omgedraaid");

        button.setAttribute("aria-pressed", flipped);

    });

    const title = document.createElement("h2");
    title.className = "naam";
    title.textContent = displayName;

    cardItem.append(button, title);

    return cardItem;
}


// ================================
// DISPLAY POKEMON
// ================================

function renderPokemon(searchTerm = "") {

    const filteredPokemon = allPokemon.filter(([name]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    gallery.innerHTML = "";

    filteredPokemon.forEach(([name, images]) => {

        const card = createPokemonCard(name, images);
        gallery.appendChild(card);

    });

    // UPDATE COUNTER

    if (searchTerm.trim() === "") {

        galleryCount.textContent =
            `${allPokemon.length} Pokémon in your collection`;

    } else {

        galleryCount.textContent =
            `Showing ${filteredPokemon.length} of ${allPokemon.length} Pokémon`;

    }

    // NO RESULTS MESSAGE

    if (filteredPokemon.length === 0) {

        galleryStatus.textContent = searchTerm.trim()
            ? `No Pokémon found matching "${searchTerm}".`
            : "No complete Pokémon card pairs found.";

    } else {

        galleryStatus.textContent = "";

    }

}


// ================================
// SEARCH
// ================================

searchInput.addEventListener("input", () => {

    renderPokemon(searchInput.value);

});


// ================================
// LOAD POKEMON FROM GITHUB
// ================================

async function loadPokemon() {

    try {

        galleryStatus.textContent = "Loading collection...";
        galleryStatus.classList.remove("error");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `GitHub API error: ${response.status}`
            );
        }

        const files = await response.json();

        const pokemon = new Map();

        // FIND FRONT AND BACK IMAGES

        files.forEach(file => {

            if (file.type !== "file") return;

            const match = file.name.match(
                /^(.+)-(front|back)\.(jpg|jpeg|png|webp)$/i
            );

            if (!match) return;

            const name = match[1].toLowerCase();
            const side = match[2].toLowerCase();

            if (!pokemon.has(name)) {
                pokemon.set(name, {});
            }

            pokemon.get(name)[side] = file.name;

        });

        // KEEP ONLY COMPLETE PAIRS

        allPokemon = [...pokemon.entries()]
            .filter(([name, images]) =>
                images.front && images.back
            )
            .sort((a, b) => a[0].localeCompare(b[0]));

        // DISPLAY EVERYTHING

        renderPokemon(searchInput.value);

        console.log(
            `Successfully loaded ${allPokemon.length} Pokémon!`
        );

    } catch (error) {

        console.error("Could not load Pokémon:", error);

        galleryCount.textContent = "Unable to load collection";

        galleryStatus.textContent =
            "Could not load photos from GitHub. Please try again.";

        galleryStatus.classList.add("error");

    }

}


// ================================
// START WEBSITE
// ================================

loadPokemon();
