// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

//Contador de pacientes
const cont = document.getElementById('cont');
let cliques = 0;

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone, idade) {
  const novoPaciente = { nome, email, nascimento, telefone, idade };

  const duplicado = pacientes.filter(pacientes => pacientes.email === novoPaciente.email);

  if(duplicado.length > 0){
    alert('Email já cadastrado');
  }else{
    console.log(novoPaciente);
    pacientes.push(novoPaciente);
  }

}

function calcaularIdade(nascimento){
  const hoje = new Date();
  const nasceu = new Date(nascimento);

  let idade = hoje.getFullYear() - nasceu.getFullYear();

  const mesAtual = hoje.getMonth();
  const mesNasc = nasceu.getMonth();

  if(mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDay() < nasceu.getDay())){
    idade--;
  }

  return idade;
}

function apagarPaciente(index){
  pacientes.splice(index, 1);
  renderizarTabela();
}


// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela() {
  tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

  pacientes.forEach((paciente, index) => {
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${paciente.telefone}</td>
      <td>${paciente.idade}</td>
      <td><button type="button" class="btn btn-danger" data-index="${index}">Apagar</button></td>
    `;

    const botao = linha.querySelector('button');

    botao.addEventListener('click', () => {
      apagarPaciente(index);
    });

    tabela.appendChild(linha);
  });
}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // evita o recarregamento da página

  cliques++;
  cont.textContent = cliques;

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value;
  let idade = calcaularIdade(nascimento);

  adicionarPaciente(nome, email, nascimento, telefone, idade);
  renderizarTabela();

  formulario.reset(); // limpa os campos do formulário
});