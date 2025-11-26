
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-usuario-form');
    const listaUsuarios = document.getElementById('lista-usuarios');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnExcluirTodos = document.getElementById('btn-excluir-todos');
    const inputPesquisa = document.getElementById('input-pesquisa');
    const btnPesquisar = document.getElementById('btn-pesquisar');
    const btnLimparPesquisa = document.getElementById('btn-limpar-pesquisa');

    const STORAGE_KEY = 'usuariosCadastrados';

    //Função para carregar usuários do Local Storage e renderizar a lista
    function carregarUsuarios() {
        const usuariosJSON = localStorage.getItem(STORAGE_KEY);
        return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    }

    //Função para salvar usuários no Local Storage
    function salvarUsuarios(usuarios) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
    }

    //Função para renderizar a lista de usuários (ou a lista filtrada)
    function renderizarLista(usuariosParaExibir) {
        listaUsuarios.innerHTML = ''; // Limpa a lista atual
        const usuarios = usuariosParaExibir || carregarUsuarios();

        if (usuarios.length === 0) {
            listaUsuarios.innerHTML = '<li class="lista-vazia">Nenhum usuário cadastrado.</li>';
            return;
        }

        usuarios.forEach((usuario, index) => {
            const li = document.createElement('li');
            const dataFormatada = new Date(usuario.dataCadastro).toLocaleString('pt-BR');
            
            li.innerHTML = `
                <span><strong>Nome:</strong> ${usuario.nome}</span>
                <span><strong>E-mail:</strong> ${usuario.email}</span>
                <span><strong>Data de Cadastro:</strong> ${dataFormatada}</span>
                <button type="button" class="btn-excluir" data-index="${usuario.id}">Excluir</button>
            `;
            listaUsuarios.appendChild(li);
        });


        document.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-index');
                excluirUsuario(id);
            });
        });
    }

    //Função para cadastrar novo usuário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!nome || !email) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const novoUsuario = {
            // Usar ID único para facilitar a exclusão
            id: Date.now().toString(), 
            nome: nome,
            email: email,
            dataCadastro: new Date().toISOString()
        };

        const usuarios = carregarUsuarios();
        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);
        
        limparCampos();

        renderizarLista();
    });

    //Função para limpar campos do formulário
    function limparCampos() {
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
        document.getElementById('nome').focus();
    }

    btnLimpar.addEventListener('click', limparCampos);

    //Função para excluir um item da lista e do Local Storage
    function excluirUsuario(id) {
        let usuarios = carregarUsuarios();
        const novaLista = usuarios.filter(usuario => usuario.id !== id);
        
        if (novaLista.length < usuarios.length) {
            salvarUsuarios(novaLista);
            renderizarLista();
            alert('Usuário excluído com sucesso!');
        } else {
            alert('Erro ao excluir usuário. ID não encontrado.');
        }
    }

    //Função para excluir todos os itens da lista e do Local Storage
    btnExcluirTodos.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir TODOS os usuários cadastrados?')) {
            localStorage.removeItem(STORAGE_KEY);
            renderizarLista();
            alert('Todos os usuários foram excluídos.');
        }
    });

    //Função para pesquisar/filtrar os itens da lista
    function pesquisarUsuarios() {
        const termo = inputPesquisa.value.toLowerCase().trim();
        const usuarios = carregarUsuarios();

        if (!termo) {
            renderizarLista(); 
            return;
        }

        const resultados = usuarios.filter(usuario => 
            usuario.nome.toLowerCase().includes(termo) || 
            usuario.email.toLowerCase().includes(termo)
        );

        renderizarLista(resultados);
    }

    btnPesquisar.addEventListener('click', pesquisarUsuarios);
    inputPesquisa.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            pesquisarUsuarios();
        }
    });

    //Função para limpar a pesquisa e mostrar todos os usuários
    btnLimparPesquisa.addEventListener('click', () => {
        inputPesquisa.value = '';
        renderizarLista();
    });

    // Carrega a lista de usuários ao iniciar a página
    renderizarLista();
});
