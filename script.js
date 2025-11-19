document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('header');
    
    // Variabel dan Konfigurasi WhatsApp
    const WHATSAPP_NUMBER = '6281902851525'; 
    const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;
    
    // Default message untuk link kontak umum
    const defaultMessage = encodeURIComponent("Halo Ryuu Desain, saya ingin berkonsultasi mengenai jasa desain 2D dan 3D. Terima kasih.");

    // Variabel Kalkulator
    const luasAreaInput = document.getElementById('luasArea');
    const paketDesainSelect = document.getElementById('paketDesain');
    const hitungBiayaBtn = document.getElementById('hitungBiaya');
    const hasilBiayaSpan = document.getElementById('hasilBiaya');
    
    // 1. Fungsi Menu Mobile (Hamburger) & Animasi Ikon
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Logika Mengubah Ikon
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Ubah ke ikon silang
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Kembalikan ke ikon garis tiga
            }
        });
    }

    // 2. Tutup Menu saat Link Diklik (di Mobile)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            // Cek apakah menu sedang aktif sebelum menutup
            if (navMenu.classList.contains('active')) {
                 navMenu.classList.remove('active');
                 
                 // Pastikan ikon kembali ke garis tiga setelah ditutup
                 const icon = menuToggle.querySelector('i');
                 icon.classList.remove('fa-times');
                 icon.classList.add('fa-bars');
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

    // 4. Utilitas Format Rupiah
    function formatRupiah(angka) {
        const rupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
        return rupiah;
    }

    // 5. Logika Kalkulator dan Redirect WhatsApp
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

    function hitungEstimasiDanPesan(e) { 
        e.preventDefault(); // PENTING: Mencegah perilaku default button
        
        const luasArea = parseFloat(luasAreaInput.value);
        const selectedOption = paketDesainSelect.options[paketDesainSelect.selectedIndex];
        const hargaPerM2 = parseFloat(selectedOption.value);
        const packageName = selectedOption.getAttribute('data-name') || selectedOption.textContent;

        if (isNaN(luasArea) || luasArea <= 0) {
            alert("Mohon masukkan luas area yang valid (angka positif) sebelum memesan.");
            hasilBiayaSpan.textContent = "Area Invalid";
            return;
        }

        const totalBiaya = luasArea * hargaPerM2;
        const estimasiBiayaFormatted = formatRupiah(totalBiaya);
        
        // Tampilkan hasil perhitungan
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
    
    // Event listener untuk tombol Kalkulator
    hitungBiayaBtn.addEventListener('click', hitungEstimasiDanPesan);

    // Hitung biaya pertama kali saat halaman dimuat dan saat input/select berubah
    hitungEstimasiAwal(); 
    luasAreaInput.addEventListener('input', hitungEstimasiAwal);
    paketDesainSelect.addEventListener('change', hitungEstimasiAwal);
    
    // 6. Listener untuk Tombol Daftar Harga (Pesan Sekarang)
    document.querySelectorAll('.pesan-paket-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // PENTING: Mencegah perilaku default link
            const packageName = this.getAttribute('data-package-name');
            
            const message = encodeURIComponent(
                `Halo Ryuu Desain, saya tertarik dengan paket: ${packageName}. Mohon informasi harga dan proses selanjutnya. Terima kasih!`
            );
            
            window.location.href = WHATSAPP_BASE_URL + message;
        });
    });

    // 7. Listener untuk Semua Link Kontak WA Umum (Navbar, Footer, Floating)
    document.querySelectorAll('.wa-contact-link, #whatsappContactLink').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // PENTING: Mencegah perilaku default link
            window.location.href = WHATSAPP_BASE_URL + defaultMessage;
        });
    });

    // 8. Scroll Reveal Animation (Intersection Observer)
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
