const campoBusca = document.getElementById('busca');
const filtroCategoria = document.getElementById('categoria');
const btnSurpreenda = document.getElementById('btn-surpreenda');
const cardsLivros = document.querySelectorAll('.card-livro');
const tituloContador = document.querySelector('.topo-lista h2');
const botoesEstante = document.querySelectorAll('.btn-adicionar');
const cardContainer = document.querySelector(".grade-livros-estante");

function verificarCategoria(etiqueta, categoriaEscolhida) {
    if (categoriaEscolhida === '') return true;

    if (categoriaEscolhida === 'romance') {
        return etiqueta.includes('romance');
    }
    if (categoriaEscolhida === 'ficcao') {
        return etiqueta.includes('ficção científica') || etiqueta.includes('fantasia');
    }
    if (categoriaEscolhida === 'suspense') {
        return etiqueta.includes('suspense') || etiqueta.includes('mistério') || etiqueta.includes('investigação');
    }
    if (categoriaEscolhida === 'nao-ficcao') {
        return etiqueta.includes('ensaio') || etiqueta.includes('crítica') || etiqueta.includes('religioso') || etiqueta.includes('diário') || etiqueta.includes('criatividade');
    }
    if (categoriaEscolhida === 'classicos') {
        return etiqueta.includes('literatura') || etiqueta.includes('fábula');
    }

    return false;
}

function filtrarLivros() {
    const textoDigitado = campoBusca.value.toLowerCase();
    const categoriaEscolhida = filtroCategoria.value;
    let quantidadeVisivel = 0;

    cardsLivros.forEach(function(card) {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        const autor = card.querySelector('.autor').innerText.toLowerCase();
        const etiqueta = card.querySelector('.tag-categoria').innerText.toLowerCase();

        const bateTexto = titulo.includes(textoDigitado) || autor.includes(textoDigitado);
        const bateCategoria = verificarCategoria(etiqueta, categoriaEscolhida);

        if (bateTexto && bateCategoria) {
            card.style.display = 'flex';
            quantidadeVisivel++;
        } else {
            card.style.display = 'none';
        }
    });

    tituloContador.innerText = 'Todos os livros (' + quantidadeVisivel + ')';
}

campoBusca.addEventListener('input', filtrarLivros);
filtroCategoria.addEventListener('change', filtrarLivros);

botoesEstante.forEach(function(botao) {
    botao.addEventListener('click', function() {
        const card = botao.closest('.card-livro');

        if (botao.innerText === '+ Minha Estante') {
            botao.innerText = '✓ Na Estante';
            botao.style.backgroundColor = '#8D5367';
            botao.style.color = '#FFF9F7';
        } else {
            botao.innerText = '+ Minha Estante';
            botao.style.backgroundColor = '#FFF9F7';
            botao.style.color = '#8D5367';
            card.removeAttribute('data-status');
        }

        filtrarLivros();
    });
});

function tocarSomRoleta(tipo) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscilador = audioCtx.createOscillator();
    const volume = audioCtx.createGain();

    oscilador.connect(volume);
    volume.connect(audioCtx.destination);

    if (tipo === 'passo') {
        oscilador.type = 'triangle';
        oscilador.frequency.setValueAtTime(500, audioCtx.currentTime);
        volume.gain.setValueAtTime(0.08, audioCtx.currentTime);
        volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        oscilador.start();
        oscilador.stop(audioCtx.currentTime + 0.06);
    } else {
        oscilador.type = 'sine';
        oscilador.frequency.setValueAtTime(523, audioCtx.currentTime);
        oscilador.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
        oscilador.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
        volume.gain.setValueAtTime(0.12, audioCtx.currentTime);
        volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        oscilador.start();
        oscilador.stop(audioCtx.currentTime + 0.4);
    }
}

btnSurpreenda.addEventListener('click', function() {
    campoBusca.value = '';
    filtroCategoria.value = '';
    filtrarLivros();

    cardsLivros.forEach(function(card) {
        card.classList.remove('card-sorteado', 'card-passando');
    });

    btnSurpreenda.disabled = true;
    btnSurpreenda.innerText = '🎲 Sorteando...';

    let passos = 0;
    const totalPassos = 14;
    let indiceAtual = 0;

    const intervalo = setInterval(function() {
        cardsLivros.forEach(function(card) {
            card.classList.remove('card-passando');
        });

        indiceAtual = Math.floor(Math.random() * cardsLivros.length);
        cardsLivros[indiceAtual].classList.add('card-passando');
        tocarSomRoleta('passo');

        passos++;

        if (passos >= totalPassos) {
            clearInterval(intervalo);
            cardsLivros[indiceAtual].classList.remove('card-passando');

            const livroEscolhido = cardsLivros[indiceAtual];
            livroEscolhido.classList.add('card-sorteado');
            livroEscolhido.scrollIntoView({ behavior: 'smooth', block: 'center' });
            tocarSomRoleta('vitoria');

            btnSurpreenda.disabled = false;
            btnSurpreenda.innerText = '🎲 Me Surpreenda';

            setTimeout(function() {
                livroEscolhido.classList.remove('card-sorteado');
            }, 4000);
        }
    }, 110);
});

const modal = document.getElementById("bookModal");
const closeModalBtn = document.getElementById("closeModalBtn");

function fecharModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

if (closeModalBtn) closeModalBtn.addEventListener("click", fecharModal);
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModal();
    });
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) fecharModal();
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