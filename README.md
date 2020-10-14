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

RF1 - El usuario puede registrarse, iniciar sesión y cerrar sesión en la aplicación <br />  
    RF1.1 - El usuario puede registrarse en la aplicación mediante su cuenta de Google, Twitter o Facebook.<br />  
    RF1.2 - El usuario puede iniciar sesión en la aplicación mediante su cuenta de Google, Twitter o Facebook.<br />  
    RF1.3 - El usuario puede cerrar sesión en la aplicación.<br />  
    RF1.4 - El administrador puede iniciar sesión con una cuenta especial.<br />  
    RF1.5 - El administrador puede cerrar sesión en la aplicación.<br />  

RF2 - El usuario puede gestionar contenido<br />  
    RF2.1 - El usuario puede publicar una foto de un graffiti añadiendo el autor del mismo, la localización, la temática y el estado de conservación.<br />  
    RF2.1 - El usuario autor de la publiación puede modificar la foto y el estado de conservación.<br />  
    RF2.2 - El usuario no autor de la publicación solo puede modificar el estado de conservación.<br />  
    RF2.3 - El usuario autor de la publicación puede eliminar la publicación.<br />  

RF3 - El usuario puede acceder a servicios de localización.<br />  
    RF3.1 - El usuario puede acceder a la ubicación del graffiti en el servicio de mapas.<br />  
    RF3.2 - El usuario puede ver su ubicación a tiempo real en el servicio de mapas.<br />  

RF4 - El usuario puede realizar búsquedas por filtro.<br />  
    RF4.1 - El usuario puede buscar graffitis por su ubicación aproximada, autor de la publicación, autor del graffiti, temática y estado de conservación.<br />  

RF5 - El usuario puede participar en el sistema social de la aplicación<br />  
    RF5.1 - El usuario puede realizar un comentario en cualquier publicación.<br />  
    RF5.2 - El usuario puede darle "Me gusta" a cualquier publicación.<br />  
    RF5.3 - El usuario puede quitar "Me gusta" a cualquier publicación que le haya dado previamente.<br />  
    RF5.4 - El usuario puede compartir en Twitter que ha subido una publicación.<br />  
    RF5.5 - El usuaario puede compartir en Twitter cualquier publicación.<br />  

RF6 - El administrador puede gestionar usuarios y publicaciones.<br />  
    RF6.1 - El administrador puede visualizar a todos los usuarios registrados.<br />  
    RF6.2 - El administrador puede eliminar a uno o varios usuarios registrados.<br />  
    RF6.3 - El administrador puede realizar búsqueda de usuarios por filtros.<br />  
    RF6.4 - El administrador puede visualizar todas las publicaciones realizadas en la aplicación.<br />  
    RF6.5 - El administrador puede elmininar una o varias publicaciones.<br />  
    RF6.6 - El administrador puede realizar búsqueda de publicaciones por filtros.<br />  

Requisitos No Funcionales
---------------------------

RNF1 - Firebase se encargará del registro y autenticación de usuarios.<br />  
    RNF1.1 - La cuenta de administrador está previamente verificada y lista para usar.<br />  
RNF2 - Existirán dos tipos de usuarios con distintos permisos. Administrador y usuario habitual.<br />  
    RFN2.1 - El usuario habitual se subdivide en: autor de publicación y usuario habitual.<br />  
    RNF2.1 - Si se es autor de publicación, se es usuario habitual.<br />  
    RNF2.2 - Se puede ser usuario habitual y no ser autor de publicación.<br />  
RNF3 - El sistema mostrará los datos meteorológicos a tiempo real de la zona donde se encuentre el usuario.<br />  
RNF4 - El sistema mostrará los datos de ... periódicamente.<br />  
RNF5 - Cuando un administrador elimina a un usuario registrado, se elimina automáticamente todo lo relacionado con dicho usuario.<br />  
RNF6 - Cuando un administrador o un autor de una publicación eliminan una publicación, se elimina automáticamente todo lo relacionado con dicha publicación.<br />  


NOTA: la distinción entre autor de publicación y usuario habitual no se ve reflejada en la aplicación (registro de cuenta). La única diferencia son los distintos permisos respecto a las publicaciones propias y ajenas.


Ideas
------

-Añadir tipo de usuario ARTISTA. Solo podría subir publicaciones donde el graffiti es suyo, no puede subir graffitis donde el autor del mismo sea otro. Por lo demás, puede seguir dando "Me gusta" a todas las publicaciones y tiene los mismos permisos que un autor de publicación y usuario habitual.
