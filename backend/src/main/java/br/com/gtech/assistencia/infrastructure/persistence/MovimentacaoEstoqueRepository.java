package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.estoque.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    @EntityGraph(attributePaths = "usuario")
    Page<MovimentacaoEstoque> findByEstoquePeca_Id(Long estoquePecaId, Pageable pageable);
}
