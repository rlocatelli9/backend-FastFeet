<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<p>Esse desafio faz parte do Desafio Final, que é uma aplicação completa (Back-end, Front-end e Mobile) que é avaliada para emissão do Certificado do Bootcamp GoStack!</p>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/rlocatelli9/backend-FastFeet?color=%2304D361">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/rlocatelli9/backend-FastFeet">

  <a href="https://github.com/rlocatelli9/backend-FastFeet/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/rlocatelli9/backend-FastFeet">
  </a>

  <a href="https://github.com/rlocatelli9/backend-FastFeet/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/rlocatelli9/backend-FastFeet">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/rlocatelli9/backend-FastFeet/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/rlocatelli9/backend-FastFeet?style=social">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-projeto">Sobre o Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-tecnologias-utilizadas">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :rocket: Sobre o Projeto

Este projeto é o desenvolvimento de um back-end bem estruturado para uma transportadora fictícia, o FastFeet. Esse desafio faz parte do Desafio Final, que é uma aplicação completa (Back-end, Front-end e Mobile) que é avaliada para emissão do Certificado do Bootcamp GoStack! **O Projeto está em andamento e em constante atualização**

## :rocket: Funcionalidades

Abaixo estão descritas as funcionalidades da aplicação.

**1. Autenticação** :heavy_check_mark:

Autenticação de usuário na aplicação utilizando e-mail e uma senha.

- Autenticação feita utilizando JWT.
- Validação dos dados de entrada.

**2. Gestão de destinatários** :heavy_check_mark:

O cadastro de destinatários é feito por administradores autenticados na aplicação.

O destinatário não se autentica no sistema, por não possuir senha.

**3. Gestão de entregadores** :heavy_check_mark:

Administradores autenticados na aplicação realiza o cadastro de entregadores na plataforma.

**4. Gestão de encomendas** :heavy_check_mark:

Administradores autenticados cadastram encomendas para os entregadores. Para essa gestão, obedecem os seguintes critérios:

- As retiradas só podem ser feitas entre as 08:00 e 18:00h.
- A **data de início** é cadastrada assim que é feita a retirada do produto pelo entregador.
- A **data de término** da entrega é cadatrada somente quando o entregador finaliza a determinada entrega.
- Essa funcionalidade é permitida somente para administradores autenticados na aplicação.

**5. Visualizar encomendas** :heavy_check_mark:

O entregador pode visualizar as encomendas atribuidas a ele, que **não estejam entregues ou canceladas**;

Permitido também que o mesmo possa listar as encomendas que já foram **entregues** por ele.

**6. Alterar status de encomendas** :heavy_check_mark:

É permitido ao entregador pode fazer **5 retiradas por dia**.

Para a funcionalidade de finalizar a entrega, é permitido o envio de uma assinatura digital.

**7. Cadastrar problemas nas entregas** :heavy_check_mark:

O entregador nem sempre conseguirá entregar as encomendas com sucesso, algumas vezes o destinatário pode estar ausente, ou o próprio entregador poderá ter algum problema com seu veículo na hora de entregar. Com isso, é permitido:

- Listar todas as entregas com algum problema.
- Listar todos os problemas de uma determinada encomenda.
- O entregador deve cadastrar eventuais problemas na entrega.

A distribuidora pode cancelar uma entrega baseado no problema. Esse cancelamento pode acontecer devido a gravidade do problema da entrega, por exemplo, em caso de perda da encomenda.

Obs: Quando uma encomenda é cancelada, o entregador recebe um e-mail informando-o sobre o cancelamento.

## :rocket: Tecnologias utilizadas

Technologies used in the development of the project:

- [Node.js](https://nodejs.org/en/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Express](https://expressjs.com/)
- [Jsonwebtoken](https://jwt.io/)
- [Sequelize](https://sequelize.org/)
- [Yup](https://github.com/jquense/yup)
- [Docker](https://www.docker.com/)
- [Postgres](https://www.postgresql.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [multer](https://github.com/expressjs/multer)
- [date-fns](https://date-fns.org/)
- [nodemailer](https://nodemailer.com/about/)
- [Handlebars](https://handlebarsjs.com/)
- [Bee-Queue](https://github.com/bee-queue/bee-queue)
- [Redis](https://redis.io/)
- [Sentry](https://sentry.io/)
- [express-async-errors](npmjs.com/package/express-async-errors)
- [Youch](https://www.npmjs.com/package/youch)

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
