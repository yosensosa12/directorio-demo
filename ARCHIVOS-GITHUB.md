# 📁 Archivos para GitHub Pages - Lista Completa

## ✅ ARCHIVOS OBLIGATORIOS (Funcionalidad básica)

### 📄 Archivos principales:
- `demo.html` ← **ARCHIVO PRINCIPAL DEL DEMO**
- `README.md` ← Descripción del proyecto (usar README-GITHUB.md)

### 📁 Carpeta `js/` (JavaScript):
- `js/protection.js` ← Sistema de protección anti-copia
- `js/farmacias.js` ← Lógica principal (si la usa demo.html)

### 📁 Carpeta `db/` (Base de datos):
- `db/farmacias.json` ← Datos de ejemplo para el demo

### 📁 Carpeta `css/` (Estilos):
- `css/adsense.css` ← Estilos adicionales

---

## 🌟 ARCHIVOS RECOMENDADOS (SEO y funcionalidad avanzada)

### 🔧 Archivos de configuración:
- `manifest.json` ← PWA (Progressive Web App)
- `robots.txt` ← SEO - Instrucciones para buscadores
- `sitemap.xml` ← SEO - Mapa del sitio
- `ads.txt` ← Monetización AdSense

---

## ❌ ARCHIVOS QUE NO SUBIR (Scripts locales y documentación interna)

### 🐍 Scripts Python (solo para desarrollo local):
- `aplicar-proteccion.py` ← Script de automatización local
- `crear-deployment.py` ← Script de despliegue local

### 📚 Documentación interna:
- `PROTECCION-GUIA.md` ← Documentación interna
- `TEMPLATE-COMPLETADO.md` ← Notas de desarrollo
- `QUICK-START.md` ← Guía interna
- `GITHUB-PAGES-SETUP.md` ← Instrucciones de setup

### 🔄 Archivos duplicados:
- `demo-protected.html` ← Versión alternativa (ya tienes demo.html)
- `index.html` ← Si no lo necesitas (demo.html es principal)
- `README-GITHUB.md` ← Renombrar a README.md

---

## 🎯 ESTRUCTURA FINAL RECOMENDADA PARA GITHUB:

```
directorio-demo/
├── demo.html              ← Archivo principal
├── README.md              ← Descripción del proyecto
├── manifest.json          ← PWA
├── robots.txt             ← SEO
├── sitemap.xml            ← SEO
├── ads.txt               ← AdSense
├── js/
│   ├── protection.js     ← Protección
│   └── farmacias.js      ← Lógica (opcional)
├── css/
│   └── adsense.css       ← Estilos
└── db/
    └── farmacias.json    ← Datos demo
```

---

## 🚀 PASOS PARA SUBIR:

### 1️⃣ Renombrar archivo README:
```powershell
Copy-Item "README-GITHUB.md" "README.md"
```

### 2️⃣ Seleccionar y subir solo estos archivos:
- ✅ demo.html
- ✅ README.md (renombrado)
- ✅ manifest.json
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ ads.txt
- ✅ Carpeta completa: js/
- ✅ Carpeta completa: css/
- ✅ Carpeta completa: db/

### 3️⃣ URL final del demo:
```
https://TU-USUARIO.github.io/directorio-demo/demo.html
```

---

## 💡 CONSEJOS PRO:

1. **Para URL más corta**: Renombra `demo.html` → `index.html`
   - URL quedará: `https://TU-USUARIO.github.io/directorio-demo/`

2. **Para mejor SEO**: Incluye todos los archivos recomendados

3. **Para máxima protección**: Solo sube los archivos esenciales

## 📊 RESUMEN POR TAMAÑO:

**MÍNIMO (Solo funcionalidad)**: 6 archivos
- demo.html, README.md, js/, css/, db/ (con sus contenidos)

**COMPLETO (Recomendado)**: 10 archivos
- Todo lo anterior + manifest.json, robots.txt, sitemap.xml, ads.txt

**TOTAL ACTUAL**: 18 archivos (muchos innecesarios para GitHub)
