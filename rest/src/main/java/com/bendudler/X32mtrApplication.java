package com.bendudler;

import com.bendudler.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@SpringBootApplication(exclude = { MongoAutoConfiguration.class, MongoDataAutoConfiguration.class })
@EnableReactiveMongoRepositories
@EnableAutoConfiguration
public class X32mtrApplication implements CommandLineRunner {
	private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(X32mtrApplication.class, args);
	}

    @Override
    public void run(String... args) throws Exception {
/*        log.info("delete repository");
        repository.deleteAll().block();

        log.info("Adding user");
        repository.save(new User("User" + 0, "abc" + 0)).block();

        repository.save(Flux.range(1, 10)
                .map(i -> {
                    User newUser = new User("User" + i, "abc" + i);
                    log.info("User created: " + newUser);
                    return newUser;
                })
        ).subscribe();*/
    }
}
