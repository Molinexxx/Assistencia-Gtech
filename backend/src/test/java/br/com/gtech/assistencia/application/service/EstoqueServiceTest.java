package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.application.security.AuthenticatedUserService;
import br.com.gtech.assistencia.domain.estoque.EstoquePeca;
import br.com.gtech.assistencia.domain.estoque.CategoriaEstoque;
import br.com.gtech.assistencia.infrastructure.persistence.EstoquePecaRepository;
import br.com.gtech.assistencia.infrastructure.persistence.MovimentacaoEstoqueRepository;
import br.com.gtech.assistencia.web.dto.EstoquePecaRequestDTO;
import br.com.gtech.assistencia.web.exception.BusinessException;
import br.com.gtech.assistencia.web.exception.ResourceConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EstoqueServiceTest {
    @Mock private EstoquePecaRepository pecas;
    @Mock private MovimentacaoEstoqueRepository movimentos;
    @Mock private AuthenticatedUserService usuario;
    @InjectMocks private EstoqueService service;

    private EstoquePeca peca;
    private EstoquePecaRequestDTO request;

    @BeforeEach
    void preparar() {
        peca = new EstoquePeca();
        peca.setSku("TESTE-001");
        peca.setNome("Tela de teste");
        peca.setPrecoVenda(new BigDecimal("80.00"));
        peca.setQuantidadeAtual(new BigDecimal("5.000"));
        ReflectionTestUtils.setField(peca, "version", 3L);

        request = new EstoquePecaRequestDTO();
        request.setSku("TESTE-001");
        request.setNome("Tela de teste");
        request.setCategoria(CategoriaEstoque.PECAS);
        request.setUnidadeMedida("UN");
        request.setCustoMedio(new BigDecimal("50.00"));
        request.setPrecoVenda(new BigDecimal("85.00"));
        request.setQuantidadeAtual(new BigDecimal("5"));
        request.setEstoqueMinimo(new BigDecimal("2"));
        request.setAtivo(true);
        request.setVersion(3L);
        when(pecas.findById(1L)).thenReturn(Optional.of(peca));
    }

    @Test
    void categoriaEscolhidaNaoDependeDoNomeDaPeca() {
        request.setCategoria(CategoriaEstoque.ACESSORIOS);
        when(pecas.saveAndFlush(peca)).thenReturn(peca);

        var response = service.atualizar(1L, request);

        assertEquals(CategoriaEstoque.ACESSORIOS, response.getCategoria());
        assertEquals("Tela de teste", response.getNome());
        assertEquals(0, new BigDecimal("5").compareTo(response.getQuantidadeAtual()));
        verifyNoInteractions(movimentos);
    }

    @Test
    void renomearPecaNaoMudaCategoriaEscolhida() {
        request.setNome("Chave de teste");
        when(pecas.saveAndFlush(peca)).thenReturn(peca);

        var response = service.atualizar(1L, request);

        assertEquals("Chave de teste", response.getNome());
        assertEquals(CategoriaEstoque.PECAS, response.getCategoria());
        verifyNoInteractions(movimentos);
    }

    @Test
    void editarPrecoPreservaSaldoESemCriarMovimentacao() {
        when(pecas.saveAndFlush(peca)).thenAnswer(invocation -> {
            ReflectionTestUtils.setField(peca, "version", 4L);
            return peca;
        });

        var response = service.atualizar(1L, request);

        assertEquals(new BigDecimal("85.00"), response.getPrecoVenda());
        assertEquals(0, new BigDecimal("5").compareTo(response.getQuantidadeAtual()));
        assertEquals(4L, response.getVersion());
        verifyNoInteractions(movimentos);
    }

    @Test
    void recusaMudancaDeSaldoPelaEdicaoDoCadastro() {
        request.setQuantidadeAtual(new BigDecimal("999"));

        assertThrows(BusinessException.class, () -> service.atualizar(1L, request));
        assertEquals(new BigDecimal("5.000"), peca.getQuantidadeAtual());
        assertEquals(new BigDecimal("80.00"), peca.getPrecoVenda());
        verify(pecas, never()).saveAndFlush(any());
        verifyNoInteractions(movimentos);
    }

    @Test
    void recusaEdicaoComVersaoAntiga() {
        request.setVersion(2L);

        assertThrows(ResourceConflictException.class, () -> service.atualizar(1L, request));
        assertEquals(new BigDecimal("80.00"), peca.getPrecoVenda());
        verify(pecas, never()).saveAndFlush(any());
        verifyNoInteractions(movimentos);
    }
}
