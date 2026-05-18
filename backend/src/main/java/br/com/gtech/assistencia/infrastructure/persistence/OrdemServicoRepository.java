package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.os.OrdemServico;
import br.com.gtech.assistencia.domain.os.StatusOrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

    @Query("""
            select distinct os
            from OrdemServico os
            join fetch os.cliente c
            join fetch os.aparelho a
            join fetch os.atendente at
            left join fetch os.tecnico t
            left join fetch os.itensPecas itens
            left join fetch itens.estoquePeca ep
            where (:status is null or os.status = :status)
              and (:clienteId is null or c.id = :clienteId)
              and (:imei is null or a.imei = :imei)
              and (:codigo is null or os.codigo = :codigo)
            order by os.dataEntrada desc
            """)
    List<OrdemServico> buscarComFiltros(
            @Param("status") StatusOrdemServico status,
            @Param("clienteId") Long clienteId,
            @Param("imei") String imei,
            @Param("codigo") String codigo
    );

    @Query("""
            select distinct os
            from OrdemServico os
            join fetch os.cliente c
            join fetch os.aparelho a
            join fetch os.atendente at
            left join fetch os.tecnico t
            left join fetch os.itensPecas itens
            left join fetch itens.estoquePeca ep
            where os.id = :id
            """)
    Optional<OrdemServico> buscarDetalhadaPorId(@Param("id") Long id);
}
