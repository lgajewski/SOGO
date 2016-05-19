package pl.edu.agh.sogo.persistence.security;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.agh.sogo.domain.security.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByUsername(String username);
}
