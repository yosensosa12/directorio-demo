/**
 * Sistema de Directorios - License Checker
 * https://github.com/yosensosa12/directorio-demo
 * 
 * Copyright (c) 2025 Yosensosa
 * Uso bajo licencia - Ver LICENSE.md
 */

// Sistema simple de validación de licencia
(function() {
    // Dominios autorizados por defecto (versión demo)
    const allowedDomains = [
        'yosensosa12.github.io',
        'localhost',
        '127.0.0.1'
    ];
    
    // Licencias comerciales (ejemplo)
    const commercialLicenses = {
        'LICENSE-BASIC-12345': {
            customer: 'Demo User',
            type: 'BASIC',
            domains: ['cliente-ejemplo.com'],
            expiry: '2026-06-12'
        }
        // Más licencias se añadirían aquí
    };
    
    // Verificar si se está ejecutando en un dominio autorizado
    function checkDomain() {
        const currentDomain = window.location.hostname;
        
        // Check allowed domains first (for demo version)
        if (allowedDomains.includes(currentDomain)) {
            console.log('Ejecutando versión demo en dominio autorizado.');
            return true;
        }
        
        // Check for license key in localStorage
        const licenseKey = localStorage.getItem('directoryLicense');
        if (!licenseKey || !commercialLicenses[licenseKey]) {
            showLicenseWarning();
            return false;
        }
        
        // Check if license is valid for this domain
        const license = commercialLicenses[licenseKey];
        if (!license.domains.includes(currentDomain)) {
            showLicenseWarning('Este dominio no está autorizado para esta licencia.');
            return false;
        }
        
        // Check if license has expired
        const today = new Date();
        const expiryDate = new Date(license.expiry);
        if (today > expiryDate) {
            showLicenseWarning('La licencia ha expirado.');
            return false;
        }
        
        console.log(`Licencia válida: ${license.type} para ${license.customer}`);
        return true;
    }
    
    // Mostrar advertencia de licencia
    function showLicenseWarning(message = 'Este software requiere una licencia comercial para uso en este dominio.') {
        // Crear div de advertencia
        const warning = document.createElement('div');
        warning.style.position = 'fixed';
        warning.style.top = '0';
        warning.style.left = '0';
        warning.style.width = '100%';
        warning.style.padding = '10px';
        warning.style.backgroundColor = '#f44336';
        warning.style.color = 'white';
        warning.style.textAlign = 'center';
        warning.style.zIndex = '9999';
        warning.innerHTML = `
            <strong>ADVERTENCIA: USO NO AUTORIZADO</strong><br>
            ${message}<br>
            <a href="https://github.com/yosensosa12/directorio-demo" style="color:white;text-decoration:underline">
                Adquiera una licencia comercial aquí
            </a>
        `;
        
        // Añadir al DOM
        document.body.appendChild(warning);
        
        // Limitar funcionalidad (opcional)
        limitFunctionality();
    }
    
    // Limitar funcionalidad en versión no autorizada
    function limitFunctionality() {
        // Ejemplo: deshabilitar botones críticos después de 30 segundos
        setTimeout(() => {
            const actionButtons = document.querySelectorAll('button:not(.license-exempt)');
            actionButtons.forEach(button => {
                button.disabled = true;
                button.title = 'Requiere licencia comercial';
            });
            
            // Añadir marca de agua
            addWatermark();
        }, 30000);
    }
    
    // Añadir marca de agua
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.innerHTML = 'VERSIÓN NO AUTORIZADA';
        watermark.style.position = 'fixed';
        watermark.style.bottom = '10px';
        watermark.style.right = '10px';
        watermark.style.fontSize = '24px';
        watermark.style.color = 'rgba(255,0,0,0.5)';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '9999';
        watermark.style.transform = 'rotate(-45deg)';
        document.body.appendChild(watermark);
    }
    
    // Verificar en carga
    window.addEventListener('DOMContentLoaded', function() {
        checkDomain();
    });
    
    // Exponer función para activar licencia
    window.activateLicense = function(key) {
        if (commercialLicenses[key]) {
            localStorage.setItem('directoryLicense', key);
            alert('¡Licencia activada correctamente! Por favor recargue la página.');
            location.reload();
            return true;
        } else {
            alert('Clave de licencia inválida.');
            return false;
        }
    };
})();
