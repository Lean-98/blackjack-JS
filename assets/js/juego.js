const miModulo = (() => {
    'use strict';

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];
    
    let puntosJugadores = [];
    
    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');
    
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');
          
    
    // Esta función inicializa el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();
        
        puntosJugadores = [];
        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }
 
        //Resetear puntajes
        puntosHTML.forEach( elem => elem.innerText = 0 );
        
        // Borrar cartas
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );
        
        btnDetener.disabled = false;
        btnPedir.disabled = false; 
        console.clear();

    };

    // Esta función crea un nuevo deck
    const crearDeck = () => {
        
        deck = [];
        for( let i = 2; i <= 10 ; i++ ) {
            for ( let tipo of tipos ) {
                deck.push( i + tipo );
            }
        }
    
        for( let tipo of tipos ) {
            for( let esp of especiales ) {
                deck.push( esp + tipo );
            }
        }
        return _.shuffle( deck );  
    }
     
    // Esta función me permite tomar una carta
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay cartas en el deck!';
        }
        return deck.pop();
    }

    // Esta función sirve para obtener el valor de la carta
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length -1);
        return ( isNaN( valor )) ? 
                ( valor === 'A' ) ? 11 : 10
                :  valor * 1; //transformar el valor de la carta string a un número; la manera más sencilla es multiplicarlo *1 o usar parseInt() o usar +
    }
    
    // Turno: 0 = primer jugador y el último será la computadora
    const acumularPuntos = ( carta, turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    // Crear carta
    const crearCarta = ( carta, turno ) => {
         // Crear carta en el HTML
         const imgCarta = document.createElement('img');
         imgCarta.src = `../assets/cartas/${ carta }.png`;
         imgCarta.classList.add('carta'); // no hace falta poner el punto al principio para agregar la clase
         divCartasJugadores[turno].append( imgCarta );
    }

    const determinarGanador = () => {

        const [ puntosMinimos,  puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            if ( puntosComputadora === puntosMinimos) {
                Swal.fire({
                    title: 'TIE!',
                    width: 480,
                    padding: '4em',
                    color: '#716add',
                    background: '#fff url(../assets/gifs/tie.gif)',
                  })
            } else if ( puntosMinimos > puntosComputadora && puntosMinimos <= 21 || puntosComputadora > 21 ) {
                Swal.fire({
                    title: 'WINNER!',
                    width: 480,
                    padding: '5em',
                    color: '#716add',
                    background: '#fff url(../assets/gifs/win.gif)',
                  })
            } else if ( puntosComputadora > puntosMinimos && puntosComputadora <= 21 || puntosMinimos > 21 ) {
                Swal.fire({
                    title: 'YOU LOST!',
                    width: 505,
                    padding: '4em',
                    color: '#716add',
                    background: '#fff url(../assets/gifs/loss.gif)',
                  })
            }
        }, 1000);

    }

    // Turno Computadora
    const turnoComputadora = ( puntosMinimos ) => {
        
        let puntosComputadora = 0;

        do {   
            const carta = pedirCarta();
            
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1); // retorna el último indice del arreglo
            crearCarta( carta, puntosJugadores.length - 1);
        
            } while ( (puntosComputadora <= puntosMinimos) && (puntosMinimos <= 21 ) );
        
        determinarGanador();
    }
    
    
    // Eventos Dos argumentos: 1)es el evento que yo quiero escuchar 'click', 'dobleclick', 'focus'; 2) crear un callback: función que manda como argumento
    //puede ser función tradicional o de flecha
    
    btnPedir.addEventListener('click', () => {
          
        const carta = pedirCarta(); 
        const puntosJugador = acumularPuntos( carta, 0 );
       
        crearCarta(carta, 0);
        
        if ( puntosJugador > 21) {
            btnDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        } else if ( puntosJugador === 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });
      
    btnDetener.addEventListener('click', () => {
        
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora( puntosJugadores[0] );
    
    });
    
    // btnNuevo.addEventListener('click', () => {
     
    // inicializarJuego();

    // });


    return {
        nuevoJuego: inicializarJuego // Público
    };
    
})();

