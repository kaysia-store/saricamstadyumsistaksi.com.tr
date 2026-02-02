document.addEventListener('DOMContentLoaded', () => {
    // Current Year Update
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Inject Modal into DOM
    const modalHTML = `
    <div id="locationModal" class="modal-overlay">
        <div class="modal-content">
            <h3 class="modal-title">Konum Paylaşmak İster misiniz?</h3>
            <p>Size en yakın aracımızı yönlendirebilmemiz için WhatsApp üzerinden konumunuzu paylaşabilirsiniz.</p>
            <div class="modal-actions">
                <button id="btnLocationYes" class="btn-modal btn-yes">📍 Evet, Paylaş</button>
                <button id="btnLocationNo" class="btn-modal btn-no">Hayır, Devam Et</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // WhatsApp Button Logic
    const whatsappBtns = document.querySelectorAll('.fab-whatsapp, .btn-header[href*="wa.me"], a[href*="wa.me"]');
    const modal = document.getElementById('locationModal');
    const btnYes = document.getElementById('btnLocationYes');
    const btnNo = document.getElementById('btnLocationNo');
    const PHONE_NUMBER = '905324745929';

    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    // Handle "No"
    btnNo.addEventListener('click', () => {
        window.location.href = `https://wa.me/${PHONE_NUMBER}`;
        modal.style.display = 'none';
    });

    // Handle "Yes" (Location)
    btnYes.addEventListener('click', () => {
        btnYes.textContent = 'Konum Alınıyor...';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
                    const message = `Merhaba, taksi çağırmak istiyorum. Konumum: ${mapLink}`;
                    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
                    window.location.href = url;
                    btnYes.textContent = '📍 Evet, Paylaş';
                    modal.style.display = 'none';
                },
                (error) => {
                    alert('Konum alınamadı veya izin verilmedi. Normal mesaj sayfasına yönlendiriliyorsunuz.');
                    window.location.href = `https://wa.me/${PHONE_NUMBER}`;
                    btnYes.textContent = '📍 Evet, Paylaş';
                    modal.style.display = 'none';
                }
            );
        } else {
            alert('Tarayıcınız konum özelliğini desteklemiyor.');
            window.location.href = `https://wa.me/${PHONE_NUMBER}`;
            modal.style.display = 'none';
        }
    });

    // Close modal if clicked outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
