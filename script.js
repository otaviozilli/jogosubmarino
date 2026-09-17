/* =========================================================
   🌊 MISSÃO SUBMARINO
   JavaScript 5.0
   Beethoven + Sons + Inimigos + Zonas
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const telaInicial =
    document.getElementById("telaInicial");

const jogo =
    document.getElementById("jogo");

const btnIniciar =
    document.getElementById("btnIniciar");

const btnPausa =
    document.getElementById("btnPausa");

const btnContinuar =
    document.getElementById("btnContinuar");

const btnTentarNovamente =
    document.getElementById("btnTentarNovamente");

const btnJogarNovamente =
    document.getElementById("btnJogarNovamente");

const btnSom =
    document.getElementById("btnSom");


const submarino =
    document.getElementById("submarino");

const areaExploracao =
    document.getElementById("areaExploracao");

const mundo =
    document.getElementById("mundo");


const pontosElemento =
    document.getElementById("pontos");

const vidasElemento =
    document.getElementById("vidas");

const zonaAtualElemento =
    document.getElementById("zonaAtual");

const recordeElemento =
    document.getElementById("recorde");

const recordeInicial =
    document.getElementById("recordeInicial");


const profundidadeElemento =
    document.getElementById("profundidade");

const barraProgresso =
    document.getElementById("barraProgresso");


const mensagem =
    document.getElementById("mensagem");

const textoFlutuante =
    document.getElementById("textoFlutuante");

const avisoPerigo =
    document.getElementById("avisoPerigo");

const avisoProfundidade =
    document.getElementById("avisoProfundidade");


const marcadorMapa =
    document.getElementById("marcadorMapa");


const missaoTexto =
    document.getElementById("missaoTexto");


const comboElemento =
    document.getElementById("combo");

const numeroCombo =
    document.getElementById("numeroCombo");


const telaPausa =
    document.getElementById("telaPausa");

const telaPerdeu =
    document.getElementById("telaPerdeu");

const telaVitoria =
    document.getElementById("telaVitoria");


const pontosFinais =
    document.getElementById("pontosFinais");

const profundidadeFinal =
    document.getElementById("profundidadeFinal");

const pontosVitoria =
    document.getElementById("pontosVitoria");

const comboFinal =
    document.getElementById("comboFinal");


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const CONFIG = {

    velocidade: 5,

    vidas: 3,

    larguraMundo: 1200,

    alturaMundo: 2750,

    alturaZona: 550,

    quantidadeZonas: 5,

    tempoInvulnerabilidade: 1300,

    tempoCombo: 2500,

    distanciaPerigo: 300,

    intervaloSomPerigo: 2600

};


/* =========================================================
   ESTADO
   ========================================================= */

const estado = {

    x: 120,

    y: 100,

    pontos: 0,

    vidas: 3,

    profundidade: 0,

    zona: 1,

    ativo: false,

    pausado: false,

    invulneravel: false,

    som: true,

    cameraY: 0,

    combo: 0,

    melhorCombo: 0,

    ultimaRecompensa: 0,

    direcaoX: 0,

    direcaoY: 0,

    teclas: {},

    recompensasColetadas: 0,

    ultimoTempo: 0,

    ultimoSomPerigo: 0,

    ultimaZonaBeethoven: 0,

    beethovenTocando: false

};


/* =========================================================
   ZONAS
   ========================================================= */

const zonas = [

    {
        nome: "Superfície",
        emoji: "☀️"
    },

    {
        nome: "Águas Rasas",
        emoji: "🌊"
    },

    {
        nome: "Oceano Profundo",
        emoji: "🌑"
    },

    {
        nome: "Abismo",
        emoji: "⚠️"
    },

    {
        nome: "Fossa Oceânica",
        emoji: "☠️"
    }

];


/* =========================================================
   MISSÕES
   ========================================================= */

const missoes = [

    "Encontre o primeiro tesouro",

    "Chegue às Águas Rasas",

    "Explore o Oceano Profundo",

    "Sobreviva ao Abismo",

    "Encontre o tesouro final"

];


let missaoAtual = 0;


/* =========================================================
   ELEMENTOS DO JOGO
   ========================================================= */

const pedras =
    document.querySelectorAll(".obstaculo");

const recompensas =
    document.querySelectorAll(".recompensa");

const inimigos =
    document.querySelectorAll(".inimigo");


/* =========================================================
   PEDRAS MÓVEIS
   ========================================================= */

const pedrasMoveis =
    document.querySelectorAll(
        '[data-movel="true"]'
    );


/* =========================================================
   RECORD
   ========================================================= */

let recorde =
    Number(
        localStorage.getItem(
            "missaoSubmarinoRecorde"
        ) || 0
    );


recordeElemento.textContent =
    recorde;

recordeInicial.textContent =
    recorde;


/* =========================================================
   ÁUDIO
   ========================================================= */

let audioContext = null;


/* =========================================================
   PREPARAR ÁUDIO
   ========================================================= */

function prepararAudio() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            console.log(
                "Este navegador não suporta áudio."
            );

            return false;

        }


        if (!audioContext) {

            audioContext =
                new AudioContext();

        }


        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        return true;

    } catch (erro) {

        console.log(
            "Erro ao preparar o áudio:",
            erro
        );

        return false;

    }

}

/* =========================================================
   SOM DOS EFEITOS
   ========================================================= */

function som(tipo) {

    if (!estado.som) {

        return;

    }


    try {

        prepararAudio();


        if (!audioContext) {

            return;

        }


        const oscilador =
            audioContext.createOscillator();

        const ganho =
            audioContext.createGain();


        oscilador.connect(ganho);

        ganho.connect(
            audioContext.destination
        );


        let frequencia = 350;

        let duracao = 0.08;

        let tipoOnda = "sine";


        if (tipo === "coleta") {

            frequencia = 700;

            duracao = 0.12;

            tipoOnda = "triangle";

        }


        if (tipo === "dano") {

            frequencia = 120;

            duracao = 0.18;

            tipoOnda = "sawtooth";

        }


        if (tipo === "zona") {

            frequencia = 450;

            duracao = 0.25;

            tipoOnda = "triangle";

        }


        if (tipo === "vitoria") {

            frequencia = 850;

            duracao = 0.45;

            tipoOnda = "triangle";

        }


        if (tipo === "perigo") {

            frequencia = 95;

            duracao = 0.35;

            tipoOnda = "sawtooth";

        }


        if (tipo === "inicio") {

            frequencia = 520;

            duracao = 0.20;

            tipoOnda = "triangle";

        }


        oscilador.type =
            tipoOnda;


        oscilador.frequency.value =
            frequencia;


        ganho.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );


        ganho.gain.exponentialRampToValueAtTime(
            0.05,
            audioContext.currentTime + 0.02
        );


        ganho.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + duracao
        );


        oscilador.start();

        oscilador.stop(
            audioContext.currentTime + duracao
        );

    } catch (erro) {

        console.log(
            "Som indisponível."
        );

    }

}


/* =========================================================
   🎵 BEETHOVEN
   5ª SINFONIA
   ========================================================= */

function tocarBeethoven() {

    if (!estado.som) {

        return;

    }


    try {

        const audioFuncionando =
            prepararAudio();


        if (!audioFuncionando) {

            return;

        }


        if (!audioContext) {

            return;

        }


        /*
           Garante que o navegador
           liberou o áudio.
        */

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        const agora =
            audioContext.currentTime;


        /*
           Motivo famoso da 5ª Sinfonia:

           TAN  TAN  TAN  TAAAAAM

           G
           G
           G
           Eb
        */

        const notas = [

            {
                frequencia: 392.00,
                inicio: 0,
                duracao: 0.18
            },

            {
                frequencia: 392.00,
                inicio: 0.22,
                duracao: 0.18
            },

            {
                frequencia: 392.00,
                inicio: 0.44,
                duracao: 0.18
            },

            {
                frequencia: 311.13,
                inicio: 0.66,
                duracao: 0.75
            }

        ];


        notas.forEach(
            function(nota) {

                const oscilador =
                    audioContext.createOscillator();


                const volume =
                    audioContext.createGain();


                /*
                   Tipo de som.
                */

                oscilador.type =
                    "triangle";


                /*
                   Frequência da nota.
                */

                oscilador.frequency.setValueAtTime(
                    nota.frequencia,
                    agora + nota.inicio
                );


                /*
                   Conecta o som.
                */

                oscilador.connect(
                    volume
                );


                volume.connect(
                    audioContext.destination
                );


                /*
                   Volume começa baixo.
                */

                volume.gain.setValueAtTime(
                    0.0001,
                    agora + nota.inicio
                );


                /*
                   Aumenta rapidamente.
                */

                volume.gain.exponentialRampToValueAtTime(
                    0.25,
                    agora +
                    nota.inicio +
                    0.03
                );


                /*
                   Diminui no final.
                */

                volume.gain.exponentialRampToValueAtTime(
                    0.0001,
                    agora +
                    nota.inicio +
                    nota.duracao
                );


                /*
                   Começa a nota.
                */

                oscilador.start(
                    agora +
                    nota.inicio
                );


                /*
                   Para a nota.
                */

                oscilador.stop(
                    agora +
                    nota.inicio +
                    nota.duracao
                );

            }
        );


    } catch (erro) {

        console.log(
            "Erro ao tocar Beethoven:",
            erro
        );

    }

}

/* =========================================================
   BEETHOVEN NAS ZONAS PROFUNDAS
   ========================================================= */

function atualizarBeethoven() {

    if (!estado.ativo) {

        return;

    }


    if (estado.pausado) {

        return;

    }


    /*
       Na superfície não toca novamente.
    */

    if (estado.zona < 3) {

        return;

    }


    const agora =
        Date.now();


    /*
       Quanto mais fundo,
       menor o intervalo.
    */

    let intervalo =
        9000;


    if (estado.zona === 4) {

        intervalo =
            7000;

    }


    if (estado.zona === 5) {

        intervalo =
            5000;

    }


    if (
        agora -
        estado.ultimaZonaBeethoven
        >= intervalo
    ) {

        tocarBeethoven();


        estado.ultimaZonaBeethoven =
            agora;

    }

}


/* =========================================================
   INICIAR
   ========================================================= */

function iniciar() {
    
     prepararAudio();


    telaInicial.classList.add(
        "escondido"
    );

    telaInicial.classList.add(
        "escondido"
    );


    jogo.classList.remove(
        "escondido"
    );


    telaPausa.classList.add(
        "escondido"
    );


    telaPerdeu.classList.add(
        "escondido"
    );


    telaVitoria.classList.add(
        "escondido"
    );


    estado.ativo = true;

    estado.pausado = false;


    prepararEstado();


    mensagem.textContent =
        "Explore o oceano!";


    prepararAudio();


    /*
       Pequeno som de início.
    */

    prepararAudio();


som("inicio");


tocarBeethoven();


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   PREPARAR ESTADO
   ========================================================= */

function prepararEstado() {

    estado.x = 120;

    estado.y = 100;

    estado.pontos = 0;

    estado.vidas =
        CONFIG.vidas;

    estado.profundidade = 0;

    estado.zona = 1;

    estado.cameraY = 0;

    estado.combo = 0;

    estado.melhorCombo = 0;

    estado.recompensasColetadas = 0;

    estado.invulneravel = false;

    estado.direcaoX = 0;

    estado.direcaoY = 0;

    estado.teclas = {};

    estado.ultimaRecompensa = 0;

    estado.ultimoSomPerigo = 0;

    estado.ultimaZonaBeethoven = 0;

    estado.beethovenTocando = false;


    missaoAtual = 0;


    submarino.style.left =
        `${estado.x}px`;

    submarino.style.top =
        `${estado.y}px`;


    submarino.style.opacity =
        "1";


    submarino.classList.remove(
        "virado-esquerda"
    );


    submarino.classList.add(
        "virado-direita"
    );


    comboElemento.classList.add(
        "escondido"
    );


    resetarRecompensas();

    resetarInimigos();

    resetarPedras();


    atualizarInterface();

}


/* =========================================================
   RESETAR RECOMPENSAS
   ========================================================= */

function resetarRecompensas() {

    recompensas.forEach(
        recompensa => {

            recompensa.style.display =
                "flex";

        }
    );

}


/* =========================================================
   RESETAR INIMIGOS
   ========================================================= */

function resetarInimigos() {

    inimigos.forEach(
        inimigo => {

            inimigo.style.display =
                "flex";


            inimigo.dataset.x =
                inimigo.offsetLeft;


            inimigo.dataset.y =
                inimigo.offsetTop;

        }
    );

}


/* =========================================================
   RESETAR PEDRAS
   ========================================================= */

function resetarPedras() {

    pedras.forEach(
        pedra => {

            pedra.style.display =
                "flex";

        }
    );


    pedrasMoveis.forEach(
        pedra => {

            pedra.dataset.baseX =
                pedra.offsetLeft;

        }
    );

}


/* =========================================================
   TECLADO
   ========================================================= */

document.addEventListener(
    "keydown",
    function(evento) {

        const tecla =
            evento.key.toLowerCase();


        estado.teclas[tecla] =
            true;


        if (
            [
                "arrowup",
                "arrowdown",
                "arrowleft",
                "arrowright",
                "w",
                "a",
                "s",
                "d",
                " "
            ].includes(tecla)
        ) {

            evento.preventDefault();

        }


        if (
            tecla === "p" ||
            tecla === "escape"
        ) {

            alternarPausa();

        }

    }
);


/* =========================================================
   SOLTAR TECLAS
   ========================================================= */

document.addEventListener(
    "keyup",
    function(evento) {

        const tecla =
            evento.key.toLowerCase();


        estado.teclas[tecla] =
            false;

    }
);


/* =========================================================
   DIREÇÃO
   ========================================================= */

function calcularDirecao() {

    let x = 0;

    let y = 0;


    if (
        estado.teclas["arrowleft"] ||
        estado.teclas["a"] ||
        estado.teclas["esquerda"]
    ) {

        x -= 1;

    }


    if (
        estado.teclas["arrowright"] ||
        estado.teclas["d"] ||
        estado.teclas["direita"]
    ) {

        x += 1;

    }


    if (
        estado.teclas["arrowup"] ||
        estado.teclas["w"] ||
        estado.teclas["cima"]
    ) {

        y -= 1;

    }


    if (
        estado.teclas["arrowdown"] ||
        estado.teclas["s"] ||
        estado.teclas["baixo"]
    ) {

        y += 1;

    }


    estado.direcaoX = x;

    estado.direcaoY = y;

}


/* =========================================================
   BOTÕES DE CONTROLE
   ========================================================= */

const controles =
    document.querySelectorAll(
        ".controle"
    );


controles.forEach(
    botao => {

        const direcao =
            botao.dataset.direcao;


        function pressionar(evento) {

            evento.preventDefault();

            estado.teclas[direcao] =
                true;

        }


        function soltar(evento) {

            evento.preventDefault();

            estado.teclas[direcao] =
                false;

        }


        botao.addEventListener(
            "mousedown",
            pressionar
        );


        botao.addEventListener(
            "mouseup",
            soltar
        );


        botao.addEventListener(
            "mouseleave",
            soltar
        );


        botao.addEventListener(
            "touchstart",
            pressionar,
            {
                passive: false
            }
        );


        botao.addEventListener(
            "touchend",
            soltar,
            {
                passive: false
            }
        );

    }
);


/* =========================================================
   MOVIMENTO
   ========================================================= */

function atualizarMovimento() {

    calcularDirecao();


    if (
        estado.direcaoX === 0 &&
        estado.direcaoY === 0
    ) {

        return;

    }


    let velocidade =
        CONFIG.velocidade;


    /*
       A velocidade diminui
       nas zonas mais profundas.
    */

    if (estado.zona === 3) {

        velocidade = 4.8;

    }


    if (estado.zona === 4) {

        velocidade = 4.5;

    }


    if (estado.zona === 5) {

        velocidade = 4.2;

    }


    /*
       Diagonal não fica mais rápida.
    */

    let fator = 1;


    if (
        estado.direcaoX !== 0 &&
        estado.direcaoY !== 0
    ) {

        fator = 0.707;

    }


    const dx =
        estado.direcaoX *
        velocidade *
        fator;


    const dy =
        estado.direcaoY *
        velocidade *
        fator;


    let novoX =
        estado.x + dx;


    let novoY =
        estado.y + dy;


    /*
       Limite horizontal.
    */

    const limiteX =
        CONFIG.larguraMundo - 100;


    if (novoX < 20) {

        novoX = 20;

    }


    if (novoX > limiteX) {

        novoX = limiteX;

    }


    /*
       Limite vertical.
    */

    const limiteY =
        CONFIG.alturaMundo - 90;


    if (novoY < 20) {

        novoY = 20;

    }


    if (novoY > limiteY) {

        novoY = limiteY;

    }


    estado.x =
        novoX;


    estado.y =
        novoY;


    submarino.style.left =
        `${estado.x}px`;


    submarino.style.top =
        `${estado.y}px`;


    /*
       Direção visual.
    */

    if (dx < 0) {

        submarino.classList.add(
            "virado-esquerda"
        );


        submarino.classList.remove(
            "virado-direita"
        );

    }


    if (dx > 0) {

        submarino.classList.add(
            "virado-direita"
        );


        submarino.classList.remove(
            "virado-esquerda"
        );

    }

}


/* =========================================================
   PROFUNDIDADE
   ========================================================= */

function atualizarProfundidade() {

    const distanciaTotal =
        CONFIG.alturaMundo -
        areaExploracao.clientHeight;


    estado.profundidade =
        (
            estado.y /
            distanciaTotal
        ) * 100;


    estado.profundidade =
        Math.max(
            0,
            Math.min(
                100,
                estado.profundidade
            )
        );


    const novaZona =
        Math.min(
            5,
            Math.floor(
                estado.profundidade / 20
            ) + 1
        );


    if (
        novaZona !==
        estado.zona
    ) {

        const antiga =
            estado.zona;


        estado.zona =
            novaZona;


        entrarNaZona(
            antiga,
            novaZona
        );

    }

}


/* =========================================================
   ENTRAR EM ZONA
   ========================================================= */

function entrarNaZona(
    antiga,
    nova
) {

    if (
        nova <= antiga
    ) {

        return;

    }


    const dados =
        zonas[nova - 1];


    avisoProfundidade.textContent =
        `${dados.emoji} ${dados.nome}`;


    avisoProfundidade.classList.add(
        "ativo"
    );


    setTimeout(
        function() {

            avisoProfundidade.classList.remove(
                "ativo"
            );

        },
        1800
    );


    som("zona");


    if (nova === 2) {

        mensagem.textContent =
            "🌊 As águas estão ficando mais profundas.";

    }


    if (nova === 3) {

        mensagem.textContent =
            "🌑 Cuidado! Os peixes começaram a perseguir você.";


        /*
           Beethoven fica mais presente
           a partir daqui.
        */

        setTimeout(
            function() {

                tocarBeethoven();

            },
            500
        );

    }


    if (nova === 4) {

        mensagem.textContent =
            "⚠️ Perigo! Animais maiores estão por perto.";


        setTimeout(
            function() {

                tocarBeethoven();

            },
            400
        );

    }


    if (nova === 5) {

        mensagem.textContent =
            "☠️ Você chegou à Fossa! Procure o tesouro.";


        setTimeout(
            function() {

                tocarBeethoven();

            },
            300
        );

    }


    atualizarMissao();

}


/* =========================================================
   VISUAL DA PROFUNDIDADE
   ========================================================= */

function atualizarVisual() {

    const p =
        estado.profundidade / 100;


    const brilho =
        1 -
        (
            p * 0.28
        );


    areaExploracao.style.filter =
        `brightness(${brilho})`;

}


/* =========================================================
   PROGRESSO
   ========================================================= */

function atualizarProgresso() {

    const valor =
        Math.floor(
            estado.profundidade
        );


    profundidadeElemento.textContent =
        `${valor}%`;


    barraProgresso.style.width =
        `${valor}%`;

}


/* =========================================================
   CÂMERA
   ========================================================= */

function atualizarCamera() {

    const alturaVisivel =
        areaExploracao.clientHeight;


    const centroSubmarino =
        estado.y +
        30;


    let camera =
        centroSubmarino -
        (
            alturaVisivel / 2
        );


    const maxCamera =
        CONFIG.alturaMundo -
        alturaVisivel;


    camera =
        Math.max(
            0,
            Math.min(
                maxCamera,
                camera
            )
        );


    estado.cameraY =
        camera;


    mundo.style.transform =
        `translateX(-50%) translateY(-${camera}px)`;

}


/* =========================================================
   COLISÃO PRECISA
   ========================================================= */

function colidiu(
    primeiro,
    segundo
) {

    const a =
        primeiro.getBoundingClientRect();


    const b =
        segundo.getBoundingClientRect();


    /*
       Hitbox do submarino.

       Deixamos uma área menor que
       o desenho para evitar colisões
       quando ainda existe espaço
       visual entre os objetos.
    */

    const margemX =
        a.width * 0.34;


    const margemY =
        a.height * 0.34;


    const sub = {

        left:
            a.left + margemX,

        right:
            a.right - margemX,

        top:
            a.top + margemY,

        bottom:
            a.bottom - margemY

    };


    /*
       Hitbox dos objetos.
    */

    const margemObjetoX =
        b.width * 0.42;


    const margemObjetoY =
        b.height * 0.42;


    const objeto = {

        left:
            b.left + margemObjetoX,

        right:
            b.right - margemObjetoX,

        top:
            b.top + margemObjetoY,

        bottom:
            b.bottom - margemObjetoY

    };


    return (

        sub.left <
        objeto.right &&

        sub.right >
        objeto.left &&

        sub.top <
        objeto.bottom &&

        sub.bottom >
        objeto.top

    );

}


/* =========================================================
   COLISÕES
   ========================================================= */

function verificarColisoes() {

    if (
        estado.invulneravel
    ) {

        return;

    }


    /*
       PEDRAS
    */

    pedras.forEach(
        pedra => {

            if (
                pedra.style.display ===
                "none"
            ) {

                return;

            }


            if (
                colidiu(
                    submarino,
                    pedra
                )
            ) {

                sofrerDano(
                    pedra
                );

            }

        }
    );


    /*
       INIMIGOS
    */

    inimigos.forEach(
        inimigo => {

            if (
                inimigo.style.display ===
                "none"
            ) {

                return;

            }


            if (
                colidiu(
                    submarino,
                    inimigo
                )
            ) {

                sofrerDano(
                    inimigo
                );


                afastarInimigo(
                    inimigo
                );

            }

        }
    );


    /*
       RECOMPENSAS
    */

    recompensas.forEach(
        recompensa => {

            if (
                recompensa.style.display ===
                "none"
            ) {

                return;

            }


            if (
                colidiu(
                    submarino,
                    recompensa
                )
            ) {

                coletar(
                    recompensa
                );

            }

        }
    );

}


/* =========================================================
   DETECTAR INIMIGO PERTO
   ========================================================= */

function verificarPerigoProximo() {

    if (!estado.ativo) {

        return;

    }


    if (estado.pausado) {

        return;

    }


    if (estado.zona < 3) {

        return;

    }


    let inimigoPerto =
        false;


    inimigos.forEach(
        inimigo => {

            if (
                inimigo.style.display ===
                "none"
            ) {

                return;

            }


            const x =
                Number(
                    inimigo.dataset.x ||
                    inimigo.offsetLeft
                );


            const y =
                Number(
                    inimigo.dataset.y ||
                    inimigo.offsetTop
                );


            const dx =
                estado.x - x;


            const dy =
                estado.y - y;


            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distancia <
                CONFIG.distanciaPerigo
            ) {

                inimigoPerto =
                    true;

            }

        }
    );


    const agora =
        Date.now();


    if (
        inimigoPerto &&
        agora -
        estado.ultimoSomPerigo
        >
        CONFIG.intervaloSomPerigo
    ) {

        som("perigo");


        estado.ultimoSomPerigo =
            agora;


        /*
           Nas zonas 4 e 5,
           Beethoven aparece junto
           com o aviso de perigo.
        */

        if (estado.zona >= 4) {

            setTimeout(
                function() {

                    tocarBeethoven();

                },
                350
            );

        }

    }


    if (inimigoPerto) {

        avisoPerigo.classList.add(
            "ativo"
        );

    } else {

        avisoPerigo.classList.remove(
            "ativo"
        );

    }

}


/* =========================================================
   SOFRER DANO
   ========================================================= */

function sofrerDano(
    objeto
) {

    if (
        estado.invulneravel
    ) {

        return;

    }


    estado.vidas -= 1;


    estado.invulneravel =
        true;


    estado.combo = 0;


    comboElemento.classList.add(
        "escondido"
    );


    som("dano");


    mostrarTexto(
        "💥 -1 VIDA"
    );


    avisoPerigo.classList.add(
        "ativo"
    );


    setTimeout(
        function() {

            avisoPerigo.classList.remove(
                "ativo"
            );

        },
        700
    );


    submarino.classList.add(
        "invulneravel"
    );


    let piscadas = 0;


    const intervalo =
        setInterval(
            function() {

                if (
                    submarino.style.opacity ===
                    "0.35"
                ) {

                    submarino.style.opacity =
                        "1";

                } else {

                    submarino.style.opacity =
                        "0.35";

                }


                piscadas++;


                if (
                    piscadas >= 8
                ) {

                    clearInterval(
                        intervalo
                    );


                    submarino.style.opacity =
                        "1";

                }

            },
            100
        );


    setTimeout(
        function() {

            estado.invulneravel =
                false;


            submarino.classList.remove(
                "invulneravel"
            );

        },
        CONFIG.tempoInvulnerabilidade
    );


    recuarSubmarino();


    atualizarInterface();


    if (
        estado.vidas <= 0
    ) {

        perder();

    }

}


/* =========================================================
   RECUO
   ========================================================= */

function recuarSubmarino() {

    /*
       Se o jogador estiver parado,
       fazemos um pequeno recuo
       para trás.
    */

    let recuoX =
        estado.direcaoX;


    let recuoY =
        estado.direcaoY;


    if (
        recuoX === 0 &&
        recuoY === 0
    ) {

        recuoY = -1;

    }


    estado.x -=
        recuoX * 35;


    estado.y -=
        recuoY * 35;


    estado.x =
        Math.max(
            20,
            Math.min(
                CONFIG.larguraMundo - 100,
                estado.x
            )
        );


    estado.y =
        Math.max(
            20,
            Math.min(
                CONFIG.alturaMundo - 90,
                estado.y
            )
        );


    submarino.style.left =
        `${estado.x}px`;


    submarino.style.top =
        `${estado.y}px`;

}


/* =========================================================
   AFASTAR INIMIGO
   ========================================================= */

function afastarInimigo(
    inimigo
) {

    const x =
        Number(
            inimigo.dataset.x ||
            inimigo.offsetLeft
        );


    const y =
        Number(
            inimigo.dataset.y ||
            inimigo.offsetTop
        );


    let novoX =
        x +
        (
            estado.direcaoX * -120
        );


    let novoY =
        y +
        (
            estado.direcaoY * -120
        );


    novoX =
        Math.max(
            40,
            Math.min(
                1120,
                novoX
            )
        );


    novoY =
        Math.max(
            60,
            Math.min(
                2670,
                novoY
            )
        );


    inimigo.dataset.x =
        novoX;


    inimigo.dataset.y =
        novoY;


    inimigo.style.left =
        `${novoX}px`;


    inimigo.style.top =
        `${novoY}px`;

}


/* =========================================================
   COLETAR RECOMPENSA
   ========================================================= */

function coletar(
    recompensa
) {

    const valor =
        Number(
            recompensa.dataset.pontos
        );


    const tipo =
        recompensa.dataset.tipo;


    recompensa.style.display =
        "none";


    estado.recompensasColetadas += 1;


    estado.pontos +=
        valor;


    const agora =
        Date.now();


    if (
        agora -
        estado.ultimaRecompensa
        <=
        CONFIG.tempoCombo
    ) {

        estado.combo += 1;

    } else {

        estado.combo = 1;

    }


    estado.ultimaRecompensa =
        agora;


    if (
        estado.combo >
        estado.melhorCombo
    ) {

        estado.melhorCombo =
            estado.combo;

    }


    /*
       Bônus do combo.
    */

    let bonus = 0;


    if (
        estado.combo >= 2
    ) {

        bonus =
            estado.combo * 5;


        estado.pontos +=
            bonus;

    }


    som("coleta");


    mostrarTexto(
        `+${valor + bonus} 💎`
    );


    atualizarCombo();


    atualizarMissao();


    atualizarConquistas();


    /*
       Tesouro final.
    */

    if (
        tipo === "tesouro"
    ) {

        setTimeout(
            vencer,
            500
        );

    }

}


/* =========================================================
   COMBO
   ========================================================= */

function atualizarCombo() {

    if (
        estado.combo >= 2
    ) {

        numeroCombo.textContent =
            estado.combo;


        comboElemento.classList.remove(
            "escondido"
        );

    } else {

        comboElemento.classList.add(
            "escondido"
        );

    }

}


/* =========================================================
   TEXTO FLUTUANTE
   ========================================================= */

function mostrarTexto(
    texto
) {

    textoFlutuante.textContent =
        texto;


    textoFlutuante.classList.remove(
        "ativo"
    );


    void textoFlutuante.offsetWidth;


    textoFlutuante.classList.add(
        "ativo"
    );


    setTimeout(
        function() {

            textoFlutuante.classList.remove(
                "ativo"
            );

        },
        900
    );

}


/* =========================================================
   INIMIGOS
   ========================================================= */

function atualizarInimigos() {

    const tempo =
        Date.now();


    inimigos.forEach(
        (
            inimigo,
            indice
        ) => {

            if (
                inimigo.style.display ===
                "none"
            ) {

                return;

            }


            let x =
                Number(
                    inimigo.dataset.x ||
                    inimigo.offsetLeft
                );


            let y =
                Number(
                    inimigo.dataset.y ||
                    inimigo.offsetTop
                );


            const tipo =
                inimigo.dataset.tipo;


            /*
               Velocidade aumenta
               conforme a profundidade.
            */

            let velocidade =
                0.45;


            if (
                estado.zona === 2
            ) {

                velocidade =
                    0.65;

            }


            if (
                estado.zona === 3
            ) {

                velocidade =
                    0.9;

            }


            if (
                estado.zona === 4
            ) {

                velocidade =
                    1.15;

            }


            if (
                estado.zona === 5
            ) {

                velocidade =
                    1.35;

            }


            /*
               Peixes profundos perseguem
               o submarino.
            */

            if (
                tipo === "peixe" &&
                estado.zona >= 3
            ) {

                const dx =
                    estado.x - x;


                const dy =
                    estado.y - y;


                const distancia =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distancia < 480 &&
                    distancia > 65
                ) {

                    x +=
                        (
                            dx /
                            distancia
                        ) *
                        velocidade;


                    y +=
                        (
                            dy /
                            distancia
                        ) *
                        velocidade;

                } else {

                    x +=
                        Math.sin(
                            tempo / 650 +
                            indice
                        ) *
                        velocidade;

                }

            } else {

                /*
                   Movimento normal.
                */

                x +=
                    Math.sin(
                        tempo / 700 +
                        indice
                    ) *
                    velocidade;

            }


            /*
               Movimento vertical.
            */

            y +=
                Math.sin(
                    tempo / 850 +
                    indice
                ) *
                0.4;


            /*
               Limites.
            */

            x =
                Math.max(
                    40,
                    Math.min(
                        1120,
                        x
                    )
                );


            y =
                Math.max(
                    60,
                    Math.min(
                        2670,
                        y
                    )
                );


            inimigo.dataset.x =
                x;


            inimigo.dataset.y =
                y;


            inimigo.style.left =
                `${x}px`;


            inimigo.style.top =
                `${y}px`;

        }
    );

}


/* =========================================================
   PEDRAS MÓVEIS
   ========================================================= */

function atualizarPedrasMoveis() {

    const tempo =
        Date.now();


    pedrasMoveis.forEach(
        (
            pedra,
            indice
        ) => {

            if (
                !pedra.dataset.baseX
            ) {

                pedra.dataset.baseX =
                    pedra.offsetLeft;

            }


            const base =
                Number(
                    pedra.dataset.baseX
                );


            const movimento =
                Math.sin(
                    tempo / 900 +
                    indice
                ) *
                70;


            pedra.style.left =
                `${base + movimento}px`;

        }
    );

}


/* =========================================================
   PARTÍCULAS
   ========================================================= */

function criarParticula() {

    const container =
        document.getElementById(
            "particulas"
        );


    if (!container) {

        return;

    }


    const bolha =
        document.createElement(
            "span"
        );


    bolha.textContent =
        "•";


    bolha.style.left =
        `${estado.x + 10}px`;


    bolha.style.top =
        `${estado.y + 25}px`;


    container.appendChild(
        bolha
    );


    setTimeout(
        function() {

            bolha.remove();

        },
        1800
    );

}


/* =========================================================
   MINI MAPA
   ========================================================= */

function atualizarMapa() {

    if (!marcadorMapa) {

        return;

    }


    const mapaAltura =
        84;


    const posicao =
        (
            estado.profundidade /
            100
        ) *
        mapaAltura;


    marcadorMapa.style.top =
        `${38 + posicao}px`;

}


/* =========================================================
   MISSÕES
   ========================================================= */

function atualizarMissao() {

    /*
       Missão 1:
       encontrar o primeiro tesouro.
    */

    if (
        missaoAtual === 0
    ) {

        if (
            estado.recompensasColetadas >= 1
        ) {

            completarMissao();

        } else {

            missaoTexto.textContent =
                "💎 Encontre o primeiro tesouro!";

        }

        return;

    }


    /*
       Missão 2:
       chegar às águas rasas.
    */

    if (
        missaoAtual === 1 &&
        estado.zona >= 2
    ) {

        completarMissao();

        return;

    }


    /*
       Missão 3:
       chegar ao oceano profundo.
    */

    if (
        missaoAtual === 2 &&
        estado.zona >= 3
    ) {

        completarMissao();

        return;

    }


    /*
       Missão 4:
       chegar ao abismo.
    */

    if (
        missaoAtual === 3 &&
        estado.zona >= 4
    ) {

        completarMissao();

        return;

    }


    /*
       Missão final.
    */

    if (
        missaoAtual === 4
    ) {

        missaoTexto.textContent =
            "👑 Encontre o tesouro final!";

        return;

    }


    missaoTexto.textContent =
        missaoAtualTexto();

}


/* =========================================================
   TEXTO DA MISSÃO
   ========================================================= */

function missaoAtualTexto() {

    return (
        missoes[
            missaoAtual
        ] ||
        "Explore o oceano!"
    );

}


/* =========================================================
   COMPLETAR MISSÃO
   ========================================================= */

function completarMissao() {

    /*
       Evita completar uma missão
       várias vezes no mesmo instante.
    */

    if (
        missaoAtual >=
        missoes.length
    ) {

        return;

    }


    estado.pontos +=
        15;


    mostrarTexto(
        "🎯 MISSÃO COMPLETA! +15"
    );


    som("coleta");


    missaoAtual++;


    if (
        missaoAtual <
        missoes.length
    ) {

        missaoTexto.textContent =
            missaoAtualTexto();

    } else {

        missaoTexto.textContent =
            "👑 Missão completa!";

    }

}


/* =========================================================
   CONQUISTAS
   ========================================================= */

function conquistar(
    nome
) {

    const elemento =
        document.querySelector(
            `[data-conquista="${nome}"]`
        );


    if (!elemento) {

        return;

    }


    elemento.classList.add(
        "desbloqueada"
    );

}


/* =========================================================
   ATUALIZAR CONQUISTAS
   ========================================================= */

function atualizarConquistas() {

    if (
        estado.recompensasColetadas >= 1
    ) {

        conquistar(
            "primeiroTesouro"
        );

    }


    if (
        estado.profundidade >= 20
    ) {

        conquistar(
            "explorador"
        );

    }


    if (
        estado.zona >= 3
    ) {

        conquistar(
            "zona3"
        );

    }


    if (
        estado.vidas === 1
    ) {

        conquistar(
            "sobrevivente"
        );

    }


    if (
        estado.recompensasColetadas >= 4 &&
        estado.zona >= 5
    ) {

        conquistar(
            "mestre"
        );

    }

}


/* =========================================================
   INTERFACE
   ========================================================= */

function atualizarInterface() {

    pontosElemento.textContent =
        estado.pontos;


    vidasElemento.textContent =
        "❤️".repeat(
            Math.max(
                0,
                estado.vidas
            )
        );


    zonaAtualElemento.textContent =
        `${estado.zona} / 5`;


    recordeElemento.textContent =
        Math.max(
            recorde,
            estado.pontos
        );


    atualizarProgresso();


    atualizarMapa();


    atualizarMissao();


    atualizarConquistas();

}


/* =========================================================
   RECORD
   ========================================================= */

function atualizarRecorde() {

    if (
        estado.pontos > recorde
    ) {

        recorde =
            estado.pontos;


        localStorage.setItem(
            "missaoSubmarinoRecorde",
            recorde
        );

    }


    recordeElemento.textContent =
        recorde;


    recordeInicial.textContent =
        recorde;

}


/* =========================================================
   PAUSA
   ========================================================= */

function alternarPausa() {

    if (
        !estado.ativo
    ) {

        return;

    }


    if (
        estado.pausado
    ) {

        continuar();

    } else {

        pausar();

    }

}


/* =========================================================
   PAUSAR
   ========================================================= */

function pausar() {

    estado.pausado =
        true;


    telaPausa.classList.remove(
        "escondido"
    );


    avisoPerigo.classList.remove(
        "ativo"
    );

}


/* =========================================================
   CONTINUAR
   ========================================================= */

function continuar() {

    estado.pausado =
        false;


    telaPausa.classList.add(
        "escondido"
    );


    prepararAudio();

}


/* =========================================================
   PERDER
   ========================================================= */

function perder() {

    estado.ativo =
        false;


    estado.pausado =
        false;


    atualizarRecorde();


    pontosFinais.textContent =
        estado.pontos;


    profundidadeFinal.textContent =
        `${Math.floor(
            estado.profundidade
        )}%`;


    telaPerdeu.classList.remove(
        "escondido"
    );

}


/* =========================================================
   VENCER
   ========================================================= */

function vencer() {

    if (
        !estado.ativo
    ) {

        return;

    }


    estado.ativo =
        false;


    estado.pontos +=
        200;


    atualizarRecorde();


    pontosVitoria.textContent =
        estado.pontos;


    comboFinal.textContent =
        estado.melhorCombo;


    conquistar(
        "mestre"
    );


    telaVitoria.classList.remove(
        "escondido"
    );


    som("vitoria");

}


/* =========================================================
   BOTÃO INICIAR
   ========================================================= */

btnIniciar.addEventListener(
    "click",
    iniciar
);


/* =========================================================
   BOTÃO PAUSA
   ========================================================= */

btnPausa.addEventListener(
    "click",
    alternarPausa
);


/* =========================================================
   BOTÃO CONTINUAR
   ========================================================= */

btnContinuar.addEventListener(
    "click",
    continuar
);


/* =========================================================
   TENTAR NOVAMENTE
   ========================================================= */

btnTentarNovamente.addEventListener(
    "click",
    function() {

        telaPerdeu.classList.add(
            "escondido"
        );


        iniciar();

    }
);


/* =========================================================
   JOGAR NOVAMENTE
   ========================================================= */

btnJogarNovamente.addEventListener(
    "click",
    function() {

        telaVitoria.classList.add(
            "escondido"
        );


        iniciar();

    }
);


/* =========================================================
   🔊 BOTÃO DE SOM
   ========================================================= */

btnSom.addEventListener(
    "click",
    function() {

        estado.som =
            !estado.som;


        if (
            estado.som
        ) {

            btnSom.textContent =
                "🔊";


            prepararAudio();


            /*
               Se estiver jogando,
               toca Beethoven novamente.
            */

            if (
                estado.ativo &&
                !estado.pausado
            ) {

                tocarBeethoven();

            }

        } else {

            btnSom.textContent =
                "🔇";

        }

    }
);


/* =========================================================
   LOOP PRINCIPAL
   ========================================================= */

function loop() {

    if (
        !estado.ativo
    ) {

        return;

    }


    if (
        !estado.pausado
    ) {

        atualizarMovimento();


        atualizarProfundidade();


        atualizarCamera();


        atualizarVisual();


        atualizarInimigos();


        atualizarPedrasMoveis();


        verificarColisoes();


        verificarPerigoProximo();


        atualizarBeethoven();


        atualizarInterface();


        atualizarRecorde();


        /*
           Bolhas ocasionais.
        */

        if (
            Math.random() < 0.025
        ) {

            criarParticula();

        }

    }


    requestAnimationFrame(
        loop
    );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

submarino.style.left =
    `${estado.x}px`;


submarino.style.top =
    `${estado.y}px`;


submarino.classList.add(
    "virado-direita"
);


btnSom.textContent =
    "🔊";


atualizarInterface();


/* =========================================================
   FIM DO JAVASCRIPT
   ========================================================= */
