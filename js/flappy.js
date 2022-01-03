function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`

}

/* const b= new Barreira(false)
b.setAltura(500)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */  



function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)


    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX =  popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(popsicaoNaTela)
} 

/* const b= new ParDeBarreiras(500,300,1000)
document.querySelector('[wm-flappy]').appendChild(b.elemento)  */

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouMeio) {
                notificarPonto()
            }
        })
    }
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')

barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
    barreiras.animar()
},20)  */

function personagens(){
    const personagen = document.getElementById('personagens-select')
    switch(personagen.value){
            
        case 'passaro':
            return 'img/passaro.png'
            break;

        case 'stella':
            return 'img/stella.png'
            break;

        case 'Red':
            return 'img/red.png'
            break;

        case 'chuck':
            return 'img/chuck.png'
            break;
        
    }

}


function Passaro(alturaJogo) {
    let voando = false



    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = personagens();

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
      barreiras.animar()
      passaro.animar() 
},20) */


 function Progresso() {
    
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
  
}

/*  const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))  */


 function estaoSobrepostos(elementoA, elementoB) {

    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false

    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu

}

 function FlappyBird(abertura_canos, velocidade, pontuacao) {
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, abertura_canos, 400,
        () => progresso.atualizarPontos(pontos += pontuacao))

    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        const inputModeReal = document.getElementById('input-modo-real')
        if(inputModeReal.checked != true) alert(`Para sair do modo de treino selecione o modo Real em configurações`);
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

              if(colidiu(passaro,barreiras) && inputModeReal.checked){
                 clearInterval(temporizador) 
                 //let pontos = progresso()
                 //const areaDoJogo = document.querySelector('[wm-flappy]')
                 areaDoJogo.removeChild(progresso.elemento)
                 areaDoJogo.removeChild(passaro.elemento)
                 barreiras.pares.forEach(par => areaDoJogo.removeChild(par.elemento))
                 alert(` Sua pontuação foi ${pontos}`);
                 //document.location.reload(true);*/
             } else{

             }
        },velocidade)
    }
}


document.addEventListener('DOMContentLoaded', () => {

      const darkModeStorage = localStorage.getItem('dark-mode')
      const html = document.querySelector('html')
      const inputDarkMode = document.getElementById('input-dark-mode')
      const inputLightMode = document.getElementById('input-light-mode')
      

      if(darkModeStorage){
        html.setAttribute("dark", "true")
      }

      inputDarkMode.addEventListener('change', () => {
        if(inputDarkMode.checked){
          html.setAttribute("dark", "true")
          localStorage.setItem('dark-mode', true)
        }
      })

      inputLightMode.addEventListener('change', () => {
        if(inputLightMode.checked){
            html.removeAttribute("dark")
            localStorage.removeItem('dark-mode')
          
        }
        })

 
         

    })
 
    const button = document.querySelector('input')
    const velocidade = document.getElementById('velocidade-select')
    const pontuacao = document.getElementById('pontuacao-select')
    
    
    const input_abertura_facil = document.getElementById('abertura_facil')
    const input_abertura_media = document.getElementById('abertura_media')
    const input_abertura_dificil = document.getElementById('abertura_dificil')

    function iniciar(){
        let valor_velocidade = 0;
        let valor_pontuacao = 1;

        if(pontuacao.value != 1){
             valor_pontuacao = (pontuacao.value == 10)? valor_pontuacao = 10: valor_pontuacao = 100
        }

        switch(velocidade.value){
            
            case 'lenta':
                valor_velocidade = 40;
                break;

            case 'normal':
                valor_velocidade = 20;
                break;

            case 'rapida':
                valor_velocidade = 10;
                break;
            
        }
        
        if(input_abertura_facil.checked){
            new FlappyBird(300,valor_velocidade,valor_pontuacao).start()
        }else if(input_abertura_media.checked){
            new FlappyBird(250,valor_velocidade,valor_pontuacao).start()
        }else{
            new FlappyBird(200,valor_velocidade,valor_pontuacao).start()
        }
    } 