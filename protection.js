// 🔒 SISTEMA DE PROTECCIÓN AVANZADO PARA HTML
// Protege el código fuente de copia no autorizada

(function() {
    'use strict';
    
    // 1. DESACTIVAR CLIC DERECHO
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionAlert('Clic derecho deshabilitado');
        return false;
    });
    
    // 2. DESACTIVAR TECLAS DE DESARROLLADOR
    document.addEventListener('keydown', function(e) {
        // F12 - DevTools
        if (e.keyCode === 123) {
            e.preventDefault();
            showProtectionAlert('Herramientas de desarrollador bloqueadas');
            return false;
        }
        
        // Ctrl+Shift+I - DevTools
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showProtectionAlert('Inspeccionar elemento bloqueado');
            return false;
        }
        
        // Ctrl+Shift+J - Console
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showProtectionAlert('Consola bloqueada');
            return false;
        }
        
        // Ctrl+U - Ver código fuente
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showProtectionAlert('Ver código fuente bloqueado');
            return false;
        }
        
        // Ctrl+A - Seleccionar todo
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            showProtectionAlert('Seleccionar todo deshabilitado');
            return false;
        }
        
        // Ctrl+S - Guardar página
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showProtectionAlert('Guardar página bloqueado');
            return false;
        }
        
        // Ctrl+P - Imprimir
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showProtectionAlert('Imprimir bloqueado');
            return false;
        }
    });
    
    // 3. DESACTIVAR SELECCIÓN DE TEXTO
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 4. DETECTAR DEVTOOLS ABIERTO
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                showProtectionAlert('DevTools detectado - Redirigiendo...');
                setTimeout(() => {
                    window.location.href = 'about:blank';
                }, 2000);
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // 5. PREVENIR COPY/PASTE
    document.addEventListener('copy', function(e) {
        e.clipboardData.setData('text/plain', 'Copia protegida - Contacta al desarrollador');
        e.preventDefault();
        showProtectionAlert('Copia protegida');
    });
    
    // 6. OBSCURECER CÓDIGO EN CONSOLA
    console.log('%cALTO!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cEsta es una función del navegador destinada a desarrolladores. Si alguien te dijo que copies y pegues algo aquí para habilitar una función o "hackear" el sitio, es una estafa y te dará acceso a tu cuenta.', 'color: red; font-size: 16px;');
    console.log('%c🔒 Código protegido por medidas de seguridad', 'color: blue; font-size: 14px; font-weight: bold;');
    
    // 7. WATERMARK INVISIBLE
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.innerHTML = '<!-- DEMO PROTEGIDO - NO COPIAR -->';
        watermark.style.display = 'none';
        document.body.appendChild(watermark);
    }
    
    // 8. FUNCIÓN PARA MOSTRAR ALERTAS DE PROTECCIÓN
    function showProtectionAlert(message) {
        // Crear modal de alerta personalizado
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                animation: slideIn 0.3s ease-out;
            ">
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-shield-alt" style="margin-right: 8px; font-size: 18px;"></i>
                    ${message}
                </div>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    // 9. PROTECCIÓN CONTRA IFRAME
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // 10. VERIFICAR DOMINIO (opcional)
    function checkDomain() {
        const allowedDomains = ['localhost', '127.0.0.1', 'file://'];
        const currentDomain = window.location.hostname;
        
        if (!allowedDomains.includes(currentDomain) && !currentDomain.includes('github.io')) {
            // document.body.innerHTML = '<h1>Acceso no autorizado</h1>';
        }
    }
    
    // 11. OCULTAR CÓDIGO JAVASCRIPT
    function obfuscateConsole() {
        // Redefinir console.log para ocultar información sensible
        const originalLog = console.log;
        console.log = function() {
            // No mostrar logs internos
        };
    }
    
    // 12. DETECTAR HERRAMIENTAS DE SCRAPING
    function detectScraping() {
        const userAgent = navigator.userAgent.toLowerCase();
        const suspiciousAgents = ['wget', 'curl', 'scrapy', 'bot', 'crawler'];
        
        for (let agent of suspiciousAgents) {
            if (userAgent.includes(agent)) {
                document.body.innerHTML = '<h1>Acceso denegado</h1>';
                return;
            }
        }
    }
    
    // 13. MARCA DE TIEMPO Y SEGUIMIENTO
    function trackAccess() {
        const accessData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };
        
        // Aquí podrías enviar a un servidor de tracking
        console.log('Access tracked:', accessData);
    }
    
    // INICIALIZAR PROTECCIONES
    document.addEventListener('DOMContentLoaded', function() {
        addWatermark();
        checkDomain();
        obfuscateConsole();
        detectScraping();
        trackAccess();
        
        // Mensaje de bienvenida protegido
        showProtectionAlert('Demo protegido cargado ✅');
    });
    
    // 14. LIMPIAR REFERENCIAS DE FUNCIONES
    window.addEventListener('load', function() {
        // Eliminar referencias a funciones sensibles
        delete window.demoData;
        delete window.openModal;
        delete window.findNearMe;
    });
    
})();

// 15. CSS PARA DESACTIVAR SELECCIÓN (se agregará dinámicamente)
const protectionStyles = `
    <style>
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        
        img {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', protectionStyles);
