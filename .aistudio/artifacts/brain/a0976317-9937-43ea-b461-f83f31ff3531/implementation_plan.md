# AvaZK Identity: Identidad Digital On-Chain Soberana en Avalanche

AvaZK Identity es una plataforma descentralizada de identidad digital soberana desplegada conceptualmente sobre la red Avalanche (C-Chain y Subnets). Permite a los usuarios emitir y gestionar credenciales verificables y medallas de actividad en formato ERC-721/Soulbound NFT, generando pruebas de conocimiento cero (ZK-Proofs) para validar su solvencia DeFi, participación en gobernanza DAO y reputación on-chain sin exponer direcciones de wallets personales, saldos exactos ni datos confidenciales. Incorpora además interoperabilidad cross-chain nativa impulsada por Avalanche Teleporter y Avalanche Warp Messaging (AWM).

---

## Decisiones Críticas y Confirmaciones de Usuario

> [!IMPORTANT]
> A continuación se resumen las decisiones acordadas durante la fase de clarificación interactiva y los parámetros arquitectónicos adoptados para el desarrollo.

- **Caso de uso principal y credenciales**: Reputación Web3 y méritos DeFi/DAO verificables (ej. volumen transaccionado $> 50$k USD, antigüedad $> 1$ año, participación en votaciones Snapshot/Tally, tenedor sin liquidaciones, nivel de staking).
- **Mecanismo ZK-Proof**: Generador interactivo de pruebas de conocimiento cero con **revelación selectiva de atributos** (Selective Disclosure) utilizando compromisos criptográficos (Pedersen Commitments / Hash Merkle Trees) para demostrar enunciados booleanos ("Tengo más de X fondos sin revelar mi balance exacto", "Voté en más de 5 propuestas sin revelar mi wallet").
- **Interoperabilidad Cross-Chain**: Avalanche Teleporter nativo con protocolo Avalanche Warp Messaging (AWM) para teletransportar y verificar atestaciones criptográficas entre la C-Chain de Avalanche y subnets/redes compatibles.
- **Custodia y Conexión**: Monedero auto-custodiado simulado con soporte de conexión rápida (Core Wallet / MetaMask) y claves locales seguras en navegador.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Permite a cualquier usuario Web3 conectar su wallet o generar una identidad auto-custodiada, mintear y organizar sus Credenciales de Actividad (Activity NFTs / Soulbound Badges), componer pruebas de conocimiento cero (ZK-Proofs) con declaraciones específicas de privacidad, y emitir certificados de verificación cross-chain hacia otras redes a través de Avalanche Teleporter.
- **Audiencia Objetivo**: Miembros activos de DAOs, traders e inversores DeFi que necesitan demostrar solvencia/antigüedad para préstamos subcolateralizados o rondas privadas, desarrolladores Web3 y validadores de la red Avalanche.
- **Valor Fundamental**: Soberanía absoluta de los datos. El usuario posee sus credenciales en su propia wallet y solo comparte la certeza matemática de sus logros mediante ZK-SNARKs, eliminando el doxxing financiero y los riesgos de filtración de identidad.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Clave de Usuario
1. **Conexión de Monedero Soberano**:
   - Conexión con monedero Avalanche (Core, MetaMask) o creación de identidad efímera segura con generación de clave criptográfica local.
   - Vista de perfil con DID soberano (`did:avax:c-chain:0x...`) y panel de estado de privacidad.
2. **Bóveda de Credenciales NFT de Actividad**:
   - Catálogo de credenciales disponibles y acuñadas (ERC-721 Soulbound):
     - *DeFi Liquidity Titan* (Volumen acumulado $> 100$k AVAX)
     - *DAO Governance Pillar* ($> 15$ propuestas votadas activamente)
     - *Avalanche Subnet Pioneer* (Despliegue y validación de nodos)
     - *Zero-Liquidation Veteran* (Historial de préstamo sin impagos)
   - Visualización detallada de metadatos criptográficos, hash de compromiso en árbol Merkle y firma de la entidad emisora.
3. **Estudio Generador de ZK-Proofs (Revelación Selectiva)**:
   - El usuario selecciona qué logro desea certificar ante un tercero (ej. un protocolo de préstamos o un proceso de Whitelist).
   - Selector interactivo de divulgación:
     - Enunciado público: *"Mi balance promedio en los últimos 6 meses es superior a 1,000 AVAX"*.
     - Entrada privada (oculta): Balance real (ej. 4,820 AVAX), dirección exacta de la cuenta y firmas.
   - Generación de la prueba ZK: computación de prueba (witness, hash de compromiso y prueba criptográfica sintetizada).
   - Inspección del recibo criptográfico (`Proof JSON` y `Proof Hash`) listo para compartir o verificar en 1 clic.
4. **Verificador Universal ZK**:
   - Módulo donde cualquier verificador o dApp puede pegar una prueba o cargar un código QR/recibo para comprobar de manera instantánea si la afirmación es matemáticamente válida sin conocer la identidad detrás.
5. **Puente Interoperable Avalanche Teleporter**:
   - Demostración de mensajería cross-chain mediante Avalanche Warp Messaging (AWM).
   - Teletransportación de la atestación verificada desde la Avalanche C-Chain hacia Subnets especializadas o redes EVM de destino.

### Identidad Visual y Estilo
- **Dirección Estética**: *Avalanche High-Tech Cryptographic Console*. Una interfaz profesional, sobria y de nivel institucional inspirada en terminales de seguridad criptográfica y exploradores de subnets de Avalanche.
- **Paleta de Color (Regla 60-30-10)**:
  - 60% Lienzo Neutro: Fondo grafito oscuro y carbón (`#0B0F19` y `#111827`).
  - 30% Superficies Estructurales: Tarjetas de profundidad única con bordes sutiles en slate (`#1F2937` / `#374151`), texto en blanco titanio y slate legible (`#F9FAFB` y `#9CA3AF`).
  - 10% Acento Avalanche & Criptografía: Rojo carmesí icónico de Avalanche (`#E84142`) para acciones principales de red y cian criptográfico (`#06B6D4` / `#38BDF8`) para verificaciones y estados ZK.
- **Tipografía y Jerarquía**:
  - Títulos y navegación: `Plus Jakarta Sans` con peso semibold, limpio y geométrico.
  - Cifras, hashes, claves públicas y estados criptográficos: `JetBrains Mono` con soporte estricto de números tabulares (`tabular-nums font-mono`).
- **Disciplina Anti-Slop y Sin Pastillas**:
  - Cero etiquetas estáticas encerradas en píldoras innecesarias; metadatos limpios separados por `·` o `/`.
  - Sin títulos con sintaxis de comentario de código ni contadores falsos de innovación.
  - Micro-interacciones rápidas ($< 150\text{ms}$) con transiciones suaves en cambios de pestaña y simulaciones de prueba.

---

## 3. Decisiones de Producto y Compensaciones Técnicas

- **Criptografía ZK en Cliente vs. Servidor**:
  - *Enfoque*: Generación de compromisos y pruebas de conocimiento cero directamente en el cliente (navegador) utilizando primitivas hash criptográficas simuladas tipo Poseidon/Merkle Membership Proof.
  - *Razón*: Garantiza privacidad real; las entradas privadas (secretos y balances del usuario) nunca abandonan el dispositivo local ni tocan un servidor externo.
- **Credenciales NFT Soulbound (SBT - EIP-5192)**:
  - *Enfoque*: Los NFTs de actividad son intransferibles por diseño (Soulbound) vinculados a la identidad criptográfica del usuario.
  - *Razón*: Evita el mercado secundario o venta de reputación y méritos entre usuarios malintencionados.
- **Avalanche Warp Messaging (AWM) y Teleporter**:
  - *Enfoque*: Simulación de contratos `TeleporterMessenger` con serialización de mensajes Warp validados por el conjunto de validadores de Avalanche.
  - *Razón*: Es el estándar nativo de alto rendimiento y bajo costo en Avalanche para interoperabilidad sin puentes centralizados ni riesgo de custodios terceros.

---

## 4. Arquitectura Técnica y Estrategia de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AvaZK Identity dApp                           │
├────────────────────────────────┬───────────────────────────────────────┤
│    Navegación & Dashboard      │      Bóveda de Credenciales           │
│   - Selector de Red (Avax)     │   - NFTs Soulbound (ERC-721)          │
│   - Estado Monedero Custodia   │   - Atributos Públicos vs Privados    │
│   - Identificador DID C-Chain  │   - Árbol de Merkle de Actividades    │
└────────────────┬───────────────┴───────────────────┬───────────────────┘
                 │                                   │
                 ▼                                   ▼
┌─────────────────────────────────┐ ┌────────────────────────────────────┐
│      Motor de ZK-Proofs         │ │     Teleporter Cross-Chain         │
│  - Generador de Declaraciones   │ │   - Avalanche Warp Messenger       │
│  - Revelación Selectiva (Inputs)│ │   - Despacho de Atestaciones AWM   │
│  - Verificador de Pruebas ZK    │ │   - Receptor en Subnet Destino     │
└─────────────────────────────────┘ └────────────────────────────────────┘
```

### Componentes y Estado de la Aplicación
1. **Wallet & Identity Store**:
   - Manejo de cuenta activa (`address`, `balance`, `did`, `isCustodial`).
   - Generador de pares de claves ZK locales (clave de compromiso y clave de verificación pública).
2. **Credential Registry Store**:
   - Colección de credenciales NFT con esquemas de atributos privados y públicos.
   - Historial de minteo on-chain con simulación de transacciones de la C-Chain de Avalanche (tx hash, gas, bloque).
3. **ZK Proof Engine**:
   - Generación de pruebas: compromiso con salting, raíz de Merkle y validación booleana de umbrales.
   - Emisión de prueba serializada en JSON estándar con `proofHash`, `publicSignals` y `timestamp`.
   - Verificador autónomo que recomputa y valida la prueba sin acceso a los testigos privados.
4. **Avalanche Teleporter Hub**:
   - Protocolo de mensajería cross-chain entre Avalanche C-Chain, Subnet DeFi (ej. DFK/Dexalot Subnet) y Subnet Institucional.
   - Seguimiento del ciclo de vida del mensaje: `Submitting` $\rightarrow$ `BLS Validator Signatures` $\rightarrow$ `Delivered to Destination Subnet`.

---

## Próximos Pasos tras Aprobación
1. Implementación de los módulos de interfaz en TypeScript y Tailwind CSS con soporte para tema Avalanche Dark Tech.
2. Integración de la biblioteca de iconos Lucide y componentes interactivos para el generador ZK, la bóveda NFT y el monitor de Teleporter.
3. Verificación de compilación y pruebas de flujos de usuario completos.
