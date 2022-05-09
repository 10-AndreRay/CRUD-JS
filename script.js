const btnAbrirTelaCadastro = document.querySelector("#btn-cadastrar");
const btnFecharTelaCadastro = document.querySelector("#btn-fechar");
const btnCancelarCadastro = document.querySelector("#btn-cancelar");
const btnSalvarCadastro = document.querySelector("#btn-salvar");
const tabelaClientes = document.querySelector("#tabela-clientes");
const telaCadastro = document.querySelector("#tela-cadastro");

//events
btnAbrirTelaCadastro.addEventListener("click", mostrarTelaCadastro);
btnFecharTelaCadastro.addEventListener("click", fecharTelaCasdastro);
btnCancelarCadastro.addEventListener("click", fecharTelaCasdastro);
btnSalvarCadastro.addEventListener("click", criarCliente);

lerCliente();

//functions
function mostrarTelaCadastro(){
    telaCadastro.classList.remove("hidden");
    btnAbrirTelaCadastro.classList.add("hidden");
    tabelaClientes.classList.add("hidden");
};

function fecharTelaCasdastro(){
    telaCadastro.classList.add("hidden");
    btnAbrirTelaCadastro.classList.remove("hidden");
    tabelaClientes.classList.remove("hidden");
    limparInput();
};

function verificarValoresObjeto(obj){
    /* 
        -> recebe um objeto ex: {nome: meunome};
        -> recebe as chaves do objeto e coloca em um array;
        -> faz um forEach e verifica se alguma propriedade tem valor "";
        -> retorna a quantidade de propriedades com valor "";
    */
    let vazio = 0;
    const objectKeys = Object.keys(obj);
    objectKeys.forEach( item => {
        if (obj[item] === "") {
            vazio++;
        };
    });
    return vazio;
};

function obterLocalStorage(){
    //Retorna um JSON do db_cliente
    return JSON.parse(localStorage.getItem("db_cliente")) ??[];
};

function definirLocalStorage(banco){
    //Transforma o array em string e manda para o local storage
    localStorage.setItem("db_cliente", JSON.stringify(banco))
};

function limparInput(){
    document.querySelector("#name").value = "";
    document.querySelector("#email").value ="";
    document.querySelector("#number").value ="";
    document.querySelector("#city").value ="";
};

function adicionarEventosEditarExcluir(){
    //Adiciona eventos nos botões de editar e excluir
    btnsEditar = document.querySelectorAll(".btn-editar");
    btnsExcluir = document.querySelectorAll(".btn-excluir");
    for (let i = 0; i < btnsEditar.length; i++){
        btnsEditar[i].addEventListener("click", atualizarCliente)
    }
    for (let j = 0; j < btnsExcluir.length; j++){
        btnsExcluir[j].addEventListener("click", excluirCliente)
    }
}

//CRUD
function criarCliente(){
    const cliente = {}
    cliente.nome = document.querySelector("#name").value;
    cliente.email = document.querySelector("#email").value;
    cliente.numero = document.querySelector("#number").value
    cliente.cidade = document.querySelector("#city").value;

    const inputsVazios = verificarValoresObjeto(cliente);

    if (inputsVazios === 0){
        const dbCliente = obterLocalStorage();
        dbCliente.push(cliente);
        definirLocalStorage(dbCliente);
        fecharTelaCasdastro();
        lerCliente();
    }
};

function lerCliente(){
    const db_cliente = obterLocalStorage();
    const tabela = document.querySelector("tbody");
    tabela.innerHTML = "";
    
    for (let i = 0; i < db_cliente.length; i++){
        const linha = document.createElement("tr");
        linha.innerHTML =
           `<td class="pt-3 nome-cliente">${db_cliente[i].nome}</td>
            <td class="pt-3 email-cliente">${db_cliente[i].email}</td>
            <td class="pt-3 num-cliente">${db_cliente[i].numero}</td>
            <td class="pt-3 cid-cliente">${db_cliente[i].cidade}</td>
            <td class="text-center" id="div-${i}">
                <button class="btn btn-success btn-editar">Editar</button>
                <button class="btn btn-danger btn-excluir">Excluir</button>
            </td>`;
        tabela.appendChild(linha);
    };

    adicionarEventosEditarExcluir();
};

function atualizarCliente(evento){
    btnSalvarCadastro.removeEventListener("click", criarCliente);

    const clienteAlvo = evento.target.parentNode.parentNode;
    //o target do evento são os botões editar e excluir, pegando o "avô" deles conseguimos a linha da tabela com os dados que serão utilizados.

    const id = evento.target.parentNode.id.split("-")[1];
    //pega o id do elemento pai do target. ex: div-3; depois faz um split e armazena apenas o número na variável "id".

    mostrarTelaCadastro();

    document.querySelector("#name").value = clienteAlvo.querySelector(".nome-cliente").textContent;
    document.querySelector("#email").value = clienteAlvo.querySelector(".email-cliente").textContent;
    document.querySelector("#number").value = clienteAlvo.querySelector(".num-cliente").textContent;
    document.querySelector("#city").value = clienteAlvo.querySelector(".cid-cliente").textContent;

    btnSalvarCadastro.addEventListener("click", () => {
        const db_cliente = obterLocalStorage();
  
        //cria um objeto pegando os novos valores
        const clienteAtualizado = {
            nome: document.querySelector("#name").value,
            email: document.querySelector("#email").value,
            numero: document.querySelector("#number").value,
            cidade: document.querySelector("#city").value,
        };

        const inputsVazios = verificarValoresObjeto(clienteAtualizado);

        //atualiza o local storage apenas se não existir nenhuma propriedade com valor vazio
        if (inputsVazios === 0){
            db_cliente[id] = clienteAtualizado;
            definirLocalStorage(db_cliente);
            fecharTelaCasdastro();
            limparInput();
            lerCliente();
        }
    })
};

function excluirCliente(evento){
    const id = evento.target.parentNode.id.split("-")[1];
    //pega o id do elemento pai do target. ex: div-3; depois faz um split e armazena apenas o número na variável "id".

    const db_cliente = obterLocalStorage();

    db_cliente.splice(db_cliente[id], 1);

    definirLocalStorage(db_cliente);
    lerCliente();
};