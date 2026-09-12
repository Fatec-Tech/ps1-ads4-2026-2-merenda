// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

//Contador de pacientes
const cont = document.getElementById('cont');

// Referências aos elementos do DOM que vamos usar várias vezes
const inputBusca = document.getElementById('filtroNome');
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const cabecalhoNome = document.getElementById('cabecalhoNome');
const cabecalhoIdade = document.getElementById('cabecalhoIdade');
const cabecalhoNascimento = document.getElementById('cabecalhoNascimento');

let ordemNome = 'asc';
let ordemIdade = 'asc';
let ordemNascimento = 'asc';

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone, idade) {
  const novoPaciente = { nome, email, nascimento, telefone, idade };

  const duplicado = pacientes.filter(pacientes => pacientes.email === novoPaciente.email);

  if(duplicado.length > 0){
    alert('Email já cadastrado');
  }else{
    console.log(novoPaciente);

    pacientes.push(novoPaciente);
    salvarPacientes();
  }

}

function calcaularIdade(nascimento){
  const hoje = new Date();
  const nasceu = new Date(nascimento);

  if (nasceu > hoje) {
    alert('Data de nascimento inválida');
    return 0;
  }

  let idade = hoje.getFullYear() - nasceu.getFullYear();

  const mesAtual = hoje.getMonth();
  const mesNasc = nasceu.getMonth();

  if(mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < nasceu.getDate())){
    idade--;
  }

  return idade;
}

function apagarPaciente(index){
  pacientes.splice(index, 1);
  salvarPacientes();
  renderizarTabela();
}

function salvarPacientes() {
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function carregarPacientes() {
  const dados = localStorage.getItem('pacientes');

  if (dados) {
    const pacientesSalvos = JSON.parse(dados);
    pacientes.push(...pacientesSalvos);
  }

  renderizarTabela();
}

function ordenarPorNome() {
  pacientes.sort((a, b) => {
    return ordemNome === 'asc' 
    ? a.nome.localeCompare(b.nome)
    : b.nome.localeCompare(a.nome);

  });

  ordemNome = ordemNome === 'asc' ? 'desc' : 'asc';
  renderizarTabela();
}

function ordenarPorIdade(){
  pacientes.sort((a, b) => {
    return ordemIdade === 'asc' 
    ? a.idade - b.idade
    : b.idade - a.idade;
  });

  ordemIdade = ordemIdade === 'asc' ? 'desc' : 'asc';
  renderizarTabela();
}

function ordenarPorNascimento(){
  pacientes.sort((a, b) => {
    return ordemNascimento === 'asc' 
    ? new Date(a.nascimento) - new Date(b.nascimento)
    : new Date(b.nascimento) - new Date(a.nascimento);
  });

  ordemNascimento = ordemNascimento === 'asc' ? 'desc' : 'asc';
  renderizarTabela(); 
}

function filtrarTabela(){
  const termo = inputBusca.value.toLowerCase();

  const linhas = tabela.querySelectorAll('tr');

  linhas.forEach((linha) => {
    //Pega o nome da primeira coluna
    const nome = linha.querySelector('td').textContent.toLowerCase();

    //Mostra ou esconde a linha
    if(nome.includes(termo)){
      linha.style.display = '';
    }else{
      linha.style.display = 'none';
    }
  });
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
      cont.textContent = pacientes.length;
    });

    tabela.appendChild(linha);
  });
}

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

//Evento disparado quando o usuário clica no cabeçalho da coluna "Nome"
cabecalhoNome.addEventListener('click', ordenarPorNome);

//Evento disparado quando o usuário clica no cabeçalho da coluna "Idade"
cabecalhoIdade.addEventListener('click', ordenarPorIdade);

//Evento disparado quando o usuário clica no cabeçalho da coluna "Nascimento"
cabecalhoNascimento.addEventListener('click', ordenarPorNascimento);

//Evento disparado quando o usuário digita no campo de busca
inputBusca.addEventListener('input', filtrarTabela);

// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // evita o recarregamento da página

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value;
  let idade = calcaularIdade(nascimento);

  adicionarPaciente(nome, email, nascimento, telefone, idade);

  cont.textContent = pacientes.length;

  renderizarTabela();

  formulario.reset(); // limpa os campos do formulário
});

carregarPacientes();
cont.textContent = pacientes.length;
