import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Função para criar o pool de conexão
function createPool() {
    // Configurações da conexão
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PSW,
        database: 'employees',
        connectTimeout: 60000, // Defina o valor desejado em milissegundos (exemplo: 60 segundos)
    };

    // Criação do pool de conexão
    const pool = mysql.createPool(dbConfig);

    // Verifica a conexão com o banco de dados
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            // Se houver um erro de conexão, agende uma tentativa de reconexão
            setTimeout(createPool, 5000); // Tenta reconectar após 5 segundos
        } else {
            console.log('Conectado ao banco de dados');
            connection.release(); // Libera a conexão para o pool
        }
    });

    return pool;
}

// Cria o pool de conexão inicial
const pool = createPool();

export default pool;
