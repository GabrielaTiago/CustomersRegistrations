<p align="center"><img src="https://cdn-icons-png.flaticon.com/512/3456/3456426.png" height="80px"/></p>

# <p align = "center"> Customers Registration </p>

## <p align = "center">Teste técnico igma</p>

<div align = "center">
   <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
   <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" heigth="30px"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white" heigth="30px"/>
   <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E" heigth="30px"/>
</div>

$~$

### :clipboard: Descrição

Este é um projeto de API de gerenciamento de clientes, construído com as tecnologias TypeScript, Express, Jest, SuperTest e PostgreSQL. Ele fornece rotas para criar novos clientes, consultar clientes por CPF e recuperar todos os clientes com paginação.

A API permite que você crie clientes com nome, CPF e data de nascimento, e armazene essas informações em um banco de dados PostgreSQL. As rotas de GET permitem que você consulte um cliente específico pelo seu CPF ou todos os clientes de uma só vez, com a opção de paginação.

Este projeto é construído com TypeScript, o que garante uma tipagem segura e uma melhor manutenibilidade do código. O Express é usado para criar as rotas da API, enquanto o Jest e o SuperTest são utilizados para testar as funcionalidades da API. Além disso, o PostgreSQL é usado como banco de dados para armazenar as informações dos clientes.

#### 🗃️ [Acesse aqui](important-fly-dress.cyclic.app/)

---

### :white_check_mark: Testes

- Criação de um novo cliente
- Buscar um cliente pelo CPF
- Buscar todos os clientes

---

### :world_map: Rotas

```yml
[POST]  /customer

    - Rota para criar um novo cliente
    - Inputs são obrigatórios
    - Nome: apenas letras,
    - CPF: apenas números - ###.###.###-## ou 12345678900,
    - Data de nascimento: apenas números, (necessário as barras /) - DD/MM/AAAA

    - body:
        {
            "name": "Vitor Santos",
            "cpf": "818.037.660-50",
            "birth_date" : "22/07/1993"
        }
```

**Descrição:**

A rota POST /customer é a rota responsável por adicionar novos clientes ao banco de dados da API de cadastro de clientes. Esta rota permite que o usuário envie informações de cliente, incluindo nome, CPF e data de nascimento, para serem registrados na base de dados.

Ao fazer uma requisição POST para esta rota, o usuário envia os dados do cliente através do corpo da requisição. As informações são validadas antes de serem armazenadas na base de dados, garantindo que apenas informações válidas sejam aceitas.

- Campo de nome: foi implementada uma validação para garantir que apenas caracteres alfabéticos sejam aceitos, evitando assim a inserção de caracteres numéricos e especiais.

- Campo de CPF, a validação permite apenas caracteres numéricos, aceitando os pontos e traços nas posições corretas. Além disso, foi implementada uma validação dos dois últimos caracteres, garantindo que somente um usuário com CPF válido possa ser cadastrado.

- Campo de data de nascimento, a validação foi realizada para garantir que apenas datas no formato DD/MM/YYYY sejam aceitas, e que apenas datas menores que a data de hoje possam ser cadastradas, evitando assim informações inválidas ou inconsistentes.

**Retornos:**

| Status Code | Situação                    |
| ----------- | --------------------------- |
| 201         | Cliente com sucesso         |
| 409         | Cliente já criado           |
| 422         | Nenhum 'body' enviado       |
| 422         | Nome inválido               |
| 422         | CPF inválido                |
| 422         | Data de nascimento inválida |

$~$

```yml
[GET] /customers?page=1&limit=10

    - Rota para buscar todas os clientes
    - Possui paginação
    - Por padrão, page = 1 e limit = 10

    - response:
        [
            {
                "id": 1,
                "name": "João da Silva",
                "cpf": "383.470.470-90",
                "birth_date": "1982-02-02T03:00:00.000Z"
            },
            {
                "id": 2,
                "name": "Maria Oliveira",
                "cpf": "849.159.140-03",
                "birth_date": "1983-03-03T03:00:00.000Z"
            },
            {
                "id": 3,
                "name": "Rafaela Souza",
                "cpf": "99247520070",
                "birth_date": "1991-11-11T02:00:00.000Z",
            },
            ...
        ]
```

**Descrição:**

A rota GET /customers permite a recuperação de todos os clientes registrados na base de dados da API de cadastro de clientes. Esta rota é implementada com a utilização de paginação, o que significa que os resultados são retornados em conjuntos, ou páginas, para melhorar a performance da consulta e evitar problemas de sobrecarga de dados.

Com esta rota, é possível recuperar informações sobre todos os clientes registrados na base de dados, incluindo nome, CPF e data de nascimento. É possível especificar o número da página a ser retornada, bem como o número de resultados por página, para que os dados sejam retornados de forma eficiente e organizada.

Por padrão, esta rota vem filtrada para primeira página limitada à 10 clientes.

- Parametros de página e limite, possuem validações para números inválidos, tais como números negativos ou muito grandes.

**Retornos:**

| Status Code | Situação                                |
| ----------- | --------------------------------------- |
| 200         | Retorna os clientes                     |
| 404         | Não econtra nenhum cliente              |
| 422         | Número da página inválido               |
| 422         | Número do limite inválido               |
| 422         | Números da página e do limite inválidos |

$~$

```yml
GET /customer/:cpf

    - Rota para buscar um cliente específico pelo seu cpf
    - params: '123.456.789-14'
    - response:
        [
            {
                "id": 9,
                "name": "Rafaela Souza",
                "cpf": "12345678914",
                "birth_date" : "1985-05-05T03:00:00.000Z"
            }
        ]

```

**Descrição:**

A rota GET /customer/:cpf é a rota responsável por buscar informações sobre um cliente específico na base de dados da API de cadastro de clientes. Esta rota utiliza o CPF do cliente como parâmetro de busca, permitindo a recuperação precisa e rápida das informações relevantes.

Ao fazer uma requisição GET para esta rota, o usuário especifica o CPF do cliente desejado na URL, como por exemplo: GET /customer/123.456.789-10. A API então realiza uma busca na base de dados por um cliente com esse CPF, e retorna as informações encontradas, incluindo nome e data de nascimento.

- No parâmetro cpf, a validação permite apenas caracteres numéricos, aceitando os pontos e traços nas posições corretas.

**Retornos:**

| Status Code | Situação                   |
| ----------- | -------------------------- |
| 200         | Retorna o cliente          |
| 404         | Não econtra nenhum cliente |
| 422         | CPF inválido               |

---

### :rocket: Rodando esse projeto localmente

Para inicializar esse projeto é necessário que você possua a última versão estável do [Node.js](https://nodejs.org/en/download) e [npm](https://www.npmjs.com/) rodando localmente. Você também precisará instalar o [postgres](https://www.postgresql.org/download/) para configurar o banco de dados.

Primeiro de tudo, clone este projeto ou faça o download do ZIP.

Para realizar o clone, no terminal de sua máquina, utilize o [git](https://git-scm.com/) e insira o seguinte comando:

```bash
    https://github.com/GabrielaTiago/CustomersRegistration.git
```

Entre na pasta do projeto

```bash
    cd CustomersRegistration
```

Execute o seguinte comando para instalar as dependências.

```bash
    npm install
```

Crie um banco de dados postgres para armazenar as informações de clientes. Você pode fazer isso usando o terminal ou a ferramenta de gerenciamento gráfico [pgAdmin](https://www.pgadmin.org).

Execute a seguinte query para criar a tabela de usuários:

```SQL
    CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "cpf" CHAR(11) NOT NULL,
        "birth_date" DATE NOT NULL
    );
```

Criar um arquivo **.env** e um **.env.test** na raiz do projeto com os seguintes dados:

⚠️ <span style="color: orange; font-weight:bold">Atenção:</span> A **_'DATABASE_URL'_** deve conter seus dados pessoais postgres para funcionar corretamente.

**.env**

```bash
    PORT=4000
    DATABASE_URL="postgres://[YourUserName]:[YourPassword]@[YourHostname]:5432/[YourDatabaseName]";
```

**.env.test**

```bash
    PORT=4000
    DATABASE_URL="postgres://[YourUserName]:[YourPassword]@[YourHostname]:5432/[YourDatabaseName_test]";
```

Para iniciar o servidor, execute o comando:

```bash
    npm run start
```

A aplicação estará disponível em: <http://localhost:4000> no seu navegador.

Para rodar todos os testes,

```bash
    npm run test
```

Para ver apenas os testes end to end (e2e)

```bash
    npm run test:e2e
```

Testes unitários no serviço

```bash
    npm run test:service
```

---

### :bulb: Reconhecimentos

- [Badges para Github](https://github.com/alexandresanlim/Badges4-README.md-Profile#-database-)
- [Inspiração de README](https://gist.github.com/luanalessa/7f98467a5ed62d00dcbde67d4556a1e4#file-readme-md)
- [Arthur Akira - Apoio e ajuda com os testes](https://github.com/akiraTatesawa)

---

### 👩‍🦱 Autora

Gabriela Tiago de Araújo

email: gabrielatiagodearaujo@outlook.com
linkedin: <https://www.linkedin.com/in/gabrielatiago/>

---

[🔝 Back to top](#customers-registration)
