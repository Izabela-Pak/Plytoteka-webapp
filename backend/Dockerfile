# Etap budowy
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Dodanie uprawnienia do uruchomienia
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


# Uruchomienie kontenera
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/target/plytoteka-0.0.1-SNAPSHOT.jar app.jar
COPY wait-for.sh wait-for.sh

RUN chmod +x wait-for.sh

EXPOSE 8080

ENTRYPOINT ["./wait-for.sh", "db:5432", "--", "java", "-jar", "app.jar"]
