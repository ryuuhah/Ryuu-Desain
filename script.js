document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');

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

    // 4. Logika Kalkulator Harga
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');

    function formatRupiah(angka) {
        const rupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
        return rupiah;
    }

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

    // Hitung biaya pertama kali saat halaman dimuat
    hitungEstimasi(); 

    // Tambahkan event listener untuk menghitung ulang saat ada perubahan
    hitungBiayaBtn.addEventListener('click', hitungEstimasi);
    luasAreaInput.addEventListener('input', hitungEstimasi); 
    paketDesainSelect.addEventListener('change', hitungEstimasi); 
    
    // 5. Scroll Reveal Animation (Intersection Observer)
    const fadeSections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Muncul ketika masuk viewport (gulir ke bawah)
                entry.target.classList.add('is-visible');
            } else {
                // Hilang ketika keluar dari viewport (gulir ke atas)
                // Ini sesuai permintaan Anda, namun perlu diingat ini bisa membuat tampilan berkedip.
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Memicu ketika elemen terlihat 10%
    });

    fadeSections.forEach(section => {
        observer.observe(section);
    });
});
