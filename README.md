# Graffiti
Proyecto asignatura Ingeniería Web

Instalar Nodejs y Angular ver primeros minutos de este video ,
también explica el funcionamiento por componentes 
https://www.youtube.com/watch?v=kqYuyACFVkE&list=LL&index=7 ;
Como conecta Angular con firebase y como crear base datos en fire base,
como hacer un crud en angular 
https://www.youtube.com/watch?v=WND9mw3HiBM&list=LLsGYVUsZSU1uh6P2HuSdSwg&index=5&t=1597s;
Como se hace el control de la navegación 
https://www.youtube.com/watch?v=Nehk4tBxD4o&list=LLsGYVUsZSU1uh6P2HuSdSwg&index=1&t=391s


Requisitos Funcionales
------------------------

RF1 - El usuario puede registrarse, iniciar sesión y cerrar sesión en la aplicación
    RF1.1 - El usuario puede registrarse en la aplicación mediante su cuenta de Google, Twitter o Facebook.
    RF1.2 - El usuario puede iniciar sesión en la aplicación mediante su cuenta de Google, Twitter o Facebook.
    RF1.3 - El usuario puede cerrar sesión en la aplicación.
    RF1.4 - El administrador puede iniciar sesión con una cuenta especial.
    RF1.5 - El administrador puede cerrar sesión en la aplicación.

RF2 - El usuario puede gestionar contenido
    RF2.1 - El usuario puede publicar una foto de un graffiti añadiendo el autor del mismo, la localización, la temática y el estado de conservación.
    RF2.1 - El usuario autor de la publiación puede modificar la foto y el estado de conservación.
    RF2.2 - El usuario no autor de la publicación solo puede modificar el estado de conservación.
    RF2.3 - El usuario autor de la publicación puede eliminar la publicación.

RF3 - El usuario puede acceder a servicios de localización.
    RF3.1 - El usuario puede acceder a la ubicación del graffiti en el servicio de mapas.
    RF3.2 - El usuario puede ver su ubicación a tiempo real en el servicio de mapas.

RF4 - El usuario puede realizar búsquedas por filtro.
    RF4.1 - El usuario puede buscar graffitis por su ubicación aproximada, autor de la publicación, autor del graffiti, temática y estado de conservación.

RF5 - El usuario puede participar en el sistema social de la aplicación
    RF5.1 - El usuario puede realizar un comentario en cualquier publicación.
    RF5.2 - El usuario puede darle "Me gusta" a cualquier publicación.
    RF5.3 - El usuario puede quitar "Me gusta" a cualquier publicación que le haya dado previamente.
    RF5.4 - El usuario puede compartir en Twitter que ha subido una publicación.
    RF5.5 - El usuaario puede compartir en Twitter cualquier publicación.

RF6 - El administrador puede gestionar usuarios y publicaciones.
    RF6.1 - El administrador puede visualizar a todos los usuarios registrados.
    RF6.2 - El administrador puede eliminar a uno o varios usuarios registrados.
    RF6.3 - El administrador puede realizar búsqueda de usuarios por filtros.
    RF6.4 - El administrador puede visualizar todas las publicaciones realizadas en la aplicación.
    RF6.5 - El administrador puede elmininar una o varias publicaciones.
    RF6.6 - El administrador puede realizar búsqueda de publicaciones por filtros.

Requisitos No Funcionales
---------------------------

RNF1 - Firebase se encargará del registro y autenticación de usuarios.
    RNF1.1 - La cuenta de administrador está previamente verificada y lista para usar.
RNF2 - Existirán dos tipos de usuarios con distintos permisos. Administrador y usuario habitual.
    RFN2.1 - El usuario habitual se subdivide en: autor de publicación y usuario habitual.
    RNF2.1 - Si se es autor de publicación, se es usuario habitual.
    RNF2.2 - Se puede ser usuario habitual y no ser autor de publicación.
RNF3 - El sistema mostrará los datos meteorológicos a tiempo real de la zona donde se encuentre el usuario.
RNF4 - El sistema mostrará los datos de ... periódicamente.
RNF5 - Cuando un administrador elimina a un usuario registrado, se elimina automáticamente todo lo relacionado con dicho usuario.
RNF6 - Cuando un administrador o un autor de una publicación eliminan una publicación, se elimina automáticamente todo lo relacionado con dicha publicación.


NOTA: la distinción entre autor de publicación y usuario habitual no se ve reflejada en la aplicación (registro de cuenta). La única diferencia son los distintos permisos respecto a las publicaciones propias y ajenas.


Ideas
------

-Añadir tipo de usuario ARTISTA. Solo podría subir publicaciones donde el graffiti es suyo, no puede subir graffitis donde el autor del mismo sea otro. Por lo demás, puede seguir dando "Me gusta" a todas las publicaciones y tiene los mismos permisos que un autor de publicación y usuario habitual.
