// ✅ TEMPLATE FARMACIAS SANTIAGO - BASE PARA GITHUB
// Configuración global
const CONFIG = {
    DEFAULT_IMAGE: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/pharmacy-71.png',
    PROXY_IMAGE: 'https://images.weserv.nl/?url=',
    FALLBACK_PROXY: 'https://api.allorigins.win/raw?url=',
    ITEMS_PER_PAGE: 9
};

// Variables globales
let todasLasFarmacias = [];
let farmaciasFiltradas = [];
let paginaActual = 1;
let imagenesCargadas = new Map(); // Cache de imágenes cargadas

// Función para probar la conectividad de los proxies
async function testProxyConnectivity() {
    console.log('🔍 Probando conectividad de proxies...');
    
    // URL de prueba (imagen pequeña de Google)
    const testImageUrl = 'https://lh3.googleusercontent.com/p/AF1QipN6SB9FcPniYwxU3vTavJpK6K3R6GIzWAkjc5jS=w426-h240-k-no';
    
    const proxies = [
        { name: 'WeServ', url: CONFIG.PROXY_IMAGE },
        { name: 'AllOrigins', url: CONFIG.FALLBACK_PROXY }
    ];
    
    for (const proxy of proxies) {
        try {
            const proxyUrl = proxy.url + encodeURIComponent(testImageUrl);
            const response = await fetch(proxyUrl, { method: 'HEAD', timeout: 5000 });
            
            if (response.ok) {
                console.log(`✅ Proxy ${proxy.name} funcionando correctamente`);
            } else {
                console.log(`⚠️ Proxy ${proxy.name} respondió con estado: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Proxy ${proxy.name} falló:`, error.message);
        }
    }
}

// Cargar y mostrar farmacias
async function cargarFarmacias() {
    const loadingElement = document.getElementById('loadingIndicator');
    const noResultsElement = document.getElementById('noResults');
    
    try {
        console.log('🚀 Iniciando carga de farmacias...');
        
        // Mostrar loading
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
            loadingElement.classList.add('flex');
        }
        if (noResultsElement) noResultsElement.classList.add('hidden');
          
        // Probar conectividad de proxies primero
        await testProxyConnectivity();
        
        const response = await fetch('db/farmacias.json');
        todasLasFarmacias = await response.json();
        farmaciasFiltradas = [...todasLasFarmacias];
        console.log('✅ Datos cargados:', todasLasFarmacias.length, 'farmacias');
        
        // Contar farmacias con imágenes
        const farmaciasConImagenes = todasLasFarmacias.filter(f => 
            f['Imagen Url'] && f['Imagen Url'] !== 'undefined' && f['Imagen Url'] !== 'null' && f['Imagen Url'].trim() !== ''
        ).length;
        console.log(`📸 Farmacias con imágenes: ${farmaciasConImagenes} de ${todasLasFarmacias.length}`);
        
        // Poblar filtros
        poblarFiltros();
        
        // Ocultar loading
        if (loadingElement) {
            loadingElement.classList.add('hidden');
            loadingElement.classList.remove('flex');
        }
        
        mostrarFarmacias();
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        console.log('Detalles del error:', error.message);
        
        // Mostrar estado de error
        if (loadingElement) {
            loadingElement.classList.add('hidden');
            loadingElement.classList.remove('flex');
        }
        if (noResultsElement) {
            noResultsElement.classList.remove('hidden');
            document.querySelector('#noResults h3').textContent = 'Error al cargar datos';
            document.querySelector('#noResults p').textContent = 'Por favor, intenta recargar la página';
        }
    }
}

function mostrarFarmacias(farmacias = farmaciasFiltradas) {
    const contenedor = document.getElementById('farmaciasContainer');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');
    
    if (!contenedor) {
        console.error('❌ Contenedor de farmacias no encontrado');
        return;
    }
    
    // Actualizar contador
    if (resultCount) {
        resultCount.textContent = farmacias.length;
    }
    
    // Mostrar mensaje si no hay resultados
    if (farmacias.length === 0) {
        contenedor.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        return;
    } else {
        if (noResults) noResults.classList.add('hidden');
    }
    
    contenedor.innerHTML = farmacias.map(farmacia => crearTarjetaFarmacia(farmacia)).join('');
    
    // Agregar event listeners a las tarjetas
    contenedor.querySelectorAll('.farmacia-card').forEach((tarjeta, index) => {
        tarjeta.addEventListener('click', () => mostrarModalFarmacia(farmacias[index]));
    });
}

function crearTarjetaFarmacia(farmacia) {
    const nombre = farmacia['Nombre Farmacia'] || farmacia.nombre || 'Farmacia';
    const direccion = farmacia['Direccion'] || farmacia.direccion || 'Dirección no disponible';
    const comuna = farmacia['Comuna'] || farmacia.comuna || '';
    const telefono = farmacia['Telefono'] || farmacia.telefono || '';
    const cadena = farmacia['Cadena'] || farmacia.cadena || 'Independiente';
    const horarios = farmacia['Horarios'] || farmacia.horarios || '';
    const servicios = farmacia['Servicios'] || farmacia.servicios || '';
    const imagen = farmacia['Imagen Url'] || farmacia.imagen || CONFIG.DEFAULT_IMAGE;
    const rating = farmacia['Rating'] || farmacia.rating || 0;
    
    // Determinar si está abierta 24 horas
    const es24Horas = horarios.toLowerCase().includes('24') || servicios.toLowerCase().includes('24');
    
    // Determinar si tiene delivery
    const tieneDelivery = servicios.toLowerCase().includes('delivery') || servicios.toLowerCase().includes('domicilio');
    
    return `
        <div class="farmacia-card bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div class="relative">
                <img 
                    src="${obtenerImagenOptimizada(imagen)}" 
                    alt="Farmacia ${nombre}"
                    class="w-full h-48 object-cover"
                    onerror="this.src='${CONFIG.DEFAULT_IMAGE}'"
                    loading="lazy"
                >
                ${es24Horas ? '<div class="status-24h absolute top-2 right-2">24H</div>' : ''}
                ${tieneDelivery ? '<div class="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold"><i class="fas fa-truck mr-1"></i>Delivery</div>' : ''}
            </div>
            
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-xl font-bold text-gray-800 line-clamp-2">${nombre}</h3>
                    ${rating > 0 ? `
                        <div class="flex items-center ml-2">
                            <span class="text-yellow-500">★</span>
                            <span class="text-sm text-gray-600 ml-1">${rating}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex items-start">
                        <i class="fas fa-map-marker-alt text-green-500 mr-2 mt-1 flex-shrink-0"></i>
                        <span class="line-clamp-2">${direccion}${comuna ? `, ${comuna}` : ''}</span>
                    </div>
                    
                    ${telefono ? `
                        <div class="flex items-center">
                            <i class="fas fa-phone text-green-500 mr-2"></i>
                            <span>${telefono}</span>
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center">
                        <i class="fas fa-building text-green-500 mr-2"></i>
                        <span class="font-medium">${cadena}</span>
                    </div>
                    
                    ${horarios ? `
                        <div class="flex items-center">
                            <i class="fas fa-clock text-green-500 mr-2"></i>
                            <span class="line-clamp-1">${horarios}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-500">Ver detalles</span>
                        <i class="fas fa-chevron-right text-green-500"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function mostrarModalFarmacia(farmacia) {
    const modal = document.getElementById('pharmacyModal');
    const modalContent = modal.querySelector('.modal-content');
    
    const nombre = farmacia['Nombre Farmacia'] || farmacia.nombre || 'Farmacia';
    const direccion = farmacia['Direccion'] || farmacia.direccion || 'Dirección no disponible';
    const comuna = farmacia['Comuna'] || farmacia.comuna || '';
    const telefono = farmacia['Telefono'] || farmacia.telefono || '';
    const email = farmacia['Email'] || farmacia.email || '';
    const website = farmacia['Website'] || farmacia.website || '';
    const cadena = farmacia['Cadena'] || farmacia.cadena || 'Independiente';
    const horarios = farmacia['Horarios'] || farmacia.horarios || '';
    const servicios = farmacia['Servicios'] || farmacia.servicios || '';
    const descripcion = farmacia['Descripcion'] || farmacia.descripcion || '';
    const imagen = farmacia['Imagen Url'] || farmacia.imagen || CONFIG.DEFAULT_IMAGE;
    const rating = farmacia['Rating'] || farmacia.rating || 0;
    const lat = farmacia['Latitud'] || farmacia.lat;
    const lng = farmacia['Longitud'] || farmacia.lng;
    
    modalContent.innerHTML = `
        <div class="relative">
            <!-- Header del Modal -->
            <div class="flex justify-between items-start p-6 border-b border-gray-200">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${nombre}</h2>
                    <p class="text-gray-600 mt-1">${cadena}</p>
                </div>
                <button onclick="cerrarModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            
            <!-- Contenido del Modal -->
            <div class="p-6 max-h-96 overflow-y-auto">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Información Principal -->
                    <div class="space-y-4">
                        ${rating > 0 ? `
                            <div class="flex items-center">
                                <div class="flex text-yellow-500 mr-2">
                                    ${Array.from({length: 5}, (_, i) => 
                                        `<span class="${i < Math.floor(rating) ? 'fas' : 'far'} fa-star"></span>`
                                    ).join('')}
                                </div>
                                <span class="text-gray-600">${rating} estrellas</span>
                            </div>
                        ` : ''}
                        
                        <div class="space-y-3">
                            <div class="flex items-start">
                                <i class="fas fa-map-marker-alt text-green-500 mr-3 mt-1"></i>
                                <div>
                                    <p class="font-medium text-gray-800">Dirección</p>
                                    <p class="text-gray-600">${direccion}${comuna ? `, ${comuna}` : ''}</p>
                                </div>
                            </div>
                            
                            ${telefono ? `
                                <div class="flex items-center">
                                    <i class="fas fa-phone text-green-500 mr-3"></i>
                                    <div>
                                        <p class="font-medium text-gray-800">Teléfono</p>
                                        <a href="tel:${telefono}" class="text-green-600 hover:text-green-700">${telefono}</a>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${email ? `
                                <div class="flex items-center">
                                    <i class="fas fa-envelope text-green-500 mr-3"></i>
                                    <div>
                                        <p class="font-medium text-gray-800">Email</p>
                                        <a href="mailto:${email}" class="text-green-600 hover:text-green-700">${email}</a>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${website ? `
                                <div class="flex items-center">
                                    <i class="fas fa-globe text-green-500 mr-3"></i>
                                    <div>
                                        <p class="font-medium text-gray-800">Sitio Web</p>
                                        <a href="${website}" target="_blank" class="text-green-600 hover:text-green-700">Visitar sitio web</a>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${horarios ? `
                                <div class="flex items-start">
                                    <i class="fas fa-clock text-green-500 mr-3 mt-1"></i>
                                    <div>
                                        <p class="font-medium text-gray-800">Horarios</p>
                                        <p class="text-gray-600">${horarios}</p>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${servicios ? `
                                <div class="flex items-start">
                                    <i class="fas fa-pills text-green-500 mr-3 mt-1"></i>
                                    <div>
                                        <p class="font-medium text-gray-800">Servicios</p>
                                        <p class="text-gray-600">${servicios}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${descripcion ? `
                            <div class="border-t pt-4">
                                <p class="font-medium text-gray-800 mb-2">Descripción</p>
                                <p class="text-gray-600 leading-relaxed">${descripcion}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Imagen y Mapa -->
                    <div class="space-y-4">
                        <img 
                            src="${obtenerImagenOptimizada(imagen)}" 
                            alt="Farmacia ${nombre}"
                            class="w-full h-48 object-cover rounded-lg"
                            onerror="this.src='${CONFIG.DEFAULT_IMAGE}'"
                        >
                        
                        ${lat && lng ? `
                            <div>
                                <p class="font-medium text-gray-800 mb-2">Ubicación</p>
                                <div id="modalMap" class="h-48 rounded-lg border border-gray-200"></div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Footer del Modal -->
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div class="flex space-x-3">
                    ${telefono ? `
                        <a href="tel:${telefono}" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-phone mr-2"></i>Llamar
                        </a>
                    ` : ''}
                    ${lat && lng ? `
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                           target="_blank" 
                           class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-directions mr-2"></i>Cómo llegar
                        </a>
                    ` : ''}
                </div>
                <button onclick="cerrarModal()" class="text-gray-500 hover:text-gray-700 px-4 py-2">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Inicializar mapa si hay coordenadas
    if (lat && lng) {
        setTimeout(() => inicializarMapaMModal(lat, lng, nombre), 100);
    }
}

function cerrarModal() {
    const modal = document.getElementById('pharmacyModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function inicializarMapaMModal(lat, lng, nombre) {
    try {
        const mapContainer = document.getElementById('modalMap');
        if (!mapContainer) return;
        
        // Crear mapa
        const map = L.map('modalMap').setView([lat, lng], 16);
        
        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Agregar marcador
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(nombre)
            .openPopup();
            
    } catch (error) {
        console.error('Error al inicializar mapa del modal:', error);
    }
}

function obtenerImagenOptimizada(imagenUrl) {
    if (!imagenUrl || imagenUrl === 'undefined' || imagenUrl === 'null' || imagenUrl.trim() === '') {
        return CONFIG.DEFAULT_IMAGE;
    }
    
    // Si ya está en caché, usar esa versión
    if (imagenesCargadas.has(imagenUrl)) {
        return imagenesCargadas.get(imagenUrl);
    }
    
    // Si es una imagen de Google Photos/Maps, usar proxy
    if (imagenUrl.includes('googleusercontent.com') || imagenUrl.includes('maps.googleapis.com')) {
        const imagenProxificada = CONFIG.PROXY_IMAGE + encodeURIComponent(imagenUrl);
        imagenesCargadas.set(imagenUrl, imagenProxificada);
        return imagenProxificada;
    }
    
    // Para otras URLs, usar directamente
    imagenesCargadas.set(imagenUrl, imagenUrl);
    return imagenUrl;
}

function poblarFiltros() {
    poblarComuna();
    // Los otros filtros ya están predefinidos en el HTML
}

function poblarComuna() {
    const comunaSelect = document.getElementById('comunaFilter');
    if (!comunaSelect || !todasLasFarmacias.length) return;
    
    const comunas = [...new Set(todasLasFarmacias
        .map(f => f['Comuna'] || f.comuna)
        .filter(c => c && c.trim() !== '')
    )].sort();
    
    // Limpiar opciones existentes (excepto la primera)
    while (comunaSelect.children.length > 1) {
        comunaSelect.removeChild(comunaSelect.lastChild);
    }
    
    comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
    });
}

function filtrarFarmacias() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const comunaFilter = document.getElementById('comunaFilter').value;
    const servicioFilter = document.getElementById('servicioFilter').value;
    const cadenaFilter = document.getElementById('cadenaFilter').value;
    
    farmaciasFiltradas = todasLasFarmacias.filter(farmacia => {
        const nombre = (farmacia['Nombre Farmacia'] || farmacia.nombre || '').toLowerCase();
        const direccion = (farmacia['Direccion'] || farmacia.direccion || '').toLowerCase();
        const comuna = farmacia['Comuna'] || farmacia.comuna || '';
        const servicios = (farmacia['Servicios'] || farmacia.servicios || '').toLowerCase();
        const cadena = (farmacia['Cadena'] || farmacia.cadena || '').toLowerCase();
        const horarios = (farmacia['Horarios'] || farmacia.horarios || '').toLowerCase();
        
        // Filtro de búsqueda de texto
        const matchesSearch = !searchInput || 
            nombre.includes(searchInput) || 
            direccion.includes(searchInput) ||
            comuna.toLowerCase().includes(searchInput);
        
        // Filtro de comuna
        const matchesComuna = !comunaFilter || comuna === comunaFilter;
        
        // Filtro de servicio
        let matchesServicio = true;
        if (servicioFilter) {
            switch (servicioFilter) {
                case '24horas':
                    matchesServicio = horarios.includes('24') || servicios.includes('24');
                    break;
                case 'delivery':
                    matchesServicio = servicios.includes('delivery') || servicios.includes('domicilio');
                    break;
                case 'receta':
                    matchesServicio = servicios.includes('receta') || servicios.includes('prescripción');
                    break;
                case 'sin-receta':
                    matchesServicio = servicios.includes('sin receta') || servicios.includes('libre');
                    break;
                case 'medicamentos-controlados':
                    matchesServicio = servicios.includes('controlados') || servicios.includes('psicotrópicos');
                    break;
            }
        }
        
        // Filtro de cadena
        const matchesCadena = !cadenaFilter || cadena.includes(cadenaFilter.toLowerCase());
        
        return matchesSearch && matchesComuna && matchesServicio && matchesCadena;
    });
    
    mostrarFarmacias();
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('comunaFilter').value = '';
    document.getElementById('servicioFilter').value = '';
    document.getElementById('cadenaFilter').value = '';
    
    farmaciasFiltradas = [...todasLasFarmacias];
    mostrarFarmacias();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación Farmacias Santiago...');
    
    // Cargar farmacias
    cargarFarmacias();
    
    // Event listeners para filtros
    const searchInput = document.getElementById('searchInput');
    const comunaFilter = document.getElementById('comunaFilter');
    const servicioFilter = document.getElementById('servicioFilter');
    const cadenaFilter = document.getElementById('cadenaFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    if (searchInput) {
        searchInput.addEventListener('input', filtrarFarmacias);
    }
    
    if (comunaFilter) {
        comunaFilter.addEventListener('change', filtrarFarmacias);
    }
    
    if (servicioFilter) {
        servicioFilter.addEventListener('change', filtrarFarmacias);
    }
    
    if (cadenaFilter) {
        cadenaFilter.addEventListener('change', filtrarFarmacias);
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', limpiarFiltros);
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Cerrar modal haciendo click fuera
    const modal = document.getElementById('pharmacyModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }
    
    console.log('✅ Aplicación inicializada correctamente');
});
