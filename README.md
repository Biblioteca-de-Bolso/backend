# Biblioteca de Bolso

<p align="center">
    <img src="/docs/library_icon.png" height="130">
</p>

<p align="center">
    <a href="https://github.com/Biblioteca-de-Bolso/backend/actions/workflows/docker-image.yml"  target="_blank">
      <img src="https://github.com/Biblioteca-de-Bolso/backend/actions/workflows/docker-image.yml/badge.svg" />
    </a>
    <a href="https://www.codacy.com/gh/Biblioteca-de-Bolso/backend/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Biblioteca-de-Bolso/backend&amp;utm_campaign=Badge_Grade" target="_blank">
      <img src="https://app.codacy.com/project/badge/Grade/dd2736e4dd7c40748fa497dd6b63ba4f"/>
    </a>
    <a href="https://documenter.getpostman.com/view/19545370/UVkmQGwd" target="_blank">
      <img src="https://img.shields.io/badge/Docs-Postman-f39f37" />
    </a>
</p>

A Biblioteca de Bolso é um projeto de TCC do curso de Análise e Desenvolvimento de Sistemas e consiste em um aplicativo móvel para controle e gerenciamento da sua biblioteca pessoal.

Recursos planejados:

- Manter registro de quais livros você possui na sua biblioteca pessoal
- Marcar quais livros você já leu
- Criar anotações e resumos personalizados citando trecho dos seus livros favoritos
- Controlar quais livros você empresotu e para quem
- Criar e compartilhar cartões de visitas de leitura, com seus escritores, livros e trechos favoritos

## Tecnologias

- Backend: API em [Node.js](https://nodejs.org/en/) escrita com [Express](https://expressjs.com/pt-br/)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org/)
- Interface com o banco de dados: [Prisma](https://www.prisma.io/)
- Testes: Suíte de testes escrita com o [Jest](https://jestjs.io/pt-BR/)
- CI/CD: Integração com deploy automático no Render e [Github Actions](https://github.com/Biblioteca-de-Bolso/backend/actions)
- Ambiente de desenvolvimento: [Docker](https://www.docker.com/)

## Documentação

Documentação da API disponível no Postman: [API Docs](https://documenter.getpostman.com/view/19545370/UVkmQGwd)

## Disponibilidade

A API encontra-se disponível hospedada no Render através do link: [API Biblitoeca de Bolso](https://bibliotecadebolso.onrender.com).

Hospedagens gratuitas no Heroku entram em modo de sleeping após 30 minutos sem nenhum trafégo. Esteja ciente de que a primeira requisição pode levar alguns segundos a mais. Após acordar, o servidor responde as chamadas subsequentes normalmente.
