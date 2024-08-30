import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export function connectDatabase() {

    console.log(`Host: ${process.env.DATABASE_HOST}`);
    console.log(`User: ${process.env.DATABASE_USER}`);
    console.log(`Database: ${process.env.MYSQL_DATABASE}`);

    connection.connect((error) => {
        if (error) {
            console.error('Erro ao conectar ao banco de dados:  ', error);
            throw new Error('Erro ao conectar ao banco de dados.');
        } else {
            console.log('Conexão com o banco de dados estabelecida.');
        }
    });
}

export function closeDatabaseConnection() {

    connection.end((error) => {
        if (error) {
            console.error('Erro ao fechar a conexão com o banco de dados: ', error);
            throw new Error("Erro ao fechar a conexão com o banco de dados.");
        } else {
            console.log('Conexão com o banco de dados fechada.');
        }
    });
}


export async function executeQuery(query: string, values?: any[]): Promise<any> {
    console.log(`Executando query: ${query}`);
    console.log(`Valores: ${values}`);
    try {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao executar a consulta: ', error);
        throw new Error('Erro ao executar a consulta.');
    }
}