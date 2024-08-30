# Leitura de Imagens Backend

Este projeto é uma aplicação backend usando Containers desenvolvida para gerenciar a leitura de consumo de água e gás a partir de imagens. Utiliza APIs e técnicas de machine learning para processar e validar os dados extraídos das imagens.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para o backend.
- **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript
- **Express.js**: Framework para construção da API.
- **MySQL**: Banco de dados para armazenamento das leituras.
- **Docker**: Containerização da aplicação.
- **Jest**: Framework de testes.
- **Luxon**: Biblioteca para manipulação e validação de datas.
- **Gemini API**: Para identificar a descrição das imagens

## Funcionalidades

- **POST /upload**: Envia uma imagem para processamento e validação.
- **PATCH /confirm**: Confirma ou corrige o valor lido pela API.
- **GET /measures/:customer_code/list**: Lista as leituras associadas a um código de cliente.

## Como Rodar a Aplicação

### Requisitos

- Node.js
- MySQL
- Docker (opcional, para ambiente containerizado)

### Configuração Local

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/dan-araujo/leitura-imagens-backend.git
   cd leitura-imagens-backend
   
2. **Preencha o arquivo .env com as configurações para o seu projeto, incluindo a Chave de API Gemini que você gerou no site oficial da Google Cloud**
3. **Com o Docker instalado na sua máquina. Através da linha de comando execute:**
   ```bash
      docker-compose up --build
