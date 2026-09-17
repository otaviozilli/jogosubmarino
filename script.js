const submarino = document.getElementById("submarino");
const oceano = document.getElementById("oceano");

const pontosTexto = document.getElementById("pontos");
const vidasTexto = document.getElementById("vidas");
const profundidadeTexto = document.getElementById("profundidade");

const mensagem = document.getElementById("mensagem");

const botaoCima = document.getElementById("cima");
const botaoBaixo = document.getElementById("baixo");
const botaoEsquerda = document.getElementById("esquerda");
const botaoDireita = document.getElementById("direita");

const botaoReiniciar = document.getElementById("reiniciar");

const recompensas = document.querySelectorAll(".recompensa");
const obstaculos = document.querySelectorAll(".obstaculo");


/* POSIÇÃO */

let x = 40;
let y = 180;


/* JOGO */

let pontos = 0;
let vidas = 3;

let profundidade = 1;

let jogoAtivo = true;


/* VELOCIDADE */

const velocidade = 4;


/* TECLAS */

const teclas = new Set();
const botoes = new Set();


/* POSIÇÃO INICIAL */

submarino.style.left = x + "px";
submarino.style.top = y + "px";


/* MOVIMENTO */

function atualizarMovimento() {

    if (!jogoAtivo) return;

    let dx = 0;
    let dy = 0;


    /* TECLADO */

    if (teclas.has("w") || teclas.has("arrowup")) {
        dy -= 1;
    }

    if (teclas.has("s") || teclas.has("arrowdown")) {
        dy += 1;
    }

    if (teclas.has("a") || teclas.has("arrowleft")) {
        dx -= 1;
    }

    if (teclas.has("d") || teclas.has("arrowright")) {
        dx += 1;
    }


    /* BOTÕES */

    if (botoes.has("cima")) {
        dy -= 1;
    }

    if (botoes.has("baixo")) {
        dy += 1;
    }

    if (botoes.has("esquerda")) {
        dx -= 1;
    }

    if (botoes.has("direita")) {
        dx += 1;
    }


    /* DIAGONAL */

    if (dx !== 0 && dy !== 0) {

        dx *= 0.707;
        dy *= 0.707;

    }


    /* MOVIMENTO */

    x += dx * velocidade;
    y += dy * velocidade;


    /* LIMITES */

    const limiteX =
        oceano.clientWidth - submarino.offsetWidth;

    const limiteY =
        oceano.clientHeight - submarino.offsetHeight;


    if (x < 0) {
        x = 0;
    }

    if (x > limiteX) {
        x = limiteX;
    }

    if (y < 0) {
        y = 0;
    }

    if (y > limiteY) {
        y = limiteY;
    }


    submarino.style.left = x + "px";
    submarino.style.top = y + "px";


    atualizarProfundidade();

    verificarColisoes();

}


/* PROFUNDIDADE */

function atualizarProfundidade() {

    const altura = oceano.clientHeight;

    const porcentagem = y / altura;


    let novaProfundidade;


    if (porcentagem < 0.20) {

        novaProfundidade = 1;

    } else if (porcentagem < 0.40) {

        novaProfundidade = 2;

    } else if (porcentagem < 0.60) {

        novaProfundidade = 3;

    } else if (porcentagem < 0.80) {

        novaProfundidade = 4;

    } else {

        novaProfundidade = 5;

    }


    /* SE CHEGOU EM UMA NOVA PROFUNDIDADE */

    if (novaProfundidade !== profundidade) {

        profundidade = novaProfundidade;

        profundidadeTexto.textContent = profundidade;

        oceano.className = "oceano";

        oceano.classList.add(
            "profundidade" + profundidade
        );


        if (profundidade === 2) {

            mensagem.textContent =
                "🐠 Você desceu! Procure a próxima recompensa!";

        }

        else if (profundidade === 3) {

            mensagem.textContent =
                "🌊 Está ficando mais fundo!";

        }

        else if (profundidade === 4) {

            mensagem.textContent =
                "🌑 Muito fundo! A recompensa vale mais!";

        }

        else if (profundidade === 5) {

            mensagem.textContent =
                "👑 Você chegou às profundezas!";

        }

    }

}


/* COLISÕES */

function verificarColisoes() {

    const submarinoRect =
        submarino.getBoundingClientRect();


    /* RECOMPENSAS */

    recompensas.forEach(function(recompensa) {

        if (recompensa.style.display === "none") {
            return;
        }


        const recompensaRect =
            recompensa.getBoundingClientRect();


        if (
            colidiu(
                submarinoRect,
                recompensaRect
            )
        ) {

            pegarRecompensa(recompensa);

        }

    });


    /* OBSTÁCULOS */

    obstaculos.forEach(function(obstaculo) {

        const obstaculoRect =
            obstaculo.getBoundingClientRect();


        if (
            colidiu(
                submarinoRect,
                obstaculoRect
            )
        ) {

            perderVida();

        }

    });

}


/* VERIFICAR COLISÃO */

function colidiu(a, b) {

    return (

        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top

    );

}


/* PEGAR RECOMPENSA */

function pegarRecompensa(recompensa) {

    const valor =
        Number(recompensa.dataset.pontos);


    pontos += valor;

    pontosTexto.textContent = pontos;


    recompensa.style.display = "none";


    mensagem.textContent =
        "🎉 Você ganhou +" +
        valor +
        " pontos! Continue descendo!";


    /* CRIA NOVA RECOMPENSA */

    setTimeout(function() {

        if (jogoAtivo) {

            recompensa.style.left =
                Math.floor(
                    Math.random() *
                    (oceano.clientWidth - 70)
                ) + "px";


            recompensa.style.top =
                Math.floor(
                    Math.random() *
                    (oceano.clientHeight - 100)
                ) + "px";


            recompensa.style.display = "block";

        }

    }, 2500);

}


/* PERDER VIDA */

let podePerderVida = true;


function perderVida() {

    if (!jogoAtivo) return;

    if (!podePerderVida) return;


    podePerderVida = false;


    vidas--;

    vidasTexto.textContent = vidas;


    x = 40;
    y = 180;


    submarino.style.left =
        x + "px";

    submarino.style.top =
        y + "px";


    if (vidas <= 0) {

        jogoAtivo = false;

        teclas.clear();
        botoes.clear();

        mensagem.textContent =
            "😢 Fim de jogo! Clique em reiniciar.";

    } else {

        mensagem.textContent =
            "💥 Você bateu! Cuidado com as pedras!";

    }


    setTimeout(function() {

        podePerderVida = true;

    }, 1000);

}


/* TECLADO */

document.addEventListener(
    "keydown",
    function(event) {

        const tecla =
            event.key.toLowerCase();


        if (

            tecla === "w" ||
            tecla === "a" ||
            tecla === "s" ||
            tecla === "d" ||

            tecla === "arrowup" ||
            tecla === "arrowdown" ||
            tecla === "arrowleft" ||
            tecla === "arrowright"

        ) {

            event.preventDefault();

            teclas.add(tecla);

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        const tecla =
            event.key.toLowerCase();

        teclas.delete(tecla);

    }
);


/* BOTÕES */

function iniciarBotao(direcao) {

    botoes.add(direcao);

}


function pararBotoes() {

    botoes.clear();

}


botaoCima.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        iniciarBotao("cima");

    }
);


botaoBaixo.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        iniciarBotao("baixo");

    }
);


botaoEsquerda.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        iniciarBotao("esquerda");

    }
);


botaoDireita.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        iniciarBotao("direita");

    }
);


document.addEventListener(
    "pointerup",
    pararBotoes
);


/* REINICIAR */

botaoReiniciar.addEventListener(
    "click",
    function() {

        x = 40;
        y = 180;

        pontos = 0;
        vidas = 3;

        profundidade = 1;

        jogoAtivo = true;

        podePerderVida = true;

        teclas.clear();
        botoes.clear();


        pontosTexto.textContent = pontos;

        vidasTexto.textContent = vidas;

        profundidadeTexto.textContent =
            profundidade;


        submarino.style.left =
            x + "px";

        submarino.style.top =
            y + "px";


        oceano.className =
            "oceano";


        recompensas.forEach(
            function(recompensa) {

                recompensa.style.display =
                    "block";

            }
        );


        mensagem.textContent =
            "🚢 Desça e encontre sua primeira recompensa!";

    }
);


/* LOOP DO JOGO */

function jogo() {

    atualizarMovimento();

    requestAnimationFrame(jogo);

}


jogo();