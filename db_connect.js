const { Client } = require('pg');

// URL de conexão externa
const connectionString = 'postgres://postgres:123Lucas@easypanel.librarymatch.com.br:5433/freelance?sslmode=disable';

const client = new Client({
  connectionString,
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    // Exemplo de consulta
    const res = await client.query('SELECT NOW()');
    console.log('Hora atual do banco:', res.rows[0]);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } finally {
    await client.end();
  }
}

connectDB();
