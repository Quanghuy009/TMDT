export function renderProductDetail(product) {
    renderBasicInfo(product);
    renderPrice(product);
    renderSpecs(product.specs);
}

function renderBasicInfo(product) {
    const nameEl = document.getElementById("product-name");
    const brandEl = document.getElementById("product-brand");
    const imageEl = document.getElementById("main-product-image");

    nameEl.textContent = product.name || "Không có tên sản phẩm";
    brandEl.textContent = product.brand ? `Thương hiệu: ${product.brand}` : "";

    if (product.image) {
        imageEl.src = `/images/products/${product.image}`;
    } else {
        imageEl.src = "/images/products/default.jpg";
    }

    imageEl.alt = product.name || "Product image";
}

function renderPrice(product) {
    const currentPriceEl = document.getElementById("product-current-price");
    const originalPriceEl = document.getElementById("product-original-price");
    const discountEl = document.getElementById("product-discount");

    if (product.onSale && product.salePrice) {
        currentPriceEl.textContent = formatCurrency(product.salePrice);
        originalPriceEl.textContent = formatCurrency(product.price);
        discountEl.textContent = `-${product.discountPercent}%`;

        originalPriceEl.style.display = "inline";
        discountEl.style.display = "inline-block";
    } else {
        currentPriceEl.textContent = formatCurrency(product.price);

        originalPriceEl.style.display = "none";
        discountEl.style.display = "none";
    }
}

function renderSpecs(specs) {
    const tbody = document.getElementById("product-specs-body");
    tbody.innerHTML = "";

    if (!specs || Object.keys(specs).length === 0) {
        tbody.innerHTML = `
            <tr>
                <td class="px-6 py-4 text-secondary">
                    Chưa có thông số kỹ thuật
                </td>
            </tr>
        `;
        return;
    }

    Object.entries(specs).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
            return;
        }

        const tr = document.createElement("tr");
        tr.className = "hover:bg-surface transition-colors";

        tr.innerHTML = `
            <td class="px-6 py-4 w-1/3 md:w-2/5 font-medium text-secondary">
                ${getSpecLabel(key)}
            </td>
            <td class="px-6 py-4 font-medium">
                ${value}
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function getSpecLabel(key) {
    const labels = {
        cpu_chip: "Chip xử lý",
        gpu_chip: "Chip đồ họa",
        ram: "RAM",
        storage_capacity: "Dung lượng lưu trữ",
        front_camera: "Camera trước",
        rear_camera: "Camera sau",
        screen_size: "Kích thước màn hình",
        screen_resolution: "Độ phân giải màn hình",
        display_technology: "Công nghệ màn hình",
        battery_capacity: "Dung lượng pin",
        charging_power: "Công suất sạc",
        utilities: "Tiện ích",

        headphone_type: "Loại tai nghe",
        connection_distance: "Khoảng cách kết nối",
        audio_technology: "Công nghệ âm thanh",
        compatible_os: "Hệ điều hành tương thích",
        battery_life: "Thời lượng pin",
        jack_type: "Cổng kết nối",

        keyboard_type: "Loại bàn phím",
        wireless_technology: "Công nghệ kết nối",
        keyboard_layout: "Layout bàn phím",
        key_count: "Số phím",
        size: "Kích thước",

        mouse_type: "Loại chuột",
        battery_type: "Loại pin",
        special_features: "Tính năng đặc biệt",

        speaker_type: "Loại loa",
        power_output: "Công suất"
    };

    return labels[key] || key;
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return Number(value).toLocaleString("vi-VN") + "đ";
}