import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import PageShell from "../components/layout/PageShell";

type PortalConfig = {
  title: string;
  summary: string;
  tables: string[];
  screens: string[];
};

const summaryText =
  "Operate OneTex gestiona contratos y mantenimiento mensual de ascensores para clientes. Para cada OT preventiva se selecciona automáticamente un checklist según plan OEM/INTERNO, marca/modelo y mes. La ficha técnica del ascensor se marca completa en ascensor.ficha_completa. El portal del cliente muestra solo historial por equipo, emergencias y encuestas de satisfacción (no aprueba cotizaciones).";

const flowSteps = [
  "[Comercial] Registra el lead y lo marca como “Listo para contrato”.",
  "[Administrador] Convierte el lead en Cliente + Unidad Operativa + Ascensor(es) y crea un Contrato mensual.",
  "[Administrador] Para cada ascensor del contrato define si el plan de mantenimiento es OEM o INTERNO.",
  "[Administrador] Genera y programa OTs preventivas mensuales por ascensor según contrato y capacidad de técnicos.",
  "[Líder Técnico] Ve su flota y reparte/reasigna OTs entre sus técnicos según zona/asignación.",
  "[Técnico Operativo] Ejecuta el checklist mensual auto-seleccionado, completa ficha técnica si falta y registra observaciones/evidencias.",
  "[Usuario Aprobador] Revisa ficha técnica y observaciones, valida las que aplican y marca cuáles se usarán para correctivos internos.",
  "[Comercial interno] Usa las observaciones validadas para preparar correctivos y coordinar con el cliente por canales externos (WhatsApp, correo, etc.).",
  "[Cliente] Consulta historial por ascensor (OTs), ve emergencias atendidas y responde encuestas de satisfacción; no aprueba cotizaciones en el portal.",
] as const;

const flowNodes: Node[] = [
  { id: "comercial", position: { x: 0, y: 0 }, data: { label: "Comercial", desc: "Registra leads y pasa a contrato" } },
  {
    id: "admin",
    position: { x: 200, y: 0 },
    data: { label: "Administrador", desc: "Crea cliente/unidad/ascensor y contrato mensual" },
  },
  {
    id: "programacion",
    position: { x: 400, y: 0 },
    data: { label: "Programación mensual", desc: "Genera y agenda OTs preventivas" },
  },
  { id: "lider", position: { x: 600, y: 0 }, data: { label: "Líder Técnico", desc: "Reparte OTs según zona/asignación" } },
  {
    id: "tecnico",
    position: { x: 800, y: 0 },
    data: { label: "Técnico Operativo", desc: "Ejecuta checklist auto-seleccionado y ficha técnica" },
  },
  { id: "aprobador", position: { x: 1000, y: 0 }, data: { label: "Usuario Aprobador", desc: "Valida ficha y observaciones" } },
  { id: "comercialinterno", position: { x: 1200, y: 0 }, data: { label: "Comercial interno", desc: "Prepara correctivos internos" } },
  { id: "cliente", position: { x: 1400, y: 0 }, data: { label: "Cliente", desc: "Consulta historial y emergencias" } },
  {
    id: "gerencia",
    position: { x: 1600, y: 0 },
    data: { label: "Asistente de Gerencia", desc: "Visualiza dashboards de lectura" },
  },
] as const;

const flowEdges: Edge[] = [
  { id: "e1", source: "comercial", target: "admin" },
  { id: "e2", source: "admin", target: "programacion" },
  { id: "e3", source: "programacion", target: "lider" },
  { id: "e4", source: "lider", target: "tecnico" },
  { id: "e5", source: "tecnico", target: "aprobador" },
  { id: "e6", source: "aprobador", target: "comercialinterno" },
  { id: "e7", source: "comercialinterno", target: "cliente" },
  { id: "e8", source: "cliente", target: "gerencia" },
] as const;

const tablesObject = `// Core tables (v0.1)
const tables = {
  cliente: "Datos del cliente dueño de unidades operativas.",
  unidad_operativa: "Edificio/sede de un cliente donde hay ascensores.",
  ascensor: "Equipo concreto; incluye ficha técnica y flag ficha_completa.",
  usuario: "Cuenta de sistema (admin, técnico, cliente...) con flags de rol y es_aprobador.",
  tecnico: "Extensión de usuario con nivel (T1/T2/T3/LIMPIEZA) y líder técnico.",
  zona: "Definición de zonas (Zona 1, Zona 2, Retail, Estado).",
  zona_distrito: "Asocia distritos a una zona.",
  contrato: "Contrato mensual asociado a una unidad_operativa.",
  contrato_ascensor: "Une contrato y ascensor, define plan_mantenimiento (OEM/INTERNO).",
  checklist_template: "Plantilla de checklist por origen (OEM/INTERNO), marca/modelo y mes.",
  checklist_template_item: "Ítems individuales de una plantilla de checklist.",
  ot: "Orden de trabajo (preventivo/correctivo/emergencia) sobre un ascensor.",
  ot_checklist_item: "Resultado por ítem de checklist en una OT.",
  ot_observacion: "Observaciones técnicas registradas en una OT.",
  ot_media: "Fotos/videos asociados a una OT.",
  ot_cliente_mensaje: "Texto sugerido para explicar al cliente la situación de la OT.",
  emergencia_reporte: "Reporte de emergencia enviado por el cliente.",
  encuesta_satisfaccion: "Encuesta de satisfacción del cliente asociada a una OT."
} as const;`;

const relationNotes = [
  "unidad_operativa pertenece a un cliente y opcionalmente a una zona.",
  "Un ascensor pertenece a una unidad_operativa.",
  "contrato pertenece a una unidad_operativa.",
  "contrato_ascensor vincula contrato y ascensor y define si usa plan OEM o INTERNO.",
  "Una OT preventiva referencia contrato_ascensor; una OT de emergencia puede existir sin contrato.",
  "checklist_template se elige por (origen OEM/INTERNO + marca/modelo + mes) y se expande a ot_checklist_item al crear la OT.",
  "ot_observacion y ot_media dependen de una OT concreta.",
  "encuesta_satisfaccion se asocia a una OT y un cliente.",
] as const;

const fixedRules = [
  "Todos los mantenimientos preventivos son mensuales.",
  "El checklist de la OT se decide automáticamente (plan OEM/INTERNO + marca/modelo + mes); el técnico no lo elige.",
  "La ficha técnica está completa cuando ascensor.ficha_completa = true; si es false, el técnico debe completarla antes de cerrar la primera OT.",
  "Solo usuarios con es_aprobador = true pueden validar fichas técnicas y observaciones.",
  "El Portal Cliente no muestra precios ni botones para aceptar cotizaciones; solo historial, emergencias y satisfacción.",
] as const;

const portalConfigs: PortalConfig[] = [
  {
    title: "Portal Administrador",
    summary: "Gestiona clientes/unidades, contratos y programación mensual de OTs; panel de aprobaciones técnicas.",
    tables: ["cliente", "unidad_operativa", "ascensor", "contrato", "contrato_ascensor", "checklist_template", "ot"],
    screens: ["Gestión de clientes/unidades", "Gestión de contratos", "Programación mensual de OTs", "Panel de aprobaciones técnicas"],
  },
  {
    title: "Portal Líder Técnico",
    summary: "Ve flota por zona/asignación y reasigna OTs entre técnicos.",
    tables: ["ot", "tecnico", "unidad_operativa", "ascensor"],
    screens: ["Flota por zona/líder", "Agenda por técnico", "Reasignación de OTs"],
  },
  {
    title: "Portal Técnico Operativo",
    summary: "Ejecuta checklist auto-seleccionado, completa ficha técnica y registra evidencias.",
    tables: ["ot", "ot_checklist_item", "ot_observacion", "ot_media", "ascensor"],
    screens: ["Lista de OTs del día", "Detalle de OT con checklist", "Captura de ficha técnica", "Registro de evidencias"],
  },
  {
    title: "Portal Usuario Aprobador",
    summary: "Valida fichas técnicas incompletas y observaciones técnicas.",
    tables: ["ascensor", "ot_observacion", "ot"],
    screens: ["Fichas incompletas", "Observaciones pendientes de aprobación"],
  },
  {
    title: "Portal Cliente",
    summary: "Consulta historial por equipo, emergencias y encuestas de satisfacción; sin aprobación de cotizaciones.",
    tables: ["ascensor", "ot", "emergencia_reporte", "encuesta_satisfaccion"],
    screens: ["Listado de equipos", "Historial por equipo", "Reporte de emergencia", "Encuesta de satisfacción"],
  },
  {
    title: "Portal Asistente de Gerencia",
    summary: "Dashboards de indicadores en solo lectura.",
    tables: ["cliente", "unidad_operativa", "ascensor", "contrato", "ot", "encuesta_satisfaccion"],
    screens: ["Dashboard de cumplimiento", "Dashboard de incidencias", "Dashboard de satisfacción"],
  },
] as const;

const extendedSql = `-- 3.2. MÓDULO 0 – Empresa y usuarios
create table public.empresa (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null,
  nombre_comercial text not null,
  ruc text,
  id_org uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rol (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null
);

create table public.usuario (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  auth_user_id uuid not null unique,
  nombre text not null,
  email text not null,
  telefono text,
  es_aprobador boolean not null default false,
  es_lider_tecnico boolean not null default false,
  es_invitado boolean not null default false,
  solo_lectura boolean not null default false,
  fecha_expiracion date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usuario_rol (
  id uuid primary key default gen_random_uuid(),
  id_usuario uuid not null references public.usuario(id) on delete cascade,
  id_rol uuid not null references public.rol(id) on delete restrict,
  unique (id_usuario, id_rol)
);

create table public.tecnico (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_usuario uuid not null references public.usuario(id) on delete cascade,
  nivel text not null check (nivel in ('T1','T2','T3','LIMPIEZA')),
  id_lider_tecnico uuid references public.usuario(id),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_usuario)
);

-- 3.3. MÓDULO 1 – Zonas y ubicación
create table public.zona (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  nombre text not null,
  tipo_segmento text not null check (tipo_segmento in ('RESIDENCIAL','RETAIL','ESTADO')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_empresa, nombre)
);

create table public.zona_distrito (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_zona uuid not null references public.zona(id) on delete cascade,
  distrito text not null,
  created_at timestamptz not null default now(),
  unique (id_zona, distrito)
);

-- 3.4. MÓDULO 2 – Comerciales, leads y portafolio
create table public.lead (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  nombre_o_edificio text not null,
  contacto_nombre text,
  contacto_telefono text,
  contacto_email text,
  distrito text,
  descripcion_equipo text,
  estado text not null check (estado in ('NUEVO','EN_PROCESO','LISTO_CONTRATO','DESCARTADO')),
  id_comercial_responsable uuid references public.usuario(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.portafolio_comercial (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_usuario_comercial uuid not null references public.usuario(id),
  id_cliente uuid,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3.5. MÓDULO 3 – Clientes, unidades y ascensores
create table public.cliente (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  nombre_comercial text not null,
  razon_social text,
  ruc text,
  telefono text,
  email text,
  estado text not null default 'ACTIVO' check (estado in ('ACTIVO','SUSPENDIDO')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.unidad_operativa (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_cliente uuid not null references public.cliente(id) on delete cascade,
  nombre_administrativo text not null,
  pais text,
  departamento text,
  ciudad text,
  distrito text,
  direccion text,
  referencia text,
  segmento text not null check (segmento in ('RESIDENCIAL','RETAIL','ESTADO')),
  id_zona uuid references public.zona(id),
  id_lider_tecnico uuid references public.usuario(id),
  id_lider_comercial uuid references public.usuario(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.marca (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  nombre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_empresa, nombre)
);

create table public.modelo (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_marca uuid not null references public.marca(id) on delete cascade,
  nombre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_marca, nombre)
);

create table public.tipo_ascensor (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  nombre text not null,
  descripcion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ascensor (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_unidad uuid not null references public.unidad_operativa(id) on delete cascade,
  codigo_ascensor text not null,
  codigo_fabrica text,
  id_modelo uuid references public.modelo(id),
  id_marca uuid not null references public.marca(id),
  id_tipo uuid references public.tipo_ascensor(id),
  capacidad_kg numeric,
  capacidad_personas numeric,
  pisos integer,
  sotanos integer,
  ficha_completa boolean not null default false,
  estado text not null default 'ACTIVO' check (estado in ('ACTIVO','FUERA_SERVICIO','RETIRADO')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_empresa, codigo_ascensor)
);

-- 3.6. MÓDULO 4 – Contratos y planes de mantenimiento
create table public.contrato (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_unidad uuid not null references public.unidad_operativa(id) on delete cascade,
  fecha_inicio date not null,
  fecha_fin date,
  frecuencia text not null default 'MENSUAL' check (frecuencia = 'MENSUAL'),
  dia_preferente integer,
  ventana_horaria text check (ventana_horaria in ('MANANA','TARDE','MIXTO')),
  requiere_confirmacion_cliente boolean not null default false,
  estado text not null default 'ACTIVO' check (estado in ('BORRADOR','ACTIVO','PAUSADO','TERMINADO')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contrato_ascensor (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_contrato uuid not null references public.contrato(id) on delete cascade,
  id_ascensor uuid not null references public.ascensor(id),
  plan_mantenimiento text not null check (plan_mantenimiento in ('OEM','INTERNO')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_contrato, id_ascensor)
);

create table public.checklist_template (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  origen text not null check (origen in ('OEM','INTERNO')),
  id_marca uuid references public.marca(id),
  id_modelo uuid references public.modelo(id),
  mes integer not null check (mes between 1 and 12),
  nombre text not null,
  version integer not null default 1,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checklist_template_item (
  id uuid primary key default gen_random_uuid(),
  id_template uuid not null references public.checklist_template(id) on delete cascade,
  orden integer not null,
  descripcion text not null,
  obligatorio boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_template, orden)
);

-- 3.7. MÓDULO 5 – Órdenes de trabajo, checklist, observaciones
create table public.ot (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_contrato_ascensor uuid references public.contrato_ascensor(id),
  id_ascensor uuid not null references public.ascensor(id),
  tipo text not null check (tipo in ('PREVENTIVO','CORRECTIVO','EMERGENCIA','DIAGNOSTICO')),
  origen text not null check (origen in ('CONTRATO','MANUAL','EMERGENCIA_CLIENTE')),
  fecha_programada timestamptz,
  fecha_inicio timestamptz,
  fecha_fin timestamptz,
  estado text not null default 'PROGRAMADA'
    check (estado in ('PROGRAMADA','EN_CURSO','COMPLETADA','CANCELADA')),
  id_tecnico_responsable uuid references public.tecnico(id),
  id_lider_tecnico uuid references public.usuario(id),
  observaciones_resumen text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ot_checklist_item (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_ot uuid not null references public.ot(id) on delete cascade,
  id_template_item uuid references public.checklist_template_item(id),
  descripcion text not null,
  orden integer not null,
  resultado text check (resultado in ('OK','NO_OK','NO_APLICA')),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_ot, orden)
);

create table public.ot_observacion (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_ot uuid not null references public.ot(id) on delete cascade,
  descripcion text not null,
  criticidad text not null default 'MEDIA' check (criticidad in ('BAJA','MEDIA','ALTA')),
  validada boolean not null default false,
  validada_por uuid references public.usuario(id),
  fecha_validacion timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ot_media (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_ot uuid not null references public.ot(id) on delete cascade,
  tipo text not null check (tipo in ('FOTO','VIDEO')),
  url text not null,
  descripcion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ot_cliente_mensaje (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_ot uuid not null references public.ot(id) on delete cascade,
  texto text not null,
  generado_por text not null check (generado_por in ('N8N','MANUAL')),
  fecha_generacion timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_ot)
);

-- 3.8. MÓDULO 6 – Emergencias y satisfacción
create table public.emergencia_reporte (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_cliente uuid references public.cliente(id),
  id_ascensor uuid references public.ascensor(id),
  descripcion text not null,
  prioridad text not null check (prioridad in ('PERSONAS_ATRAPADAS','FALLA_GRAVE','FALLA_LEVE')),
  fecha_reporte timestamptz not null default now(),
  id_ot uuid references public.ot(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.encuesta_satisfaccion (
  id uuid primary key default gen_random_uuid(),
  id_empresa uuid not null references public.empresa(id),
  id_cliente uuid not null references public.cliente(id),
  id_ot uuid not null references public.ot(id) on delete cascade,
  puntaje integer not null check (puntaje between 1 and 5),
  comentario text,
  fecha_respuesta timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id_ot, id_cliente)
);

-- 3.9. MÓDULO 7 – Vista para Portal Cliente (historial por equipo)
create view public.view_historial_equipo as
select
  ot.id_empresa,
  asc.id as id_ascensor,
  asc.codigo_ascensor,
  asc.codigo_fabrica,
  ot.id as id_ot,
  ot.tipo,
  ot.estado,
  ot.fecha_programada,
  ot.fecha_inicio,
  ot.fecha_fin,
  ot.observaciones_resumen
from public.ot ot
join public.ascensor asc on asc.id = ot.id_ascensor;`;
const codeBlock = (content: string, language = "typescript") => (
  <pre className="rounded-lg bg-slate-900/80 p-4 text-sm text-slate-100 overflow-auto">
    <code className={`language-${language}`}>{content}</code>
  </pre>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="chart-card space-y-3">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <div className="text-slate-200">{children}</div>
  </div>
);

const FlowDiagram = ({
  onSelect,
  selectedId,
}: {
  onSelect: (id: string | null) => void;
  selectedId: string | null;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    flowNodes.map((node) => ({
      ...node,
      style: {
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: 8,
        background: selectedId === node.id ? "#0ea5e9" : "#0f172a",
        color: selectedId === node.id ? "#0b1120" : "#e2e8f0",
        boxShadow: selectedId === node.id ? "0 0 0 2px #38bdf8" : "none",
      },
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          background: selectedId === n.id ? "#0ea5e9" : "#0f172a",
          color: selectedId === n.id ? "#0b1120" : "#e2e8f0",
          boxShadow: selectedId === n.id ? "0 0 0 2px #38bdf8" : "none",
        },
      }))
    );
  }, [selectedId, setNodes]);

  return (
    <div className="h-[360px] rounded-xl border border-slate-800 bg-slate-900/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        onNodeClick={(_, node) => onSelect(node.id)}
      >
        <Background gap={12} color="#1e293b" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const PipelinePage = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const portalBlocks = useMemo(
    () =>
      portalConfigs.map((portal) => {
        const content = `// Tablas que usa
const tables = ${JSON.stringify(portal.tables, null, 2)};

// Pantallas clave
const screens = ${JSON.stringify(portal.screens, null, 2)};`;
        return (
          <div key={portal.title} className="chart-card flex flex-col gap-3">
            <div>
              <h4 className="text-base font-semibold text-white">{portal.title}</h4>
              <p className="text-sm text-slate-300">{portal.summary}</p>
            </div>
            {codeBlock(content)}
          </div>
        );
      }),
    []
  );

  useEffect(() => {
    hljs.highlightAll();
  }, [selectedNodeId]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <header className="chart-card">
          <h1 className="text-2xl font-bold text-white">Pipeline Operate OneTex</h1>
          <p className="text-slate-300">Documento vivo para entender flujo, datos y reglas del sistema.</p>
        </header>

        <SectionCard title="Resumen">
          <p className="leading-relaxed text-slate-200">{summaryText}</p>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Flujo funcional (lista)">
            <ol className="list-decimal space-y-2 pl-5 text-slate-200">
              {flowSteps.map((step, idx) => (
                <li
                  key={step}
                  className={`rounded-md px-2 py-1 transition ${
                    selectedNodeId && flowNodes[idx]?.id === selectedNodeId ? "bg-sky-900/60" : ""
                  }`}
                >
                  {step}
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Flujo funcional (ReactFlow)">
            <FlowDiagram onSelect={setSelectedNodeId} selectedId={selectedNodeId} />
          </SectionCard>
        </div>

        <SectionCard title="Tablas núcleo v0.1 (Supabase/Postgres)">{codeBlock(tablesObject)}</SectionCard>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Relaciones clave">
            <ul className="space-y-2 text-slate-200">
              {relationNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Reglas fijas del sistema">
            <ul className="space-y-2 text-slate-200">
              {fixedRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{portalBlocks}</div>

        <SectionCard title="3.2–3.9 Esquema detallado (SQL de referencia)">
          {codeBlock(extendedSql, "sql")}
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default PipelinePage;
