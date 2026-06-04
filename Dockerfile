FROM maven:3-openjdk-23 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:23-jdk-slim
WORKDIR /app
COPY --from=build /app/target/store-0.0.1-SNAPSHOT.war store.war
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "store.war"]