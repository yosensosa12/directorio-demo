// JAVASCRIPT PARA GOOGLE ADSENSE - FARMACIAS SANTIAGO TEMPLATE

/**
 * Configuración de Google AdSense
 * IMPORTANTE: Reemplaza los valores con tus propios IDs de AdSense
 */
const ADSENSE_CONFIG = {
    publisherId: 'ca-pub-XXXXXXXXXX', // 🔧 REEMPLAZAR con tu Publisher ID
    adUnits: {
        headerDesktop: 'XXXXXXXXXX', // 728x90 Header Desktop
        mobileHeader: 'XXXXXXXXXX', // 320x50 Mobile Header  
        sidebar: 'XXXXXXXXXX', // 300x250 Sidebar Desktop
        contentMiddle: 'XXXXXXXXXX', // 336x280 Content Middle
        mobileContent: 'XXXXXXXXXX', // 300x250 Mobile Content
        footer: 'XXXXXXXXXX' // 728x90 Footer Banner
    }
};

/**
 * Función para cargar el script principal de AdSense
 */
function loadAdSenseScript() {
    if (document.querySelector('script[src*="googlesyndication.com"]')) {
        return; // Ya está cargado
    }
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
}

/**
 * Función para crear un anuncio programáticamente
 */
function createAdUnit(containerId, slotId, sizes = 'auto', format = 'auto') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', ADSENSE_CONFIG.publisherId);
    ins.setAttribute('data-ad-slot', slotId);
    ins.setAttribute('data-ad-format', format);
    
    if (sizes !== 'auto') {
        ins.style.width = sizes.width + 'px';
        ins.style.height = sizes.height + 'px';
    } else {
        ins.setAttribute('data-full-width-responsive', 'true');
    }
    
    container.appendChild(ins);
    
    // Inicializar el anuncio
    (window.adsbygoogle = window.adsbygoogle || []).push({});
}

/**
 * Función para inicializar todos los anuncios
 */
function initializeAds() {
    // Verificar que AdSense esté disponible
    if (typeof window.adsbygoogle === 'undefined') {
        setTimeout(initializeAds, 1000);
        return;
    }
    
    // Crear anuncios según el dispositivo
    if (window.innerWidth >= 768) {
        // Desktop/Tablet
        createAdUnit('header-ad-container', ADSENSE_CONFIG.adUnits.headerDesktop);
        createAdUnit('sidebar-ad-container', ADSENSE_CONFIG.adUnits.sidebar);
        createAdUnit('content-ad-container', ADSENSE_CONFIG.adUnits.contentMiddle);
        createAdUnit('footer-ad-container', ADSENSE_CONFIG.adUnits.footer);
    } else {
        // Mobile
        createAdUnit('mobile-header-ad', ADSENSE_CONFIG.adUnits.mobileHeader);
        createAdUnit('mobile-content-ad', ADSENSE_CONFIG.adUnits.mobileContent);
    }
}

/**
 * Función para refrescar anuncios (útil para SPA)
 */
function refreshAds() {
    if (window.adsbygoogle) {
        window.adsbygoogle.forEach(function(ad) {
            try {
                ad.push({});
            } catch (e) {
                console.log('Error refreshing ad:', e);
            }
        });
    }
}

/**
 * Función para detectar bloqueadores de anuncios
 */
function detectAdBlocker() {
    const adTest = document.createElement('div');
    adTest.innerHTML = '&nbsp;';
    adTest.className = 'adsbox';
    adTest.style.position = 'absolute';
    adTest.style.left = '-9999px';
    document.body.appendChild(adTest);
    
    setTimeout(() => {
        const isBlocked = adTest.offsetHeight === 0;
        document.body.removeChild(adTest);
        
        if (isBlocked) {
            console.log('⚠️ AdBlocker detectado');
            showAdBlockerMessage();
        } else {
            console.log('✅ AdBlocker no detectado');
        }
    }, 100);
}

/**
 * Función para mostrar mensaje de adblocker
 */
function showAdBlockerMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #92400e;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Por favor, desactiva tu bloqueador de anuncios para apoyar este sitio gratuito 🙏</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; font-size: 16px; cursor: pointer; margin-left: 8px;">×</button>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remover automáticamente después de 10 segundos
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 10000);
}

/**
 * Función para optimizar la carga de anuncios basada en viewport
 */
function lazyLoadAds() {
    const adContainers = document.querySelectorAll('.ad-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.loaded) {
                const adId = entry.target.id;
                
                // Cargar anuncio específico basado en el ID del contenedor
                switch(adId) {
                    case 'ad-sidebar':
                        if (window.innerWidth >= 768) {
                            createAdUnit(adId, ADSENSE_CONFIG.adUnits.sidebar);
                        }
                        break;
                    case 'ad-content-middle':
                        createAdUnit(adId, ADSENSE_CONFIG.adUnits.contentMiddle);
                        break;
                    case 'ad-footer':
                        createAdUnit(adId, ADSENSE_CONFIG.adUnits.footer);
                        break;
                }
                
                entry.target.dataset.loaded = 'true';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    adContainers.forEach(container => observer.observe(container));
}

/**
 * Función para manejar el cambio de tamaño de ventana
 */
function handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recargar anuncios si cambió significativamente el tamaño
            const currentWidth = window.innerWidth;
            const isMobile = currentWidth < 768;
            
            // Lógica para recargar anuncios responsivos
            refreshAds();
        }, 250);
    });
}

/**
 * Función para registrar métricas de rendimiento de anuncios
 */
function trackAdPerformance() {
    // Registrar tiempo de carga inicial
    const startTime = performance.now();
    
    window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`📊 Tiempo de carga de anuncios: ${loadTime.toFixed(2)}ms`);
        
        // Enviar métricas a Google Analytics si está disponible
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_load_time', {
                'event_category': 'ads',
                'event_label': 'initial_load',
                'value': Math.round(loadTime)
            });
        }
    });
}

/**
 * Función para validar configuración de AdSense
 */
function validateAdSenseConfig() {
    const issues = [];
    
    if (!ADSENSE_CONFIG.publisherId || ADSENSE_CONFIG.publisherId === 'ca-pub-XXXXXXXXXX') {
        issues.push('Publisher ID no configurado');
    }
    
    Object.entries(ADSENSE_CONFIG.adUnits).forEach(([key, value]) => {
        if (!value || value === 'XXXXXXXXXX') {
            issues.push(`Ad Unit ${key} no configurado`);
        }
    });
    
    if (issues.length > 0) {
        console.warn('⚠️ Problemas de configuración AdSense:', issues);
        return false;
    }
    
    console.log('✅ Configuración AdSense válida');
    return true;
}

/**
 * Inicialización principal
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando AdSense para Farmacias Santiago...');
    
    // Validar configuración
    if (!validateAdSenseConfig()) {
        console.error('❌ Configuración AdSense incompleta. Revisa ADSENSE_CONFIG.');
        return;
    }
    
    // Cargar script principal
    loadAdSenseScript();
    
    // Detectar bloqueador de anuncios
    setTimeout(detectAdBlocker, 2000);
    
    // Inicializar anuncios después de un breve delay
    setTimeout(() => {
        initializeAds();
        lazyLoadAds();
        trackAdPerformance();
    }, 1000);
    
    // Manejar redimensionamiento
    handleResize();
    
    console.log('✅ AdSense inicializado correctamente');
});

/**
 * Función para debugging - mostrar información de anuncios
 */
function debugAdSense() {
    console.log('🔧 Debug AdSense:', {
        publisherId: ADSENSE_CONFIG.publisherId,
        adUnits: ADSENSE_CONFIG.adUnits,
        screenWidth: window.innerWidth,
        adsbygoogle: typeof window.adsbygoogle,
        adElements: document.querySelectorAll('.adsbygoogle').length
    });
}

// Exportar funciones para uso global
window.AdSense = {
    config: ADSENSE_CONFIG,
    init: initializeAds,
    refresh: refreshAds,
    debug: debugAdSense,
    detect: detectAdBlocker
};
