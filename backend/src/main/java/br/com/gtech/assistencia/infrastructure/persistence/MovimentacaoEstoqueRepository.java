package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.estoque.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    List<MovimentacaoEstoque> findTop20ByEstoquePeca_IdOrderByIdDesc(Long estoquePecaId);
}
