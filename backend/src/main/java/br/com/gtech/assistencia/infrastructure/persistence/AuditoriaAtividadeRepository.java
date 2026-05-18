package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.auditoria.AuditoriaAtividade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaAtividadeRepository extends JpaRepository<AuditoriaAtividade, Long> {
}
