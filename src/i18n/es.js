export const ui = {
  brandSubtitle: 'Agricultura inteligente MVP',
  nav: {
    dashboard: 'Panel',
    parcels: 'Parcelas',
    schedule: 'Programación',
    activity: 'Actividad',
    devices: 'Dispositivos',
    admin: 'Clientes',
    missionSimulator: 'Misiones',
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
    tagline:
      'Un ecosistema agrícola autónomo: robótica aérea, infraestructura de campo e inteligencia artificial como un solo organismo.',
    heroTitle: 'Ahorra insumos. Detecta plagas antes. Cero personas dentro del lote.',
    heroLead:
      'Qhiro Symbiotic monitorea tu cultivo, decide en el borde y aplica la dosis exacta solo donde hace falta —sin maquinaria pesada ni fumigación masiva.',
    heroMicro: 'Sin compromiso técnico inicial. Te mostramos el sistema y evaluamos tu lote.',
    ctaLogin: 'Iniciar sesión',
    ctaPrimary: 'Solicitar acceso',
    ctaSecondary: 'Ver cómo funciona',
    ctaRegister: 'Solicitar acceso',
    ctaWatch: 'Ver cómo funciona',
    midCtaAfterSolution: '¿Listo para llevar precisión quirúrgica a tu campo?',
    backHome: 'Volver al inicio',
    problem: {
      eyebrow: 'El problema que resuelves',
      title: 'Tu campo no debería operar a ciegas, con fuerza bruta y en promedios.',
      lead: 'Si sigues fumigando todo por un brote localizado, pierdes agua, químico, tiempo y rendimiento.',
      items: [
        {
          title: 'Dependencia humana',
          desc: 'Cada decisión y cada aplicación exige que alguien esté en el lote, en el momento justo.',
        },
        {
          title: 'Maquinaria pesada',
          desc: 'Tractores y equipos que compactan el suelo, dañan el cultivo y exigen logística costosa.',
        },
        {
          title: 'Fumigación masiva',
          desc: 'Se trata todo el campo por un brote localizado: se desperdicia agua, químico y dinero.',
        },
        {
          title: 'Diagnóstico tardío',
          desc: 'El estrés hídrico, las plagas y las deficiencias se ven cuando ya causaron pérdida.',
        },
      ],
    },
    product: {
      eyebrow: 'La solución',
      title: 'Un ecosistema autónomo que vigila, decide y actúa por ti.',
      lead: 'Robótica aérea, infraestructura desplegable e inteligencia artificial —Qhiro Core— trabajando como un solo organismo.',
      pillars: [
        {
          title: 'Red viva de nodos',
          desc: 'El Nido, los Centinelas y El Vigía se coordinan entre sí, no en cadena de mando humana.',
        },
        {
          title: 'Precisión quirúrgica',
          desc: 'Dosis exacta, solo donde se necesita, en el momento en que se necesita.',
        },
        {
          title: 'Prevención, no reacción',
          desc: 'Detecta plagas y microestrés térmico antes de que sean visibles.',
        },
      ],
    },
    videos: {
      eyebrow: 'Míralo en acción',
      title: 'Primero ves el resultado. Luego entiendes el sistema.',
      lead: 'Un video muestra la simulación de intervención. El otro explica qué es Qhiro Symbiotic de verdad.',
      simulation: {
        title: 'Simulación: el problema resuelto',
        desc: 'Cómo el sistema detecta, decide e interviene sin personas dentro del cultivo.',
      },
      explain: {
        title: 'Explicación: qué es realmente',
        desc: 'El Nido, los Centinelas, El Vigía y Qhiro Core trabajando como un organismo.',
      },
    },
    capabilities: {
      eyebrow: 'Qué ganas en operación',
      title: 'Cuatro capacidades. Un solo resultado: menos desperdicio.',
      lead: 'Monitoreo continuo, aplicación focalizada, control en el borde y hardware que se protege solo.',
      items: [
        {
          title: 'Monitoreo multiespectral continuo',
          desc: 'Datos de suelo, follaje y salud vegetal (NDVI) de forma automatizada.',
        },
        {
          title: 'Aplicación focalizada',
          desc: 'Micro-aspersión desde torres que se elevan sobre el dosel solo donde se necesita.',
        },
        {
          title: 'Gobernanza en el borde',
          desc: 'Qhiro Core procesa variables agronómicas y redistribuye caudales vía LoRa Mesh.',
        },
        {
          title: 'Hardware protegido',
          desc: 'Los nodos se repliegan en reposo: menos interferencia con clima y maquinaria.',
        },
      ],
    },
    architecture: {
      eyebrow: 'El sistema',
      title: 'Tres nodos. Una inteligencia.',
      lead: 'Interconectados por fluido bi-canal y comunicación en red.',
      nodes: [
        {
          role: 'Centro de operaciones',
          name: 'El Nido',
          desc: 'Contenedor modular en el perímetro: módulo aéreo, hidráulico y energético/control.',
        },
        {
          role: 'Torres desplegables',
          name: 'Los Centinelas',
          desc: 'Nodos en tierra que emergen para asperjar y se repliegan al terminar.',
        },
        {
          role: 'El ojo aéreo',
          name: 'El Vigía',
          desc: 'Dron modular con RTK y sensores multiespectrales que mapea e interviene.',
        },
      ],
      core: 'Qhiro Core gobierna los tres nodos: procesa en el borde, decide y reconfigura el plan al instante.',
    },
    cycle: {
      eyebrow: 'Cómo funciona',
      title: 'Del diagnóstico a la intervención en un ciclo cerrado.',
      lead: 'Cada intervención alimenta el siguiente diagnóstico.',
      steps: [
        {
          title: 'Exploración',
          desc: 'El Vigía mapea el lote. Los Centinelas reportan cada zona.',
        },
        {
          title: 'Diagnóstico',
          desc: 'Qhiro Core procesa imágenes y lecturas climáticas.',
        },
        {
          title: 'Mezcla',
          desc: 'El Nido prepara la fórmula exacta y la envía por la red bi-canal.',
        },
        {
          title: 'Aspersión',
          desc: 'Los Centinelas del sector afectado aplican y se repliegan.',
        },
      ],
      principle:
        'La tierra habla, el aire observa, la IA piensa y el hardware ejecuta.',
    },
    results: {
      eyebrow: 'Resultado',
      title: 'Intervención quirúrgica. Cero personas en el lote.',
      lead: 'Diseño del sistema según el cierre de una misión autónoma.',
      items: [
        { value: '98.4%', label: 'ahorro de insumo vs. método tradicional' },
        { value: '35 ml', label: 'aplicados solo sobre el foco' },
        { value: '12 ha', label: 'escaneadas en una misión' },
        { value: '0', label: 'personas dentro del lote' },
      ],
      quote:
        'Misión completada. 12 hectáreas escaneadas. Anomalía detectada. Intervención quirúrgica ejecutada con éxito.',
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Respuestas claras antes de pedir acceso.',
      lead: 'Lo que suelen preguntar productores y equipos técnicos al evaluar Qhiro.',
      items: [
        {
          q: '¿Reemplaza a mi equipo de campo?',
          a: 'El sistema monitorea solo: casi no hace falta que una persona vigile. Solo hay intervención humana cuando Qhiro avisa un problema que no puede resolver, o cuando hay que recargar componentes para las mezclas.',
        },
        {
          q: '¿Cómo me hace ahorrar en fumigación?',
          a: 'Dejas de tratar el lote completo por un brote localizado. Qhiro aplica solo donde hace falta, así reduces químico, agua y costo en las zonas sanas que antes fumigabas por inercia.',
        },
        {
          q: '¿Qué necesito para empezar?',
          a: 'Solicitas acceso y queda una solicitud pendiente. Revisamos tu lote y te avisamos cuando el acceso esté listo.',
        },
      ],
    },
    closing: {
      eyebrow: 'Siguiente paso',
      title: 'Solicita acceso y ve cómo Qhiro operaría en tu cultivo.',
      lead: 'Te mostramos la simulación, la arquitectura y el plan para llevar precisión quirúrgica a tu lote.',
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
    pendingTitle: 'Solicitud recibida',
    pendingMessage:
      'Tu cuenta quedó registrada pero aún no está activa. Te contactaremos cuando el acceso esté listo.',
    pendingBack: 'Volver al inicio',
    accountPending:
      'Tu cuenta está pendiente de activación. Todavía no puedes entrar a la plataforma.',
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
    zoneId: 'Zona',
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
    subtitle: 'Vista de clientes y solicitudes de acceso.',
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
  missionSimulator: {
    title: 'Simulador de Misiones',
    subtitle: 'Haz clic en el mapa, sube una imagen del dron y observa el diagnóstico, la acción y el timeline completo.',
  },
  accountStatus: {
    pending: 'Pendiente',
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
    title: 'Programación de vuelos',
    subtitle: 'Gestión de misiones autónomas y telemetría de flota.',
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
    subtitle: 'Estado del dron, nido y centinelas.',
    addTitle: 'Agregar dispositivo',
    editTitle: 'Editar dispositivo',
    name: 'Nombre del dispositivo',
    namePlaceholder: 'Ej. Sensor zona norte',
    nameOptional: 'Nombre (opcional)',
    nameOptionalPlaceholder: 'Se genera automáticamente si lo dejas vacío',
    type: 'Tipo de dispositivo',
    addButton: 'Registrar dispositivo',
    saveChanges: 'Guardar cambios',
    added: 'Dispositivo registrado correctamente.',
    updated: 'Dispositivo actualizado correctamente.',
    deleted: 'Dispositivo eliminado correctamente.',
    deleteConfirm: '¿Eliminar este dispositivo? Esta acción no se puede deshacer.',
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
  sentinel: 'Centinela',
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
