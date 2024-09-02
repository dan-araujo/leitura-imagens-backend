# Leitura de Imagens Backend

Este projeto é uma aplicação backend usando Containers desenvolvida para gerenciar a leitura de consumo de água e gás a partir de imagens. Utiliza APIs e técnicas de machine learning para processar e validar os dados extraídos das imagens.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para o backend.
- **TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript
- **Express.js**: Framework para construção da API.
- **MySQL**: Banco de dados para armazenamento das leituras.
- **Docker**: Containerização da aplicação.
- **Jest**: Framework de testes.
- **Supertest**: Ferramenta que permite testar requisições HTTP
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
   
2. **Preencha o arquivo .env com as configurações para o seu projeto, incluindo a Chave de API Gemini que você gerou no site oficial do Google AI Developers**

     - [Obter a chave da API](https://ai.google.dev/gemini-api/docs/api-key)
     
4. **Com o Docker instalado na sua máquina. Através da linha de comando execute:**
   ```bash
      docker-compose up --build

## Testando a API com Postman

Para facilitar o teste da API, inclui uma coleção do Postman no repositório. Siga os passos abaixo para importar e utilizar a coleção:

1. **Importar Coleção:**
   - Navegue até a pasta `tests/postman` no repositório.
   - Importe o arquivo `Gemini API.postman_collection.json` no Postman:
     - Abra o Postman.
     - Clique em "Import" no canto superior esquerdo.
     - Selecione "Upload Files" e escolha `Gemini API.postman_collection.json`.
     - Clique em "Import".

2. **Executar Testes:**
   - Após a importação, selecione o ambiente apropriado, preencha com as informações no corpo da requisição do JSON e execute as requisições para testar a API.

3. **Configurações:**
   - Certifique-se de que as variáveis de ambiente estejam configuradas conforme necessário para o seu ambiente de desenvolvimento.

Se precisar de ajuda para configurar o Postman, consulte a [documentação do Postman](https://www.postman.com/docs/).
