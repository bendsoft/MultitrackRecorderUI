package com.bendudler;

import com.mongodb.Mongo;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.config.Storage;
import de.flapdoodle.embed.mongo.distribution.IFeatureAwareVersion;
import de.flapdoodle.embed.process.config.IRuntimeConfig;
import de.flapdoodle.embed.process.runtime.Network;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.embedded.EmbeddedMongoProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

/**
 * Created by Benjamin on 20.04.2017.
 */
@Configuration
@AutoConfigureAfter(EmbeddedMongoAutoConfiguration.class)
public class MongoDBConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public IMongodConfig embeddedMongoConfiguration() throws IOException {
        IFeatureAwareVersion featureAwareVersion = new EmbeddedMongoAutoConfiguration.ToStringFriendlyFeatureAwareVersion(
                this.embeddedProperties.getVersion(),
                this.embeddedProperties.getFeatures());
        MongodConfigBuilder builder = new MongodConfigBuilder()
                .version(featureAwareVersion);
        if (this.embeddedProperties.getStorage() != null) {
            builder.replication(
                    new Storage(this.embeddedProperties.getStorage().getDatabaseDir(),
                            this.embeddedProperties.getStorage().getReplSetName(),
                            this.embeddedProperties.getStorage().getOplogSize() != null
                                    ? this.embeddedProperties.getStorage().getOplogSize()
                                    : 0));
        }
        Integer configuredPort = this.properties.getPort();
        if (configuredPort != null && configuredPort > 0) {
            builder.net(new Net(getHost().getHostAddress(), configuredPort,
                    Network.localhostIsIPv6()));
        }
        else {
            builder.net(new Net(getHost().getHostAddress(),
                    Network.getFreeServerPort(getHost()), Network.localhostIsIPv6()));
        }
        return builder.build();
    }
}
