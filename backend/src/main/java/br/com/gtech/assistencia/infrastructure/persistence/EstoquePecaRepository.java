package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.estoque.EstoquePeca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstoquePecaRepository extends JpaRepository<EstoquePeca, Long> {

    boolean existsBySkuIgnoreCase(String sku);
}
