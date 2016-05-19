package pl.edu.agh.sogo.persistence.security;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.sogo.domain.security.User;
import pl.edu.agh.sogo.domain.security.VerificationToken;

@Repository
public interface VerificationTokenRepository extends MongoRepository<VerificationToken, String> {

    VerificationToken findByToken(String token);

    VerificationToken findByUser(User user);

}
