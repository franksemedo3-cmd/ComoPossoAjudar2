
const pesquisa = document.getElementById("pesquisa");
const servicos = document.querySelectorAll(".servico");
const mensagem = document.getElementById("mensagem");

// Pesquisar serviços
if (pesquisa && mensagem) {
    pesquisa.addEventListener("input", function () {
        const texto = pesquisa.value.trim().toLocaleLowerCase("pt");
        let encontrados = 0;

        servicos.forEach(function (servico) {
            const nome = (
                (servico.dataset.nome || "") + " " +
                servico.textContent
            ).toLocaleLowerCase("pt");

            const corresponde = nome.includes(texto);
            servico.hidden = !corresponde;

            if (corresponde) {
                encontrados++;
            }
        });

        mensagem.textContent = encontrados > 0
            ? "Encontrámos " + encontrados + " serviço(s)."
            : "Não encontrámos esse serviço.";
    });
}

// Abrir as páginas
servicos.forEach(function (servico) {
    servico.addEventListener("click", function (evento) {
        const nome = servico.dataset.nome;

        const paginas = {
            "educação": "src/educacao.html",
            "emprego": "src/emprego.html",
            "saúde": "src/saude.html",
            "finanças": "src/financas.html",
            "serviços": "src/servicos.html",
            "ajuda": "src/ajuda.html",
            "agricultura": "src/servicos.html",
            "transportes": "src/servicos.html"
        };

        if (paginas[nome]) {
            if (servico.tagName.toLowerCase() === "a") {
                return;
            }

            evento.preventDefault();
            window.location.href = paginas[nome];
        } else if (mensagem) {
            evento.preventDefault();
            mensagem.textContent =
                "A área " + nome + " será desenvolvida futuramente.";
        }
    });
});

// Manter o modo offline
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js")
            .then(function () {
                console.log("Modo offline preparado!");
            })
            .catch(function (erro) {
                console.error("Erro ao ativar o modo offline:", erro);
            });
    });
}
