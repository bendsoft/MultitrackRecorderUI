package com.bendudler;

import com.bendudler.user.UserController;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.*;

/**
 * Created by ben on 16.04.2017.
 * Copyright by Benjamin Dudler, 2016
 */
@SpringBootApplication
@EnableReactiveMongoRepositories
@PropertySource(ignoreResourceNotFound = true, value = "classpath:/main/resources/application.properties")
public class ApplicationConfiguration {
    @Bean
    RouterFunction<?> userRoutes(UserController controller) {
        return RouterFunctions
                .route(GET("/users")
                        .and(accept(APPLICATION_JSON)), controller::getUsers)
                .andRoute(GET("users/{id}")
                        .and(contentType(APPLICATION_JSON)), controller::getUser);
    }
}
