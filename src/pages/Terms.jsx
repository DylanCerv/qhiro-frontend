import LegalPageShell, { LegalSection } from '../components/LegalPageShell';

const UPDATED = '6 de agosto de 2026';

const TOC = [
  { id: 'aceptacion', label: 'Aceptación de los Términos' },
  { id: 'definiciones', label: 'Definiciones' },
  { id: 'objeto', label: 'Objeto del servicio' },
  { id: 'cuenta', label: 'Registro, cuenta y activación' },
  { id: 'uso', label: 'Uso permitido y prohibido' },
  { id: 'hardware', label: 'Hardware, campo y operación' },
  { id: 'datos', label: 'Datos agrícolas y propiedad' },
  { id: 'ia', label: 'Inteligencia artificial y decisiones' },
  { id: 'disponibilidad', label: 'Disponibilidad y mantenimiento' },
  { id: 'pagos', label: 'Pagos, suspensión e inhabilitación' },
  { id: 'propiedad', label: 'Propiedad intelectual' },
  { id: 'responsabilidad', label: 'Limitación de responsabilidad' },
  { id: 'indemnidad', label: 'Indemnidad' },
  { id: 'terminacion', label: 'Terminación' },
  { id: 'modificaciones', label: 'Modificaciones' },
  { id: 'ley', label: 'Ley aplicable y controversias' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Terms() {
  return (
    <LegalPageShell title="Términos y Condiciones de Uso" updatedAt={UPDATED} active="terms">
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

      <LegalSection id="aceptacion" title="1. Aceptación de los Términos">
        <p>
          Los presentes Términos y Condiciones de Uso (en adelante, los “Términos”) regulan el acceso
          y la utilización de la plataforma digital, aplicaciones web, interfaces de programación,
          consolas de operación y servicios asociados de Qhiro Symbiotic (en adelante, “Qhiro”, “la
          Plataforma” o “nosotros”).
        </p>
        <p>
          Al solicitar acceso, crear una cuenta, iniciar sesión o utilizar cualquier funcionalidad de
          la Plataforma, usted (en adelante, el “Usuario” o “usted”) declara haber leído, comprendido
          y aceptado estos Términos en su integridad, así como la Política de Privacidad vigente. Si
          no está de acuerdo, debe abstenerse de registrarse o de continuar usando el servicio.
        </p>
        <p>
          Si actúa en nombre de una persona jurídica, garantiza que cuenta con facultades suficientes
          para vincularla a estos Términos.
        </p>
      </LegalSection>

      <LegalSection id="definiciones" title="2. Definiciones">
        <p>Para efectos de estos Términos, se entenderá por:</p>
        <ul>
          <li>
            <strong>Plataforma:</strong> el software SaaS de Qhiro Symbiotic, incluyendo paneles de
            cliente y administración, mapas de parcelas, programación de misiones, historial de
            actividad, gestión de dispositivos y diagnóstico técnico.
          </li>
          <li>
            <strong>Qhiro Core:</strong> el componente de inteligencia que procesa variables
            agronómicas, genera diagnósticos y puede emitir órdenes operativas hacia nodos del
            ecosistema.
          </li>
          <li>
            <strong>Ecosistema simbiótico:</strong> el conjunto de nodos conceptuales y/o físicos
            denominados El Nido, Los Centinelas y El Vigía, coordinados mediante la Plataforma.
          </li>
          <li>
            <strong>Cuenta:</strong> el perfil de Usuario asociado a credenciales de autenticación y
            a un estado operativo (pendiente, activa, suspendida o inhabilitada).
          </li>
          <li>
            <strong>Datos de Campo:</strong> información agrícola e IoT generada o cargada en la
            Plataforma, incluyendo parcelas, coordenadas, cultivos, telemetría, NDVI, nutrientes,
            alertas, reportes e imágenes asociadas a misiones.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="objeto" title="3. Objeto del servicio">
        <p>
          Qhiro ofrece una plataforma de agrotecnología orientada a la gestión, monitoreo y apoyo a
          la aplicación focalizada de insumos mediante robótica aérea, infraestructura de campo e
          inteligencia artificial. El servicio puede incluir, según el plan y el estado de
          despliegue:
        </p>
        <ul>
          <li>creación y edición de parcelas georreferenciadas;</li>
          <li>registro y seguimiento de dispositivos (drones, sensores, nidos, centinelas);</li>
          <li>programación de vuelos o misiones;</li>
          <li>visualización de telemetría, alertas, reportes e historial de actividad;</li>
          <li>
            procesamiento asistido por inteligencia artificial sobre datos e imágenes de cultivo;
          </li>
          <li>
            intercambio de mensajes técnicos vía protocolos IoT (incluido MQTT) entre la Plataforma y
            dispositivos autorizados.
          </li>
        </ul>
        <p>
          Salvo acuerdo escrito en contrario, la Plataforma se presta “tal cual” (as is) y “según
          disponibilidad”. La existencia de hardware en campo, instalaciones o mantenimiento físico
          puede regirse por contratos, cotizaciones o anexos comerciales separados.
        </p>
      </LegalSection>

      <LegalSection id="cuenta" title="4. Registro, cuenta y activación">
        <p>
          Para solicitar acceso, el Usuario debe proporcionar información veraz, completa y
          actualizada, incluyendo como mínimo: nombre o razón social de contacto, correo
          electrónico, país y una contraseña segura. La Plataforma puede asociar una ubicación
          referencial basada en el país seleccionado para inicializar mapas y configuraciones.
        </p>
        <h3>4.1. Estado pendiente</h3>
        <p>
          Toda solicitud de registro genera una cuenta en estado <strong>pendiente</strong>. Mientras
          la cuenta no sea activada por Qhiro, el Usuario no tendrá acceso operativo a los paneles
          protegidos de la Plataforma, aun cuando las credenciales de autenticación existan.
        </p>
        <h3>4.2. Activación y roles</h3>
        <p>
          Qhiro se reserva el derecho de aceptar, rechazar o condicionar la activación de una cuenta
          a su sola discreción razonable (evaluación comercial, técnica, de seguridad o de
          cumplimiento). Existen roles diferenciados, incluyendo cuentas de cliente y cuentas de
          administración técnica. El Usuario cliente no debe intentar acceder a funciones
          administrativas reservadas.
        </p>
        <h3>4.3. Seguridad de credenciales</h3>
        <p>
          El Usuario es responsable de custodiar sus credenciales, del uso de su cuenta y de
          notificar de inmediato cualquier acceso no autorizado. Qhiro podrá invalidar sesiones,
          exigir restablecimiento de contraseña o restringir el acceso ante indicios de
          compromiso.
        </p>
      </LegalSection>

      <LegalSection id="uso" title="5. Uso permitido y prohibido">
        <p>El Usuario se obliga a utilizar la Plataforma de forma lícita y conforme a estos Términos. Queda prohibido, entre otras conductas:</p>
        <ul>
          <li>usar la Plataforma para fines ilícitos, fraudulentos o que vulneren derechos de terceros;</li>
          <li>intentar eludir controles de autenticación, autorización o estado de cuenta;</li>
          <li>
            interferir con brokers MQTT, APIs, telemetría, dispositivos de otros usuarios o
            infraestructura de Qhiro;
          </li>
          <li>
            realizar ingeniería inversa, extracción masiva no autorizada de datos, scraping abusivo o
            ataques de denegación de servicio;
          </li>
          <li>
            cargar contenido malicioso, imágenes o datos que infrinjan propiedad intelectual o
            privacidad de terceros;
          </li>
          <li>
            presentar diagnósticos o reportes generados por la Plataforma como certificación oficial
            agronómica, sanitaria o regulatoria, salvo autorización expresa.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="hardware" title="6. Hardware, campo y operación">
        <p>
          La Plataforma puede interactuar con dispositivos de campo. El Usuario reconoce que la
          operación agrícola implica riesgos inherentes (clima, plagas, fallos mecánicos, conectividad,
          energía, error humano en recargas o mantenimiento). Salvo contrato de servicio de campo
          específico:
        </p>
        <ul>
          <li>
            el Usuario es responsable de la instalación segura, permisos locales, seguridad laboral y
            cumplimiento normativo aplicable a su lote;
          </li>
          <li>
            el Usuario debe mantener recargas, insumos, energía y condiciones físicas mínimas para el
            funcionamiento de nodos;
          </li>
          <li>
            las intervenciones humanas residuales (alertas no resolubles por el sistema, recargas de
            componentes, mantenimiento) son responsabilidad del Usuario o de su personal autorizado.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="datos" title="7. Datos agrícolas y propiedad">
        <p>
          Sin perjuicio de lo establecido en la Política de Privacidad, los Datos de Campo que el
          Usuario genere o introduzca en el marco de su operación agrícola le pertenecen en cuanto
          contenido de negocio. Qhiro conserva todos los derechos sobre la Plataforma, Qhiro Core,
          modelos, software, interfaces, marcas y documentación.
        </p>
        <p>
          El Usuario otorga a Qhiro una licencia no exclusiva, mundial y limitada para hospedar,
          procesar, transmitir, respaldar y analizar los Datos de Campo con el único fin de prestar,
          proteger, mejorar y soportar el servicio, incluyendo el entrenamiento o ajuste de
          componentes analíticos en forma agregada o seudonimizada cuando sea técnicamente viable y
          conforme a la Política de Privacidad.
        </p>
      </LegalSection>

      <LegalSection id="ia" title="8. Inteligencia artificial y decisiones">
        <p>
          Qhiro Core y los módulos de análisis pueden producir diagnósticos, recomendaciones,
          estimaciones (por ejemplo NDVI/salud vegetal) y órdenes hacia dispositivos. Dichos
          resultados son de carácter asistivo y probabilístico. El Usuario reconoce que:
        </p>
        <ul>
          <li>
            no constituyen asesoría agronómica personalizada certificada ni garantía de rendimiento,
            ahorro de insumos o ausencia de pérdidas;
          </li>
          <li>
            la calidad de la inferencia depende de la calidad de sensores, imágenes, calibración,
            conectividad y condiciones ambientales;
          </li>
          <li>
            el Usuario debe validar decisiones críticas con personal competente antes de aplicar
            insumos o alterar operaciones a gran escala.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="disponibilidad" title="9. Disponibilidad y mantenimiento">
        <p>
          Qhiro procurará mantener la Plataforma operativa, sin garantizar disponibilidad ininterrumpida
          ni ausencia de errores. Podrán existir ventanas de mantenimiento, degradaciones por
          terceros (proveedores de nube, mapas, mensajería IoT, autenticación) o fuerza mayor.
        </p>
      </LegalSection>

      <LegalSection id="pagos" title="10. Pagos, suspensión e inhabilitación">
        <p>
          Cuando el acceso a la Plataforma o a módulos asociados esté sujeto a contraprestación,
          condiciones comerciales o periodos de prueba, el incumplimiento de pago, la sospecha
          fundada de fraude, el uso indebido o razones de seguridad podrán dar lugar a la
          suspensión o inhabilitación de la cuenta, con la consiguiente restricción de acceso a
          paneles, APIs y dispositivos vinculados.
        </p>
        <p>
          Qhiro podrá comunicar la medida a la dirección de correo asociada a la cuenta. La
          reactivación podrá condicionarse al saneamiento de la causa que originó la restricción.
        </p>
      </LegalSection>

      <LegalSection id="propiedad" title="11. Propiedad intelectual">
        <p>
          Quedan reservados todos los derechos de propiedad intelectual e industrial sobre Qhiro
          Symbiotic, Qhiro Core, nombres comerciales, logotipos, diseños de interfaz, código fuente,
          documentación y materiales relacionados. Queda prohibida su reproducción, distribución,
          modificación o explotación sin autorización previa y por escrito de Qhiro.
        </p>
      </LegalSection>

      <LegalSection id="responsabilidad" title="12. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la ley aplicable, Qhiro no será responsable por daños
          indirectos, lucro cesante, pérdida de cosecha, pérdida de datos, daño reputacional o
          consequential damages derivados del uso o la imposibilidad de uso de la Plataforma, de
          recomendaciones de IA, de fallos de conectividad IoT o de actos de terceros.
        </p>
        <p>
          La responsabilidad total acumulada de Qhiro frente al Usuario por cualquier reclamo
          relacionado con estos Términos o el servicio se limitará, en conjunto, al monto efectivamente
          pagado por el Usuario a Qhiro por el servicio durante los doce (12) meses anteriores al
          hecho generador o, si no hubiera pagos, a cero (0), salvo dolo o culpa grave cuando la ley
          no permita dicha limitación.
        </p>
      </LegalSection>

      <LegalSection id="indemnidad" title="13. Indemnidad">
        <p>
          El Usuario se obliga a mantener indemne a Qhiro, sus afiliados, directores, empleados y
          contratistas frente a reclamos, sanciones, costos y honorarios razonables de abogados
          derivados del uso indebido de la Plataforma, del incumplimiento de estos Términos, de la
          violación de derechos de terceros o del manejo de insumos, personal y operaciones en campo.
        </p>
      </LegalSection>

      <LegalSection id="terminacion" title="14. Terminación">
        <p>
          El Usuario puede dejar de usar la Plataforma en cualquier momento. Qhiro puede terminar o
          restringir el acceso ante incumplimiento material de estos Términos, por cierre del
          servicio o por mandato legal. Tras la terminación, cesará el derecho de uso de la
          Plataforma, sin perjuicio de las obligaciones que por su naturaleza deban sobrevivir
          (propiedad intelectual, limitación de responsabilidad, confidencialidad y pagos adeudados).
        </p>
      </LegalSection>

      <LegalSection id="modificaciones" title="15. Modificaciones">
        <p>
          Qhiro podrá actualizar estos Términos para reflejar cambios del servicio, requisitos
          legales o mejoras de seguridad. La versión vigente se publicará en esta página con su fecha
          de actualización. El uso continuado de la Plataforma después de la publicación constituirá
          aceptación de los cambios, salvo que la ley exija un consentimiento específico.
        </p>
      </LegalSection>

      <LegalSection id="ley" title="16. Ley aplicable y controversias">
        <p>
          Estos Términos se interpretarán de conformidad con las leyes aplicables en el domicilio del
          prestador del servicio Qhiro Symbiotic, sin perjuicio de normas imperativas de protección
          al consumidor que resulten irrenunciables en la jurisdicción del Usuario.
        </p>
        <p>
          Las partes procurarán resolver de buena fe cualquier controversia. De no alcanzarse un
          acuerdo, serán competentes los tribunales correspondientes según la ley aplicable, salvo
          pacto arbitral escrito posterior.
        </p>
      </LegalSection>

      <LegalSection id="contacto" title="17. Contacto">
        <p>
          Para notificaciones relacionadas con estos Términos, escriba a{' '}
          <a href="mailto:hola@qhiro.tech">hola@qhiro.tech</a>.
        </p>
      </LegalSection>

      <p className="legal-note">
        <strong>Aviso:</strong> este documento constituye el marco contractual de uso de la
        Plataforma Qhiro Symbiotic según su diseño y operación actuales. No reemplaza asesoría legal
        personalizada para contratos de suministro de hardware, seguros agrícolas o regulaciones
        locales específicas del cultivo o del país del Usuario.
      </p>
    </LegalPageShell>
  );
}
