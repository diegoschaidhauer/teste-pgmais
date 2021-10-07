const fs = require('fs');
const csv = require('csv-parse');
const axios = require('axios')


const inputFile = 'arquivo.csv';
const saveElements = []

// aqui lê o arquivo e faz o parse, utilizando como delimitador o ';'
const parse = csv({ delimiter: ';' }, function (err, data) {
    try {
        dataManipulation(data)
    } catch (error) {
        console.log('Erro ao efetuar parse', error);
    }
});

//Cria os objeto, executa as outras funções e verificaçoes simples
function dataManipulation(data) {
    data.forEach(async function (dataInfo) {
        const data = {
            "id_msg": dataInfo[0],
            "DDD": dataInfo[1],
            "celular": dataInfo[2],
            "operadora": dataInfo[3],
            "horario": dataInfo[4],
            "mensagem": dataInfo[5],
        };
        console.log('Dado Inicial:\n', data);

        const phone = data.DDD + data.celular
        //Expressão regular para determinar regras para os telefones
        const verifyPhone = /^[2-9][1-9]9[7-9][0-9]{3}[0-9]{4}$/.test(phone)
        data['phone'] = phone

        //Chamada para verificação de Blacklist
        const statusCode = await consultBlacklist(phone)
        if (statusCode == 200) return

        //Verificação do horário abaixo de '19:59:59', msg menor que 140 caracteres e regras do telefone e região
        const time = data.horario
        if (!verifyPhone || time > '19:59:59' || data.mensagem.length >= 140) return

        //Verificação de id_broker
        let id_broker
        if (data.operadora == 'VIVO' || data.operadora == 'TIM') {
            id_broker = 1
        } else if (data.operadora == 'CLARO' || data.operadora == 'OI') {
            id_broker = 2
        } else {
            id_broker = 3
        }

        //Chamada da verificação de mensagem/horario para o mesmo numero
        const validData = checkRepeatedPhone(data)
        // console.log(validData);
        if (validData == undefined) return

        console.log('Dado final:\n', `${data.id_msg};${id_broker}`);
    });
}

//Verfica se o telefone está na blackllist
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
// Verifica se existe mais de uma mensagem para o mesmo numero e retonar a com menos horario
function checkRepeatedPhone(data) {
    if (saveElements.length > 0) {
        for (let i = 0; i < saveElements.length; i++) {
            if (data.phone === saveElements[i].phone) {
                if (data.horario > saveElements[i].horario) {
                    data = saveElements[i]
                } else {
                    data = data

                }
            }
        }
        return data

    }
    saveElements.push(data)
}

// Lê o arquivo de entrada e aplica a função de manipulação
fs.createReadStream(inputFile).pipe(parse);


