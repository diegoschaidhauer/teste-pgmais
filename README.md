# Teste Pg Mais Analis NodeJS JR
 _Aplicação com base do teste do link https://github.com/pgmais/teste-dev_

Esta aplicação irá uma aquivo .csv, retornando os campos id_mensagem e id_broker para cada linha lida, de acordo com as regras designadas abaixo:

- mensagens com telefone inválido deverão ser bloqueadas(DDD+NUMERO);
- mensagens que estão na blacklist deverão ser bloqueadas; 
- mensagens para o estado de São Paulo deverão ser bloqueadas;
- mensagens com agendamento após as 19:59:59 deverão ser bloqueadas;
- as mensagens com mais de 140 caracteres deverão ser bloqueadas;
- caso possua mais de uma mensagem para o mesmo destino, apenas a mensagem - - - apta com o menor horário deve ser considerada;
- o id_broker será definido conforme a operadora; 

## Tecnologias utilizadas

- Linguagem JavaScript - NodeJS
- IDE VS Code
- Windows 10 como Sistema Operacional
- Axios
- csv-parse
- Prettier e Eslint como despendencias de desenvolvimento

## Como executar
Primeiramente deverá ser informado o diretorio do arquivo.csv, o qual deve ser lido, sendo passado na constante inputFile.

```sh
const inputFile = 'arquivo.csv';
```

Então abra o seu terminal e digite o comando abaixo 

```sh
node index.js
```

A aplicação irá iniciar, retornando cada linha do arquivo dentro de um objeto, com uma propriedade associada à cada valor.
Exemplo:
```sh
Dado Inicial:
 { id_msg: 'bff58d7b-8b4a-456a-b852-5a3e000c0e63',
  DDD: '12',
  celular: '996958849',
  operadora: 'NEXTEL',
  horario: '21:24:03',
  mensagem: 'sapien sapien non mi integer ac neque duis bibendum' }
```
Após alguns segundos, irá retornar no terminal o Dado final de cada mensagem válida: id_mensagem e seu respectivo id_broker separados por um ';':
```sh
Dado final:
 c04096fe-2878-4485-886b-4a68a259bac5;3
 ```
 
