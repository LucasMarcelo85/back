const { Client } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

const connectionString = 'postgres://postgres:123Lucas@easypanel.librarymatch.com.br:5433/freelance?sslmode=disable';

// Endpoint para registrar venda
app.post('/gofashion/venda', async (req, res) => {
  const client = new Client({ connectionString });
  const { vendidos } = req.body;
  try {
    await client.connect();
    for (const item of vendidos) {
      await client.query(
        `UPDATE gofashion_stock SET estoque = estoque - $1
         WHERE produto_id = $2 AND tamanho = $3 AND cor = $4 AND estoque >= $1`,
        [item.quantidade, item.id, item.tamanho, item.cor]
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

// Endpoint para adicionar produto e estoque
app.post('/gofashion/add', async (req, res) => {
  const client = new Client({ connectionString });
  const { id, category, title, tamanho, cor, estoque } = req.body;
  try {
    await client.connect();
    await client.query(
      `INSERT INTO gofashion (id, category, title)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [id, category, title]
    );
    await client.query(
      `INSERT INTO gofashion_stock (produto_id, tamanho, cor, estoque)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (produto_id, tamanho, cor) DO UPDATE SET estoque = gofashion_stock.estoque + $4`,
      [id, tamanho, cor, estoque]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

// Endpoint para listar produtos e estoque detalhado
app.get('/gofashion', async (req, res) => {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const result = await client.query(`
      SELECT g.id, g.category, g.title,
        s.tamanho, s.cor, s.estoque
      FROM gofashion g
      JOIN gofashion_stock s ON g.id = s.produto_id
      ORDER BY g.id, s.tamanho, s.cor
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

// Endpoint para filtros (categoria, tamanho, cor)
app.get('/gofashion/filter', async (req, res) => {
  const client = new Client({ connectionString });
  const { category, tamanho, cor } = req.query;
  let where = [];
  let values = [];
  if (category) {
    where.push('g.category ILIKE $' + (values.length + 1));
    values.push('%' + category + '%');
  }
  if (tamanho) {
    where.push('s.tamanho ILIKE $' + (values.length + 1));
    values.push('%' + tamanho + '%');
  }
  if (cor) {
    where.push('s.cor = $' + (values.length + 1));
    values.push(cor);
  }
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    await client.connect();
    const result = await client.query(`
      SELECT g.id, g.category, g.title,
        s.tamanho, s.cor, s.estoque
      FROM gofashion g
      JOIN gofashion_stock s ON g.id = s.produto_id
      ${whereClause}
      ORDER BY g.id, s.tamanho, s.cor
    `, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.end();
  }
});

// app.listen(port, () => {
//   console.log(`API rodando em http://localhost:${port}`);
// });

app.listen(port, '0.0.0.0', () => {
  console.log(`API rodando em http://0.0.0.0:${port}`);
});