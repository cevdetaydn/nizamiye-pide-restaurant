// Modern Optimized JavaScript for Restaurant Website

class RestaurantApp {
    constructor() {
        this.cart = new Map();
        this.isLoading = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleLoading();
        this.initAnimations();
        this.initBackToTop();
        this.initMobileMenu();
        this.initStats();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handleLoading();
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Loading Screen Management
    handleLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Simulate loading time
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            this.isLoading = false;
            this.triggerAnimations();
        }, 1500);
    }

    // Scroll Effects
    handleScroll() {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        const backToTop = document.getElementById('back-to-top');

        // Header background opacity
        if (header) {
            if (scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollY < window.innerHeight) {
            const parallaxSpeed = scrollY * 0.5;
            hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    }

    // Back to Top Functionality
    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Mobile Menu
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (mobileToggle && navList) {
            mobileToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close menu when clicking on nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            });
        }
    }

    // Animated Statistics Counter
    initStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Animation Triggers
    initAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    triggerAnimations() {
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Cart Management (for menu page)
    addToCart(name, price, quantity = 1) {
        if (this.cart.has(name)) {
            const existingItem = this.cart.get(name);
            existingItem.quantity += quantity;
        } else {
            this.cart.set(name, { price, quantity });
        }
        this.updateCartDisplay();
        this.showNotification(`${name} sepete eklendi!`, 'success');
    }

    removeFromCart(name, quantity = 1) {
        if (this.cart.has(name)) {
            const item = this.cart.get(name);
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                this.cart.delete(name);
            }
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const totalPrice = document.getElementById('total-price');
        const orderBtn = document.getElementById('order-btn');
        const cartEmpty = document.getElementById('cart-empty');
        const cartCount = document.querySelector('.cart-count');

        if (!cartItems || !totalPrice) return;

        cartItems.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        this.cart.forEach((item, name) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemCount += item.quantity;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${name}</span>
                    <span class="cart-item-price">${itemTotal.toFixed(2)} TL</span>
                </div>
                <div class="cart-item-controls">
                    <span class="cart-item-quantity">x${item.quantity}</span>
                    <button class="remove-item-btn" data-name="${name}" title="Ürünü Sil">
                        <span>🗑️</span>
                    </button>
                </div>
            `;
            cartItems.appendChild(li);
        });

        // Add event listeners to remove buttons
        const removeButtons = cartItems.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const itemName = btn.getAttribute('data-name');
                this.removeItemCompletely(itemName);
            });
        });

        // Update cart count
        if (cartCount) {
            cartCount.textContent = `${itemCount} ürün`;
        }

        // Show/hide empty cart message
        if (cartEmpty) {
            if (this.cart.size === 0) {
                cartEmpty.style.display = 'block';
                cartItems.style.display = 'none';
            } else {
                cartEmpty.style.display = 'none';
                cartItems.style.display = 'block';
            }
        }

        totalPrice.textContent = `Toplam: ${total.toFixed(2)} TL`;

        if (orderBtn) {
            if (total > 0) {
                orderBtn.disabled = false;
                orderBtn.style.opacity = '1';
                orderBtn.style.cursor = 'pointer';
            } else {
                orderBtn.disabled = true;
                orderBtn.style.opacity = '0.6';
                orderBtn.style.cursor = 'not-allowed';
            }
        }
    }

    // Completely remove item from cart
    removeItemCompletely(name) {
        if (this.cart.has(name)) {
            this.cart.delete(name);
            this.updateCartDisplay();
            this.showNotification(`${name} sepetten çıkarıldı!`, 'warning');
            
            // Reset quantity display in menu
            const quantityControls = document.querySelectorAll('.quantity-controls');
            quantityControls.forEach(control => {
                if (control.getAttribute('data-name') === name) {
                    const quantityValue = control.querySelector('.quantity-value');
                    if (quantityValue) {
                        quantityValue.textContent = '0';
                    }
                }
            });
        }
    }

    // WhatsApp Order
    sendWhatsAppOrder() {
        if (this.cart.size === 0) {
            this.showNotification('Sepetiniz boş!', 'error');
            return;
        }

        let message = 'Merhaba! Aşağıdaki ürünleri sipariş etmek istiyorum:%0A%0A';
        let total = 0;

        this.cart.forEach((item, name) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `• ${name} x${item.quantity} = ${itemTotal.toFixed(2)} TL%0A`;
        });

        message += `%0AToplam: ${total.toFixed(2)} TL%0A%0ATeşekkürler!`;

        const whatsappUrl = `https://wa.me/905305858228?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Type-specific colors
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Gallery Modal (for gallery page)
    initGalleryModal() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        const modal = document.getElementById('zoom-modal');
        const modalImage = document.getElementById('zoomed-image');
        const closeBtn = document.querySelector('.close-zoom');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (!modal || !modalImage) return;

        let currentImageIndex = 0;
        const images = Array.from(galleryImages);

        const showImage = (index) => {
            const img = images[index];
            const galleryItem = img.closest('.gallery-item');
            const info = galleryItem.querySelector('.gallery-info');
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            
            if (modalTitle && modalDescription && info) {
                modalTitle.textContent = info.querySelector('h3').textContent;
                modalDescription.textContent = info.querySelector('p').textContent;
            }
            
            currentImageIndex = index;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                modal.classList.add('active');
                showImage(index);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            modalImage.src = '';
            modalImage.alt = '';
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
                showImage(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
                showImage(newIndex);
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        if (prevBtn) prevBtn.click();
                        break;
                    case 'ArrowRight':
                        if (nextBtn) nextBtn.click();
                        break;
                }
            }
        });
    }

    // Contact Form Handler
    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.phone || !data.subject || !data.message) {
                this.showNotification('Lütfen zorunlu alanları doldurun!', 'error');
                return;
            }

            if (!data.privacy) {
                this.showNotification('Kişisel verilerin işlenmesini kabul etmelisiniz!', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Gönderiliyor...</span>';
            submitBtn.disabled = true;

            // Send email using EmailJS
            this.sendContactEmail(data)
                .then(() => {
                    this.showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Email gönderme hatası:', error);
                    this.showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen telefon ile iletişime geçin.', 'error');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Send contact email using EmailJS
    async sendContactEmail(formData) {
        // EmailJS configuration
        const serviceID = 'service_nizamiye'; // EmailJS service ID
        const templateID = 'template_contact'; // EmailJS template ID
        const publicKey = 'YOUR_PUBLIC_KEY'; // EmailJS public key

        const templateParams = {
            from_name: formData.name,
            from_email: formData.email || 'Belirtilmemiş',
            from_phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            to_email: 'nizamiyerestoran@gmail.com' // Mesajların gideceği email adresi
        };

        try {
            // EmailJS kullanarak email gönder
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
                return response;
            } else {
                // EmailJS yüklenmemişse alternatif yöntem: mailto
                this.sendEmailViaMailto(formData);
                return Promise.resolve();
            }
        } catch (error) {
            // Hata durumunda alternatif yöntem
            this.sendEmailViaMailto(formData);
            throw error;
        }
    }

    // Alternative method: Open default email client
    sendEmailViaMailto(formData) {
        const subject = encodeURIComponent(`İletişim Formu: ${formData.subject}`);
        const body = encodeURIComponent(`
Ad Soyad: ${formData.name}
Telefon: ${formData.phone}
E-posta: ${formData.email || 'Belirtilmemiş'}
Konu: ${formData.subject}

Mesaj:
${formData.message}

---
Bu mesaj Nizamiye Pide ve Lahmacun web sitesi iletişim formundan gönderilmiştir.
        `);

        const mailtoLink = `mailto:nizamiyerestoran@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
    }

    // FAQ Accordion
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    }

    // Menu Page Functionality
    initMenuPage() {
        const quantityControls = document.querySelectorAll('.quantity-controls');
        const orderBtn = document.getElementById('order-btn');

        quantityControls.forEach(control => {
            const decreaseBtn = control.querySelector('.decrease-btn');
            const increaseBtn = control.querySelector('.increase-btn');
            const quantityValue = control.querySelector('.quantity-value');
            const name = control.getAttribute('data-name');
            const price = parseFloat(control.getAttribute('data-price'));

            if (decreaseBtn) {
                decreaseBtn.addEventListener('click', () => {
                    let current = parseInt(quantityValue.textContent);
                    if (current > 0) {
                        current--;
                        quantityValue.textContent = current;
                        if (current === 0) {
                            this.removeFromCart(name, 1);
                        } else {
                            this.removeFromCart(name, 1);
                        }
                    }
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener('click', () => {
                    let current = parseInt(quantityValue.textContent);
                    current++;
                    quantityValue.textContent = current;
                    this.addToCart(name, price, 1);
                });
            }
        });

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                this.sendWhatsAppOrder();
            });
        }

        this.updateCartDisplay();
    }

    // Smooth Scrolling for Anchor Links
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Resize Handler
    handleResize() {
        // Handle any resize-specific logic here
        const navList = document.querySelector('.nav-list');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (window.innerWidth > 768) {
            if (navList) navList.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
        }
    }

    // Lazy Loading for Images
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Performance Monitoring
    logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    }
}

// Initialize the application
const app = new RestaurantApp();

// Page-specific initializations
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('menu')) {
        app.initMenuPage();
    }
    
    if (currentPage.includes('gallery')) {
        app.initGalleryModal();
    }
    
    if (currentPage.includes('contact')) {
        app.initContactForm();
        app.initFAQ();
    }
    
    app.initSmoothScrolling();
    app.initLazyLoading();
    app.logPerformance();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RestaurantApp;
}
