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