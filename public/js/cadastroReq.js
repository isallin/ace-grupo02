function obterDadosCadastro() {
    if (window.innerWidth > 768) {
        return cadastroWeb();
    } else {
        return cadastroMob();
    }
}

function cadastroWeb() {
    return {
        nome: document.querySelector('#web_nome').value,
        usuario: document.querySelector('#web_usuario').value,
        email: document.querySelector('#web_email').value,
        codigo: document.querySelector('#web_codigo').value,
        senha: document.querySelector('#web_senha').value
    };
}

function cadastroMob() {
    return {
        nome: document.querySelector('#mob_nome').value,
        usuario: document.querySelector('#mob_usuario').value,
        email: document.querySelector('#mob_email').value,
        codigo: document.querySelector('#mob_codigo').value,
        senha: document.querySelector('#mob_senha').value
    };
}

async function validacao() {
    const dadosCadastro = obterDadosCadastro();
    const dadosLista = Object.values(dadosCadastro);

    // 1. Verificação de campos vazios
    if (dadosLista.some(valor => valor.trim() === "")) {
        notificacao("Erro", "Preencha todos os campos", "c3423f");
        return false;
    }

    //Verificando o tamanho do nome
    if (dadosCadastro.nome.length <= 3) {
        notificacao("Erro", "Nome inválido!", "c3423f");
        return false;
    }

    //Verificando se o user já existe no banco de dados
    const listaUsuarios = await listarUsuarios();
    usuario = dadosCadastro.usuario;
    for (let i = 0; i < listaUsuarios.length; i++) {
        const user = listaUsuarios[i].nickname;
        if (user == usuario) {
            notificacao("Erro", "Usuário já existe!", "c3423f");
            return false;
        }
    }

    //Verificando email
    if (dadosCadastro.email.includes("@") == false) {
        notificacao("Erro", "Email inválido!", "c3423f");
        return false;
    }
    const listaEmail = await listarEmail();
    email = dadosCadastro.email;
    for (let i = 0; i < listaEmail.length; i++) {
        const user = listaEmail[i].email;
        if (user == email) {
            notificacao("Erro", "Email já existe!", "c3423f");
            return false;
        }
    }

    //Verificando se o código existe no banco de dados
    const listaCodigos = await listarCodigos();
    const prefixoCodigo = dadosCadastro.codigo.slice(0, -1);
    const codigoValido = listaCodigos.some(c => c.codAtivacao === prefixoCodigo);
    if (!codigoValido) {
        notificacao("Erro", "Código inválido!", "c3423f");
        return false;
    }

    //Verificando senha
    if (dadosCadastro.senha.length < 8) {
        notificacao("Erro", "Senha inválido!", "c3423f");
        return false;
    }
    return dadosCadastro
}

// Função para cadastrar depois de validar
async function cadastrar() {
    const dados = await validacao();
    if (!dados) return;

    let funcao = "OUTROS";
    const sufixo = dados.codigo.slice(-1).toUpperCase();

    if (sufixo === "C") {
        funcao = "COACH";
    } else if (sufixo === "J") {
        funcao = "JOGADOR";
    }

    try {
        const resposta = await fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioServer: dados.usuario,
                emailServer: dados.email,
                senhaServer: dados.senha,
                // nomeServer: dados.nome,
                funcaoServer: funcao,
                codigoServer: dados.codigo.slice(0, -1)
            }),
        });

        if (resposta.ok) {
            notificacao("Sucesso!", "Cadastrado com sucesso!", "7EC94C")
            setTimeout(() => window.location = "login.html", 2000);
        } else {
            notificacao("Erro", "Erro ao cadastrar!", "c3423f");
            throw new Error("Erro ao realizar o cadastro");
        }
    } catch (erro) {
        notificacao("Erro", "Erro ao cadastrar!", "c3423f");
        console.error(`ERRO: ${erro}`);
    }
}

//Função para verificar se o @user já existe
async function listarUsuarios() {
    try {
        const resp = await fetch("/usuarios/listarUsuarios");
        if (!resp.ok) throw new Error("Erro ao listar usuários");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

//Função para verificar se o email já existe
async function listarEmail() {
    try {
        const resp = await fetch("/usuarios/listarEmail");
        if (!resp.ok) throw new Error("Erro ao listar emails");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

//Função para verificar o código de ativação
async function listarCodigos() {
    try {
        const resp = await fetch("/usuarios/listarCodigos");
        if (!resp.ok) throw new Error("Erro ao listar códigos");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}