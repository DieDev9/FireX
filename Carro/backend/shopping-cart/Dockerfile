#Partimos de una imagen de Java 17 Alpine (más ligera)
FROM openjdk:17-jdk-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el JAR generado en el contenedor
COPY target/shopping-cart-0.0.1-SNAPSHOT.jar app.jar

#Crear variables de entorno
#RabbitMQ
ENV RABBITMQ_HOST=10.6.101.104
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_USERNAME=guest
ENV RABBITMQ_PASSWORD=guest

#Redis
ENV REDIS_HOST=10.6.101.104
ENV REDIS_PORT=6379

#Exponemos el puerto definido en el application.properties (default 8080)
EXPOSE 8085

# Comando para ejecutar la aplicación cuando el contenedor arranque
ENTRYPOINT ["java", "-jar", "app.jar"]