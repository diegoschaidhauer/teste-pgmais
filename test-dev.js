const fs = require('fs');
const parse = require('csv-parse');
const axios = require('axios')
 
const inputFile='arquivo.csv';
const saveElements = []

async function consultBlacklist(phone) {
    let status
    await axios.get(`https://front-test-pg.herokuapp.com/blacklist/${phone}`)
    .then(function (response) {
        status = response.status
    })
    .catch(function (error) {
      
        status = error.response.status
       
    });
    return status
}

function verifyElement(data){
   
          if(saveElements.length > 0){
             
          for (let i = 0; i < saveElements.length ; i++) {
                if(data.phone == saveElements[i].phone){
                    
                    console.log('CONDIÇÃO DO IFFFFFFF', data.horario < saveElements[i].horario)                  
                    if(data.horario > saveElements[i].horario){    
                        console.log('QUANTAS VEZES PASSOU NO ==========IF')                  
                        data = saveElements[i]
                    }
                }
            }
            saveElements.push(data)
          }
        
         console.log(data, 'DATTTAAAAA NA FUNÇÃO');
          
          return data

}

 
// aqui lê o arquivo e faz o parse, utilizando como delimitador o ';'
const parser = parse({delimiter: ';'}, function (err, data) {
    // create country object out of parsed fields
    data.forEach(async function(line) {
     const data = { "id_msg" : line[0],
                     "DDD" : line[1],
                     "celular" : line[2],
                     "operadora" : line[3],
                     "horario" : line[4],
                     "mensagem" : line[5],
                    };
     
                    console.log('=================DATA INICIAL', data);
     let phone = data.DDD + data.celular
     data['phone'] = phone
     let hora = data.horario 
     let id_broker
     let verificadorCel = /^[2-9][1-9]9[6-9][0-9]{3}[0-9]{4}$/.test(phone)  
     let status = await consultBlacklist(phone)
     if(status == 200){
       
        return
     }
     if(!verificadorCel || hora > '19:59:59' || data.mensagem.length >= 140){
        return
     }

     if(data.operadora == 'VIVO' || data.operadora == 'TIM'){
        id_broker = 1
     }else if(data.operadora == 'CLARO' || data.operadora == 'OI'){
         id_broker = 2               
     }else{        
         id_broker = 3
     }

     let retorno = verifyElement(data)

    // console.log('=================DATA final', retorno);



     //console.log(JSON.stringify(data));

     //console.log(data.id_msg, id_broker);

    
   
               
   

    // console.log(hora);
    });   
});
 
// read the inputFile, feed the contents to the parser
fs.createReadStream(inputFile).pipe(parser);


    