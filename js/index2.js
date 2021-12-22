
let bancoDeDados;
let nomeDoBancoDeDados = "BancoDePostit2";
let nomeDaLista = "listaDeDados2"

function criaBancoDeDados () {
    
    let requisicao = window.indexedDB.open( nomeDoBancoDeDados, 1);

    requisicao.onsuccess = (evento) => {

        bancoDeDados = requisicao.result;

        //console.log("banco de dados criado", evento, bancoDeDados);
        
        mostrarCardNaTela ()
    }

    requisicao.onupgradeneeded = (evento) => {

        bancoDeDados = evento.target.result;

        const objetoSalvo = bancoDeDados.createObjectStore(nomeDaLista, {
            keyPath: "id",
            autoIncrement: true
        });

        objetoSalvo.createIndex("lembrete", "lembrete", {unique: false});

        //console.log("houve um upgrade", evento)
    }


    requisicao.onerror = (evento) => {

        console.log("hove um erro", evento);
    }
}

function salvarDados (conteudoTitulo, lembrete, itensCheck, itensNaoCheck, data, dataEdicao) {
    
  
    
   
    let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

    let novaMensagem = {titulo: conteudoTitulo, mensagem: lembrete, listaCheck: itensCheck, listaNaoCheck: itensNaoCheck, data: data, dataEdicao: dataEdicao};

    listaParaAdicionar.add(novaMensagem);

    mostrarCardNaTela ()       
}


function salvarEdicao (id, titulo, conteudo, checados, naoChecados, data, dataAtual) {

    let numeroId = Number(id)
    
    let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

    // let local = listaParaAdicionar.get(localId);

    // local.onsuccess = function(e) {
    //     var data = e.target.result;

    //     console.log(`Data ${JSON.stringify(data)} localId: ${localId}`)
    //     data.mensagem = lembrete;
    //     listaParaAdicionar.put(data);
    // }

    listaParaAdicionar.put({id: numeroId, titulo: titulo, mensagem: conteudo, listaCheck: checados, listaNaoCheck: naoChecados, data: data, dataEdicao: dataAtual});
    mostrarCardNaTela ();
 
}


const removerItem = (eventoClick) => {

    setTimeout(function(){
        
        console.log(eventoClick.target);
    
        const localId = Number(eventoClick.target.getAttribute("data-id"));
    
        let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");
    
        let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);
    
        listaParaAdicionar.delete(localId);
    
        mostrarCardNaTela ();

    }, 800)

};


function mostrarCardNaTela(){

    let local = document.querySelector(".container-cards");
    local.innerHTML  = ""

    let objetoGuardado = bancoDeDados.transaction(nomeDaLista).objectStore(nomeDaLista);

    objetoGuardado.openCursor().onsuccess = (evento) => {

        const cursor = evento.target.result;

        if(cursor){

            const titulo = cursor.value.titulo;
            const conteudo = cursor.value.mensagem;
            const itensChecados = cursor.value.listaCheck;
            const itensNaoChecados = cursor.value.listaNaoCheck;
            const data = cursor.value.data;
            const dataEdicao = cursor.value.dataEdicao;

            const card = criarCard(titulo, conteudo, cursor, itensChecados, itensNaoChecados, data, dataEdicao); 
        
            local.appendChild(card)

            cursor.continue();
        }
    }
}


function pegarDados(){
    
    var campoInformacoes = document.querySelector("[data-mensagem]");
    var conteudo = campoInformacoes.value;
    var campoTitulo = document.querySelector("[data-titulo]");
    var conteudoTitulo = campoTitulo.value;
    let arrayCheck = document.querySelectorAll(".item-check");
    
    let separados = separaItensChecados(arrayCheck);

    var data = document.querySelector(".data");
    var dataFormatada = data.value.split("-").reverse().join("-");

    let dataEdicao = ""

    document.querySelector("[data-itensCheck]").innerHTML = ""
    
    if(conteudo.length > 0){
        
        salvarDados(conteudoTitulo, conteudo, separados[0], separados[1], dataFormatada, dataEdicao);
               
        campoInformacoes.value = ""
        campoTitulo.value = ""
        data.value = ""

    }else{
        
        campoInformacoes.value = ""
        campoTitulo.value = ""
        
    }
}














const montaCheckList = (itensChecados, itensNaoChecados) => {

    let divCheck = document.createElement("div")
    divCheck.classList.add("card-div-checar")

    


    
    itensChecados.forEach(elementchecado => {
        

        let divCheckItem = document.createElement("div")
        divCheckItem.classList.add("card-div-checar-item")
            
        let pTexto = document.createElement("p");
        pTexto.classList.add("card-item-check");
        pTexto.classList.add("texto-riscado");
        pTexto.setAttribute("contenteditable", true);
        pTexto.setAttribute("data-checado", 1);
        pTexto.textContent = elementchecado;
       

        let divBotoesCheck = document.createElement("div");
        divBotoesCheck.classList.add("card-botoes-check");

        let pRiscar = document.createElement("p");
        pRiscar.classList.add("card-riscar-check");
        pRiscar.addEventListener("click", riscaCheckCard);

        let pApagar = document.createElement("p");
        pApagar.classList.add("card-apagar-check")
        pApagar.addEventListener("click", removeCheckCard);

        divBotoesCheck.appendChild(pRiscar);
        divBotoesCheck.appendChild(pApagar);

        divCheckItem.appendChild(pTexto);
        divCheckItem.appendChild(divBotoesCheck);

        divCheck.appendChild(divCheckItem);

    });


    itensNaoChecados.forEach(elementoNChecado =>{
        
        let divCheckItem = document.createElement("div")
        divCheckItem.classList.add("card-div-checar-item")
            
        let pTexto = document.createElement("p");
        pTexto.classList.add("card-item-check");
        pTexto.setAttribute("contenteditable", true);
        pTexto.setAttribute("data-checado", 0);
        pTexto.textContent = elementoNChecado;
        pTexto.addEventListener("change", (e)=> {
            let pai = e.parentNode;
            console.log("oi")
        }
        )
       

        let divBotoesCheck = document.createElement("div");
        divBotoesCheck.classList.add("card-botoes-check");

        let pRiscar = document.createElement("p");
        pRiscar.classList.add("card-riscar-check");
        pRiscar.addEventListener("click", riscaCheckCard);

        let pApagar = document.createElement("p");
        pApagar.classList.add("card-apagar-check")
        pApagar.addEventListener("click", removeCheckCard);

        divBotoesCheck.appendChild(pRiscar);
        divBotoesCheck.appendChild(pApagar);

        divCheckItem.appendChild(pTexto);
        divCheckItem.appendChild(divBotoesCheck);

        divCheck.appendChild(divCheckItem);
    })

    return divCheck;

}


const riscaCheckCard = (e) => {

    let alvo = e.target;
    let pai = alvo.parentNode;
    let vo = pai.parentNode;
    
    let textoParaRiscar = vo.querySelector(".card-item-check");
   
    textoParaRiscar.classList.toggle("texto-riscado")
    

    const index = textoParaRiscar.dataset.checado;
  
    if(index == 0){
        textoParaRiscar.dataset.checado = 1
    }else{
        textoParaRiscar.dataset.checado = 0
    }

    
}

const removeCheckCard = (e) =>{
    let alvo = e.target;
    let pai = alvo.parentNode;
    let vo = pai.parentNode.remove();

}














const botaoIncluir = () => {

    let localListaCheck = document.querySelector("[data-itensCheck]");

    document.querySelector("[data-botaoIncluir]")
    .addEventListener("click", ()=> {
        let textoChecar = document.querySelector("[data-inputChecar]");

        let divChecar = document.createElement("div");
        divChecar.classList.add("div-checar")

        let divBotoes = document.createElement("div");
        divBotoes.classList.add("div-Botoes-input")

        let riscar = document.createElement("p");
        riscar.classList.add("riscar-input");
        riscar.addEventListener("click", riscacheck)
       
        let apagar = document.createElement("p");
        apagar.classList.add("apagar-input")
        apagar.addEventListener("click", removeCheck);

        let lista = document.createElement("p");
        lista.setAttribute("contenteditable", true)
        lista.setAttribute("data-checado", 0)
        lista.classList.add("item-check");
        lista.textContent = textoChecar.value;

        divBotoes.appendChild(riscar);
        divBotoes.appendChild(apagar)

        divChecar.appendChild(lista);
        divChecar.appendChild(divBotoes);
        

        localListaCheck.appendChild(divChecar);
        id++

        textoChecar.value = "";  
    
    })
    

};

const removeCheck = (e) =>{
    let alvo = e.target;
    let pai = alvo.parentNode;
    let vo = pai.parentNode.remove();

}

const riscacheck = (e) => {

    let alvo = e.target;
    let pai = alvo.parentNode;
    let vo = pai.parentNode;
    
    let textoParaRiscar = vo.querySelector(".item-check");
   
    textoParaRiscar.classList.toggle("texto-riscado")
    

    const index = textoParaRiscar.dataset.checado;
  
    if(index == 0){
        textoParaRiscar.dataset.checado = 1
    }else{
        textoParaRiscar.dataset.checado = 0
    }

    
}




















const separaItensChecados = (arrayRecebido) => {


    let arrayValoresChecados = [];
    let arrayValoresNaoChecados = []

    arrayRecebido.forEach(item => {
        
        const riscado = item.dataset.checado;
        const texto = item.textContent;
        
        if(riscado == 1){

            arrayValoresChecados.push(texto);

        }else{

            arrayValoresNaoChecados.push(texto);
            
        }
    
    });

    let arrayJunto = [];

    arrayJunto.push(arrayValoresChecados);

    arrayJunto.push(arrayValoresNaoChecados);

    return arrayJunto

}



function criarCard(titulo, conteudo, cursor, itensChecados, itensNaoChecados, data, dataEdicao) {

    let checkList = montaCheckList(itensChecados, itensNaoChecados)

   
    let div = document.createElement("div");
    div.classList.add("post-it");

    let salvarEdicao = document.createElement("p");
    salvarEdicao.classList.add("botao-edicao-card");
    salvarEdicao.textContent = "Salvar"
    salvarEdicao.addEventListener("click", editaTudo)
    


    let divtexto = document.createElement("div");
    divtexto.classList.add("textos");

    let divFilha = document.createElement("div");
    divFilha.classList.add("xis");
    divFilha.textContent = "X";
    divFilha.classList.add("botao-cancelar");
    divFilha.setAttribute("data-id", cursor.value.id);
    divFilha.addEventListener("click", removerItem);
    divFilha.addEventListener("click", esmaecerItem);

    let h4titulo = document.createElement("h4");
    h4titulo.textContent = titulo;
    h4titulo.classList.add("filtrar");
    h4titulo.setAttribute("data-id", cursor.value.id);
    h4titulo.setAttribute("contenteditable", true)
    
    

    let pConteudo = document.createElement("p");
    pConteudo.classList.add("texto");
    pConteudo.classList.add("filtrar");
    pConteudo.textContent = conteudo;
    pConteudo.setAttribute("data-id", cursor.value.id);
    pConteudo.setAttribute("contenteditable", true)
  
    let divBotoes = document.createElement("div");
    divBotoes.classList.add("botao-post-it");
    
    let pData = document.createElement("p");
    pData.classList.add("data-card");
    pData.setAttribute("contenteditable", true)
    pData.textContent = data;

    let pDataEdicao = document.createElement("p");
    pDataEdicao.classList.add("data-card-edicao");
    pDataEdicao.textContent = dataEdicao;



    divtexto.appendChild(divFilha);
    divtexto.appendChild(h4titulo);

    divtexto.appendChild(pConteudo);
    

    div.appendChild(divtexto);

    div.appendChild(checkList);

    div.appendChild(pData);

    div.appendChild(salvarEdicao);

    div.appendChild(pDataEdicao);
    
    
    return div;
}


const editaTudo = (e) => {
    let alvo = e.target.parentNode

    let id = alvo.querySelector(".botao-cancelar").dataset.id;
    let titulo = alvo.querySelector("h4").textContent;
    let conteudo = alvo.querySelector(".texto").textContent;
    let data = alvo.querySelector(".data-card").textContent;




    var dataED = new Date();
    var dia = String(dataED. getDate()). padStart(2 ,'0');
    var mes = String(dataED. getMonth() + 1). padStart(2, '0');
    var ano = dataED.getFullYear();
    var hora = dataED.getHours();
    var minutos = dataED.getMinutes();
    var dataAtual =`Editado ${dia}/${mes}/${ano} às ${hora}:${minutos}`;
    




    let checkList = alvo.querySelectorAll(".card-item-check");

    let checkListSeparado = separaItensChecados(checkList);

    salvarEdicao(id, titulo, conteudo, checkListSeparado[0], checkListSeparado[1], data, dataAtual)

}





const esmaecerItem = (evento) =>{
    const paiDoAlvo = evento.target.parentNode;
    const voDoalvo = paiDoAlvo.parentNode;
    
    voDoalvo.classList.add("esmaecer");
}


























// filtrar

let campoDigitavelBusca = document.querySelector(".filtro");

    campoDigitavelBusca.addEventListener("input", () => {

        var camposDeBusca = document.querySelectorAll(".textos");

        if(campoDigitavelBusca.value.length > 0){

            camposDeBusca.forEach((elemento, indice) => {

                let conteudoTitulo = elemento.querySelector("p").textContent;
                let conteudoTexto = elemento.querySelector("h4").textContent;
                let conteudoCheck = elemento.parentNode.querySelectorAll(".card-item-check");
                let conteudoArray = []

                console.log(conteudoCheck[0])

                let conteudoTotalTexto = conteudoTitulo.concat(conteudoTexto);

                conteudoCheck.forEach(item => {

                    let textos = item.textContent;
                    conteudoArray.push(textos);

                })

                let checkString = conteudoArray.join();

                let conteudoTotal = conteudoTotalTexto.concat(checkString);

                let expressao = new RegExp(campoDigitavelBusca.value, "i");

                if(expressao.test(conteudoTotal)){
                    
                    elemento.parentNode.classList.remove("invisivel");
                   
                }else{

                    elemento.parentNode.classList.add("invisivel");
                }
            })
        }else{
            camposDeBusca.forEach(elemento => {
                
                elemento.parentNode.classList.remove("invisivel");
            })
        }
    })



// Eventos

document.querySelector(".botao-cancelar").addEventListener("click" ,()=>{
    var campoInformacoes = document.querySelector("[data-mensagem]");
    campoInformacoes.value = "";

    var data = document.querySelector(".data");
    data.value = ""

    const areaDeAviso = document.querySelector(".aviso")
        .classList.remove("visualiza-aviso");
    

    campoInformacoes.classList.remove("borda-vermelha");

    var campoTitulo = document.querySelector("[data-titulo]");
    campoTitulo.value = ""

    document.querySelector('.menu-deslizante').classList.toggle('menu-deslizante--ativo')
    document.querySelector('.botao-adicionar').classList.toggle('apaga-botao');
    document.querySelector("[data-itensCheck]").innerHTML = ""
    document.querySelector("[data-inputChecar]").value = ""
});

document.querySelector(".botao-salvar").addEventListener("click", ()=>{
    const temMensagem = document.getElementById("mensagem");
    const areaDeAviso = document.querySelector(".aviso");
    
    if(temMensagem.value.length > 0){

        document.querySelector('.menu-deslizante').classList.toggle('menu-deslizante--ativo')

        document.querySelector('.botao-adicionar').classList.toggle('apaga-botao');

        temMensagem.classList.remove("borda-vermelha");
        areaDeAviso.classList.remove("visualiza-aviso");

        pegarDados()
    }else{
        temMensagem.classList.add("borda-vermelha");
        areaDeAviso.classList.add("visualiza-aviso");
    }


});


document.querySelector('.botao-adicionar').addEventListener('click', () => {

    document.querySelector('.menu-deslizante').classList.toggle('menu-deslizante--ativo')
    document.querySelector('.botao-adicionar').classList.toggle('apaga-botao');
});





document.querySelector(".lupa").addEventListener("click", () => {
    const campoBuscar = document.querySelector(".div-busca").classList.toggle("busca-ativa")
})
document.querySelector(".filtro").addEventListener("blur", ()=> {
    const campoBuscar = document.querySelector(".div-busca");
    campoBuscar.classList.remove("busca-ativa")
})



criaBancoDeDados();

botaoIncluir();


