// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll handling
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const navContainer = document.querySelector('.nav-container');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navLinksContainer.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = navContainer ? navContainer.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active section highlighting
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Add shadow to nav on scroll
        if (window.scrollY > 10) {
            navContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navContainer.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Scroll animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for children elements
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Apply fade-in animation to sections
    sections.forEach(section => {
        section.classList.add('fade-in');
        fadeInObserver.observe(section);
    });
    
    // Apply subtle fade-in animations to grid items
    const gridItems = document.querySelectorAll('.tech-item, .response-item, .payment-item, .timeline-item');
    gridItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.transitionDelay = `${Math.min(index * 0.03, 0.3)}s`;
    });
    
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    gridItems.forEach(item => {
        gridObserver.observe(item);
    });
    
    
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();

    // -----------------------------
    // Signature pads and PDF export
    // -----------------------------

    function formatHumanDate(date) {
        const day = date.getDate();
        const monthNames = [
            'January','February','March','April','May','June','July','August','September','October','November','December'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function setupSignaturePad(opts) {
        const canvas = document.getElementById(opts.canvasId);
        const clearBtn = document.getElementById(opts.clearBtnId);
        const confirmBtn = document.getElementById(opts.confirmBtnId);
        const img = document.getElementById(opts.imgId);
        const dateSpan = document.getElementById(opts.dateSpanId);

        if (!canvas || !clearBtn || !confirmBtn || !img || !dateSpan) return;

        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#111827';

        // Handle device pixel ratio for crisp lines
        function resizeCanvas() {
            const ratio = Math.max(window.devicePixelRatio || 1, 1);
            const displayWidth = canvas.clientWidth || canvas.width;
            const displayHeight = canvas.clientHeight || canvas.height;
            canvas.width = displayWidth * ratio;
            canvas.height = displayHeight * ratio;
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            ctx.scale(ratio, ratio);
            ctx.lineWidth = 2;
        }

        // Initialize size based on attributes
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let isDrawing = false;
        let hasStroke = false;
        let lastX = 0;
        let lastY = 0;

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        function start(e) {
            isDrawing = true;
            hasStroke = true;
            const pos = getPos(e);
            lastX = pos.x; lastY = pos.y;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            e.preventDefault();
        }

        function move(e) {
            if (!isDrawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            lastX = pos.x; lastY = pos.y;
            e.preventDefault();
        }

        function end() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', start);
        canvas.addEventListener('mousemove', move);
        canvas.addEventListener('mouseup', end);
        canvas.addEventListener('mouseleave', end);
        canvas.addEventListener('touchstart', start, { passive: false });
        canvas.addEventListener('touchmove', move, { passive: false });
        canvas.addEventListener('touchend', end);

        clearBtn.addEventListener('click', function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hasStroke = false;
        });

        confirmBtn.addEventListener('click', function() {
            if (!hasStroke) {
                alert('Please provide a signature before confirming.');
                return;
            }
            const dataUrl = canvas.toDataURL('image/png');
            img.src = dataUrl;
            img.style.display = 'block';
            canvas.style.display = 'none';
            clearBtn.disabled = true;
            confirmBtn.disabled = true;
            if (opts.onConfirm) {
                opts.onConfirm();
            }
            const dateStr = formatHumanDate(new Date());
            dateSpan.textContent = dateStr;

            // Persist to localStorage
            try {
                if (opts.storageKeyPrefix) {
                    localStorage.setItem(`${opts.storageKeyPrefix}Signature`, dataUrl);
                    localStorage.setItem(`${opts.storageKeyPrefix}SignedDate`, dateStr);
                    if (opts.storageKeyPrefix === 'client') {
                        const nameInput = document.getElementById('client-name');
                        const titleInput = document.getElementById('client-title');
                        if (nameInput) localStorage.setItem('clientName', nameInput.value || '');
                        if (titleInput) localStorage.setItem('clientTitle', titleInput.value || '');
                    }
                }
            } catch (e) {
                // Ignore storage errors (private mode, quota, etc.)
            }
        });
    }

    // Client signature pad
    setupSignaturePad({
        canvasId: 'client-sign-canvas',
        clearBtnId: 'client-clear-btn',
        confirmBtnId: 'client-confirm-btn',
        imgId: 'client-sign-img',
        dateSpanId: 'client-date',
        storageKeyPrefix: 'client',
        onConfirm: function() {
            // Lock client name/title inputs after signing
            const nameInput = document.getElementById('client-name');
            const titleInput = document.getElementById('client-title');
            if (nameInput) nameInput.setAttribute('disabled', 'disabled');
            if (titleInput) titleInput.setAttribute('disabled', 'disabled');
        }
    });

    // Developer signature pad
    setupSignaturePad({
        canvasId: 'dev-sign-canvas',
        clearBtnId: 'dev-clear-btn',
        confirmBtnId: 'dev-confirm-btn',
        imgId: 'dev-sign-img',
        dateSpanId: 'dev-date',
        storageKeyPrefix: 'dev'
    });

    // Restore persisted signatures and client details
    (function restoreSignatures() {
        try {
            // Client
            const clientSig = localStorage.getItem('clientSignature');
            const clientDate = localStorage.getItem('clientSignedDate');
            const clientImg = document.getElementById('client-sign-img');
            const clientCanvas = document.getElementById('client-sign-canvas');
            const clientClear = document.getElementById('client-clear-btn');
            const clientConfirm = document.getElementById('client-confirm-btn');
            const clientDateSpan = document.getElementById('client-date');
            const nameInput = document.getElementById('client-name');
            const titleInput = document.getElementById('client-title');
            const storedName = localStorage.getItem('clientName');
            const storedTitle = localStorage.getItem('clientTitle');

            if (storedName && nameInput) nameInput.value = storedName;
            if (storedTitle && titleInput) titleInput.value = storedTitle;

            if (clientSig && clientImg && clientCanvas && clientClear && clientConfirm && clientDateSpan) {
                clientImg.src = clientSig;
                clientImg.style.display = 'block';
                clientCanvas.style.display = 'none';
                clientClear.disabled = true;
                clientConfirm.disabled = true;
                clientDateSpan.textContent = clientDate || clientDateSpan.textContent;
                if (nameInput) nameInput.setAttribute('disabled', 'disabled');
                if (titleInput) titleInput.setAttribute('disabled', 'disabled');
            }

            // Developer
            const devSig = localStorage.getItem('devSignature');
            const devDate = localStorage.getItem('devSignedDate');
            const devImg = document.getElementById('dev-sign-img');
            const devCanvas = document.getElementById('dev-sign-canvas');
            const devClear = document.getElementById('dev-clear-btn');
            const devConfirm = document.getElementById('dev-confirm-btn');
            const devDateSpan = document.getElementById('dev-date');

            if (devSig && devImg && devCanvas && devClear && devConfirm && devDateSpan) {
                devImg.src = devSig;
                devImg.style.display = 'block';
                devCanvas.style.display = 'none';
                devClear.disabled = true;
                devConfirm.disabled = true;
                devDateSpan.textContent = devDate || devDateSpan.textContent;
            }
        } catch (e) {
            // Ignore storage errors
        }
    })();

    // Export PDF
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async function() {
            const { jsPDF } = window.jspdf || {};
            if (!window.html2canvas || !jsPDF) {
                alert('PDF export libraries failed to load. Please check your connection and try again.');
                return;
            }

            const target = document.body;
            const canvas = await html2canvas(target, { scale: 2, useCORS: true, scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = canvas.height * pdfWidth / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('Software-Development-Agreement-SCENTMATIC.pdf');
        });
    }

    // Download client-signable HTML
    const downloadHtmlBtn = document.getElementById('download-client-html-btn');
    if (downloadHtmlBtn) {
        downloadHtmlBtn.addEventListener('click', function() {
            // Take current DOM snapshot but ensure client area is ready to sign and developer is embedded
            try {
                const docClone = document.documentElement.cloneNode(true);

                // Ensure developer signature is embedded (image shown, canvas hidden)
                const devSigData = localStorage.getItem('devSignature');
                const devDate = localStorage.getItem('devSignedDate');
                const devImgClone = docClone.querySelector('#dev-sign-img');
                const devCanvasClone = docClone.querySelector('#dev-sign-canvas');
                const devDateSpanClone = docClone.querySelector('#dev-date');
                const devClearBtnClone = docClone.querySelector('#dev-clear-btn');
                const devConfirmBtnClone = docClone.querySelector('#dev-confirm-btn');
                if (devSigData && devImgClone && devCanvasClone) {
                    devImgClone.setAttribute('src', devSigData);
                    devImgClone.setAttribute('style', 'display:block;');
                    devCanvasClone.setAttribute('style', 'display:none;');
                }
                if (devDate && devDateSpanClone) {
                    devDateSpanClone.textContent = devDate;
                }
                if (devClearBtnClone) devClearBtnClone.setAttribute('disabled', 'disabled');
                if (devConfirmBtnClone) devConfirmBtnClone.setAttribute('disabled', 'disabled');

                // Client area: keep canvas active for signing, enable inputs
                const clientImgClone = docClone.querySelector('#client-sign-img');
                const clientCanvasClone = docClone.querySelector('#client-sign-canvas');
                const clientClearBtnClone = docClone.querySelector('#client-clear-btn');
                const clientConfirmBtnClone = docClone.querySelector('#client-confirm-btn');
                const clientDateSpanClone = docClone.querySelector('#client-date');
                const clientNameClone = docClone.querySelector('#client-name');
                const clientTitleClone = docClone.querySelector('#client-title');
                const storedClientName = localStorage.getItem('clientName') || '';
                const storedClientTitle = localStorage.getItem('clientTitle') || '';

                if (clientImgClone) clientImgClone.setAttribute('style', 'display:none;');
                if (clientCanvasClone) clientCanvasClone.setAttribute('style', 'display:block;');
                if (clientClearBtnClone) clientClearBtnClone.removeAttribute('disabled');
                if (clientConfirmBtnClone) clientConfirmBtnClone.removeAttribute('disabled');
                if (clientDateSpanClone) clientDateSpanClone.textContent = '_____________';
                if (clientNameClone) {
                    clientNameClone.removeAttribute('disabled');
                    clientNameClone.setAttribute('value', storedClientName);
                }
                if (clientTitleClone) {
                    clientTitleClone.removeAttribute('disabled');
                    clientTitleClone.setAttribute('value', storedClientTitle);
                }

                // Remove this export/download button from the client copy
                const exportBtnClone = docClone.querySelector('#export-pdf-btn');
                const downloadBtnClone = docClone.querySelector('#download-client-html-btn');
                if (exportBtnClone && exportBtnClone.parentNode) exportBtnClone.parentNode.removeChild(exportBtnClone);
                if (downloadBtnClone && downloadBtnClone.parentNode) downloadBtnClone.parentNode.removeChild(downloadBtnClone);

                // Serialize and download
                const serializer = new XMLSerializer();
                let htmlString = serializer.serializeToString(docClone);

                // Add a simple note in the <title> for recipient clarity
                htmlString = htmlString.replace('<title>', '<title>[Client-Signable] ');

                const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Agreement-for-Client-Signature.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (e) {
                alert('Unable to generate the client-signable file in this browser.');
            }
        });
    }
});

// Add fade-in styles dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in-child {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-child.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);