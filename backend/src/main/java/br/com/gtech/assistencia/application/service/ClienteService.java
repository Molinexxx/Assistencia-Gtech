package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.domain.cliente.Cliente;
import br.com.gtech.assistencia.infrastructure.persistence.ClienteRepository;
import br.com.gtech.assistencia.web.dto.ClienteRequestDTO;
import br.com.gtech.assistencia.web.dto.ClienteResponseDTO;
import br.com.gtech.assistencia.web.exception.ResourceConflictException;
import br.com.gtech.assistencia.web.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public ClienteResponseDTO criar(ClienteRequestDTO request) {
        if (clienteRepository.existsByCpfCnpj(request.getCpfCnpj())) {
            throw new ResourceConflictException("Ja existe cliente cadastrado com este CPF/CNPJ.");
        }

        Cliente cliente = new Cliente();
        preencher(cliente, request);
        return toResponse(clienteRepository.save(cliente));
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado."));
    }

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listar(String cpfCnpj, String nome) {
        if (cpfCnpj != null && !cpfCnpj.isBlank()) {
            return clienteRepository.findByCpfCnpj(cpfCnpj)
                    .map(cliente -> List.of(toResponse(cliente)))
                    .orElse(List.of());
        }

        if (nome != null && !nome.isBlank()) {
            return clienteRepository.findByNomeContainingIgnoreCase(nome)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        return clienteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado."));

        clienteRepository.findByCpfCnpj(request.getCpfCnpj())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResourceConflictException("Ja existe outro cliente com este CPF/CNPJ.");
                });

        preencher(cliente, request);
        return toResponse(clienteRepository.save(cliente));
    }

    private void preencher(Cliente cliente, ClienteRequestDTO request) {
        cliente.setNome(request.getNome());
        cliente.setCpfCnpj(request.getCpfCnpj());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setLogradouro(request.getLogradouro());
        cliente.setNumero(request.getNumero());
        cliente.setBairro(request.getBairro());
        cliente.setCidade(request.getCidade());
        cliente.setUf(request.getUf());
        cliente.setCep(request.getCep());
    }

    private ClienteResponseDTO toResponse(Cliente cliente) {
        ClienteResponseDTO response = new ClienteResponseDTO();
        response.setId(cliente.getId());
        response.setNome(cliente.getNome());
        response.setCpfCnpj(cliente.getCpfCnpj());
        response.setEmail(cliente.getEmail());
        response.setTelefone(cliente.getTelefone());
        response.setLogradouro(cliente.getLogradouro());
        response.setNumero(cliente.getNumero());
        response.setBairro(cliente.getBairro());
        response.setCidade(cliente.getCidade());
        response.setUf(cliente.getUf());
        response.setCep(cliente.getCep());
        return response;
    }
}
