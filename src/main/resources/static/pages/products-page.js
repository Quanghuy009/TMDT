import { renderDeviceFilterSidebar } from '../js/components/filter-sidebar.js';
let currentPage = 0;
let currentSort = 'best_seller';
const pageSize = 12;

const categoryNames = {
    1: 'Điện thoại',
    2: 'Laptop',
    3: 'Tablet'
};

document.addEventListener('DOMContentLoaded', async () => {
    loadFragment('header', '/fragments/header.html');
    loadFragment('footer', '/fragments/footer.html');

    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('categoryId');

    if (!categoryId) {
        document.getElementById('category-title').textContent = 'Danh mục sản phẩm';
        return;
    }

    document.getElementById('category-title').textContent =
        categoryNames[categoryId] || 'Danh mục sản phẩm';

    renderDeviceFilterSidebar('filter-sidebar');

    bindFilterEvents();
    bindSortEvents();

    loadProducts();
});

async function loadFragment(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Không tải được ${filePath}`);

        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

function bindFilterEvents() {
    document.querySelectorAll('.filter-input').forEach(input => {
        input.addEventListener('change', () => {
            currentPage = 0;
            loadProducts();
        });
    });
}

function bindSortEvents() {
    document.querySelectorAll('.sort-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentSort = button.dataset.sort;
            currentPage = 0;

            document.querySelectorAll('.sort-btn').forEach(btn => {
                btn.className =
                    'sort-btn bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-200';
            });

            button.className =
                'sort-btn bg-primary-container text-white px-4 py-1.5 rounded-full text-xs font-medium';

            loadProducts();
        });
    });
}

async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('categoryId');

    const apiParams = new URLSearchParams();

    apiParams.append('categoryId', categoryId);
    apiParams.append('page', currentPage);
    apiParams.append('size', pageSize);
    apiParams.append('sort', currentSort);

    appendFilterParams(apiParams);

    try {
        const response = await fetch(`/api/products?${apiParams.toString()}`);

        if (!response.ok) {
            throw new Error('Không thể tải danh sách sản phẩm');
        }

        const data = await response.json();

        renderProducts(data.content || []);
        renderProductCount(data);
        renderPagination(data);

    } catch (error) {
        console.error(error);
        document.getElementById('product-grid').innerHTML = `
            <div class="col-span-full text-center text-red-500 py-12">
                Không thể tải sản phẩm
            </div>
        `;
    }
}

function appendFilterParams(apiParams) {
    const checkedInputs = document.querySelectorAll('.filter-input:checked');

    checkedInputs.forEach(input => {
        apiParams.append(input.name, input.value);
    });
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-12">
                Không có sản phẩm phù hợp
            </div>
        `;
        return;
    }

    grid.innerHTML = products
        .map(p => renderProductCard(p))
        .join('');
}

function renderProductCount(data) {
    const countEl = document.getElementById('product-count');

    countEl.innerHTML = `
        Hiển thị 
        <span class="text-gray-900">${data.numberOfElements || 0}</span> 
        trên 
        <span class="text-gray-900">${data.totalElements || 0}</span> 
        sản phẩm
    `;
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');

    if (!data.totalPages || data.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    html += `
        <button 
            ${data.first ? 'disabled' : ''}
            data-page="${currentPage - 1}"
            class="page-btn w-10 h-10 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
            <span class="material-symbols-outlined">chevron_left</span>
        </button>
    `;

    for (let i = 0; i < data.totalPages; i++) {
        html += `
            <button 
                data-page="${i}"
                class="page-btn w-10 h-10 rounded ${
            i === currentPage
                ? 'bg-primary-container text-white'
                : 'border border-gray-200 hover:bg-gray-50'
        } flex items-center justify-center font-bold">
                ${i + 1}
            </button>
        `;
    }

    html += `
        <button 
            ${data.last ? 'disabled' : ''}
            data-page="${currentPage + 1}"
            class="page-btn w-10 h-10 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
            <span class="material-symbols-outlined">chevron_right</span>
        </button>
    `;

    pagination.innerHTML = html;

    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentPage = Number(button.dataset.page);
            loadProducts();
        });
    });
}