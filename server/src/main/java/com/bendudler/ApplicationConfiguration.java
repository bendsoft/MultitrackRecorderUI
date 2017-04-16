package main.java.com.bendudler;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import main.java.com.bendudler.user.UserController;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;
import org.springframework.data.mongodb.core.mapping.event.LoggingEventListener;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

/**
 * Created by ben on 16.04.2017.
 * Copyright by Benjamin Dudler, 2016
 */
@SpringBootApplication(exclude = { MongoAutoConfiguration.class, MongoDataAutoConfiguration.class })
@EnableReactiveMongoRepositories
@AutoConfigureAfter(EmbeddedMongoAutoConfiguration.class)
public class ApplicationConfiguration extends AbstractReactiveMongoConfiguration {
    private final int MONGODB_PORT = 3201;

    @Bean
    RouterFunction<?> routes(UserController controller) {
        return RouterFunctions
                .route(GET("/users"), controller::getUsers)
                .andRoute(GET("users/{id}"), request -> {
                    boolean pathVariableIsNumber = true;
                    try {
                        int test = Integer.parseInt(request.pathVariable("id"));
                    } catch (NumberFormatException e) {
                        pathVariableIsNumber = false;
                    }

                    if(pathVariableIsNumber) {
                        return controller.getUser(request);
                    }

                    return controller.getUserByUsername(request);
                };
    }

    @Bean
    public LoggingEventListener mongoEventListener() {
        return new LoggingEventListener();
    }

    @Override
    @Bean
    @DependsOn("embeddedMongoServer")
    public MongoClient mongoClient() {
        return MongoClients.create(String.format("mongodb://localhost:%d", MONGODB_PORT));
    }

    @Override
    protected String getDatabaseName() {
        return "reactive";
    }
}
