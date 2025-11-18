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

    // 4. Logika Kalkulator Harga & WhatsApp
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');
    
    // Konfigurasi WhatsApp (Placeholder Nomor)
    // ***HARAP GANTI NOMOR INI DENGAN NOMOR WA AKTIF ANDA***
    const WHATSAPP_NUMBER = '6281234567890'; 
    const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

    function formatRupiah(angka) {
        const rupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
        return rupiah;
    }

    function generateWhatsappLink(packageName, luasArea, estimasiBiaya) {
        // Encoding pesan untuk URL WhatsApp
        const message = encodeURIComponent(
            `Halo Ryuu Desain, saya tertarik dengan paket berikut:\n\n` +
            `📦 Paket Pilihan: ${packageName}\n` +
            `📐 Luas Area Total: ${luasArea} m²\n` +
            `💰 Estimasi Biaya: ${estimasiBiaya}\n\n` +
            `Mohon info lebih lanjut mengenai proses pemesanan. Terima kasih!`
        );
        return WHATSAPP_BASE_URL + message;
    }

    function hitungEstimasiDanPesan() {
        const luasArea = parseFloat(luasAreaInput.value);
        
        // Ambil elemen opsi yang dipilih untuk mendapatkan nama paket
        const selectedOption = paketDesainSelect.options[paketDesainSelect.selectedIndex];
        const hargaPerM2 = parseFloat(selectedOption.value);
        // Ambil nama paket dari data-name atau konten teks
        const packageName = selectedOption.getAttribute('data-name') || selectedOption.textContent;

        if (isNaN(luasArea) || luasArea <= 0) {
            alert("Mohon masukkan luas area yang valid (angka positif) sebelum memesan.");
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        const estimasiBiayaFormatted = formatRupiah(totalBiaya);
        
        // Tampilkan hasil perhitungan lagi (sebelum redirect)
        hasilBiayaSpan.textContent = estimasiBiayaFormatted;

        // Redirect ke WhatsApp dengan data terisi
        const whatsappLink = generateWhatsappLink(packageName, luasArea, estimasiBiayaFormatted);
        window.location.href = whatsappLink;
    }

    function hitungEstimasiAwal() {
         // Fungsi ini hanya untuk menampilkan hasil pertama kali saat load/input berubah tanpa redirect
        const luasArea = parseFloat(luasAreaInput.value);
        const hargaPerM2 = parseFloat(paketDesainSelect.value);

        if (isNaN(luasArea) || luasArea <= 0) {
            hasilBiayaSpan.textContent = "Masukkan luas area yang valid.";
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        hasilBiayaSpan.textContent = formatRupiah(totalBiaya);
    }
    
    // Fungsi untuk tombol di Daftar Harga (Pricing Table)
    document.querySelectorAll('.pesan-paket-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah pindah ke #
            const packageName = this.getAttribute('data-package-name');
            
            const message = encodeURIComponent(
                `Halo Ryuu Desain, saya tertarik dengan paket: ${packageName}. Mohon informasi harga dan proses selanjutnya. Terima kasih!`
            );
            
            window.location.href = WHATSAPP_BASE_URL + message;
        });
    });

    // Update Kontak Link umum dengan pesan default
    const defaultMessage = encodeURIComponent("Halo Ryuu Desain, saya ingin berkonsultasi mengenai jasa desain 2D dan 3D. Terima kasih.");
    document.getElementById('whatsappContactLink').href = WHATSAPP_BASE_URL + defaultMessage;
    // Update link di navbar
    document.querySelector('.btn-nav-kontak').href = WHATSAPP_BASE_URL + defaultMessage;
    
    // Event listener untuk tombol Kalkulator
    hitungBiayaBtn.addEventListener('click', hitungEstimasiDanPesan);

    // Hitung biaya pertama kali saat halaman dimuat dan saat input/select berubah
    hitungEstimasiAwal(); 
    luasAreaInput.addEventListener('input', hitungEstimasiAwal);
    paketDesainSelect.addEventListener('change', hitungEstimasiAwal);


    // 5. Scroll Reveal Animation (Intersection Observer)
    const fadeSections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Hilang ketika keluar dari viewport
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 
    });

    fadeSections.forEach(section => {
        observer.observe(section);
    });
});
