# Reto 30 Días — Planificador de Transformación

Aplicación web instalable (PWA) con entrenamiento diario en casa, alimentación colombiana,
seguimiento de medidas/fotos y todo tu progreso guardado en tu propio celular.

## Qué es real aquí (y qué no)

✅ **Persistencia real**: el progreso se guarda con `localStorage` (checklists, pesos, medidas,
racha, logros, comidas libres) y con `IndexedDB` (fotos de progreso), directamente en tu navegador.
No se pierde al cerrar la app, cerrar el navegador o reiniciar el teléfono. Solo se borraría si
desinstalas la app o borras manualmente los datos del navegador para este sitio.

✅ **Instalable como PWA real**: incluye `manifest.json`, Service Worker (`public/sw.js`) e íconos.
Una vez publicada en una URL (paso 3 más abajo), puedes agregarla a la pantalla de inicio en
Android e iPhone y se abre en modo standalone, como una app.

⚠️ **Importante sobre "abrirla ya mismo desde tu celular"**: una PWA necesita estar servida desde
una URL (http/https) para poder instalarse — no se puede "agregar a inicio" un archivo suelto en tu
computador. Por eso el paso 3 (publicar gratis) es el que te da el enlace real para instalarla.

⚠️ Los datos viven **en el navegador de ese celular específico**. Si cambias de teléfono o borras
los datos del navegador, necesitas restaurar desde una copia de seguridad (ver más abajo). Por eso
la app incluye exportar/importar respaldo en **Progreso → Respaldo**.

---

## 1. Ejecutarla en tu computador (para probar)

Necesitas tener [Node.js](https://nodejs.org) instalado (versión 18 o superior).

```bash
cd reto30-app
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`). Ahí puedes usar
la app y probar todo. El Service Worker/instalación completa se ve mejor en el paso 2 o 3
(build de producción), porque en modo desarrollo algunos navegadores no lo activan igual.

Para generar la versión de producción localmente:

```bash
npm run build
npm run preview
```

`npm run preview` te da una URL local servida como si fuera producción (ahí sí puedes probar el
"Agregar a pantalla de inicio" desde el celular, si tu celular está en la misma red Wi-Fi que tu
computador y usas la IP que te muestre la terminal en vez de "localhost").

---

## 2. Instalarla en tu celular ("Agregar a pantalla de inicio")

Una vez la app esté publicada en una URL (ver paso 3), ábrela desde el navegador del celular:

**Android (Chrome):**
1. Abre el enlace de tu app.
2. Toca el menú (⋮) arriba a la derecha.
3. Toca **"Agregar a pantalla de inicio"** o **"Instalar aplicación"**.
4. Confirma. Quedará como un ícono normal, se abre sin barra de navegador (modo standalone).

**iPhone (Safari — debe ser Safari, no Chrome, para que funcione):**
1. Abre el enlace de tu app en Safari.
2. Toca el botón de compartir (el cuadrado con la flecha hacia arriba).
3. Baja y toca **"Agregar a pantalla de inicio"**.
4. Confirma. Aparecerá con el ícono verde de hoja que generamos, y abrirá en modo standalone.

---

## 3. Publicarla gratis (para tener una URL real)

Cualquiera de estas tres opciones es gratuita y funciona bien. Recomendada para lo más simple: **Netlify** o **Vercel** (detectan Vite automáticamente). GitHub Pages también funciona pero requiere un paso extra de configuración.

### Opción A — Vercel (recomendada, más simple)
1. Sube esta carpeta a un repositorio en GitHub (ver abajo cómo).
2. Entra a [vercel.com](https://vercel.com), inicia sesión con tu cuenta de GitHub.
3. "Add New Project" → selecciona el repositorio.
4. Vercel detecta Vite automáticamente (Build Command: `npm run build`, Output: `dist`). Dale "Deploy".
5. En un par de minutos te da una URL tipo `tu-app.vercel.app`. Esa es la que abres en tu celular.

### Opción B — Netlify
1. Sube la carpeta a GitHub.
2. Entra a [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project".
3. Conecta tu repo. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy. Te da una URL tipo `tu-app.netlify.app`.

### Opción C — GitHub Pages
1. Sube la carpeta a un repositorio en GitHub.
2. Instala el paquete de despliegue: `npm install --save-dev gh-pages`.
3. Agrega a `package.json`, dentro de `"scripts"`: `"deploy": "npm run build && npx gh-pages -d dist"`.
4. Ejecuta `npm run deploy`.
5. En GitHub, entra a **Settings → Pages** del repositorio y confirma que la fuente sea la rama `gh-pages`.
6. Tu URL será `https://tu-usuario.github.io/nombre-del-repo/`.

### Cómo subir esta carpeta a GitHub (si nunca lo has hecho)
```bash
cd reto30-app
git init
git add .
git commit -m "Reto 30 días - primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/reto30-app.git
git push -u origin main
```
(Antes necesitas crear el repositorio vacío en github.com y tener Git instalado.)

---

## 4. Copia de seguridad de tus datos

Dentro de la app: **Progreso → Respaldo → "Exportar copia de seguridad"**. Esto descarga un
archivo `.json` con todo tu progreso, medidas y fotos. Guárdalo donde prefieras (Drive, iCloud,
correo a ti misma).

## 5. Restaurar en un celular nuevo

1. Instala/abre la app en el celular nuevo (mismo enlace).
2. Ve a **Progreso → Respaldo → "Restaurar desde un archivo"**.
3. Selecciona el `.json` que exportaste antes. Tu progreso, medidas y fotos vuelven exactamente como estaban.

---

## Estructura del proyecto

```
reto30-app/
├── index.html              ← incluye manifest, meta tags iOS/Android, Tailwind
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json        ← nombre, ícono, modo standalone, colores
│   ├── sw.js                ← Service Worker (caché offline)
│   └── icons/                ← íconos generados (192, 512, maskable, apple-touch-icon)
└── src/
    ├── main.jsx              ← monta React y registra el Service Worker
    ├── App.jsx                ← toda la aplicación (pantallas, datos, lógica)
    └── storage.js             ← localStorage + IndexedDB + exportar/importar respaldo
```

## Notas técnicas

- Los estilos usan Tailwind vía CDN (`index.html`) para evitar un paso de build adicional. Si
  luego quieres integrarlo como dependencia de build (más rápido en producción y sin el aviso de
  consola de "no usar en producción"), puedo ayudarte a migrarlo a `tailwindcss` + PostCSS.
- Los 21 videos de entrenamiento (Steph Delmor, Pau Fit, cardio/zumba) están verificados con
  enlaces reales de YouTube y organizados en una rotación de 30 días con dificultad progresiva.
- El Service Worker cachea el "app shell" (HTML, manifest, íconos) para que la app abra incluso
  sin conexión una vez que se abrió al menos una vez con internet. Los videos de YouTube sí
  necesitan conexión para reproducirse, como cualquier video de YouTube.
