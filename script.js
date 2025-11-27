document.addEventListener('DOMContentLoaded', function() {
    // 1. Deklarasi Variabel dan Konstan
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a, header a');
    const header = document.querySelector('header');
    
    const waNumber = '6285117788355'; // Nomor WhatsApp
    
    // State untuk Keranjang Satuan
    let satuanCart = []; 
    
    // Daftar Produk Statis
    const SATUAN_PRODUCTS = [
        { id: 1, name: "Gambar Kerja 2D", price: 15000, unit: 'm²' },
        { id: 2, name: "Gambar Render 3D (Eksterior)", price: 15000, unit: 'm²' },
        { id: 3, name: "Rencana Anggaran Biaya (RAB)", price: 20000, unit: 'm²' },
        { id: 4, name: "Gambar Render 3D Interior", price: 15000, unit: 'm²' },
        { id: 5, name: "Gambar Rencana 2D dan 3D Furniture", price: 0, unit: 'Konsultasi' },
        { id: 6, name: "Desain Web", price: 0, unit: 'Konsultasi' }
    ];

    // Elemen Kalkulator
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiayaBtn');
    const hasilBiayaText = document.getElementById('hasilBiaya');
    const waKalkulatorLink = document.getElementById('waKalkulatorLink');
    
    // Elemen Katalog Satuan
    const satuanCatalogGrid = document.getElementById('satuanCatalogGrid');
    const satuanCartList = document.getElementById('satuanCartList');
    const cartTotalText = document.getElementById('cartTotalText');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // 2. Fungsi Utilitas
    
    /** Mengkonversi angka menjadi format Rupiah. */
    const formatRupiah = (angka) => {
        if (typeof angka !== 'number') return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka).replace(',00', '');
    };

    /** Membuat link WhatsApp dengan pesan yang sudah di-encode. */
    const generateWaLink = (message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${waNumber}?text=${encodedMessage}`;
    };

    // 3. Navbar dan Smooth Scroll
    
    // Toggle Menu Mobile
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Scroll Header Background
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'white';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                // Biarkan warna default di CSS (jika ada) atau putih
                header.style.backgroundColor = 'white';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        }
    });

    // Close menu on link click (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // 4. Kalkulator Estimasi
    
    /** Menghitung estimasi biaya paket desain. */
    const hitungEstimasiPaket = () => {
        const luasArea = parseFloat(luasAreaInput.value) || 0;
        const hargaPerM2 = parseInt(paketDesainSelect.value) || 0;
        const totalBiaya = luasArea * hargaPerM2;
        
        hasilBiayaText.textContent = formatRupiah(totalBiaya);
        
        // Update pesan WA link kalkulator
        const namaPaket = paketDesainSelect.options[paketDesainSelect.selectedIndex].text.split('(')[0].trim();
        const message = `Halo Ryuu Desain, saya ingin konsultasi mengenai estimasi proyek saya.\n- Paket: ${namaPaket}\n- Luas Area: ${luasArea} m²\n- Estimasi Biaya: ${formatRupiah(totalBiaya)}`;
        waKalkulatorLink.setAttribute('data-wa-message', message);
    };

    // Panggil fungsi sekali saat DOMContentLoaded untuk inisialisasi awal
    hitungEstimasiPaket();

    // Event listener untuk menghitung ulang saat ada perubahan
    if (luasAreaInput) luasAreaInput.addEventListener('input', hitungEstimasiPaket);
    if (paketDesainSelect) paketDesainSelect.addEventListener('change', hitungEstimasiPaket);

    // Event listener untuk tombol 'Hitung Estimasi' (sama seperti event change, tapi untuk tombol)
    if (hitungBiayaBtn) {
        hitungBiayaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hitungEstimasiPaket();
            // Scroll ke hasil (optional, bisa dihilangkan)
            // hasilBiayaText.scrollIntoView({ behavior: 'smooth' }); 
        });
    }

    // 5. Katalog A La Carte (Satuan) dan Keranjang
    
    /** Render katalog produk ke DOM. */
    const renderCatalog = () => {
        if (!satuanCatalogGrid) return;

        satuanCatalogGrid.innerHTML = SATUAN_PRODUCTS.map(product => {
            const isInCart = satuanCart.some(item => item.id === product.id);
            const buttonClass = isInCart ? 'add-btn added-to-cart' : 'add-btn';
            const buttonText = isInCart ? 'Ditambahkan' : 'Tambah ke Keranjang';
            
            const priceDisplay = product.price === 0 
                ? product.unit 
                : `${formatRupiah(product.price)} / ${product.unit}`;

            return `
                <div class="satuan-item" data-id="${product.id}">
                    <div class="satuan-item-info">
                        <h4>${product.name}</h4>
                        <span class="satuan-price-unit">${priceDisplay}</span>
                    </div>
                    <button class="${buttonClass}" data-id="${product.id}" ${isInCart ? 'disabled' : ''}>
                        ${buttonText}
                    </button>
                </div>
            `;
        }).join('');
    };

    /** Render keranjang belanja ke DOM. */
    const renderCart = () => {
        if (!satuanCartList || !cartTotalText || !checkoutBtn) return;

        let total = 0;
        satuanCartList.innerHTML = ''; // Kosongkan keranjang

        if (satuanCart.length === 0) {
            satuanCartList.innerHTML = '<li class="empty-cart-message">Keranjang Anda masih kosong.</li>';
            checkoutBtn.disabled = true;
        } else {
            satuanCart.forEach(item => {
                let priceText;
                if (item.price === 0) {
                    priceText = item.unit; // Konsultasi
                } else {
                    priceText = `${formatRupiah(item.price)} x [Luas]`;
                    total += item.price; // Hanya hitung total untuk produk berbayar
                }

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>
                        <span style="font-size:0.9em; margin-right: 10px;">${priceText}</span>
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </span>
                `;
                satuanCartList.appendChild(listItem);
            });
            checkoutBtn.disabled = false;
        }

        // Tampilkan total (gunakan placeholder karena harga berbasis m²)
        const totalDisplay = satuanCart.some(item => item.price > 0) 
            ? 'Konsultasi Harga Total' 
            : formatRupiah(0);

        cartTotalText.textContent = totalDisplay;
    };

    /** Menambahkan produk ke keranjang. */
    const addToCart = (productId) => {
        const id = parseInt(productId);
        const product = SATUAN_PRODUCTS.find(p => p.id === id);
        
        if (product && !satuanCart.some(item => item.id === id)) {
            satuanCart.push(product);
            renderCatalog();
            renderCart();
        }
    };

    /** Menghapus produk dari keranjang. */
    const removeFromCart = (productId) => {
        const id = parseInt(productId);
        satuanCart = satuanCart.filter(item => item.id !== id);
        renderCatalog();
        renderCart();
    };

    // Event Delegation untuk tombol Tambah
    if (satuanCatalogGrid) {
        satuanCatalogGrid.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('add-btn') && !target.disabled) {
                const productId = target.getAttribute('data-id');
                addToCart(productId);
            }
        });
    }

    // Event Delegation untuk tombol Hapus di Keranjang
    if (satuanCartList) {
        satuanCartList.addEventListener('click', (e) => {
            const target = e.target.closest('.remove-item-btn');
            if (target) {
                const productId = target.getAttribute('data-id');
                removeFromCart(productId);
            }
        });
    }
    
    // Event listener untuk tombol Checkout Satuan
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (satuanCart.length === 0) return;

            // Buat pesan checkout
            let message = "Halo Ryuu Desain, saya ingin memesan layanan A La Carte berikut:\n";
            satuanCart.forEach(item => {
                const priceText = item.price === 0 
                    ? `(${item.unit})` 
                    : `(${formatRupiah(item.price)}/${item.unit} - perlu konsultasi luas)`;
                message += `- ${item.name} ${priceText}\n`;
            });
            message += "\nMohon konfirmasi dan informasikan total biaya final untuk proyek saya. Terima kasih.";
            
            window.open(generateWaLink(message), '_blank');
        });
    }

    // Panggil renderCatalog dan renderCart saat DOMContentLoaded
    renderCatalog();
    renderCart();
    
    // 6. WA Contact Links Handler 
    const waContactLinks = document.querySelectorAll('.wa-contact-link');
    waContactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Ambil pesan dari data-wa-message atau gunakan default
            const defaultMessage = "Halo Ryuu Desain, saya tertarik dengan layanan desain Anda dan ingin berkonsultasi lebih lanjut.";
            const message = this.getAttribute('data-wa-message') || defaultMessage;
            
            window.open(generateWaLink(message), '_blank');
        });
    });
    
    // 7. Scroll Fade In Animation
    const fadeIns = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Berhenti mengamati setelah terlihat
        }
      });
    }, observerOptions);

    fadeIns.forEach(el => observer.observe(el));
});
