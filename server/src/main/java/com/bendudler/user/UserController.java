package main.java.com.bendudler.user;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Created by ben on 16.04.2017.
 * Copyright by Benjamin Dudler, 2016
 */
@Component
public class UserController {
    private final UserRepository repository;

    UserController(UserRepository repository) {
        this.repository = repository;
    }

    public Mono<ServerResponse> getUser(ServerRequest request) {
        Mono<User> user = repository.findOne(request.pathVariable("id"));
        return ServerResponse.ok().body(user, User.class);
    }

    public Mono<ServerResponse> getUsers(ServerRequest request) {
        Flux<User> users = repository.findAll();
        return ServerResponse.ok().body(users, User.class);
    }
}
