PRUEBAS UNITARIAS EN APLICACIÓN COMPLETA

* Inicializar la app
    - Descargar o clonar el repositorio (URL: https://github.com/Klerith/nest-teslo-shop/tree/01-testing-inicio)
    - Abrir el archivo README.md y ejecutar los siguiente passo:
        + Crear una copia del archivo ".env.template" a ".env" (variables de entorno).
        + Levantar la db con docker
            $ docker compose up -d
        + Ejecutar al app
            $ npm run start:dev
        + Abrir en browser (URL: http://localhost:3000/api)
        + Ejecutar pruebas
            $ npm run test:watch        // Pruebas unitarias
            $ npm run test:cov          // Pruebas de cobertura (Abri en el browser: /coverage/lcov-report/index.html)

* Postman
    - Create new collection -> Blank collection | "teslo-shop-api-testing"
        + Seed (Petición HTTP)
            > GET: http://localhost:3000/api/seed   // Crear y descruye los datos de la DB
        + Productos (Add folder: "Products")
            > GET: http://localhost:3000/api/products   // Obtener todos los productos


CONTROLADORES - MÓDULOS - BOOTSTRAP - SERVICIOS

* Inicializar la app
    - Levantar la db
        $ docker compose up -d
    - Ejecutar la app
        $ npm run start:dev
    - Ejecutar pruebas
        $ npm run test:watch

* Postman
    - Realizar peticiones HTTP
        + Seed
            > GET: http://localhost:3000/api/seed   // Crear y descruye los datos de la DB


PRUEBAS SOBRE TRANSACCIONES Y CARGA DE ARCHIVOS

* Inicializar la app
    - Crear las dependencias
        $ npm install
    - Levantar al db
        $ docker compose up -d
    - Ejecutar la app
        $ npm run start:dev
    - Ejecutar pruebas
        $ npm run test:watch

* Postman
    - Realizar peticiones HTTP
        + Seed
            > GET: http://localhost:3000/api/seed   // Crear y descruye los datos de la DB


E2E - PRUEBAS DE EXTREMO A EXTREMO

* Inicializar la app
    - Crear las dependencias
        $ npm install
    - Levantar al db
        $ docker compose up -d
    - Ejecutar la app
        $ npm run start:dev
    - Ejecutar pruebas
        $ npm run test:e2e:watch    // Pruebas e2e
        $ npm run test:e2e:cov      // Pruebas e2e de covertura


* Postman
    - Realizar peticiones HTTP
        + Seed
            > GET: http://localhost:3000/api/seed   // Crear y descruye los datos de la DB