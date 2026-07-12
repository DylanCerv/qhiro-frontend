export const ui = {
  brandSubtitle: 'Agricultura inteligente MVP',
  nav: {
    dashboard: 'Panel',
    parcels: 'Parcelas',
    schedule: 'Programación',
    flights: 'Vuelos',
    devices: 'Dispositivos',
    simulator: 'Simulador',
    admin: 'Clientes',
    mqttDiagnostics: 'MQTT',
  },
  common: {
    error: 'Error',
    loadingSession: 'Cargando sesión…',
    loadingDashboard: 'Cargando panel…',
    loadingFlights: 'Cargando vuelos…',
    loadingDevices: 'Cargando dispositivos…',
    requestFailed: 'Error en la solicitud',
    notAvailable: '—',
    logout: 'Cerrar sesión',
    save: 'Guardar',
    edit: 'Editar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
  },
  landing: {
    tagline: 'Gestión inteligente de cultivos con IA y robótica avanzada',
    ctaLogin: 'Iniciar sesión',
    ctaRegister: 'Registrarse',
    backHome: 'Volver al inicio',
    problem: {
      title: 'El problema',
      items: [
        {
          title: 'Aplicación ineficiente de nutrientes',
          desc: 'Las operaciones agrícolas carecen de sistemas para aplicar nutrientes y agroquímicos de forma precisa, localizada y en tiempo real, generando pérdidas masivas de insumos.',
        },
        {
          title: 'Mercado en auge, soluciones fragmentadas',
          desc: 'El mercado de agricultura de precisión crece aceleradamente, pero las soluciones actuales son costosas, fragmentadas y carecen de dosificación integrada y verdaderamente simbiótica.',
        },
        {
          title: '60% de desperdicio',
          desc: 'Hasta el 60% de los fertilizantes nitrogenados aplicados globalmente no son absorbidos por los cultivos, evidenciando una ineficiencia masiva en los métodos convencionales.',
        },
      ],
    },
    ecosystem: {
      title: 'El ecosistema simbiótico',
      subtitle: 'Ecosistema Qhiro Symbiotic',
      units: [
        {
          role: 'El Cerebro',
          name: 'Qhiro Core (IA)',
          desc: 'Sistema nervioso central. Recibe telemetría, calcula dosis exactas de NPK y coordina autónomamente todas las unidades sin intervención humana.',
        },
        {
          role: 'Los Ojos',
          name: 'El Vigía (Dron)',
          desc: 'Unidad aérea que escanea cultivos con sensores multiespectrales. Detecta anomalías y envía geolocalización exacta para activar la respuesta.',
        },
        {
          role: 'El Cuerpo',
          name: 'Nido y Centinelas',
          desc: 'El Nido es la estación base donde el dron recarga y se almacenan insumos. Los Centinelas ejecutan la inyección localizada en la coordenada afectada.',
        },
      ],
      flowTitle: 'La simbiosis en acción',
      flow: [
        'El Vigía detecta deficiencia de nutrientes',
        'Qhiro Core procesa la anomalía y calcula la fórmula',
        'Ordena al Centinela activar su mix-node local',
        'El cultivo recibe la dosis exacta en tiempo real',
      ],
      principle:
        'La tierra habla, el aire observa, la IA piensa y el hardware ejecuta. Un ciclo cerrado que erradica el desperdicio tradicional.',
    },
    solution: {
      title: 'Qhiro Symbiotic',
      subtitle: 'Nuestra solución',
      items: [
        'Erradicación del desperdicio químico: separación de solutos y mezcla instantánea en el Mix-Node, evitando floculación y pérdida del principio activo.',
        'Inyección quirúrgica por coordenadas: Qhiro Core dirige el tratamiento exclusivamente al Centinela responsable de la coordenada detectada por el Vigía.',
        'Eficiencia energética descentralizada: minibombas en cada nodo elevan la presión en el punto final, reduciendo estrés mecánico y consumo energético.',
        'Mezcla just-in-time: los insumos puros se combinan en el último segundo antes de la aplicación, eliminando hasta el 60% del desperdicio convencional.',
      ],
    },
    stats: {
      title: 'Ineficiencia crítica, oportunidad de mercado',
      items: [
        { value: '60%', label: 'de fertilizantes nitrogenados se pierden con métodos convencionales' },
        { value: '$13B+', label: 'mercado global de agricultura de precisión proyectado 2026' },
        { value: '12.5%', label: 'CAGR del sector AgTech impulsado por fertirrigación y UAV' },
        { value: '0', label: 'soluciones autónomas integradas — Qhiro unifica todo en un ecosistema cerrado' },
      ],
    },
    segments: {
      title: 'Segmentos y tendencias',
      trends: [
        'Crisis de fertilizantes',
        'Automatización descentralizada',
        'Presión sostenible',
        'CapEx y ROI',
      ],
      audiences: [
        {
          segment: 'Productores agrícolas de alto valor',
          model: 'Redes B2B',
          desc: 'Grandes exportadores de cultivos premium con millones en contratos internacionales.',
        },
        {
          segment: 'Empresas de gestión de cultivos en red',
          model: 'SaaS B2B',
          desc: 'Corporaciones que gestionan cadenas hoteleras e industriales con calidad homogénea.',
        },
        {
          segment: 'Proveedores AgTech SaaS (terceros)',
          model: 'SaaS B2B',
          desc: 'Agrónomos y consultoras que necesitan infraestructura modular para análisis en campo.',
        },
      ],
    },
    business: {
      title: 'Nuestro modelo',
      subtitle: 'Fuentes de ingreso',
      plans: [
        { name: 'Plan Base', desc: 'Acceso esencial a monitoreo, parcelas y programación de vuelos.' },
        {
          name: 'Symbiotic AI Pro',
          desc: 'Analítica predictiva, automatización hidráulica y mapeo multiespectral en tiempo real.',
        },
      ],
      revenue: [
        'Venta e instalación del hardware propietario (CapEx): El Nido, Centinelas con Mix-Node y El Vigía (UAV).',
        'Suscripción mensual SaaS (OpEx): licenciamiento escalonado de Qhiro Core.',
        'Contratos de mantenimiento y consumibles: calibración de sensores y suministro de refacciones.',
      ],
      ctaTitle: 'Empieza a gestionar tus cultivos con precisión',
    },
  },
  auth: {
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Crear cuenta de cliente',
    email: 'Correo electrónico',
    password: 'Contraseña',
    displayName: 'Nombre completo',
    country: 'País',
    loginButton: 'Entrar',
    registerButton: 'Registrarme',
    demoTitle: 'Acceso demo (sin Firebase)',
    demoAdmin: 'Entrar como administrador',
    demoClient: 'Entrar como cliente',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    goRegister: 'Regístrate',
    goLogin: 'Inicia sesión',
    useLocation: 'Usar mi ubicación actual',
    locating: 'Detectando ubicación…',
    missingApiKey:
      'Falta FIREBASE_WEB_API_KEY en qhiro-backend/.env. Copia la Web API Key desde Firebase Console → Configuración del proyecto.',
  },
  parcels: {
    title: 'Mis parcelas',
    subtitle: 'Crea, selecciona y delimita tus parcelas en el mapa según tu ubicación.',
    createTitle: 'Nueva parcela',
    name: 'Nombre de la parcela',
    cropType: 'Tipo de cultivo',
    zoneId: 'ID de zona',
    drawHint: 'Haz clic en el mapa para añadir vértices (mínimo 3 puntos).',
    selectPointHint: 'Selecciona un punto numerado para moverlo o eliminarlo.',
    selectPoint: 'Seleccionar punto',
    pointLabel: 'Punto',
    movePoint: 'Mover punto',
    movingPoint: 'Arrastrando…',
    movePointHint: 'Arrastra el punto en el mapa a la nueva posición.',
    deletePoint: 'Eliminar punto',
    deselectPoint: 'Deseleccionar',
    minPointsDelete: 'No puedes eliminar: la parcela necesita al menos 3 puntos.',
    addCrop: 'Agregar cultivo…',
    noCrop: 'Sin cultivo',
    cropUpdated: 'Cultivo actualizado.',
    removeLastPoint: 'Quitar último punto',
    clearPoints: 'Limpiar puntos',
    satelliteView: 'Vista satélite',
    streetView: 'Vista calle',
    pointsCount: 'Puntos marcados',
    saveParcel: 'Guardar parcela',
    saveChanges: 'Guardar cambios',
    editTitle: 'Editar parcela',
    saved: 'Parcela guardada correctamente.',
    updated: 'Parcela actualizada correctamente.',
    deleted: 'Parcela eliminada.',
    selectParcel: 'Parcela activa',
    listTitle: 'Parcelas registradas',
    noParcels: 'Aún no tienes parcelas. Crea la primera abajo.',
    goCreate: 'Crear parcela',
    minPoints: 'Marca al menos 3 puntos en el mapa.',
  },
  admin: {
    title: 'Gestión de clientes',
    subtitle: 'Suspende o inhabilita cuentas cuando el cliente no haya pagado.',
    client: 'Cliente',
    email: 'Correo',
    country: 'País',
    parcels: 'Parcelas',
    status: 'Estado de cuenta',
    actions: 'Acciones',
    activate: 'Activar',
    suspend: 'Suspender',
    disable: 'Inhabilitar',
    noClients: 'No hay clientes registrados.',
    updated: 'Estado de cuenta actualizado.',
  },
  mqttDiagnostics: {
    title: 'Diagnóstico MQTT',
    subtitle: 'Verifica rápidamente si el backend está conectado al broker y puede publicar mensajes.',
    status: 'Estado',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    broker: 'Broker',
    clientId: 'Client ID',
    message: 'Mensaje de prueba',
    send: 'Publicar prueba',
    refresh: 'Actualizar estado',
    sent: 'Mensaje publicado correctamente.',
    topic: 'Topic',
  },
  accountStatus: {
    active: 'Activa',
    suspended: 'Suspendida',
    disabled: 'Inhabilitada',
  },
  dashboard: {
    title: 'Panel',
    subtitle: 'Salud de parcelas, mapa NDVI, alertas y próximo vuelo.',
    parcelHealth: 'Salud de la parcela',
    noParcels: 'No hay parcelas configuradas.',
    createParcelLink: 'Ir a Parcelas para crear una',
    nextFlight: 'Próximo vuelo programado',
    parcelLabel: 'Parcela',
    noFlightsScheduled: 'No hay vuelos programados.',
    ndviMap: 'Mapa NDVI',
    recentAlerts: 'Alertas recientes',
  },
  schedule: {
    title: 'Programación',
    subtitle: 'Configura horario y frecuencia de vuelos automáticos del dron.',
    newSchedule: 'Nueva programación',
    editSchedule: 'Editar programación',
    scheduleType: 'Tipo de programación',
    parcel: 'Parcela',
    startTime: 'Hora de inicio',
    frequencyDays: 'Frecuencia (días)',
    enableAutomation: 'Activar automatización',
    save: 'Guardar programación',
    saveChanges: 'Guardar cambios',
    saved: 'Programación guardada correctamente.',
    updated: 'Programación actualizada correctamente.',
    deleted: 'Programación eliminada.',
    activeSchedules: 'Programaciones activas',
    noSchedules: 'Aún no hay programaciones.',
    enabled: 'Activa',
    disabled: 'Inactiva',
    next: 'Próximo',
  },
  flights: {
    title: 'Historial de vuelos',
    subtitle: 'Vuelos del dron e informes de análisis vinculados.',
    flights: 'Vuelos',
    noFlights: 'Aún no hay vuelos registrados.',
    flightId: 'ID de vuelo',
    parcel: 'Parcela',
    status: 'Estado',
    scheduled: 'Programado',
    completed: 'Completado',
    reports: 'Informes',
    noReports: 'Los informes aparecen cuando la severidad ≥ 0.6.',
    severity: 'Severidad',
    download: 'Descargar PDF',
    downloading: 'Descargando…',
  },
  devices: {
    title: 'Dispositivos',
    subtitle: 'Estado del dron, sensores y nido.',
    addTitle: 'Agregar dispositivo',
    editTitle: 'Editar dispositivo',
    name: 'Nombre del dispositivo',
    namePlaceholder: 'Ej. Sensor zona norte',
    type: 'Tipo de dispositivo',
    addButton: 'Registrar dispositivo',
    saveChanges: 'Guardar cambios',
    added: 'Dispositivo registrado correctamente.',
    updated: 'Dispositivo actualizado correctamente.',
    battery: 'Batería',
    lastSeen: 'Última conexión',
    noDevices: 'No hay dispositivos registrados.',
  },
  simulator: {
    title: 'Simulador MQTT',
    subtitle: 'Envía telemetría de prueba al broker local usando topics seguros por usuario y dispositivo.',
    device: 'Dispositivo',
    parcel: 'Parcela',
    flightId: 'ID de vuelo',
    status: 'Estado',
    ndvi: 'NDVI',
    batteryLevel: 'Batería',
    soilMoisture: 'Humedad del suelo',
    nitrogen: 'Nitrógeno',
    phosphorus: 'Fósforo',
    potassium: 'Potasio',
    supplyLevel: 'Nivel de suministro',
    send: 'Enviar telemetría',
    sent: 'Telemetría publicada en MQTT.',
    noDevices: 'Registra primero un dispositivo en la sección Dispositivos.',
    noParcels: 'Registra primero una parcela para simular vuelos.',
    topic: 'Topic publicado',
  },
  alerts: {
    none: 'Aún no hay alertas.',
    severity: 'Severidad',
  },
};

const healthStatus = {
  green: 'Saludable',
  yellow: 'Atención',
  red: 'Crítico',
};

const flightStatus = {
  scheduled: 'Programado',
  started: 'En curso',
  completed: 'Completado',
  failed: 'Fallido',
};

const deviceStatus = {
  online: 'En línea',
  offline: 'Desconectado',
  lowBattery: 'Batería baja',
};

const deviceType = {
  drone: 'Dron',
  sensor: 'Sensor',
  nest: 'Nido',
};

const notificationEvent = {
  flightCompleted: 'Vuelo completado',
  anomalyDetected: 'Anomalía detectada',
  injectionExecuted: 'Inyección ejecutada',
  emergencyAlert: 'Alerta de emergencia',
  deviceLowBattery: 'Batería baja en dispositivo',
  supplyLow: 'Suministro bajo',
};

const cropType = {
  avocado: 'Aguacate',
  corn: 'Maíz',
  wheat: 'Trigo',
  tomato: 'Tomate',
};

const scheduleType = {
  routine: 'Rutina',
  inspection: 'Inspección',
  emergency: 'Emergencia',
};

export function formatDate(value) {
  return new Date(value).toLocaleString('es');
}

export function formatFrequency(days) {
  if (days === 1) return 'Cada 1 día';
  return `Cada ${days} días`;
}

export function getHealthLabel(status) {
  return healthStatus[status] ?? status;
}

export function getFlightStatusLabel(status) {
  return flightStatus[status] ?? status;
}

export function getDeviceStatusLabel(status) {
  return deviceStatus[status] ?? status;
}

export function getDeviceTypeLabel(type) {
  return deviceType[type] ?? type;
}

export function getEventLabel(event) {
  return notificationEvent[event] ?? event;
}

export function getCropTypeLabel(type) {
  if (!type) return ui.parcels.noCrop;
  return cropType[type] ?? type;
}

export function getScheduleTypeLabel(type) {
  return scheduleType[type] ?? type;
}

export function toDatetimeLocal(value) {
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getAccountStatusLabel(status) {
  return ui.accountStatus[status] ?? status;
}
