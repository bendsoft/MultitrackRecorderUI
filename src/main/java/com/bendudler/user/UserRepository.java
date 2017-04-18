package com.bendudler.user;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

/**
 * Created by ben on 16.04.2017.
 * Copyright by Benjamin Dudler, 2016
 */
public interface UserRepository extends ReactiveCrudRepository<User, String> {

    /**
     * Derived query selecting by {@code username}.
     *
     * @param username
     * @return
     */
    Mono<User> findByUserName(String username);
}
