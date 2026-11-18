document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.querySelector(".grade-livros-estante");
    const modal = document.getElementById("bookModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    

    const dadosIniciais = {
        "A biblioteca da meia-noite": {
            titulo: "A biblioteca da meia-noite",
            autor: "Matt Haig",
            genero: "DRAMA",
            status: "Incompleto",
            paginasTotais: 304,
            paginaAtual: 142,
            sinopse: "Entre a vida e a morte existe uma biblioteca, e dentro dessa biblioteca, as prateleiras não têm fim. Cada livro oferece a chance de experimentar outra vida que você poderia ter vivido."
        },
        "Torto Arado": {
            titulo: "Torto Arado",
            autor: "Itamar Vieira Junior",
            genero: "FICÇÃO",
            status: "Completo",
            paginasTotais: 264,
            paginaAtual: 264,
            sinopse: "Nas profundezas do sertão baiano, as irmãs Bibiana e Belonísia encontram uma velha e misteriosa faca na mala guardada sob a cama da avó. Ocorre então um acidente que ligará suas vidas para sempre."
        },
        "O conto da aia": {
            titulo: "O conto da aia",
            autor: "Margaret Atwood",
            genero: "DISTOPIA",
            status: "Incompleto",
            paginasTotais: 368,
            paginaAtual: 85,
            sinopse: "Num futuro próximo, a República de Gilead derrubou o governo dos Estados Unidos. Offred é uma das poucas mulheres férteis restantes, designada para gerar filhos para a elite governante."
        },
        "Pequenos incêndios": {
            titulo: "Pequenos incêndios",
            autor: "Celeste Ng",
            genero: "ROMANCE",
            status: "Não iniciado",
            paginasTotais: 336,
            paginaAtual: 0,
            sinopse: "Em Shaker Heights, um subúrbio planejado e pacato, tudo é meticulosamente organizado — até a chegada de Mia Warren, uma artista enigmática e mãe solteira que abala a rotina da família Richardson."
        },
        "Duna": {
            titulo: "Duna",
            autor: "Frank Herbert",
            genero: "FANTASIA",
            status: "Incompleto",
            paginasTotais: 680,
            paginaAtual: 310,
            sinopse: "Ambientado no planeta desértico Arrakis, Duna conta a história de Paul Atreides, cuja família aceita o controle da única fonte da substância mais valiosa do universo."
        }
    };

    function abrirModal(livro) {
        document.getElementById("modalCategory").textContent = livro.categoria || livro.genero || "LITERATURA";
        document.getElementById("modalTitle").textContent = livro.titulo;
        document.getElementById("modalAuthor").textContent = livro.autor;
        document.getElementById("modalSynopsis").textContent = livro.sinopse || "Sem sinopse.";

        const coverImg = document.getElementById("modalCoverImg");
        if (livro.capaUrl) {
            coverImg.src = livro.capaUrl;
            coverImg.style.display = "block";
        } else {
            coverImg.removeAttribute("src");
        }

        const tagsContainer = document.getElementById("modalTags");
        tagsContainer.innerHTML = "";
        const listaTags = livro.tags || [livro.genero];
        
        listaTags.forEach((tag) => {
            if (tag) {
                const span = document.createElement("span");
                span.className = "tag-pill";
                span.textContent = tag;
                tagsContainer.appendChild(span);
            }
        });

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    }

    function fecharModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", fecharModal);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            fecharModal();
        }
    });


    document.querySelectorAll(".card-livro").forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest(".btn-adicionar")) return;

            const tituloCard = card.querySelector("h3").textContent.trim();
            const autorCard = card.querySelector(".autor").textContent.trim();
            const generoCard = card.querySelector(".tag-categoria").textContent.trim();
            const capaSrc = card.querySelector(".capa-wrapper img").getAttribute("src");

            const livroEncontrado = dadosIniciais[tituloCard] || {
                titulo: tituloCard,
                autor: autorCard,
                genero: generoCard,
                capaUrl: capaSrc,
                sinopse: "Sinopse do livro selecionado."
            };

            livroEncontrado.capaUrl = capaSrc;

            abrirModal(livroEncontrado);
        });
    });
    fetch("http://localhost:8080/livros")
        .then((response) => {
            if (!response.ok) throw new Error("Servidor não respondeu");
            return response.json();
        })
        .then((livros) => {
            cardContainer.innerHTML = "";

            livros.forEach((livro) => {
                const card = document.createElement("article");
                card.className = "card-livro";
                card.innerHTML = `
                    <div class="card-cover"></div>
                    <div class="card-content">
                        <h3>${livro.titulo}</h3>
                        <p class="author">${livro.autor}</p>
                        <div class="rating">★★★★★</div>
                        <span class="genre-tag">${livro.genero}</span>
                    </div>
                `;

                card.addEventListener("click", () => abrirModal(livro));
                cardContainer.appendChild(card);
            });
        })
        .catch(() => {
            console.log("Spring Boot offline: exibindo os cards locais do HTML.");
        });
});

const campoBuscaEstante = document.getElementById("leitura");
    const botoesStatus = document.querySelectorAll(".filter-pills .pill");
    let statusSelecionado = "todos"

    function normalizarStatus(textoBotao) {
        const texto = textoBotao.trim().toLowerCase();
        if (texto === "completo") return "completo";
        if (texto === "incompleto") return "incompleto";
        if (texto === "não iniciado") return "nao-iniciado";
        return "todos";
    }

    function filtrarEstante() {
        const termoBusca = campoBuscaEstante ? campoBuscaEstante.value.toLowerCase().trim() : "";
        const cardsDaEstante = document.querySelectorAll(".grade-livros-estante .card-livro");

        cardsDaEstante.forEach((card) => {
            const titulo = card.querySelector("h3").innerText.toLowerCase();
            const autor = card.querySelector(".autor").innerText.toLowerCase();
            const categoria = card.querySelector(".tag-categoria").innerText.toLowerCase();
            const statusLivro = card.getAttribute("data-status") || "";

            const bateTexto =
                titulo.includes(termoBusca) ||
                autor.includes(termoBusca) ||
                categoria.includes(termoBusca);

            const bateStatus =
                statusSelecionado === "todos" || statusLivro === statusSelecionado;

            if (bateTexto && bateStatus) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    if (campoBuscaEstante) {
        campoBuscaEstante.addEventListener("input", filtrarEstante);
    }

    botoesStatus.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesStatus.forEach((btn) => btn.classList.remove("active"));
            botao.classList.add("active");

            statusSelecionado = normalizarStatus(botao.textContent);
            filtrarEstante();
        });
    });