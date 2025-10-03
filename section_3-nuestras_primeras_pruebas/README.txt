RESTFUL API - CONFIGURACIONES Y PRUEBAS SOBRE DTO'S

* Inicillizar el proyecto
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