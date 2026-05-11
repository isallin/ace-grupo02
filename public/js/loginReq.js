function obterDadoslogin() {
    if (window.innerWidth > 768) {
        return loginWeb();
    } else {
        return loginMob();
    }
}

function loginWeb() {
    return {
        email: document.querySelector('#web_email').value,
        senha: document.querySelector('#web_senha').value
    };
}

function loginMob() {
    return {
        email: document.querySelector('#mob_email').value,
        senha: document.querySelector('#mob_senha').value
    };
}

async function login() {
    const dadosLogin = obterDadoslogin();
    const dadosLista = Object.values(dadosLogin);

    if (dadosLista.some(valor => valor.trim() === "")) {
        notificacao("Erro", "Preencha todos os campos", "c3423f");
        return false;
    }

    try {
        const resposta = await fetch("/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailServer: dadosLogin.email,
                senhaServer: dadosLogin.senha
            })
        });

        if (resposta.ok) {
            notificacao("Sucesso!", "Login feito com sucesso", "7EC94C")
            const json = await resposta.json();
            console.log(json);
            console.log(JSON.stringify(json));
            sessionStorage.EMAIL_USUARIO = json.email;
            sessionStorage.NOME_USUARIO = json.nickname;
            sessionStorage.ID_USUARIO = json.idusuario;
            sessionStorage.FUNCAO_USUARIO = json.funcao;

            console.log("Session Storage armazenado com sucesso")
            setTimeout(() => {
                window.location = "../dashboard/geral.html";
            }, 1000);

        } else {
            const textoErro = await resposta.text();
            console.error("Erro no login:", textoErro);
            notificacao("Erro", "Falha ao fazer login", "c3423f");
        }

    } catch (erro) {
        console.log("ERRO na requisição:", erro);
        notificacao("Erro", "Falha ao fazer login", "c3423f");
    }

    return false;
}