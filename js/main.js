
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


// ================================
// FIND AND LOAD POKEMON
// ================================

async function loadPokemon() {

    try {

        galleryStatus.textContent = "Loading Pokémon...";
        galleryStatus.classList.remove("error");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `GitHub API error: ${response.status}`
            );
        }

        const files = await response.json();

        // Supported image formats
        const imageExtensions = ["jpg", "jpeg", "png", "webp"];

        // Store matching front/back images
        const pokemon = new Map();

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

        // Only keep Pokémon with BOTH images
        const completePokemon = [...pokemon.entries()]
            .filter(([name, images]) => images.front && images.back)
            .sort((a, b) => a[0].localeCompare(b[0]));

        // Clear previous gallery
        gallery.innerHTML = "";

        // Create the cards
        completePokemon.forEach(([name, images]) => {

            const displayName = name
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, letter => letter.toUpperCase());

            const cardItem = document.createElement("div");
            cardItem.className = "item";

            const button = document.createElement("button");
            button.className = "kaart";
            button.type = "button";
            button.setAttribute("aria-label", `Flip ${displayName} card`);
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

            // Flip card when clicked
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
            gallery.appendChild(cardItem);

        });

        // Update gallery information
        galleryCount.textContent =
            `${completePokemon.length} Pokémon`;

        if (completePokemon.length === 0) {
            galleryStatus.textContent =
                "No complete Pokémon card pairs found.";
        } else {
            galleryStatus.textContent = "";
        }

        console.log(
            `Successfully loaded ${completePokemon.length} Pokémon!`
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
