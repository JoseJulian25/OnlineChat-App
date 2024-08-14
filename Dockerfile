FROM openjdk:17-jdk-slim
ARG JAR_FILE=target/Chat-online-1.0.jar
COPY ${JAR_FILE} ChatOnlineApplication.jar
EXPOSE 8585
ENTRYPOINT ["java", "-jar", "ChatOnlineApplication.jar"]