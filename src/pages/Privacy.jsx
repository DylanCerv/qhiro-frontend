import LegalPageShell, { LegalSection } from '../components/LegalPageShell';

const UPDATED = '6 de agosto de 2026';

const TOC = [
  { id: 'responsable', label: 'Responsable del tratamiento' },
  { id: 'ambito', label: 'Ámbito de aplicación' },
  { id: 'datos', label: 'Datos que tratamos' },
  { id: 'finalidades', label: 'Finalidades y bases' },
  { id: 'cuenta', label: 'Registro y estados de cuenta' },
  { id: 'campo', label: 'Datos de campo e IoT' },
  { id: 'terceros', label: 'Encargados y terceros' },
  { id: 'transferencias', label: 'Transferencias y alojamiento' },
  { id: 'conservacion', label: 'Conservación' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'derechos', label: 'Derechos del titular' },
  { id: 'cookies', label: 'Cookies y almacenamiento local' },
  { id: 'menores', label: 'Menores de edad' },
  { id: 'cambios', label: 'Cambios a esta política' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Privacy() {
  return (
    <LegalPageShell title="Política de Privacidad" updatedAt={UPDATED} active="privacy">
      <nav className="legal-toc" aria-label="Índice">
        <p className="legal-toc-label">Índice</p>
        <ol className="legal-toc-list">
          {TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <LegalSection id="responsable" title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de los datos personales tratados a través de la plataforma
          Qhiro Symbiotic (la “Plataforma”) es Qhiro Symbiotic, contactable en{' '}
          <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a> (en adelante, “Qhiro”, “nosotros” o
          “el Responsable”).
        </p>
        <p>
          Esta Política describe qué datos recogemos, para qué los usamos, con quién los compartimos
          y qué derechos le asisten. Debe leerse junto con los Términos y Condiciones de Uso.
        </p>
      </LegalSection>

      <LegalSection id="ambito" title="2. Ámbito de aplicación">
        <p>Esta Política aplica a:</p>
        <ul>
          <li>visitantes de la página de presentación (landing);</li>
          <li>solicitantes de acceso y usuarios registrados (clientes y administradores);</li>
          <li>
            el uso de paneles web, APIs, telemetría IoT vinculada a la cuenta y funcionalidades de
            soporte técnico.
          </li>
        </ul>
        <p>
          No controlamos sitios de terceros enlazados desde la Plataforma (por ejemplo, proveedores
          de mapas). Su uso se rige por las políticas de esos terceros.
        </p>
      </LegalSection>

      <LegalSection id="datos" title="3. Datos que tratamos">
        <h3>3.1. Datos de identificación y cuenta</h3>
        <ul>
          <li>nombre o nombre para mostrar;</li>
          <li>correo electrónico;</li>
          <li>contraseña (almacenada/gestionada mediante el proveedor de autenticación; Qhiro no almacena la contraseña en texto claro);</li>
          <li>país;</li>
          <li>
            ubicación referencial (latitud/longitud aproximada asociada al país seleccionado para
            inicializar mapas; no constituye geolocalización GPS continua del dispositivo del
            Usuario, salvo que en el futuro se habilite y acepte expresamente);
          </li>
          <li>rol (cliente o administrador) y estado de cuenta (pendiente, activa, suspendida, inhabilitada);</li>
          <li>fecha de creación y actualización del perfil.</li>
        </ul>

        <h3>3.2. Datos de uso técnico</h3>
        <ul>
          <li>token de sesión / identificador de autenticación almacenado en el navegador;</li>
          <li>registros técnicos de acceso a APIs y errores necesarios para seguridad y soporte;</li>
          <li>
            permisos del navegador para notificaciones locales del panel, cuando el Usuario los
            concede.
          </li>
        </ul>

        <h3>3.3. Datos de campo, agricultura e IoT</h3>
        <ul>
          <li>parcelas: nombre, tipo de cultivo, zona, polígonos/coordenadas;</li>
          <li>indicadores agronómicos: NDVI, estado de salud, humedad y nutrientes cuando estén disponibles;</li>
          <li>dispositivos: identificadores, tipo (dron, sensor, nido, centinela), estado, batería, última conexión;</li>
          <li>programaciones de vuelo/misión y su historial;</li>
          <li>alertas, reportes de diagnóstico y archivos asociados (por ejemplo PDF de reporte);</li>
          <li>
            telemetría y cargas útiles intercambiadas con dispositivos (incluyendo metadatos de
            misión y, cuando aplique, referencias o contenidos de imagen procesados por módulos de
            análisis);
          </li>
          <li>registros de acciones/comandos enviados a dispositivos y sus acuses (ACK).</li>
        </ul>

        <h3>3.4. Datos opcionales futuros</h3>
        <p>
          La arquitectura contempla tokens de mensajería push (FCM) para notificaciones. Si se
          habilitan, se tratarán conforme a esta Política y se solicitará el consentimiento o base
          jurídica que corresponda.
        </p>
      </LegalSection>

      <LegalSection id="finalidades" title="4. Finalidades y bases del tratamiento">
        <p>Tratamos datos personales para las siguientes finalidades:</p>
        <ul>
          <li>
            <strong>Prestación del servicio:</strong> crear y gestionar la cuenta, autenticar
            accesos, mostrar paneles, mapas, dispositivos, misiones y reportes.
          </li>
          <li>
            <strong>Activación y administración:</strong> evaluar solicitudes pendientes, aplicar
            estados de cuenta y operar consolas técnicas de administración.
          </li>
          <li>
            <strong>Operación IoT y seguridad:</strong> recibir telemetría, emitir comandos
            autorizados, detectar anomalías y proteger la integridad del sistema.
          </li>
          <li>
            <strong>Mejora del producto:</strong> depurar fallos, medir rendimiento y mejorar
            modelos analíticos, preferentemente con datos agregados o seudonimizados.
          </li>
          <li>
            <strong>Comunicaciones:</strong> responder solicitudes, notificar cambios relevantes del
            servicio o del estado de la cuenta, y enviar enlaces de restablecimiento de contraseña.
          </li>
          <li>
            <strong>Cumplimiento legal:</strong> atender requerimientos de autoridad competente y
            obligaciones regulatorias aplicables.
          </li>
        </ul>
        <p>
          Las bases jurídicas pueden incluir la ejecución de un contrato o medidas precontractuales
          (solicitud de acceso), el interés legítimo en securizar y mejorar la Plataforma, el
          consentimiento cuando sea legalmente exigible, y el cumplimiento de obligaciones legales.
        </p>
      </LegalSection>

      <LegalSection id="cuenta" title="5. Registro y estados de cuenta">
        <p>
          Al registrarse, su cuenta permanece <strong>pendiente</strong> hasta activación. En ese
          estado no se concede acceso a los paneles protegidos. Qhiro puede rechazar o demorar la
          activación por motivos comerciales, técnicos o de seguridad.
        </p>
        <p>
          Las cuentas pueden pasar a estados suspendida o inhabilitada. La inhabilitación puede
          implicar el bloqueo de la identidad de autenticación asociada, impidiendo nuevos inicios
          de sesión hasta regularización.
        </p>
      </LegalSection>

      <LegalSection id="campo" title="6. Datos de campo e IoT">
        <p>
          Los Datos de Campo pueden incluir información sensible desde el punto de vista comercial
          (ubicación de cultivos, prácticas de aplicación, telemetría). Qhiro los trata como
          confidenciales de servicio y no los vende a terceros con fines publicitarios.
        </p>
        <p>
          El procesamiento analítico (incluido análisis asistido por inteligencia artificial) puede
          ocurrir en infraestructura de Qhiro o de proveedores de cómputo autorizados, con el fin
          exclusivo de generar diagnósticos, alertas u órdenes operativas vinculadas a su cuenta.
        </p>
      </LegalSection>

      <LegalSection id="terceros" title="7. Encargados y terceros">
        <p>Para operar la Plataforma podemos recurrir a proveedores que tratan datos por cuenta de Qhiro, entre ellos:</p>
        <ul>
          <li>
            <strong>Firebase (Google):</strong> autenticación de usuarios, base de datos, almacenamiento
            de archivos (p. ej. reportes) y, eventualmente, mensajería push;
          </li>
          <li>
            <strong>Infraestructura de servidor y broker MQTT:</strong> para APIs, telemetría y
            comandos hacia dispositivos;
          </li>
          <li>
            <strong>Servicios de análisis / IA:</strong> para procesar datos o imágenes de misión y
            devolver resultados a la Plataforma;
          </li>
          <li>
            <strong>Proveedores de mapas:</strong> teselas cartográficas mostradas en el navegador
            (p. ej. servicios de mapas satelitales u OpenStreetMap);
          </li>
          <li>
            <strong>Hosting / CDN front-end:</strong> despliegue de la aplicación web (p. ej.
            plataformas de hosting que sirven el cliente y pueden enrutar tráfico hacia backends).
          </li>
        </ul>
        <p>
          Estos terceros solo deben tratar datos según nuestras instrucciones y medidas de seguridad
          razonables, sin perjuicio de sus propias políticas cuando actúan como responsables
          independientes (por ejemplo, al cargar recursos de mapa en su navegador).
        </p>
      </LegalSection>

      <LegalSection id="transferencias" title="8. Transferencias y alojamiento">
        <p>
          Los datos pueden almacenarse y procesarse en servidores ubicados fuera del país del
          Usuario, incluyendo infraestructura de nube y centros de cómputo utilizados por Qhiro o
          sus proveedores. Al usar la Plataforma, usted comprende que tales transferencias son
          necesarias para la prestación del servicio y se realizan con salvaguardas técnicas y
          organizativas adecuadas en la medida razonable.
        </p>
      </LegalSection>

      <LegalSection id="conservacion" title="9. Conservación">
        <p>
          Conservamos los datos mientras la cuenta exista y sea necesario para prestar el servicio,
          cumplir obligaciones legales, resolver disputas y asegurar la Plataforma. Los registros
          técnicos y de telemetría pueden conservarse por periodos limitados según necesidades
          operativas y de auditoría. Tras la baja o inhabilitación definitiva, podremos eliminar o
          anonimizar datos personales cuando no exista otra base legítima de conservación.
        </p>
      </LegalSection>

      <LegalSection id="seguridad" title="10. Seguridad">
        <p>
          Aplicamos medidas razonables de seguridad técnica y organizativa, incluyendo
          autenticación basada en tokens, control de acceso por roles, comunicación cifrada en
          tránsito hacia servicios compatibles (HTTPS/TLS cuando está habilitado) y restricciones de
          API según estado de cuenta. Ningún sistema es 100% seguro; el Usuario también debe
          proteger sus credenciales y dispositivos de acceso.
        </p>
      </LegalSection>

      <LegalSection id="derechos" title="11. Derechos del titular">
        <p>
          Conforme a la normativa aplicable de protección de datos, usted puede solicitar acceso,
          rectificación, actualización, eliminación, oposición, limitación del tratamiento o
          portabilidad de sus datos personales, cuando corresponda. Para ejercer estos derechos,
          escriba a <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a> indicando su correo de
          cuenta y la solicitud concreta. Podremos verificar su identidad antes de responder.
        </p>
        <p>
          También puede presentar reclamos ante la autoridad de protección de datos competente en su
          jurisdicción.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="12. Cookies y almacenamiento local">
        <p>
          La Plataforma utiliza almacenamiento local del navegador para mantener la sesión de
          autenticación (token) y el funcionamiento del cliente web. Pueden emplearse cookies o
          tecnologías similares estrictamente necesarias para seguridad y sesión. No utilizamos, en
          la configuración actual del producto, redes publicitarias de seguimiento de terceros con
          fines de marketing comportamental.
        </p>
      </LegalSection>

      <LegalSection id="menores" title="13. Menores de edad">
        <p>
          La Plataforma está dirigida a profesionales y organizaciones agrícolas. No está destinada
          a menores de edad. Si tiene indicios de que un menor ha proporcionado datos personales,
          contáctenos para proceder a su eliminación cuando corresponda.
        </p>
      </LegalSection>

      <LegalSection id="cambios" title="14. Cambios a esta política">
        <p>
          Podemos actualizar esta Política para reflejar cambios del servicio o de la ley. La fecha
          de “Última actualización” indica la versión vigente. El uso continuado de la Plataforma
          después de cambios materiales implica el conocimiento de la nueva versión, sin perjuicio
          de obligaciones de consentimiento cuando la ley lo exija.
        </p>
      </LegalSection>

      <LegalSection id="contacto" title="15. Contacto">
        <p>
          Para privacidad y ejercicio de derechos: {' '}
          <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a>.
        </p>
      </LegalSection>

      <p className="legal-note">
        <strong>Transparencia operativa:</strong> esta Política refleja el tratamiento real del
        sistema Qhiro Symbiotic (registro pendiente, Firebase Auth/Firestore/Storage, telemetría MQTT,
        parcelas, dispositivos, reportes/IA y paneles cliente/admin). Si habilita módulos adicionales
        (p. ej. FCM o geolocalización precisa del navegador), se actualizará este documento.
      </p>
    </LegalPageShell>
  );
}
