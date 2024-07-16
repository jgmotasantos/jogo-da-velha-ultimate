document.addEventListener("DOMContentLoaded", () => {
    const elementoTabuleiro = document.getElementById("board");
    const elementoTitulo = document.getElementById("title");

    let jogadorAtual = 'X';
    const CORINGA = 'O/';
    const estadoTabuleiro = Array(9).fill(null).map(() => Array(9).fill(null));
    const estadoSecao = Array(9).fill(null);
    let secaoAtual = null;

    const alternarJogador = () => {
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    };

    const verificarVencedor = (tabuleiro, considerarEmpates = false) => {
        const combinacoesVencedoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6]             // diagonais
        ];

        for (const combinacao of combinacoesVencedoras) {
            const [a, b, c] = combinacao;
            const linha = [tabuleiro[a], tabuleiro[b], tabuleiro[c]];

            if (linha.every(celula => celula === jogadorAtual || celula === CORINGA)) {
                return jogadorAtual;
            }
        }

        if (considerarEmpates) {
            for (const combinacao of combinacoesVencedoras) {
                const [a, b, c] = combinacao;
                const linha = [tabuleiro[a], tabuleiro[b], tabuleiro[c]];

                if (linha.every(celula => celula === jogadorAtual || celula === CORINGA || celula === 'O/')) {
                    return jogadorAtual;
                }
            }
        }

        // Verificar se todas as células estão preenchidas (empate)
        if (!tabuleiro.includes(null)) {
            return 'O/';
        }

        return null; // Ainda não há vencedor
    };

    const lidarClique = (indiceSecao, indiceCelula) => {
        if ((secaoAtual !== null && secaoAtual !== indiceSecao) || estadoTabuleiro[indiceSecao][indiceCelula] || estadoSecao[indiceSecao]) return;

        estadoTabuleiro[indiceSecao][indiceCelula] = jogadorAtual;
        renderizarTabuleiro();

        const vencedorSecao = verificarVencedor(estadoTabuleiro[indiceSecao]);
        if (vencedorSecao) {
            estadoSecao[indiceSecao] = vencedorSecao;
            marcarSecao(indiceSecao, vencedorSecao);
            secaoAtual = null;
        } else {
            secaoAtual = indiceCelula;
        }

        if (estadoSecao[secaoAtual]) {
            secaoAtual = null;
        }

        const vencedorJogo = verificarVencedor(estadoSecao, true);
        if (vencedorJogo) {
            elementoTitulo.textContent = vencedorJogo === 'O/' ? 'Jogo Empatado!' : `${vencedorJogo} venceu!`;
            elementoTabuleiro.removeEventListener('click', lidarCliqueTabuleiro);
        } else {
            alternarJogador();
            elementoTitulo.textContent = `Vez do jogador ${jogadorAtual}`;
        }
    };

    const marcarSecao = (indiceSecao, vencedor) => {
        const elementoSecao = elementoTabuleiro.children[indiceSecao];
        if (vencedor === 'O/') {
            elementoSecao.classList.add('empate');
            elementoSecao.innerHTML = '<span class="empate">O/</span>';
        } else {
            elementoSecao.classList.add(`vencedor-${vencedor}`);
            elementoSecao.innerHTML = `<span class="vencedor">${vencedor}</span>`;
        }
    };

    const renderizarTabuleiro = () => {
        Array.from(elementoTabuleiro.children).forEach((elementoSecao, indiceSecao) => {
            Array.from(elementoSecao.children).forEach((elementoCelula, indiceCelula) => {
                elementoCelula.textContent = estadoTabuleiro[indiceSecao][indiceCelula];
            });

            if (estadoSecao[indiceSecao] === null) {
                elementoSecao.classList.add('playable');
            } else {
                elementoSecao.classList.remove('playable');
            }
        });

        if (secaoAtual !== null) {
            elementoTabuleiro.children[secaoAtual].classList.add('playable');
        } else {
            Array.from(elementoTabuleiro.children).forEach((elementoSecao, indiceSecao) => {
                if (estadoSecao[indiceSecao] === null) {
                    elementoSecao.classList.add('playable');
                }
            });
        }
    };

    const lidarCliqueTabuleiro = (event) => {
        const elementoCelula = event.target;
        if (!elementoCelula.classList.contains('cell')) return;

        const elementoSecao = elementoCelula.parentElement;
        const indiceSecao = Array.from(elementoTabuleiro.children).indexOf(elementoSecao);
        const indiceCelula = Array.from(elementoSecao.children).indexOf(elementoCelula);

        lidarClique(indiceSecao, indiceCelula);
    };

    elementoTabuleiro.addEventListener('click', lidarCliqueTabuleiro);
    elementoTitulo.textContent = "Ultimate Tic-Tac-Toe: Vez do jogador X";
});
