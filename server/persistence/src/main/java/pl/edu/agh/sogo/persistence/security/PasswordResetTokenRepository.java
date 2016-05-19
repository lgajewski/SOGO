package pl.edu.agh.sogo.persistence.security;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.sogo.domain.security.PasswordResetToken;
import pl.edu.agh.sogo.domain.security.User;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {

    PasswordResetToken findByToken(String token);

    PasswordResetToken findByUser(User user);

}
