1 - API Gateway

2 - 0 - Each service exposes their own HTTP server/port. For this to work, the front end needs to know the URL of each service

2 - 1 - Create a small microservice similar to API Gateway

2 - 2 - SDK that masks all the complexity how to communicate with the services. All operations to microservices are done through the SDK.
The angular client will only use the SDK to communicate with the services.

3 - BFF - Backend for Frontend. The frontend (angular) will create a microservice that communicate with the other microservices. (via pub-sub)


---

Como escuchar mas de un topico

Como dockerizar la app

Ver como hacer RPC (Remote Procedure Call) con pub-sub en Kafka

Mirar como funcionan las particiones.

Mirar como funciona el historial de mensajes en Kafka, para no reprocesar mensajes que ya se procesaron.

Mirar como funciona la serializacion, typing y validation. Ej: Mandas un mensaje a topico 'x' pero el mensaje puede ser de otro tipo o tener propiedades que no se esperarian.

JSON puede ser un formato de serializacion. Pero pueden existir otros mas performantes ya que solo se estaria usando para la comunicacion entre backends.