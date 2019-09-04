# node-common

Utilidades comunes para proyectos en node.

## ZorzalError

Es una subclase de `Error` que agrega las propiedades:
* `code`: un código de error para identificar el tipo de exacto de error.
* `info`: cualquier dato que ayude a determinar las condiciones específicas de este error.
* `cause`: un `Error` previo que causó este error.

Además implementa la serialización completa en JSON, que en el caso de la clase nativa `Error` la serialización siempre devuelve un objeto sin datos (`{}`).
