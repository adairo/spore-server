# SporeCar

![Visualización del mapa](pics/map.png)
![Inicio de sesión](pics/signup.png)

SporeCar es una aplicación web que lleva el control de un grupo de usuarios y sus automóviles. En la aplicación, los usuarios pueden registrar, editar y eliminar automóviles, así como visualizar en tiempo real la ubicación (coordenadas geográficas) de sus autos en un mapa interactivo.

## Iniciar la aplicación

La aplicación está dividida en dos repositorios distintos, uno para el cliente y otro para el servidor. A continuación se presentan las instrucciones para iniciar el servidor. Para conocer las instrucciones del cliente visita el repositorio https://github.com/adairo/client-spore.

### Requisitos

Se deben contar con los siguientes herramientas/programados instalados para iniciar el servidor.

- Node.js - [Instalar Node](https://nodejs.org/en)
- PostgreSQL - [Instalar PostgreSQL](https://www.postgresql.org/download/)
- Git (https://git-scm.com/downloads)
- Conocimientos básicos de la línea de comandos

### Instalación de repositorio

Se debe contar con una versión de este repositorio de forma local. Para ello vamos a abrir una terminal y vamos a crear una carpeta para alojar el proyecto.

`$ mkdir spore-car && cd spore-car`

clonamos el repositorio y nos posicionamos dentro de la carpeta del servidor

`$ git clone https://github.com/adairo/spore-server && cd spore-server`

### Instalación de dependencias

Una vez en el directorio del proyecto, vamos a instalar las dependencias del proyecto con el siguiente comando:

`$ npm install`

Una vez terminó el proceso, procederemos a configurar la conexión con la base de datos. 

### Configuración de la base de datos

Para eso tenemos que configurar el archivo `config/default.json` con los valores que corresponden con nuestra instalación de postgres. El archivo default.json tiene la siguiente forma

```json
{
  "db": {
    "url": "postgres://<user>:<password>@<host>:<port>/<database>",
    "tsconfig": "./tsconfig.json",
    "migration-filename-format": "utc"
  },
  "server": {
    "port": "3001"
  },
  "auth": {
    "token_key": "IA667FCxJd27?Lko1BNC89"
  }
}
```

Se puede utilizar esta misma configuración, pero se deben reemplazar el valor "db.url" por la cadena de conexión a nuestra instalación de postgres. Por ejemplo, en mi caso la cadena de conexión es la siguiente:

`"postgres://postgres:openpassword@localhost:5432/sporecar"`

Ya que mi usuario se llama `postgres`, mi contraseña es `openpassword`, el puerto en el que se ejecuta es 5432, etc.

El valor de "auth.key" es una cadena aleatoria que se usa para firmar los JWT, es decir, está relacionado con la seguridad de la aplicación. 

Antes de intentar conectar la aplicación con la base de datos, debemos asegurarnos de que existe la base de datos `sporecar` en postgres. Para ello utilizaremos el comando sql `CREATE DATABASE sporecar;` desde una sesión de `psql` (Herramienta incluida con la instalación de postgres) o con el comando `$ creatdb sporecar`.

### Aplicar migraciones

Se deben aplicar las migraciones para asegurarnos de que la base de datos sabe cómo guardar e interaccionar con los datos de nuestros usuarios. Para eso, ejecutamos el siguiente comando desde la terminal:

`$ npm run migrate up`

Esto dejará a la base de datos lista para ser utilizada.

### Iniciar el servidor

Lo último que resta será iniciar el servidor, para eso ejecutamos el siguiente comando en la terminal:

`$ npm run dev`

Se debe mostrar en la consola un mensaje que dice:

"Server started at port 3001"

Esto nos indica que el servidor está listo para recibir peticiones. Visita las instrucciones del cliente para empezar a usar SporeCar.
