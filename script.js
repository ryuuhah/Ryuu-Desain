document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');
    
    // UTILITY FUNCTION
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    // 1. Fungsi Menu Mobile (Hamburger) & Header Scroll
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                 navMenu.classList.remove('active');
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =======================================================
    // 2. Logika Kalkulator Paket (Section #kalkulator)
    // =======================================================
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');

    function hitungEstimasiPaket() {
        const luasArea = parseFloat(luasAreaInput.value);
        const hargaPerM2 = parseFloat(paketDesainSelect.value);
        const selectedPackageName = paketDesainSelect.options[paketDesainSelect.selectedIndex].getAttribute('data-name');

        if (isNaN(luasArea) || luasArea <= 0) {
            hasilBiayaSpan.textContent = "Masukkan luas area yang valid.";
            hitungBiayaBtn.disabled = true;
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        hasilBiayaSpan.textContent = formatRupiah(totalBiaya);
        hitungBiayaBtn.disabled = false;
        
        // Update WA link
        const waMessage = `Halo Ryuu Desain, saya ingin memesan *${selectedPackageName}* dengan total luas area ${luasArea} m². Estimasi biaya ${formatRupiah(totalBiaya)}. Mohon konfirmasi jadwal dan langkah selanjutnya.`;
        hitungBiayaBtn.onclick = () => {
            window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`, '_blank');
        };
    }

    // Inisialisasi dan Event Listener Kalkulator Paket
    hitungEstimasiPaket(); 
    luasAreaInput.addEventListener('input', hitungEstimasiPaket); 
    paketDesainSelect.addEventListener('change', hitungEstimasiPaket); 
    
    // =======================================================
    // 3. Logika Kalkulator Satuan (A La Carte)
    // =======================================================
    
    const satuanItems = document.querySelectorAll('.satuan-item');
    const satuanCartList = document.getElementById('satuanCartList');
    const hasilSatuanBiayaSpan = document.getElementById('hasilSatuanBiaya');
    const hitungSatuanBiayaBtn = document.getElementById('hitungSatuanBiaya');
    const satuanLuasAreaInput = document.getElementById('satuanLuasArea');
    const inputVolumeContainer = document.querySelector('.input-volume-container');
    
    let cart = []; // Keranjang belanja satuan

    function updateCartDisplay() {
        satuanCartList.innerHTML = ''; // Kosongkan keranjang
        
        if (cart.length === 0) {
            satuanCartList.innerHTML = '<p class="cart-empty-message">Keranjang kosong. Pilih produk dari katalog di atas.</p>';
            inputVolumeContainer.style.display = 'none';
            hitungSatuanBiayaBtn.disabled = true;
            hitungSatuanBiaya();
            return;
        }

        let needsVolumeInput = false;
        let cartMessage = "Saya ingin memesan layanan A La Carte berikut:\n";
        let totalBiaya = 0;
        const luasArea = parseFloat(satuanLuasAreaInput.value) || 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            const itemCost = item.price * (item.unit === 'm²' ? luasArea : 1);
            totalBiaya += itemCost;
            
            let priceText;
            if (item.unit === 'm²') {
                priceText = `${formatRupiah(itemCost)} (${formatRupiah(item.price)}/m²)`;
                needsVolumeInput = true;
                cartMessage += `- ${item.name} (${luasArea} m²): ${formatRupiah(itemCost)}\n`;
            } else {
                priceText = "Konsultasi";
                cartMessage += `- ${item.name} (Konsultasi)\n`;
            }
            
            itemElement.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${priceText}</span>
            `;
            satuanCartList.appendChild(itemElement);
        });

        // Tampilkan/Sembunyikan input volume berdasarkan item di keranjang
        inputVolumeContainer.style.display = needsVolumeInput ? 'block' : 'none';
        
        // Tampilkan total biaya
        hasilSatuanBiayaSpan.textContent = formatRupiah(totalBiaya);

        // Update tombol WA
        if (needsVolumeInput && luasArea <= 0) {
             hitungSatuanBiayaBtn.textContent = "Masukkan Luas Area";
             hitungSatuanBiayaBtn.disabled = true;
        } else {
             hitungSatuanBiayaBtn.textContent = "Pesan Layanan Satuan via WhatsApp";
             hitungSatuanBiayaBtn.disabled = false;
             
             if (needsVolumeInput) {
                 cartMessage += `\nTotal Estimasi Biaya: ${formatRupiah(totalBiaya)} (Luas Area: ${luasArea} m²)`;
             } else {
                 cartMessage += `\nSilahkan kontak kami untuk memulai konsultasi.`;
             }
             
             hitungSatuanBiayaBtn.onclick = () => {
                window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(cartMessage)}`, '_blank');
             };
        }
    }
    
    function hitungSatuanBiaya() {
        updateCartDisplay();
    }

    // Event Listener untuk setiap item satuan
    satuanItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const itemName = this.getAttribute('data-name');
            const itemPrice = parseFloat(this.getAttribute('data-price'));
            const itemUnit = this.getAttribute('data-unit');

            const index = cart.findIndex(i => i.id === itemId);

            if (index > -1) {
                // Hapus dari keranjang (sudah ada)
                cart.splice(index, 1);
                this.classList.remove('selected');
            } else {
                // Tambahkan ke keranjang (belum ada)
                const newItem = {
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    unit: itemUnit
                };
                cart.push(newItem);
                this.classList.add('selected');
            }

            hitungSatuanBiaya();
        });
    });
    
    // Event Listener untuk input luas area satuan
    satuanLuasAreaInput.addEventListener('input', hitungSatuanBiaya);
    
    // Inisialisasi tampilan keranjang
    hitungSatuanBiaya(); 
});
