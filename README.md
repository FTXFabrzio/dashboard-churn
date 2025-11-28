# Diagnóstico de Churn – AndesTel Hogar

Dashboard de una sola página en React + Vite + TypeScript + TailwindCSS que visualiza los resultados de un modelo de churn para AndesTel Hogar usando un JSON local.

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
```

## Desarrollo local
```bash
npm run dev
```

## Build de producción
```bash
npm run build
```

## Despliegue en Vercel
- Framework: Vite / React
- Build command: `npm run build`
- Output directory: `dist`

## Datos
Coloca tu JSON real en `src/data/churnDashboardData.json` respetando el contrato de datos definido en `src/types/churn.ts`.
