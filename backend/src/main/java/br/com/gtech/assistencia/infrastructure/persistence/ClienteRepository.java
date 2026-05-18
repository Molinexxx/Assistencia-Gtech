package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.cliente.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByCpfCnpj(String cpfCnpj);

    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    boolean existsByCpfCnpj(String cpfCnpj);
}
