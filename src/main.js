import './styles/main.scss'

const API_BASE = 'https://ceramic-api.onrender.com/api';
const PRODUCTS_API = `${API_BASE}/products`;
const POSTS_API = `${API_BASE}/posts`;

async function fetchProducts(category = null) {
    try {
        const url = category ? `${PRODUCTS_API}/?category=${category}` : PRODUCTS_API;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function fetchPosts() {
    try {
        const response = await fetch(POSTS_API);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

function renderProducts(products) {
    const productsGrid = document.querySelector('.catalog-products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="catalog-product-card">
            <div class="catalog-product-image" style="background-image: url('${product.image}')"></div>
            <div class="catalog-product-info">
                <h3 class="catalog-product-name">${product.title}</h3>
                <p class="catalog-product-price">${product.price} ${product.currency}</p>
            </div>
        </div>
    `).join('');
}

function renderPosts(posts) {
    const postsGrid = document.querySelector('.blog-posts-grid');
    if (!postsGrid) return;

    postsGrid.innerHTML = posts.map(post => `
        <div class="blog-post-card">
            <div class="blog-post-top">
                <div class="blog-post-image" style="background-image: url('${post.image}')"></div>
                <div class="blog-post-content">
                    <h3 class="blog-post-title">${post.title}</h3>
                    <button class="blog-read-btn">Read More</button>
                </div>
            </div>
            <div class="blog-post-text">
                <p>${post.excerpt}</p>
            </div>
        </div>
    `).join('');
}

async function initCatalog() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.querySelector('.catalog-products-grid');
    
    if (!productsGrid) return;

    const activeButton = document.querySelector('.filter-btn.active');
    const defaultCategory = activeButton ? activeButton.textContent.toLowerCase() : 'tea';
    const defaultProducts = await fetchProducts(defaultCategory);
    renderProducts(defaultProducts);

    filterButtons.forEach(button => {
        button.addEventListener('click', async () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.textContent.toLowerCase();
            const products = await fetchProducts(category);
            renderProducts(products);
        });
    });
}

async function initBlog() {
    const posts = await fetchPosts();
    renderPosts(posts);
}

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (hamburgerMenu && mobileMenu && mobileMenuClose) {
        hamburgerMenu.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });

        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });

        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    const galleryImages = document.querySelectorAll('.gallery-image');
    const indicators = document.querySelectorAll('.indicator');
    const prevArrow = document.querySelector('.gallery-arrow:first-child');
    const nextArrow = document.querySelector('.gallery-arrow:last-child');
    let currentIndex = 0;

    function showImage(index) {
        galleryImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(currentIndex);
        });

        nextArrow.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            showImage(currentIndex);
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    showImage(0);

    const currentPage = window.location.pathname;
    
    if (currentPage.includes('catalog.html')) {
        initCatalog();
    } else if (currentPage.includes('blog.html')) {
        initBlog();
    }
});
