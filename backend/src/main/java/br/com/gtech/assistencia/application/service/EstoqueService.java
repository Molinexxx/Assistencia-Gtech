package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.application.security.AuthenticatedUserService;
import br.com.gtech.assistencia.domain.estoque.EstoquePeca;
import br.com.gtech.assistencia.domain.estoque.MovimentacaoEstoque;
import br.com.gtech.assistencia.domain.estoque.TipoMovimentoEstoque;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.EstoquePecaRepository;
import br.com.gtech.assistencia.infrastructure.persistence.MovimentacaoEstoqueRepository;
import br.com.gtech.assistencia.web.dto.AjusteEstoqueRequestDTO;
import br.com.gtech.assistencia.web.dto.EstoquePecaRequestDTO;
import br.com.gtech.assistencia.web.dto.EstoquePecaResponseDTO;
import br.com.gtech.assistencia.web.dto.HistoricoEstoqueResponseDTO;
import br.com.gtech.assistencia.web.dto.MovimentacaoEstoqueResponseDTO;
import br.com.gtech.assistencia.web.exception.BusinessException;
import br.com.gtech.assistencia.web.exception.ResourceConflictException;
import br.com.gtech.assistencia.web.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
public class EstoqueService {

    private final EstoquePecaRepository estoquePecaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public EstoqueService(
            EstoquePecaRepository estoquePecaRepository,
            MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.estoquePecaRepository = estoquePecaRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public EstoquePecaResponseDTO criar(EstoquePecaRequestDTO request) {
        if (estoquePecaRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new ResourceConflictException("Ja existe peca cadastrada com este SKU.");
        }

        EstoquePeca entity = new EstoquePeca();
        preencher(entity, request);
        EstoquePeca salva = estoquePecaRepository.save(entity);

        if (salva.getQuantidadeAtual().compareTo(BigDecimal.ZERO) > 0) {
            registrarMovimentacao(salva, TipoMovimentoEstoque.ENTRADA, salva.getQuantidadeAtual(), BigDecimal.ZERO,
                    salva.getQuantidadeAtual(), "Carga inicial de estoque.");
        }

        return toResponse(salva);
    }

    @Transactional(readOnly = true)
    public EstoquePecaResponseDTO buscarPorId(Long id) {
        return estoquePecaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Peca de estoque nao encontrada."));
    }

    @Transactional(readOnly = true)
    public List<EstoquePecaResponseDTO> listar(String sku, String nome, String busca) {
        String termo = busca == null ? "" : busca.trim().toLowerCase(Locale.ROOT);
        return estoquePecaRepository.findAll().stream()
                .filter(peca -> sku == null || sku.isBlank() || peca.getSku().equalsIgnoreCase(sku))
                .filter(peca -> nome == null || nome.isBlank() || peca.getNome().toLowerCase().contains(nome.toLowerCase()))
                .filter(peca -> termo.isEmpty()
                        || peca.getNome().toLowerCase(Locale.ROOT).contains(termo)
                        || peca.getSku().toLowerCase(Locale.ROOT).contains(termo))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EstoquePecaResponseDTO> listarAbaixoDoMinimo() {
        return estoquePecaRepository.findAll().stream()
                .filter(peca -> peca.getQuantidadeAtual().compareTo(peca.getEstoqueMinimo()) <= 0)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EstoquePecaResponseDTO atualizar(Long id, EstoquePecaRequestDTO request) {
        EstoquePeca entity = estoquePecaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Peca de estoque nao encontrada."));

        validarVersion(entity.getVersion(), request.getVersion());

        if (request.getQuantidadeAtual() == null
                || entity.getQuantidadeAtual().compareTo(request.getQuantidadeAtual()) != 0) {
            throw new BusinessException("Para alterar a quantidade, registre uma entrada ou saida de estoque.");
        }

        if (!entity.getSku().equalsIgnoreCase(request.getSku())
                && estoquePecaRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new ResourceConflictException("Ja existe outra peca cadastrada com este SKU.");
        }

        preencher(entity, request);
        return toResponse(estoquePecaRepository.saveAndFlush(entity));
    }

    @Transactional
    public EstoquePecaResponseDTO ajustar(Long id, AjusteEstoqueRequestDTO request) {
        EstoquePeca entity = estoquePecaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Peca de estoque nao encontrada."));

        validarVersion(entity.getVersion(), request.getVersion());

        BigDecimal saldoAnterior = entity.getQuantidadeAtual();
        BigDecimal saldoPosterior = calcularNovoSaldo(entity, request);
        entity.setQuantidadeAtual(saldoPosterior);

        EstoquePeca salvo = estoquePecaRepository.save(entity);
        registrarMovimentacao(salvo, request.getTipoMovimento(), request.getQuantidade(), saldoAnterior,
                saldoPosterior, request.getObservacao());
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public HistoricoEstoqueResponseDTO listarHistorico(Long id, int pagina) {
        if (pagina < 0) {
            throw new BusinessException("A pagina do historico nao pode ser negativa.");
        }
        if (!estoquePecaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Peca de estoque nao encontrada.");
        }

        var registros = movimentacaoEstoqueRepository.findByEstoquePeca_Id(
                id, PageRequest.of(pagina, 20, Sort.by(Sort.Direction.DESC, "id"))
        );
        var movimentacoes = registros.getContent().stream()
                .map(movimento -> new MovimentacaoEstoqueResponseDTO(
                        movimento.getId(), movimento.getTipoMovimento(), movimento.getQuantidade(),
                        movimento.getSaldoAnterior(), movimento.getSaldoPosterior(), movimento.getObservacao(),
                        movimento.getDataMovimento(), movimento.getUsuario().getNome()
                ))
                .toList();

        return new HistoricoEstoqueResponseDTO(
                movimentacoes, registros.getNumber(), registros.getTotalPages(), registros.getTotalElements()
        );
    }

    private BigDecimal calcularNovoSaldo(EstoquePeca entity, AjusteEstoqueRequestDTO request) {
        BigDecimal quantidade = request.getQuantidade();
        return switch (request.getTipoMovimento()) {
            case ENTRADA, AJUSTE_POSITIVO, ESTORNO -> entity.getQuantidadeAtual().add(quantidade);
            case SAIDA, AJUSTE_NEGATIVO, RESERVA -> {
                BigDecimal novoSaldo = entity.getQuantidadeAtual().subtract(quantidade);
                if (novoSaldo.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BusinessException("A movimentacao deixaria o estoque negativo.");
                }
                yield novoSaldo;
            }
        };
    }

    private void preencher(EstoquePeca entity, EstoquePecaRequestDTO request) {
        entity.setSku(request.getSku());
        entity.setNome(request.getNome());
        entity.setCategoria(request.getCategoria());
        entity.setDescricao(request.getDescricao());
        entity.setUnidadeMedida(request.getUnidadeMedida());
        entity.setCustoMedio(request.getCustoMedio());
        entity.setPrecoVenda(request.getPrecoVenda());
        entity.setQuantidadeAtual(request.getQuantidadeAtual());
        entity.setEstoqueMinimo(request.getEstoqueMinimo());
        entity.setAtivo(Boolean.TRUE.equals(request.getAtivo()));
    }

    private void registrarMovimentacao(
            EstoquePeca estoquePeca,
            TipoMovimentoEstoque tipo,
            BigDecimal quantidade,
            BigDecimal saldoAnterior,
            BigDecimal saldoPosterior,
            String observacao
    ) {
        Usuario usuario = authenticatedUserService.getCurrentUser();

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setEstoquePeca(estoquePeca);
        movimentacao.setUsuario(usuario);
        movimentacao.setTipoMovimento(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setSaldoAnterior(saldoAnterior);
        movimentacao.setSaldoPosterior(saldoPosterior);
        movimentacao.setObservacao(observacao);
        movimentacaoEstoqueRepository.save(movimentacao);
    }

    private void validarVersion(Long entityVersion, Long requestVersion) {
        if (requestVersion == null || !entityVersion.equals(requestVersion)) {
            throw new ResourceConflictException("Versao desatualizada para a operacao solicitada.");
        }
    }

    private EstoquePecaResponseDTO toResponse(EstoquePeca entity) {
        EstoquePecaResponseDTO response = new EstoquePecaResponseDTO();
        response.setId(entity.getId());
        response.setSku(entity.getSku());
        response.setNome(entity.getNome());
        response.setCategoria(entity.getCategoria());
        response.setDescricao(entity.getDescricao());
        response.setUnidadeMedida(entity.getUnidadeMedida());
        response.setCustoMedio(entity.getCustoMedio());
        response.setPrecoVenda(entity.getPrecoVenda());
        response.setQuantidadeAtual(entity.getQuantidadeAtual());
        response.setEstoqueMinimo(entity.getEstoqueMinimo());
        response.setAtivo(entity.isAtivo());
        response.setVersion(entity.getVersion());
        return response;
    }
}
