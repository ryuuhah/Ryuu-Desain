document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');
    
    // Asumsi nomor WhatsApp
    const waNumber = '6281234567890'; // Ganti dengan nomor WA Anda

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

    // Fungsi Pembantu
    function formatRupiah(angka) {
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

    // 4. Logika Kalkulator Harga Paket (Existing)
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');

    function hitungEstimasi() {
        const luasArea = parseFloat(luasAreaInput.value);
        const hargaPerM2 = parseFloat(paketDesainSelect.value);
        
        if (isNaN(luasArea) || luasArea <= 0) {
            hasilBiayaSpan.textContent = "Masukkan luas area yang valid.";
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        hasilBiayaSpan.textContent = formatRupiah(totalBiaya);
    }
    
    hitungEstimasi(); 

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
    luasAreaInput.addEventListener('input', hitungEstimasi);
    paketDesainSelect.addEventListener('change', hitungEstimasi);

    // 5. Logika Katalog Satuan (NEW)
    const satuanLayananSelect = document.getElementById('satuanLayanan');
    const satuanLuasInput = document.getElementById('satuanLuas');
    const hasilSatuanBiayaSpan = document.getElementById('hasilSatuanBiaya');
    const hitungSatuanBiayaBtn = document.getElementById('hitungSatuanBiaya');
    const satuanAreaInputGroup = document.querySelector('.area-input-group');
    const allSatuanItems = document.querySelectorAll('.satuan-item');

    function updateSatuanEstimasi() {
        const selectedOption = satuanLayananSelect.options[satuanLayananSelect.selectedIndex];
        const hargaPerM2 = parseFloat(selectedOption.value);
        const luasArea = parseFloat(satuanLuasInput.value);
        
        // Atur tampilan input area berdasarkan harga
        if (hargaPerM2 === 0) {
            // Sembunyikan input area
            satuanAreaInputGroup.style.maxHeight = '0';
            satuanAreaInputGroup.style.opacity = '0';
            satuanAreaInputGroup.style.marginBottom = '0';
            satuanAreaInputGroup.style.pointerEvents = 'none'; // Menonaktifkan input
            
            hasilSatuanBiayaSpan.textContent = "Hubungi Kami";
            hitungSatuanBiayaBtn.textContent = "Konsultasi Layanan via WhatsApp";
            hitungSatuanBiayaBtn.classList.add('btn-outline');
            hitungSatuanBiayaBtn.classList.remove('btn');
        } else {
            // Tampilkan input area
            satuanAreaInputGroup.style.maxHeight = '100px'; 
            satuanAreaInputGroup.style.opacity = '1';
            satuanAreaInputGroup.style.marginBottom = '15px';
            satuanAreaInputGroup.style.pointerEvents = 'auto'; // Mengaktifkan input
            
            hitungSatuanBiayaBtn.textContent = "Pesan Layanan Satuan via WhatsApp";
            hitungSatuanBiayaBtn.classList.add('btn');
            hitungSatuanBiayaBtn.classList.remove('btn-outline');


            if (isNaN(luasArea) || luasArea <= 0) {
                hasilSatuanBiayaSpan.textContent = "Masukkan luas area.";
                return;
            }

            const totalBiaya = luasArea * hargaPerM2;
            hasilSatuanBiayaSpan.textContent = formatRupiah(totalBiaya);
        }
    }
    
    // Event listener untuk tombol hitung/pesan Satuan
    hitungSatuanBiayaBtn.addEventListener('click', function() {
        const selectedOption = satuanLayananSelect.options[satuanLayananSelect.selectedIndex];
        const paketNama = selectedOption.getAttribute('data-name');
        const hargaPerM2 = parseFloat(selectedOption.value);
        const luasArea = parseFloat(satuanLuasInput.value);
        let message;

        if (hargaPerM2 === 0) {
             message = `Halo Ryuu Desain, saya ingin berkonsultasi mengenai layanan "${paketNama}". Mohon informasinya.`;
        } else {
            if (isNaN(luasArea) || luasArea <= 0) {
                alert("Mohon masukkan Luas Area Total yang valid.");
                return;
            }
            const totalBiaya = luasArea * hargaPerM2;
            message = `Halo Ryuu Desain, saya ingin memesan layanan satuan:\n- Layanan: ${paketNama}\n- Luas Area: ${luasArea} m²\n- Estimasi Biaya: ${formatRupiah(totalBiaya)}`;
        }

        window.open(generateWaLink(message), '_blank');
    });

    // Event listeners untuk perubahan input
    satuanLayananSelect.addEventListener('change', updateSatuanEstimasi);
    satuanLuasInput.addEventListener('input', updateSatuanEstimasi);
    
    // Event listener untuk klik pada kartu satuan
    allSatuanItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            const itemPrice = this.getAttribute('data-price');
            
            // Temukan option yang sesuai dan setel sebagai terpilih
            for (let i = 0; i < satuanLayananSelect.options.length; i++) {
                if (satuanLayananSelect.options[i].getAttribute('data-name') === itemName) {
                    satuanLayananSelect.value = itemPrice; 
                    break;
                }
            }
            updateSatuanEstimasi();
        });
    });

    // Initial calculation for Satuan
    updateSatuanEstimasi();
    
    // 6. WA Contact Links Handler (NEW)
    const waContactLinks = document.querySelectorAll('.wa-contact-link');
    waContactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const defaultMessage = "Halo Ryuu Desain, saya tertarik dengan layanan desain Anda dan ingin berkonsultasi lebih lanjut.";
            window.open(generateWaLink(defaultMessage), '_blank');
        });
    });
    
    // 7. Scroll Fade In Animation (NEW - Added Logic)
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

});
