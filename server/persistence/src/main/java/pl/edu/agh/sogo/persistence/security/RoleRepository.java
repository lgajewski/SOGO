package pl.edu.agh.sogo.persistence.security;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.sogo.domain.security.Role;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {

    Role findByName(String name);

    @Override
    void delete(Role role);

}
