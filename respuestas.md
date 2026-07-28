# Evaluación Teórica

## Sección A: React Native y Arquitectura

### Pregunta 1 — React vs React Native vs Expo vs React Native CLI

Cada uno hace algo distinto. React es la librería base para armar interfaces con componentes, usada en desarrollo web sobre el DOM del navegador.

React Native usa esa misma lógica (componentes, props, estado, hooks), pero habla con el sistema operativo del celular para mostrar pantallas nativas reales, tanto en iOS como en Android, desde una sola base de código.

Expo es una capa sobre React Native que facilita todo: trae funciones ya listas (cámara, notificaciones, ubicación), no exige Xcode ni Android Studio para arrancar, y permite compilar desde la nube (EAS).

React Native CLI es el camino más puro: las carpetas nativas quedan visibles y editables, pero hay que mantener ese entorno uno mismo.

Para la mayoría de proyectos nuevos iría con Expo, porque acelera el desarrollo. Usaría CLI solo si hace falta un SDK nativo que Expo no soporte, o si ya existe código nativo previo.

### Pregunta 2 — Ventajas de TypeScript en React Native

Lo más grande es que atrapa errores antes de producción: typos, tipos que no coinciden, props que faltan. El compilador los marca antes de correr la app, y el autocompletado mejora mucho.

También sirve como documentación: viendo cómo está definida una función ya sabés qué espera recibir. Y en proyectos grandes da tranquilidad al reorganizar código, porque si algo se rompe, el compilador avisa antes de que llegue al usuario.

### Pregunta 3 — Patrón para una aplicación bancaria grande

Me inclinaría por separar el código en capas donde el negocio no depende de la interfaz (Clean Architecture). En un banco, seguridad y mantenimiento pesan más que la velocidad. Esto permite probar la lógica sin depender de la UI, cambiar de backend sin tocar el núcleo, y que varios equipos trabajen sin pisarse.

Un patrón que separa la vista de su lógica (MVVM) también sirve, y suelen usarse juntos: MVVM en la parte visual, dentro del esquema de Clean Architecture.

## Sección B: Desarrollo Móvil

### Pregunta 4 — Ciclo de vida con Hooks

Los componentes funcionales no tienen ciclo de vida formal, pero los hooks lo simulan. useState maneja el estado local; al cambiar, el componente se vuelve a renderizar. useEffect reemplaza a los métodos viejos de las clases: con dependencias vacías corre una sola vez, sin lista corre en cada render, y con dependencias específicas corre cuando esas cambian. Lo que devuelve el efecto actúa como limpieza.

useMemo guarda el resultado de un cálculo pesado y solo lo recalcula si cambian sus dependencias. useCallback hace lo mismo con funciones, evitando que se recreen en cada render, útil al pasarlas a un hijo optimizado (React.memo).

En resumen: se monta, se actualiza con cada cambio de estado o props, y se desmonta ejecutando la limpieza.

### Pregunta 5 — Renderizado de listas grandes

Con un simple recorrido (map) dentro de un scroll, se dibujan todos los elementos de una vez, aunque el usuario vea solo una parte. Eso dispara la memoria y genera trabones al scrollear (jank).

Para eso existe un componente que dibuja solo lo visible más un margen, reciclando elementos al scrollear (FlatList). Hay una variante para listas con encabezados por sección (SectionList), y por debajo de ambas hay un componente base (VirtualizedList) para cuando se necesita más control.

### Pregunta 6 — Redux Toolkit vs Context API vs Zustand

Context API la usaría para estado global simple que casi no cambia, como el tema o el usuario logueado. No es buena para actualizaciones frecuentes, porque provoca renders de más.

Redux Toolkit para apps grandes con estado complejo, donde hace falta rastrear cambios o el estado depende de muchas partes, como en un banco.

Zustand es un punto medio: liviano, con menos código repetitivo, ideal cuando Context se queda corto pero Redux es demasiado.

## Sección C: Seguridad

### Pregunta 7 — JWT en AsyncStorage para una app bancaria

No, es un error grave. AsyncStorage no está encriptado, guarda todo en texto plano. Si el teléfono está rooteado o hay malware con acceso a archivos, alguien puede robar el token y suplantar al usuario.

Lo correcto es usar el almacenamiento seguro del sistema: Keychain en iOS y Android Keystore en Android, que cifran los datos con el hardware del dispositivo. El token debería durar poco, con uno de renovación (refresh token), y protegerse con biometría al recuperarlo.

### Pregunta 8 — SSL Pinning, Keychain, Android Keystore y Biometría

SSL Pinning verifica que el certificado del servidor coincida con uno guardado dentro de la app, protegiendo contra ataques donde alguien se mete en medio de la comunicación (man-in-the-middle).

Keychain es el almacenamiento seguro de iOS para credenciales sensibles. Android Keystore hace lo mismo en Android, guardando claves de cifrado en un espacio respaldado por hardware al que ni el sistema operativo accede directamente.

Biometría es usar huella o reconocimiento facial para confirmar identidad, normalmente como segundo paso de seguridad o para desbloquear algo ya guardado en Keychain o Keystore.

### Pregunta 9 — Cinco vulnerabilidades del OWASP Mobile Top 10

Uso inadecuado de credenciales, autenticación insuficiente, comunicación insegura, almacenamiento inseguro de datos sensibles, y criptografía mal implementada.

## Sección D: Full Stack

### Pregunta 10 — Consumo de una API REST protegida con OAuth2

El proceso arranca con el login, idealmente con un flujo pensado para móviles que agrega seguridad extra (Authorization Code Flow con PKCE), abierto en un navegador embebido seguro.

Tras confirmar credenciales, el proveedor devuelve un código temporal que se cambia por un token de acceso y uno de renovación. El token de acceso se guarda en almacenamiento seguro y se manda en cada pedido a la API.

Cuando el token de acceso vence, se usa el de renovación para conseguir uno nuevo sin pedir credenciales otra vez. Si ese también vence, se manda al usuario al login.

### Pregunta 11 — REST vs GraphQL

REST expone varios endpoints fijos, uno por recurso, con estructura ya definida. Es simple y bien adoptado, pero puede traer datos de más o exigir varias llamadas para una sola pantalla.

GraphQL expone un único punto donde el cliente pide exactamente lo que necesita, pero el backend es más complejo y el cacheo tradicional deja de funcionar igual.

Para mí REST sigue siendo más simple, y GraphQL da más flexibilidad a costa de más complejidad.

### Pregunta 12 — Estrategia para manejar errores del backend

Centralizaría el manejo de errores con un interceptor de red (por ejemplo con Axios), para no repetir lógica en cada llamada.

Clasificaría los errores por origen: de red, del servidor, o del cliente (sesión vencida, permisos, validación), traduciéndolos a tipos propios de la app.

Cada tipo se maneja distinto: sesión vencida dispara renovación de token; error de validación se muestra en el formulario; error grave del servidor muestra mensaje genérico con opción de reintentar.

Por último, sumaría monitoreo de errores no controlados con una herramienta externa, y reintentos automáticos para errores de red pasajeros.