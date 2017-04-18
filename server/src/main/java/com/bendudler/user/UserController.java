package main.java.com.bendudler.user;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
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

    public Mono<ResponseEntity<User>> getUser(ServerRequest request) {
        String id = request.pathVariable("id");
        return Mono.just(id)
                .filter(StringUtils::isNumeric)
                .compose(repository::findOne)
                .switchIfEmpty(repository.findByUserName(id))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.status(404).body(null));
    }

    public Flux<ResponseEntity<User>> getUsers(ServerRequest request) {
        return repository.findAll()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.status(404).body(null));
    }
}
