/*Guevara Arriaza Danys Emanuel   GA19014
  Hernández Zavala Cynthia Nohemy HZ19004 */

let barra_inicio = 0;       //variable para llevar el conteo de las barras de inicio
let barra_derecha= 0;       //variable para llevar el conteo de la barra derecha osea la final
let barra_b = document.getElementsByClassName("barra");  //variable que va a almacenar los objetos con la clase barra 
console.log(barra_b)        //como trae tres objetos llamados barras usaremos un for ...of para iterar cada objeto
let Iniciar_arrastre = () => { 
  for (var x of barra_b) {  //recorremos los objetos con la clase barra
    for (var y = 0; y < x.children.length; y++) { //recorremos y seteamos los atributos a los hijos de los objetos
      if (y == 0) {         // verificamos que solo el primer hijo de cada barra se pueda mover de posicion
        x.children[y].setAttribute("draggable", "true");    
        x.children[y].setAttribute("ondragstart","arrastrar(event)");
      }
      else {                //en caso de que no sea el primer hijo se setean estos atributos y quitamos algunos atributos
        x.children[y].setAttribute("draggable", "false");     
        x.children[y].removeAttribute("ondragstart");
      }
    }
  } 
}
Iniciar_arrastre();         //mandamos a llamar la funcion para dar el orden de los discos que se moveran, es decir para mover los primeros que se encuentren en cada barra
let arrastrar = (event) =>{ //variable que usamos para darle logica al momento de arrastar los discos
    event.dataTransfer.setData("text", event.target.id);  
    var barraInicial_control = event.target.parentElement;
    for (var x = 0; x < barra_b.length; x ++) {
    if (barra_b[x] === barraInicial_control) {
        barra_inicio = x;
    }
    }
}
let dropSoltar = (event) => {    //creamos la funcion dropSoltar para darle la logica al posisionamiento de cada disco al momento de soltar, al igual que las restricciones que pide el juego
  var DiscoId = event.dataTransfer.getData("text"); //variable para recoger los datos de cada disco, y usamos dataTransfer porque el contiene dichos datos
  event.preventDefault();        
  if (event.target.classList[0].match(/disco/) !== null) {   
    
    return;
  }
  if (event.target.children.length === 0) {   //usamos esta propiedad que nos devolvera una coleccion de los elementos que contiene la barra
    for (var x = 0; x < barra_b.length; x ++) {  //recorremos los elementos de la barra
    if (barra_b[x] === event.target) {
      barra_derecha= x;
      }
    }
    var CoordenadaX = ((event.pageY - event.target.getBoundingClientRect().top)/event.target.getBoundingClientRect().height)*100;   //creamos una variable que nos traera las coordenadas de cada disco
    event.target.appendChild(document.getElementById(DiscoId));
    document.getElementById(DiscoId).style.position = "absolute";
    var deciendeX = setInterval(()=>{            //arrow funcion para setiar los intervalos y los estilos que necesitamos para que los discos queden en su lugar
      document.getElementById(DiscoId).style.top = `${CoordenadaX}%`;
      CoordenadaX += 1;
      if (CoordenadaX >= 90) {             //en el caso que las coordenas en X del disco que arrastramos sobrepasan los 90 le setiamos una posicion relativa
        document.getElementById(DiscoId).style.position = "relative";
        document.getElementById(DiscoId).style.top = "";
        clearInterval(deciendeX);
      }
    }, 10);
    Iniciar_arrastre();
  }
  else {              //en el caso de que movamos de posicion de nuevo el disco
    for (var x = 0; x < barra_b.length; x ++) {     //recorremos los elementos de la barra
    if (barra_b[x] === event.target && DiscoId.length > 0) {
      barra_derecha= x;
      }
    }
    var DiscoIdNum = Number(DiscoId[5]);            //como tenemos 5 discos creamos una variable para contenerlos y usamos Number para poder representar y manipularlos como valores numericos
    var destinoId = event.target.children[0].id;    //cogemos el id de cada disco
    var destinoIdNum = Number(destinoId[5]);        
    if (DiscoIdNum < destinoIdNum) {              //si el que tenemos es menor al disco que ingresaremos no se podra poner sobre el otro
      var CoordenadaX = ((event.pageY - event.target.getBoundingClientRect().top)/event.target.getBoundingClientRect().height)*100;
      event.target.insertBefore(document.getElementById(DiscoId), event.target.children[0]);  
      document.getElementById(DiscoId).style.position = "absolute";   //setiamos al disco por medio de su id una posicion absoluta
      var CoordenadaXLimite = 90 - (10*(event.target.children.length-1));
      var deciendeX = setInterval(()=>{
        document.getElementById(DiscoId).style.top = `${CoordenadaX}%`;
        CoordenadaX += 1;
        if (CoordenadaX >= CoordenadaXLimite) {
          document.getElementById(DiscoId).style.position = "relative";
          document.getElementById(DiscoId).style.top = "";
          clearInterval(deciendeX);
        }
      }, 10);
      Iniciar_arrastre();
    }else{               //al querer colocar un disco de mayor tamaño arriba de uno de menor tamaño se mostrara un alerta
        alert('No puede colocar un disco mas grande sobre uno de menor tamaño.')    
    }  
  }  
}
let dragOver = (event) =>{        //cambiamos el comportamiento predeterminado de soltar
  event.preventDefault();
}