RESTFUL API - CONFIGURACIONES Y PRUEBAS SOBRE DTO'S

* Inicilizar el proyecto
    - Crear la app
        $ nest new my-pokemon-app
            ? Which package manager would you ❤️  to use? npm
        $ cd my-pokemon-app
        $ npm run start

        $ npm run test
        $ npm run test:watch
        $ npm run test:cov      // Ejecuta los test y crea un directorio "coverage"
        $ npm run test:debug    // Ejecuta los test en modo depuracion (Normalmente no usado)

        SHORTCUT para revisar breakpoint:
            - Agregar un breakpoint
            - CTRL + P -> >debug: Debug npm Script -> test:watch
            - SHIFT + F5 // Salir del modo debug

        $ npm run test:e2e      // Ejecuta los test e2e

        $ npm run build         // Ejecuta el buil de prod (Primero ejecuta los testing)

    - Nest CLI
        + Crear un nuevo resource
            $ nest g res
                ? What name would you like to use for this resource (plural, e.g., "users")? pokemons
                ? What transport layer do you use? REST API
                ? Would you like to generate CRUD entry points? (Y/n) y

    - Dependencias
        + Class validator y Class transformer
            $ npm i class-validator class-transformer
        
        + Reflect Metadata (Requerido para ejectuar los test)
            $ npm i -D reflect-metadata

    - Postman
        + Realizar las peticiones GET, POST, PATCH y DELETE

    - Errores en VSCode
        + Unsafe call of a(n) `error` type typed value.
            > CTRL + SHIFT + P | Developer: Reload Window

    - Generar informe de cobertura
        + Reporte de cobertura (Pruebas de Unitarias e Integración)
            $ npm run test:cov
        + Abrir el archivo "index.html" del reporte de cobertura en el browser.
            > coverage/lcov-report/index.html 


PRUEBAS EN CONTROLADORES, SERVICIOS, MÓDULOS Y MÁS

* Inicializar el proyecto
    - Levantar y ejecutar los test de la app
        $ npm install
        $ npm run start:dev
        $ npm run test:cov      // Ejecutar test de cobertura y revisar en el browser
        $ npm run test:watch

TAREA - COBERTURA AL 100%

* Inicializar el proyecto
    - Levanta y ejecutar los test de la app
        $ npm install
        $ npm run start:dev
        $ npm run test:watch
        $ npm run test:cov      // Test de cobertura
    
    - Ejecutar e implementar todos los test de cobertura


END TO END TESTING - E2E

* Continuar con la app
    - Reconstruir los modulos y ejecutar test en la app
        $ npm install
        $ npm run start:dev     // Run app
        $ npm run test:watch    // Run test