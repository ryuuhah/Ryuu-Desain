document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');
    
    // Asumsi nomor WhatsApp
    const waNumber = '6281234567890'; // Ganti dengan nomor WA Anda

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

    // Elemen DOM Satuan
    const satuanItems = document.querySelectorAll('.satuan-item');
    const cartListElement = document.getElementById('satuanCartList');
    const totalBiayaSpan = document.getElementById('hasilSatuanBiaya');
    const waButton = document.getElementById('hitungSatuanBiaya');

    // =====================================================
    // Fungsi Pembantu
    // =====================================================
    function formatRupiah(angka) {
        if (angka === 0) return 'Rp 0';
        const rupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
        return rupiah;
    }

    function generateWaLink(message) {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${waNumber}?text=${encodedMessage}`;
    }

    function getProductById(id) {
        return SATUAN_PRODUCTS.find(p => p.id === id);
    }
    
    // =====================================================
    // Logika Keranjang Satuan
    // =====================================================

    function addToCart(productId) {
        const id = parseInt(productId);
        const product = getProductById(id);
        
        if (!product) return;

        const existingItem = satuanCart.find(item => item.productId === id);

        if (existingItem) {
            // Jika produk sudah ada, abaikan atau bisa tambahkan notifikasi
            return;
        } else {
            // Tambahkan produk baru ke keranjang
            satuanCart.push({
                productId: id,
                volume: (product.price > 0 ? 100 : 1), // Default volume 100m2 untuk non-konsultasi
                product: product 
            });
            // Beri highlight pada kartu di katalog
            const itemCard = document.querySelector(`.satuan-item[data-id="${id}"]`);
            if (itemCard) itemCard.classList.add('in-cart');
        }
        
        renderCart();
    }
    
    function removeFromCart(productId) {
        const id = parseInt(productId);
        satuanCart = satuanCart.filter(item => item.productId !== id);
        
        // Hapus highlight pada kartu di katalog
        const itemCard = document.querySelector(`.satuan-item[data-id="${id}"]`);
        if (itemCard) itemCard.classList.remove('in-cart');

        renderCart();
    }
    
    function updateCartVolume(productId, newVolume) {
        const id = parseInt(productId);
        const item = satuanCart.find(i => i.productId === id);
        
        if (item && item.product.price > 0) {
            item.volume = Math.max(1, newVolume); // Pastikan volume minimal 1
            updateCartTotal();
        }
    }
    
    function updateCartTotal() {
        let totalCost = 0;
        let hasPayableItem = false; // Untuk menentukan apakah ada item berharga > 0

        satuanCart.forEach(item => {
            if (item.product.price > 0 && item.volume > 0) {
                totalCost += item.product.price * item.volume;
                hasPayableItem = true;
            }
        });

        totalBiayaSpan.textContent = formatRupiah(totalCost);
        
        // Atur status tombol WA
        if (satuanCart.length === 0) {
             waButton.textContent = "Pilih Layanan ke Keranjang";
             waButton.disabled = true;
        } else {
             waButton.disabled = false;
             if (hasPayableItem) {
                waButton.textContent = `Pesan ${satuanCart.length} Layanan via WhatsApp`;
             } else {
                waButton.textContent = `Ajukan Konsultasi ${satuanCart.length} Layanan via WhatsApp`;
             }
        }
    }

    function renderCart() {
        if (satuanCart.length === 0) {
            cartListElement.innerHTML = '<p class="cart-empty-message">Keranjang kosong. Pilih produk dari katalog di atas.</p>';
        } else {
            let html = '';
            satuanCart.forEach(item => {
                const isConsultation = item.product.price === 0;
                
                html += `
                    <div class="cart-item" data-id="${item.productId}">
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.product.name}</span>
                            <span class="cart-item-price-m2">${isConsultation ? item.product.unit : formatRupiah(item.product.price) + '/' + item.product.unit}</span>
                        </div>
                        <div class="cart-item-controls">
                            ${isConsultation ? 
                                `<span class="cart-total-price">KONSULTASI</span>` : 
                                `<input type="number" min="1" value="${item.volume}" class="cart-item-input" data-id="${item.productId}">
                                <span class="cart-total-price">${item.product.unit}</span>`
                            }
                            <button class="cart-item-remove-btn" data-id="${item.productId}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            cartListElement.innerHTML = html;
        }
        updateCartTotal();
    }
    
    // =====================================================
    // Event Listeners Keranjang Satuan
    // =====================================================

    // 1. Klik Kartu Satuan (Add to Cart)
    satuanItems.forEach(item => {
        item.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });

    // 2. Event Delegation untuk input volume dan tombol remove
    cartListElement.addEventListener('change', function(e) {
        if (e.target.classList.contains('cart-item-input')) {
            const id = e.target.getAttribute('data-id');
            const newVolume = parseInt(e.target.value);
            if (!isNaN(newVolume) && newVolume >= 1) {
                updateCartVolume(id, newVolume);
            } else {
                // Reset nilai input ke nilai terakhir yang valid atau default
                e.target.value = satuanCart.find(i => i.productId == id).volume;
            }
        }
    });

    cartListElement.addEventListener('click', function(e) {
        if (e.target.closest('.cart-item-remove-btn')) {
            const button = e.target.closest('.cart-item-remove-btn');
            const id = button.getAttribute('data-id');
            removeFromCart(id);
        }
    });
    
    // 3. Tombol Pesan via WA
    waButton.addEventListener('click', function() {
        if (satuanCart.length === 0) return;

        let message = "Halo Ryuu Desain, saya ingin memesan layanan satuan berikut:\n\n";
        let hasPayable = false;
        let totalCost = 0;

        satuanCart.forEach((item, index) => {
            const product = item.product;
            const isConsultation = product.price === 0;
            const subtotal = product.price * item.volume;
            
            if (isConsultation) {
                message += `${index + 1}. ${product.name} (Perlu Konsultasi Harga)\n`;
            } else {
                message += `${index + 1}. ${product.name} - ${item.volume} ${product.unit} (Est. ${formatRupiah(subtotal)})\n`;
                totalCost += subtotal;
                hasPayable = true;
            }
        });

        if (hasPayable) {
            message += `\nTotal Estimasi Biaya: ${formatRupiah(totalCost)}`;
        } else {
             message = "Halo Ryuu Desain, saya ingin mengajukan konsultasi untuk layanan:\n" + satuanCart.map(item => `- ${item.product.name}`).join('\n');
        }

        window.open(generateWaLink(message), '_blank');
    });

    // =====================================================
    // Logika Lain (Non-Satuan) - Disesuaikan
    // =====================================================
    
    // 1. Fungsi Menu Mobile (Hamburger)
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // 2. Tutup Menu saat Link Diklik (di Mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                 navMenu.classList.remove('active');
            }
        });
    });
    
    // 3. Efek Header Dinamis saat Scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Logika Kalkulator Harga Paket (Existing)
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');

    function hitungEstimasiPaket() {
        const luasArea = parseFloat(luasAreaInput.value);
        const hargaPerM2 = parseFloat(paketDesainSelect.value);
        
        if (isNaN(luasArea) || luasArea <= 0) {
            hasilBiayaSpan.textContent = "Masukkan luas area yang valid.";
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        hasilBiayaSpan.textContent = formatRupiah(totalBiaya);
    }
    
    hitungEstimasiPaket(); 

    // Event listener untuk tombol hitung/pesan Paket
    hitungBiayaBtn.addEventListener('click', function() {
        const luasArea = parseFloat(luasAreaInput.value);
        const hargaPerM2 = parseFloat(paketDesainSelect.value);
        const paketNama = paketDesainSelect.options[paketDesainSelect.selectedIndex].getAttribute('data-name');
        
        if (isNaN(luasArea) || luasArea <= 0) {
            alert("Mohon masukkan Luas Area Total yang valid.");
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        const message = `Halo Ryuu Desain, saya ingin memesan:\n- Paket: ${paketNama}\n- Luas Area: ${luasArea} m²\n- Estimasi Biaya: ${formatRupiah(totalBiaya)}`;
        
        window.open(generateWaLink(message), '_blank');
    });

    // Tambahkan event listener untuk menghitung ulang saat ada perubahan
    luasAreaInput.addEventListener('input', hitungEstimasiPaket);
    paketDesainSelect.addEventListener('change', hitungEstimasiPaket);
    
    // 5. WA Contact Links Handler 
    const waContactLinks = document.querySelectorAll('.wa-contact-link');
    waContactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const defaultMessage = "Halo Ryuu Desain, saya tertarik dengan layanan desain Anda dan ingin berkonsultasi lebih lanjut.";
            window.open(generateWaLink(defaultMessage), '_blank');
        });
    });
    
    // 6. Scroll Fade In Animation
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
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    fadeIns.forEach(section => {
      observer.observe(section);
    });
    
    // Initial call for Satuan Cart
    renderCart();
});
