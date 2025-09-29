# NESTJS + TESTING: PRUEBAS UNITARIAS Y END TO END (E2E)

> **Instructor:** Fernando Herrera

## Introducción

Testing con NestSJ + Jest. Nos enfocaremos en Pruebas Unitarias y las pruebas de Extremo a Extremo (E2E).

## Instalaciones recomendadas

- [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [Git](https://git-scm.com/)
  ```sh
  $ git config --global user.name "Tu nombre"
  $ git config --global user.email "Tu correo"
  ```
- [Node.js](https://nodejs.org/en)
- Nest CLI

  ```sh
  $ npm install -g @nestjs/cli
  ```

**Extensiones de VSCode**

- [Easy Snippet](https://marketplace.visualstudio.com/items?itemName=inu1255.easy-snippet)

**Tema de VSCode**

- [Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night)
- [Bearded Icons](https://marketplace.visualstudio.com/items?itemName=BeardedBear.beardedicons)

**Instalaciones adicionales**

- [Past JSON as Code](https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype)
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

## Introducción a las pruebas automáticas

Comprenden las pruebas unitarias, integración y end to end (E2E) testing y como estructuras las pruebas.

## Pruebas automáticas (Testing)

¿Por qué?, ¿Para qué?, ¿vale la pena? Mitos y realidades.

- **No son una pérdida de tiempo**
  **_Valen la pena_**
  Garantizan calidad, detectar errores, facilitan mantenimiento, aceleran desarrollo con itegraciones contínuas y despliegues seguros.

- **Si te regalaran un carro**
  - No ha sido probado.
  - No sabes si es seguro.

### Tipos de pruebas

- **Unitarias**
  Enfocada en partes atómicas.

- **Integración**
  ¿Cómo reaccionan varias piezas en conjunto?

- **E2E - End to End**
  Ejecuta todo un flujo continúo como si fuera el proceso que realizaría un usuario.

Principalmente debemos de enforcarnos en las pruebas unitarias, empezando pro las piezas más pequeñas y desacopladas.

#### Unitarias

1. Pruebas atómicas simples.
2. Se recomienda no tener dependencias de otros componentes.
3. Debe de ser especializadas en la pieza que estamos probando.

#### Integración

1. ¿Como funcionan elementos en conjuto?
2. No deben de ser mayores a las unitarias.

#### E2E - End to End

1. Un flujo asilado.
2. Objectivo específico.
3. Pruebas de casos improbables.

### Características de las pruebas

Toda prueba automática debe de respetar.

1. Fáciles de escribir.
2. Fáciles de leer.
3. Rápidas.
4. Flexibles.

### El triple "A"

- **Arrange** - Arreglar
- **Act** - Actuar
- **Assert** - Afirmar

#### **Arrange** - Arreglar

1. Importaciones
2. Inicializaciones

#### **Act** - Actuar

1. Aplicar estímulos
2. Llamar métodos
3. Simular cliks

#### **Assert** - Afirmar

¿Qué debe de haver sucedido?

### Mitos

1. Hacen que mi aplicación no tenga erroes.
2. Las pruebas no pueden fallar.
3. Hacen más lenta mi aplicación.
4. Es una pérdida de tiempo.
5. Hay que probar todo.

### **Coverage** - Cobertura

- **Cobertura de líneas:**
  Porcenjate de líneas ejecutadas.

- **Cobertura de ramas:**
  Porcentaje de ramas de decisión probadas.

- **Cobertura de funciones:**
  Porcentaje de funciones/métodos invocados.

- **Cobertura de condiciones:**
  Porcentaje de condiciones evaluadas en ambos sentidos.
