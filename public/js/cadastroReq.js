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
    const listaWeb = obterDadosCadastro();
    const listaValor = Object.values(listaWeb);

    // 1. Verificação de campos vazios
    if (listaValor.some(valor => valor.trim() === "")) {
        console.log("Preencha todos os campos.");
        return false;
    }

    //Verificando o tamanho do nome
    if (listaWeb.nome.length <= 3) {
        console.log("Nome inválido")
        return false;
    }

    //Verificando se o user já existe no banco de dados
    const listaUsuarios = await listarUsuarios();
    usuario = listaWeb.nome;
    for (let i = 0; i < listaUsuarios.length; i++) {
        const user = listaUsuarios[i].nickname;
        if (user == usuario) {
            console.log("Usuário já existe!")
            return false;
        }
    }

    //Verificando email
    if (listaWeb.email.includes("@") == false) {
        console.log("Email inválido")
        return false;
    }

    //Verificando se o código existe no banco de dados
    const listaCodigos = await listarCodigos();
    const prefixoCodigo = listaWeb.codigo.slice(0, -1);
    const codigoValido = listaCodigos.some(c => c.codAtivacao === prefixoCodigo);
    if (!codigoValido) {
        console.log("Código não encontrado!");
        return false;
    }

    //Verificando senha
    if (listaWeb.senha.length < 8) {
        console.log("Senha inválida")
        return false;
    }
    return listaWeb
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
            console.log("Cadastrado com sucesso!")
            setTimeout(() => window.location = "login.html", 2000);
        } else {
            throw new Error("Erro ao realizar o cadastro");
        }
    } catch (erro) {
        console.error(`ERRO: ${erro}`);
    }
}

//Função para verificar se o @user que a
//pessoa inseriu já existe no banco de dados
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