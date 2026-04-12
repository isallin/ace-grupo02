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

    if (listaWeb.nome.length <= 3) {
        console.log("Nome inválido")
        return false;
    }

    //Verificando se o user já existe no banco de dados
    const listaUsuarios = await listarUsuarios();
    for (let i = 0; i < listaUsuarios.length; i++) {
        const user = listaUsuarios[i].nickname;
        if (user == usuario) {
            console.log("Usuário já existe!")
            return;
        }
    }

    //Verificando email
    if (lista.email.includes("@") == false) {
        console.log("Email inválido")
        return false;
    }

    //Verificando senha
    if (lista.senha.length < 8) {
        console.log("Senha inválida")
        return false;
    }

    return true;
}

//Função para verificar se o @user que a
//pessoa inseriu já existe no banco de dados
async function listarUsuarios() {
    try {
        const resp = await fetch("/usuarios/listarUsuarios");
        if (!resp.ok) throw new Error("Erro na rede");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}