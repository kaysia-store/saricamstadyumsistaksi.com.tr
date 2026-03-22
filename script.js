// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // PWA Install Prompt Logic
    let deferredPrompt;
    const floatingActions = document.querySelector('.floating-actions');

    // Create Install Button (Hidden by default)
    if (floatingActions) {
        const installBtn = document.createElement('button');
        installBtn.id = 'btnInstallPWA';
        installBtn.className = 'fab fab-call'; // Reuse style for circular shape
        installBtn.style.display = 'none';
        installBtn.style.backgroundColor = '#0d1b2a'; // Dark color for distinction
        installBtn.style.color = '#f7b500'; // Yellow icon
        installBtn.style.border = 'none';
        installBtn.style.cursor = 'pointer';
        installBtn.setAttribute('aria-label', 'Uygulamayı Yükle');

        // Download Icon SVG
        installBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;

        // Insert as first item
        floatingActions.insertBefore(installBtn, floatingActions.firstChild);

        // Listen for install availability
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'flex';

            // Show Hero Button if available
            const heroBtn = document.getElementById('heroInstallBtn');
            if (heroBtn) {
                heroBtn.style.display = 'inline-block';

                heroBtn.addEventListener('click', () => {
                    heroBtn.style.display = 'none';
                    installBtn.style.display = 'none';
                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('User accepted the install prompt');
                            }
                            deferredPrompt = null;
                        });
                    }
                });
            }
        });

        // Click handler for floating button
        installBtn.addEventListener('click', (e) => {
            installBtn.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }

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
    const whatsappBtns = document.querySelectorAll('.fab-whatsapp, .btn-header[href*="wa.me"], a[href*="wa.me"], #mpBtnWhatsapp');
    const modal = document.getElementById('locationModal');
    const btnYes = document.getElementById('btnLocationYes');
    const btnNo = document.getElementById('btnLocationNo');
    const PHONE_NUMBER = '905301309101';

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
