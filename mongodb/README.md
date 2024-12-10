# MongoDB Backups

Directorio para respaldos de la base de datos MongoDB

## Crear respaldo

Para crear un respaldo de una base de datos MongoDB es necesario ejecutar el siguiente comando en una consola o terminal:

```console
> mongodump --host <database-host> -d <database-name> --port <database-port> --out directory
```

[Más información de mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/)

## Restaurar respaldo

Para restaurar un respaldo de una base de datos MongoDB es necesario ejecutar el siguiente comando en una consola o terminal:

```console
> mongorestore --host <database-host> -d <database-name> --port <database-port> foldername
```

[Más información de mongorestore](https://docs.mongodb.com/database-tools/mongorestore/)

## Restaurar respaldo por medio de un script

De manera alternativa es posible restaurar el respaldo de la base de datos por medio de un archivo javascript, para ello es necesario entrar en el shell de MongoDB por medio del comando `mongo` y una vez dentro cargar el script:

```console
> load('experiencia_prendaria.js')
```
