package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.aparelho.Aparelho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AparelhoRepository extends JpaRepository<Aparelho, Long> {

    Optional<Aparelho> findByImei(String imei);

    boolean existsByImei(String imei);
}
