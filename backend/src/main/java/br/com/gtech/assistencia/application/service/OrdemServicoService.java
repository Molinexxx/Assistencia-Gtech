package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.application.security.AuthenticatedUserService;
import br.com.gtech.assistencia.application.security.EncryptedPayload;
import br.com.gtech.assistencia.application.security.SensitiveDataCryptoService;
import br.com.gtech.assistencia.domain.aparelho.Aparelho;
import br.com.gtech.assistencia.domain.auditoria.AuditoriaAtividade;
import br.com.gtech.assistencia.domain.cliente.Cliente;
import br.com.gtech.assistencia.domain.estoque.EstoquePeca;
import br.com.gtech.assistencia.domain.os.ItemOrdemServicoPeca;
import br.com.gtech.assistencia.domain.os.OrdemServico;
import br.com.gtech.assistencia.domain.os.StatusOrdemServico;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.AparelhoRepository;
import br.com.gtech.assistencia.infrastructure.persistence.AuditoriaAtividadeRepository;
import br.com.gtech.assistencia.infrastructure.persistence.ClienteRepository;
import br.com.gtech.assistencia.infrastructure.persistence.EstoquePecaRepository;
import br.com.gtech.assistencia.infrastructure.persistence.OrdemServicoRepository;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import br.com.gtech.assistencia.web.dto.AtualizarStatusOrdemServicoRequestDTO;
import br.com.gtech.assistencia.web.dto.OrdemServicoRequestDTO;
import br.com.gtech.assistencia.web.dto.OrdemServicoResponseDTO;
import br.com.gtech.assistencia.web.exception.BusinessException;
import br.com.gtech.assistencia.web.exception.ResourceConflictException;
import br.com.gtech.assistencia.web.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class OrdemServicoService {

    private final ClienteRepository clienteRepository;
    private final AparelhoRepository aparelhoRepository;
    private final EstoquePecaRepository estoquePecaRepository;
    private final OrdemServicoRepository ordemServicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaAtividadeRepository auditoriaAtividadeRepository;
    private final SensitiveDataCryptoService sensitiveDataCryptoService;
    private final AuthenticatedUserService authenticatedUserService;

    public OrdemServicoService(
            ClienteRepository clienteRepository,
            AparelhoRepository aparelhoRepository,
            EstoquePecaRepository estoquePecaRepository,
            OrdemServicoRepository ordemServicoRepository,
            UsuarioRepository usuarioRepository,
            AuditoriaAtividadeRepository auditoriaAtividadeRepository,
            SensitiveDataCryptoService sensitiveDataCryptoService,
            AuthenticatedUserService authenticatedUserService
    ) {
        this.clienteRepository = clienteRepository;
        this.aparelhoRepository = aparelhoRepository;
        this.estoquePecaRepository = estoquePecaRepository;
        this.ordemServicoRepository = ordemServicoRepository;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaAtividadeRepository = auditoriaAtividadeRepository;
        this.sensitiveDataCryptoService = sensitiveDataCryptoService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public OrdemServicoResponseDTO abrirNovaOrdemServico(OrdemServicoRequestDTO request) {
        validarImei(request);

        Usuario atendente = authenticatedUserService.getCurrentUser();
        Cliente cliente = localizarOuCriarCliente(request.getCliente());
        Aparelho aparelho = localizarOuCriarAparelho(cliente, request);
        Usuario tecnico = localizarTecnicoSeInformado(request.getTecnicoId());

        OrdemServico ordemServico = new OrdemServico();
        ordemServico.setCodigo(gerarCodigoOs());
        ordemServico.setCliente(cliente);
        ordemServico.setAparelho(aparelho);
        ordemServico.setAtendente(atendente);
        ordemServico.setTecnico(tecnico);
        ordemServico.setStatus(StatusOrdemServico.EM_ANALISE);
        ordemServico.setProblemaRelatado(request.getProblemaRelatado());
        ordemServico.setChecklistTela(request.getChecklist().getTela());
        ordemServico.setChecklistCarcaca(request.getChecklist().getCarcaca());
        ordemServico.setChecklistBotoes(request.getChecklist().getBotoes());
        ordemServico.setChecklistConectores(request.getChecklist().getConectores());
        ordemServico.setChecklistCameras(request.getChecklist().getCameras());
        ordemServico.setChecklistBiometria(request.getChecklist().getBiometria());
        ordemServico.setChecklistOxidacao(Boolean.TRUE.equals(request.getChecklist().getOxidacao()));
        ordemServico.setAcessoriosRecebidos(request.getAcessoriosRecebidos());
        ordemServico.setImeiConfirmado(request.getImeiConfirmado());
        ordemServico.setDataEntrada(LocalDateTime.now());
        ordemServico.setDataPrevisao(request.getDataPrevisao());

        BigDecimal totalPecas = BigDecimal.ZERO;
        for (OrdemServicoRequestDTO.ItemPecaDTO itemRequest : request.getItensPecas()) {
            ItemOrdemServicoPeca item = new ItemOrdemServicoPeca();
            EstoquePeca estoquePeca = localizarPecaSeInformada(itemRequest.getEstoquePecaId());
            item.setEstoquePeca(estoquePeca);
            item.setDescricao(itemRequest.getDescricao());
            item.setQuantidade(itemRequest.getQuantidade());
            item.setValorUnitario(itemRequest.getValorUnitario());
            item.setSubtotal(itemRequest.getQuantidade().multiply(itemRequest.getValorUnitario()));
            ordemServico.adicionarItem(item);
            totalPecas = totalPecas.add(item.getSubtotal());
        }

        ordemServico.setValorPecas(totalPecas);
        ordemServico.setValorMaoObra(BigDecimal.ZERO);
        ordemServico.setDesconto(BigDecimal.ZERO);
        ordemServico.setValorTotal(totalPecas);

        OrdemServico ordemServicoSalva = ordemServicoRepository.save(ordemServico);
        salvarAuditoriaInicial(ordemServicoSalva, atendente);
        return toResponse(ordemServicoSalva);
    }

    @Transactional(readOnly = true)
    public List<OrdemServicoResponseDTO> listar(StatusOrdemServico status, Long clienteId, String imei, String codigo) {
        return ordemServicoRepository.buscarComFiltros(status, clienteId, imei, codigo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrdemServicoResponseDTO buscarPorId(Long id) {
        OrdemServico ordemServico = ordemServicoRepository.buscarDetalhadaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de servico nao encontrada."));
        return toResponse(ordemServico);
    }

    @Transactional
    public OrdemServicoResponseDTO atualizarStatus(Long id, AtualizarStatusOrdemServicoRequestDTO request) {
        OrdemServico ordemServico = ordemServicoRepository.buscarDetalhadaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordem de servico nao encontrada."));

        validarVersion(ordemServico.getVersion(), request.getVersion());
        validarTransicaoStatus(ordemServico.getStatus(), request.getStatus());

        ordemServico.setStatus(request.getStatus());
        if (request.getStatus() == StatusOrdemServico.FINALIZADA) {
            ordemServico.setDataFechamento(LocalDateTime.now());
        }
        if (request.getStatus() == StatusOrdemServico.ENTREGUE) {
            ordemServico.setDataEntrega(LocalDateTime.now());
        }

        OrdemServico salva = ordemServicoRepository.save(ordemServico);
        salvarAuditoriaDeStatus(salva, authenticatedUserService.getCurrentUser());
        return toResponse(salva);
    }

    private void validarImei(OrdemServicoRequestDTO request) {
        if (!Objects.equals(request.getAparelho().getImei(), request.getImeiConfirmado())) {
            throw new BusinessException("O IMEI confirmado deve ser igual ao IMEI informado no aparelho.");
        }
    }

    private void validarTransicaoStatus(StatusOrdemServico atual, StatusOrdemServico novo) {
        if (atual == novo) {
            return;
        }

        boolean valido = switch (atual) {
            case EM_ANALISE -> novo == StatusOrdemServico.AGUARDANDO_APROVACAO
                    || novo == StatusOrdemServico.EM_REPARO
                    || novo == StatusOrdemServico.AGUARDANDO_PECA
                    || novo == StatusOrdemServico.CANCELADA;
            case AGUARDANDO_APROVACAO -> novo == StatusOrdemServico.EM_REPARO
                    || novo == StatusOrdemServico.CANCELADA;
            case EM_REPARO -> novo == StatusOrdemServico.FINALIZADA
                    || novo == StatusOrdemServico.AGUARDANDO_PECA
                    || novo == StatusOrdemServico.CANCELADA;
            case AGUARDANDO_PECA -> novo == StatusOrdemServico.EM_REPARO
                    || novo == StatusOrdemServico.CANCELADA;
            case FINALIZADA -> novo == StatusOrdemServico.ENTREGUE;
            case ENTREGUE, CANCELADA -> false;
        };

        if (!valido) {
            throw new BusinessException("Transicao de status invalida: " + atual + " -> " + novo);
        }
    }

    private Cliente localizarOuCriarCliente(OrdemServicoRequestDTO.ClienteDTO clienteRequest) {
        if (clienteRequest.getId() != null) {
            return clienteRepository.findById(clienteRequest.getId())
                    .map(cliente -> atualizarCliente(cliente, clienteRequest))
                    .map(clienteRepository::save)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente informado nao foi encontrado."));
        }

        return clienteRepository.findByCpfCnpj(clienteRequest.getCpfCnpj())
                .map(cliente -> atualizarCliente(cliente, clienteRequest))
                .map(clienteRepository::save)
                .orElseGet(() -> clienteRepository.save(criarCliente(clienteRequest)));
    }

    private Cliente criarCliente(OrdemServicoRequestDTO.ClienteDTO clienteRequest) {
        Cliente cliente = new Cliente();
        return atualizarCliente(cliente, clienteRequest);
    }

    private Cliente atualizarCliente(Cliente cliente, OrdemServicoRequestDTO.ClienteDTO clienteRequest) {
        cliente.setNome(clienteRequest.getNome());
        cliente.setCpfCnpj(clienteRequest.getCpfCnpj());
        cliente.setEmail(clienteRequest.getEmail());
        cliente.setTelefone(clienteRequest.getTelefone());
        cliente.setLogradouro(clienteRequest.getLogradouro());
        cliente.setNumero(clienteRequest.getNumero());
        cliente.setBairro(clienteRequest.getBairro());
        cliente.setCidade(clienteRequest.getCidade());
        cliente.setUf(clienteRequest.getUf());
        cliente.setCep(clienteRequest.getCep());
        return cliente;
    }

    private Aparelho localizarOuCriarAparelho(Cliente cliente, OrdemServicoRequestDTO request) {
        return aparelhoRepository.findByImei(request.getAparelho().getImei())
                .map(aparelho -> atualizarAparelhoExistente(aparelho, cliente, request))
                .orElseGet(() -> aparelhoRepository.save(criarAparelho(cliente, request)));
    }

    private Aparelho atualizarAparelhoExistente(Aparelho aparelho, Cliente cliente, OrdemServicoRequestDTO request) {
        if (!Objects.equals(aparelho.getCliente().getId(), cliente.getId())) {
            throw new ResourceConflictException("Ja existe um aparelho com esse IMEI vinculado a outro cliente.");
        }

        return aparelhoRepository.save(preencherAparelho(aparelho, cliente, request));
    }

    private Aparelho criarAparelho(Cliente cliente, OrdemServicoRequestDTO request) {
        Aparelho aparelho = new Aparelho();
        return aparelhoRepository.save(preencherAparelho(aparelho, cliente, request));
    }

    private Aparelho preencherAparelho(Aparelho aparelho, Cliente cliente, OrdemServicoRequestDTO request) {
        aparelho.setCliente(cliente);
        aparelho.setMarca(request.getAparelho().getMarca());
        aparelho.setModelo(request.getAparelho().getModelo());
        aparelho.setCor(request.getAparelho().getCor());
        aparelho.setImei(request.getAparelho().getImei());
        aparelho.setNumeroSerie(request.getAparelho().getNumeroSerie());
        aparelho.setBloqueioConta(request.getAparelho().isBloqueioConta());
        aparelho.setBloqueioFrp(request.getAparelho().isBloqueioFrp());
        aparelho.setObservacoes(request.getAparelho().getObservacoes());

        EncryptedPayload encryptedPayload = sensitiveDataCryptoService.encrypt(request.getSenhaDispositivo());
        aparelho.setSenhaCriptografada(encryptedPayload.cipherText());
        aparelho.setSenhaIv(encryptedPayload.iv());
        return aparelho;
    }

    private Usuario localizarTecnicoSeInformado(Long tecnicoId) {
        if (tecnicoId == null) {
            return null;
        }

        return usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new ResourceNotFoundException("Tecnico informado nao foi encontrado."));
    }

    private EstoquePeca localizarPecaSeInformada(Long estoquePecaId) {
        if (estoquePecaId == null) {
            return null;
        }

        return estoquePecaRepository.findById(estoquePecaId)
                .orElseThrow(() -> new ResourceNotFoundException("Peca de estoque informada nao foi encontrada."));
    }

    private void salvarAuditoriaInicial(OrdemServico ordemServico, Usuario usuario) {
        AuditoriaAtividade auditoria = new AuditoriaAtividade();
        auditoria.setEntidade("ORDEM_SERVICO");
        auditoria.setEntidadeId(ordemServico.getId());
        auditoria.setAcao("ABERTURA_OS");
        auditoria.setDetalhes("OS criada com status EM_ANALISE para o aparelho IMEI " + ordemServico.getImeiConfirmado());
        auditoria.setUsuario(usuario);
        auditoriaAtividadeRepository.save(auditoria);
    }

    private void salvarAuditoriaDeStatus(OrdemServico ordemServico, Usuario usuario) {
        AuditoriaAtividade auditoria = new AuditoriaAtividade();
        auditoria.setEntidade("ORDEM_SERVICO");
        auditoria.setEntidadeId(ordemServico.getId());
        auditoria.setAcao("ALTERACAO_STATUS_OS");
        auditoria.setDetalhes("OS alterada para o status " + ordemServico.getStatus().name());
        auditoria.setUsuario(usuario);
        auditoriaAtividadeRepository.save(auditoria);
    }

    private void validarVersion(Long entityVersion, Long requestVersion) {
        if (requestVersion == null || !entityVersion.equals(requestVersion)) {
            throw new ResourceConflictException("Versao desatualizada para a operacao solicitada.");
        }
    }

    private OrdemServicoResponseDTO toResponse(OrdemServico ordemServico) {
        OrdemServicoResponseDTO response = new OrdemServicoResponseDTO();
        response.setId(ordemServico.getId());
        response.setCodigo(ordemServico.getCodigo());
        response.setStatus(ordemServico.getStatus());
        response.setClienteId(ordemServico.getCliente().getId());
        response.setAparelhoId(ordemServico.getAparelho().getId());
        response.setAtendenteId(ordemServico.getAtendente().getId());
        response.setTecnicoId(ordemServico.getTecnico() != null ? ordemServico.getTecnico().getId() : null);
        response.setClienteNome(ordemServico.getCliente().getNome());
        response.setAparelhoDescricao(ordemServico.getAparelho().getMarca() + " " + ordemServico.getAparelho().getModelo());
        response.setValorPecas(ordemServico.getValorPecas());
        response.setValorMaoObra(ordemServico.getValorMaoObra());
        response.setDesconto(ordemServico.getDesconto());
        response.setValorTotal(ordemServico.getValorTotal());
        response.setDataEntrada(ordemServico.getDataEntrada());
        response.setVersion(ordemServico.getVersion());
        response.setItens(ordemServico.getItensPecas().stream().map(item -> {
            OrdemServicoResponseDTO.ItemResumoDTO itemDto = new OrdemServicoResponseDTO.ItemResumoDTO();
            itemDto.setId(item.getId());
            itemDto.setEstoquePecaId(item.getEstoquePeca() != null ? item.getEstoquePeca().getId() : null);
            itemDto.setDescricao(item.getDescricao());
            itemDto.setQuantidade(item.getQuantidade());
            itemDto.setValorUnitario(item.getValorUnitario());
            itemDto.setSubtotal(item.getSubtotal());
            return itemDto;
        }).toList());
        return response;
    }

    private String gerarCodigoOs() {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "OS-" + Year.now().getValue() + "-" + suffix;
    }
}
