function calcularSimulacao() {
    // Obter valores do formulário
    const valorImovel = parseFloat(document.getElementById('valorImovel').value) || 200000;
    const valorEntrada = parseFloat(document.getElementById('valorEntrada').value) || 40000;
    const prazo = parseInt(document.getElementById('prazo').value) || 30;
    const tipoTaxa = document.querySelector('input[name="tipoTaxa"]:checked').value;
    const tipoPessoa = document.querySelector('input[name="tipoPessoa"]:checked').value;
    const idade = parseInt(document.getElementById('idade').value) || 35;
    const rendimentoMensal = parseFloat(document.getElementById('rendimentoMensal').value) || 3000;

    // Validar valores mínimos
    if (valorEntrada < valorImovel * 0.1) {
        alert('Atenção: O valor de entrada deve ser pelo menos 10% do valor do imóvel.');
        return;
    }

    if (valorEntrada > valorImovel) {
        alert('Atenção: O valor de entrada não pode ser maior que o valor do imóvel.');
        return;
    }

    // Cálculos
    const valorEmprestimo = valorImovel - valorEntrada;
    const prazoMeses = prazo * 12;
    
    // Taxas de juros baseadas no tipo de taxa e perfil
    let taxaAnual = 0;
    
    if (tipoTaxa === 'fixa') {
        taxaAnual = idade < 40 ? 3.5 : 4.0;
    } else {
        taxaAnual = idade < 40 ? 2.8 : 3.3;
    }
    
    // Ajuste baseado no tipo de pessoa
    if (tipoPessoa === 'casal') {
        taxaAnual -= 0.2;
    }
    
    // Garantir que a taxa não fique negativa
    taxaAnual = Math.max(taxaAnual, 1.0);
    
    const taxaMensal = taxaAnual / 100 / 12;
    
    // Cálculo da prestação mensal (fórmula de amortização)
    let prestacao = 0;
    if (taxaMensal > 0) {
        prestacao = valorEmprestimo * taxaMensal * Math.pow(1 + taxaMensal, prazoMeses) / 
                   (Math.pow(1 + taxaMensal, prazoMeses) - 1);
    } else {
        prestacao = valorEmprestimo / prazoMeses;
    }
    
    const totalJuros = prestacao * prazoMeses - valorEmprestimo;
    
    // Atualizar resultados na página
    document.getElementById('prestacaoMensal').textContent = formatarMoeda(Math.round(prestacao));
    document.getElementById('taxaJuros').textContent = taxaAnual.toFixed(2) + '%';
    document.getElementById('totalJuros').textContent = formatarMoeda(Math.round(totalJuros));
    document.getElementById('totalEmprestimo').textContent = formatarMoeda(Math.round(valorEmprestimo + totalJuros));
    
    // Calcular percentual do rendimento
    const percentualRendimento = (prestacao / rendimentoMensal * 100).toFixed(1);
    
    // Gerar recomendação baseada no percentual
    let recomendacao = '';
    if (percentualRendimento > 40) {
        recomendacao = `Atenção: Sua prestação representa ${percentualRendimento}% do seu rendimento (acima dos 40% recomendados). Considere aumentar o prazo ou valor de entrada.`;
    } else if (percentualRendimento > 35) {
        recomendacao = `Cuidado: Sua prestação representa ${percentualRendimento}% do seu rendimento (próximo do limite de 35%).`;
    } else {
        recomendacao = `Boa notícia: Sua prestação representa ${percentualRendimento}% do seu rendimento (dentro dos limites recomendados).`;
    }
    
    document.getElementById('recomendacaoTexto').textContent = recomendacao;
    
    // Mostrar resultados
    document.getElementById('resultadoCard').classList.remove('hidden');
    
    // Rolagem suave para os resultados
    document.getElementById('resultadoCard').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-PT') + ' €';
}

// Validar entrada enquanto o usuário digita
document.getElementById('valorImovel').addEventListener('input', function(e) {
    const valor = parseFloat(e.target.value) || 0;
    const entradaMinima = Math.ceil(valor * 0.1);
    document.querySelector('.info-text').textContent = `Mínimo recomendado: ${formatarMoeda(entradaMinima)} (10% do imóvel)`;
});

// Calcular automaticamente ao carregar a página
window.addEventListener('load', function() {
    calcularSimulacao();
    
    // Adicionar event listeners para cálculos em tempo real
    const inputs = ['valorImovel', 'valorEntrada', 'prazo', 'idade', 'rendimentoMensal'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calcularSimulacao);
    });
    
    // Event listeners para radios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', calcularSimulacao);
    });
});

// Prevenir valores negativos
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function(e) {
        if (e.target.value < 0) {
            e.target.value = Math.abs(e.target.value);
        }
    });
});