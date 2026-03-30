function cadastroLista() {
    return {
        nome: document.getElementById("ipt_nomecompleto").value,
        usuario: document.getElementById("ipt_usuario").value,
        email: document.getElementById("ipt_email").value,
        codigo: document.getElementById("ipt_codigo").value,
        senha: document.getElementById("ipt_senha").value
    };
}

function validacao() {
    const lista = cadastroLista();
    const valoresLista = Object.values(lista);

    //Verificando se está nulo
    for (let i = 0; i < valoresLista.length; i++) {
        if (valoresLista[i] == "") {
            console.log("Preencha todos os campos")
            return false;
        }
    }

    //Verificando tamanho do nome
    if (lista.nome.length <= 3) {
        console.log("Nome inválido")
        return false;
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

function listarUsuarios() {
    let listaUsuarios = [];

    fetch("/usuarios/listarUsuarios", {
        method: "GET",
    })
        .then(function (resp) {
            resp.json().then((usuarios) => {
                usuarios.forEach((usuario) => {
                    listaUsuarios.push(usuario);
                });

                console.log(listaUsuarios)
            });
        })
        .catch(function (resp) {
            console.log(`ERRO: ${resp}`);
        });
}