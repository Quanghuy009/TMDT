export function initSpecForm() {
    const categorySelect = document.getElementById("category-select");
    const accessoryTypeSelect = document.getElementById("accessory-type-select");

    hideAllSpecSections();
    hideAccessoryTypeContainer();

    categorySelect?.addEventListener("change", () => {
        handleCategoryChange();
    });

    accessoryTypeSelect?.addEventListener("change", () => {
        handleAccessoryTypeChange();
    });
}

export function handleCategoryChange() {
    const categorySelect = document.getElementById("category-select");
    const selectedOption = categorySelect?.selectedOptions[0];
    const categoryName = selectedOption?.dataset.name || selectedOption?.textContent || "";

    hideAllSpecSections();

    if (isDeviceCategory(categoryName)) {
        hideAccessoryTypeContainer();
        showSpecSection("spec-device");
        return;
    }

    if (categoryName === "Phụ kiện") {
        showAccessoryTypeContainer();
        handleAccessoryTypeChange();
        return;
    }

    hideAccessoryTypeContainer();
}

export function handleAccessoryTypeChange() {
    const accessoryTypeSelect = document.getElementById("accessory-type-select");
    const type = accessoryTypeSelect?.value || "";

    hideAllSpecSections();

    if (type === "headphone") {
        showSpecSection("spec-headphone");
        return;
    }

    if (type === "keyboard") {
        showSpecSection("spec-keyboard");
        return;
    }

    if (type === "mouse") {
        showSpecSection("spec-mouse");
        return;
    }

    if (type === "speaker") {
        showSpecSection("spec-speaker");
    }
}

function isDeviceCategory(categoryName) {
    return categoryName === "Điện thoại"
        || categoryName === "Laptop"
        || categoryName === "Tablet";
}

function showSpecSection(id) {
    document.getElementById(id)?.classList.remove("hidden");
}

function hideAllSpecSections() {
    document.querySelectorAll(".spec-section").forEach(section => {
        section.classList.add("hidden");
    });
}

function showAccessoryTypeContainer() {
    document.getElementById("accessory-type-container")?.classList.remove("hidden");
}

function hideAccessoryTypeContainer() {
    document.getElementById("accessory-type-container")?.classList.add("hidden");

    const accessoryTypeSelect = document.getElementById("accessory-type-select");
    if (accessoryTypeSelect) {
        accessoryTypeSelect.value = "";
    }
}