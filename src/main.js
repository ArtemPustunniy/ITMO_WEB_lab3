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

function getImagePath(imagePath) {
    if (!imagePath) return '';
    
    const imageMap = {
        '/images/terracotta.jpg': '/assets/terracotta-Cp_Fiquy.jpg',
        '/images/clay-bloom.jpg': '/assets/clay-bloom-CoIudm2A.jpg',
        '/images/moss-moon.jpg': '/assets/moss-moon-gBlYZMI6.jpg',
        '/images/earthen-grace.jpg': '/assets/earthen-grace-93zm5t6m.jpg',
        '/images/solace-set.jpg': '/assets/solace-set-93zm5t6m.jpg',
        '/images/pottery-secrets.jpg': '/assets/pottery-secrets-93zm5t6m.jpg',
        '/images/best-materials.jpg': '/assets/best-materials-93zm5t6m.jpg',
        '/images/ceramic-vase.png': '/assets/ceramic-vase-OXX2WIyD.png',
        '/images/crafts.jpg': '/assets/crafts-DEWsSkwQ.jpg',
        '/images/potter.jpg': '/assets/potter-BfefSK05.jpg',
        '/images/store.jpg': '/assets/store-95IpNxmP.jpg',
        '/images/workshop-hands.jpg': '/assets/workshop-hands-BWI96lKG.jpg',
        '/images/vase.png': '/assets/vase-3Pe10w9V.png'
    };
    
    // Определяем базовый путь для GitHub Pages
    const basePath = window.location.pathname.includes('/ITMO_WEB_lab3/') ? '/ITMO_WEB_lab3' : '';
    
    // Если есть маппинг, используем его
    if (imageMap[imagePath]) {
        return basePath + imageMap[imagePath];
    }
    
    // Иначе обрабатываем как обычно
    if (imagePath.startsWith('/')) {
        return basePath + imagePath;
    }
    
    if (imagePath.startsWith('./')) {
        return basePath + '/' + imagePath.substring(2);
    }
    
    return basePath + '/' + imagePath;
}

function renderProducts(products) {
    const productsGrid = document.querySelector('.catalog-products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="catalog-product-card">
            <div class="catalog-product-image" style="background-image: url('${getImagePath(product.image)}')"></div>
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
                <div class="blog-post-image" style="background-image: url('${getImagePath(post.image)}')"></div>
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

    initFormValidation();

    const currentPage = window.location.pathname;
    
    if (currentPage.includes('catalog.html')) {
        initCatalog();
    } else if (currentPage.includes('blog.html')) {
        initBlog();
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateQuestion(question) {
    return question.trim().length >= 10;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearFieldValidation(field) {
    field.classList.remove('error', 'success');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

function initFormValidation() {
    const contactForms = document.querySelectorAll('.contact-form form');
    contactForms.forEach(form => {
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const questionTextarea = form.querySelector('textarea');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (validateName(this.value)) {
                        showFieldSuccess(this);
                    } else {
                        showFieldError(this, 'Name must be at least 2 characters long');
                    }
                } else {
                    clearFieldValidation(this);
                }
            });
            
            nameInput.addEventListener('input', function() {
                if (this.classList.contains('error') && validateName(this.value)) {
                    showFieldSuccess(this);
                }
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (validateEmail(this.value)) {
                        showFieldSuccess(this);
                    } else {
                        showFieldError(this, 'Please enter a valid email address');
                    }
                } else {
                    clearFieldValidation(this);
                }
            });
            
            emailInput.addEventListener('input', function() {
                if (this.classList.contains('error') && validateEmail(this.value)) {
                    showFieldSuccess(this);
                }
            });
        }
        
        if (questionTextarea) {
            questionTextarea.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (validateQuestion(this.value)) {
                        showFieldSuccess(this);
                    } else {
                        showFieldError(this, 'Question must be at least 10 characters long');
                    }
                } else {
                    clearFieldValidation(this);
                }
            });
            
            questionTextarea.addEventListener('input', function() {
                if (this.classList.contains('error') && validateQuestion(this.value)) {
                    showFieldSuccess(this);
                }
            });
        }
        
        if (submitBtn) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                if (nameInput && !validateName(nameInput.value)) {
                    showFieldError(nameInput, 'Name must be at least 2 characters long');
                    isValid = false;
                }
                
                if (emailInput && !validateEmail(emailInput.value)) {
                    showFieldError(emailInput, 'Please enter a valid email address');
                    isValid = false;
                }
                
                if (questionTextarea && !validateQuestion(questionTextarea.value)) {
                    showFieldError(questionTextarea, 'Question must be at least 10 characters long');
                    isValid = false;
                }
                
                if (isValid) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'SENDING...';
                    
                    setTimeout(() => {
                        alert('Form submitted successfully!');
                        form.reset();
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'SEND REQUEST';
                        
                        [nameInput, emailInput, questionTextarea].forEach(field => {
                            if (field) clearFieldValidation(field);
                        });
                    }, 2000);
                }
            });
        }
    });
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (validateEmail(this.value)) {
                        showFieldSuccess(this);
                    } else {
                        showFieldError(this, 'Please enter a valid email address');
                    }
                } else {
                    clearFieldValidation(this);
                }
            });
            
            emailInput.addEventListener('input', function() {
                if (this.classList.contains('error') && validateEmail(this.value)) {
                    showFieldSuccess(this);
                }
            });
        }
        
        if (submitBtn) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!validateEmail(emailInput.value)) {
                    showFieldError(emailInput, 'Please enter a valid email address');
                    return;
                }
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'SUBSCRIBING...';
                
                setTimeout(() => {
                    alert('Successfully subscribed to newsletter!');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SUBMIT';
                    clearFieldValidation(emailInput);
                }, 2000);
            });
        }
    });
}
