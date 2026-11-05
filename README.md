<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=220&section=header&text=Pok%C3%A9dex%20%C2%B7%20Mochila%20de%20Entrenador&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Busca%20Pok%C3%A9mon%2C%20crea%20tu%20entrenador%20y%20atr%C3%A1palos%20a%20todos&descAlignY=60&descSize=16" alt="Pokédex · Mochila de Entrenador" />

<a href="https://github.com/yilder-rodriguez/pokedex_ejercicio">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=22&duration=3000&pause=800&color=DC2626&center=true&vCenter=true&width=620&lines=%C2%A1Hola%2C+entrenador!+%F0%9F%91%8B;Busca+cualquier+Pok%C3%A9mon+por+nombre+o+n%C3%BAmero;Crea+tu+perfil+de+entrenador;Guarda+tus+capturas+en+la+mochila;Gotta+catch+'em+all!+%E2%9A%A1" alt="Texto animado" />
</a>

<br />

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif" height="70" alt="Pikachu" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif" height="80" alt="Charizard" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/149.gif" height="80" alt="Dragonite" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/94.gif" height="70" alt="Gengar" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/448.gif" height="75" alt="Lucario" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/133.gif" height="60" alt="Eevee" />

<br /><br />

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![PokéAPI](https://img.shields.io/badge/Pok%C3%A9API-EF5350?style=for-the-badge&logo=pokemon&logoColor=white)

<br />

<a href="https://instagram.com/yilder_rodriguez">
  <img src="https://img.shields.io/badge/Instagram-@yilder__rodriguez-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram de Yilder" />
</a>

</div>

---

## ✨ ¿Qué es este proyecto?

Una **Pokédex web** hecha con React que consume la [PokéAPI](https://pokeapi.co/). Puedes buscar cualquier Pokémon, ver sus estadísticas, crear uno o varios **perfiles de entrenador** y guardar tus capturas en una **mochila** personal.

Empezó como un ejercicio para practicar con **Vercel** y la API de Pokémon (`https://pokeapi.co/api/v2/pokemon/pikachu`) y terminó convirtiéndose en una app completa, con modo oscuro y animaciones.

> Todo se guarda en el navegador (`localStorage`), así que **no necesita base de datos ni cuenta**.

---

## 🎮 Funcionalidades

### 🔍 Pokédex
- Búsqueda por **nombre o número** (del 1 al 1025). Acepta formatos como `pikachu`, `25` o `#25`.
- Ilustración oficial del Pokémon, **tipos** con insignias de color y datos básicos (altura, peso, experiencia base, habilidades).
- **Estadísticas base** con barras y total, con números que cuentan hacia arriba.
- Navegación entre Pokémon y marca de agua de fondo que cambia con la búsqueda.

### 🧢 Entrenadores
- Crea, edita y elimina entrenadores, y cambia entre varios.
- Cada uno tiene **nombre, región** (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola, Galar y Paldea), **género** y un **avatar** predefinido o tu propia foto (se recorta al centro y se reduce a 256 px).
- Se muestran como una **tarjeta de licencia** con estadísticas y progreso en la Pokédex.

### 🎒 Mochila
- Captura Pokémon y guárdalos en la mochila del entrenador activo.
- Tarjetas con efecto de inclinación, **orden** (número, nombre o más reciente) y **filtro por tipo**.
- Ventana de detalle con las estadísticas y la fecha de captura. Desde ahí puedes verlo en la Pokédex o **liberarlo** (con animación de salida).

### 🌗 Detalles
- **Modo claro y oscuro**, con selector y preferencia guardada.
- **Mensajes de confirmación** al crear un entrenador, guardar o liberar un Pokémon, o cuando algo falla.
- **Accesible**: las animaciones se desactivan si tu dispositivo tiene activado "reducir movimiento".
- Diseño adaptable: funciona en celular, tablet y escritorio.

---

## 🛠️ Tecnologías

| Área | Herramientas |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS 4, tw-animate-css, class-variance-authority |
| Componentes | shadcn/ui + Base UI, lucide-react (iconos) |
| Datos | [PokéAPI](https://pokeapi.co/) + SWR |
| Estado | Store propio con `useSyncExternalStore` + `localStorage` |
| Tipografía | Outfit y JetBrains Mono |
| Despliegue | Vercel |

---

## 📁 Estructura del proyecto

```
pokedex_ejercicio/
├── public/                  # Íconos y recursos estáticos
├── src/
│   ├── components/          # Buscador, tarjetas, mochila, entrenadores, modal, toaster...
│   ├── hooks/               # use-pokemon, use-theme, use-count-up, use-swap-animation
│   ├── lib/                 # Cliente de PokéAPI, store de entrenadores, toasts, utilidades
│   ├── App.tsx              # Composición principal de la página
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales y animaciones
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🚀 Cómo correrlo en tu computador

Necesitas [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clona el repositorio
git clone https://github.com/yilder-rodriguez/pokedex_ejercicio.git
cd pokedex_ejercicio

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre **http://localhost:3000** en tu navegador y listo.

### Otros comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Revisa los tipos y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción para probarla |

---

## ☁️ Despliegue

El proyecto está pensado para desplegarse en **Vercel** como una app de Vite: conecta el repositorio, deja el comando de build en `npm run build` y el directorio de salida en `dist`.

---

## 🙏 Créditos

- Datos e imágenes de [PokéAPI](https://pokeapi.co/).
- Pokémon y todos los nombres relacionados son marca registrada de Nintendo, Game Freak y The Pokémon Company. Este es un proyecto **educativo, sin fines de lucro**.

---

<div align="center">

### 👨‍💻 Hecho por Yilder Rodríguez

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif" height="60" alt="Pikachu corriendo" />

**¿Te gustó el proyecto? Dale una ⭐ al repo y sígueme en Instagram:**

<a href="https://instagram.com/yilder_rodriguez">
  <img src="https://img.shields.io/badge/Síguenos_en_Instagram-@yilder__rodriguez-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
</a>

<br /><br />

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer" alt="" />

</div>
