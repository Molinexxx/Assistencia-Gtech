package br.com.gtech.assistencia.domain.aparelho;

import br.com.gtech.assistencia.domain.cliente.Cliente;
import br.com.gtech.assistencia.domain.shared.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "aparelhos")
public class Aparelho extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, length = 80)
    private String marca;

    @Column(nullable = false, length = 120)
    private String modelo;

    @Column(length = 40)
    private String cor;

    @Column(nullable = false, unique = true, length = 20)
    private String imei;

    @Column(name = "numero_serie", length = 80)
    private String numeroSerie;

    @Column(name = "bloqueio_conta", nullable = false)
    private boolean bloqueioConta;

    @Column(name = "bloqueio_frp", nullable = false)
    private boolean bloqueioFrp;

    @Column(name = "senha_criptografada")
    private byte[] senhaCriptografada;

    @Column(name = "senha_iv")
    private byte[] senhaIv;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getImei() {
        return imei;
    }

    public void setImei(String imei) {
        this.imei = imei;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public boolean isBloqueioConta() {
        return bloqueioConta;
    }

    public void setBloqueioConta(boolean bloqueioConta) {
        this.bloqueioConta = bloqueioConta;
    }

    public boolean isBloqueioFrp() {
        return bloqueioFrp;
    }

    public void setBloqueioFrp(boolean bloqueioFrp) {
        this.bloqueioFrp = bloqueioFrp;
    }

    public byte[] getSenhaCriptografada() {
        return senhaCriptografada;
    }

    public void setSenhaCriptografada(byte[] senhaCriptografada) {
        this.senhaCriptografada = senhaCriptografada;
    }

    public byte[] getSenhaIv() {
        return senhaIv;
    }

    public void setSenhaIv(byte[] senhaIv) {
        this.senhaIv = senhaIv;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
