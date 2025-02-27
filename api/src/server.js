const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint que retorna blocos de 50 itens + total de resultados
app.get('/api/items', async (req, res) => {
  try {
    const { q, offset = 0 } = req.query;
    const response = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${q}&offset=${offset}&limit=50`,
    );

    // Mapeia os resultados em um formato customizado
    const items = response.data.results.map((item) => ({
      id: item.id,
      title: item.title,
      price: {
        currency:
          item.currency ||
          item.currency_id ||
          item.price?.currency ||
          item.price?.currency_id ||
          item.sale_price?.currency ||
          item.sale_price?.currency_id ||
          '$',
        amount:
          item.price ||
          item.amount ||
          item.price?.amount ||
          item.sale_price?.amount ||
          '',
        decimals:
          item.decimals ||
          item.price?.decimals ||
          item.sale_price?.decimals ||
          '',
        regular_amount:
          item.original_price ||
          item.price?.regular_amount ||
          item.sale_price?.regular_amount ||
          '',
      },
      picture: item.pictures || item.thumbnail || '',
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      installments: {
        quantity: item.installments?.quantity,
        amount: item.installments?.amount,
      },
      seller: {
        id: item.seller?.id,
        nickname: item.seller?.nickname,
      },
    }));

    // Captura o total de resultados (ex.: 534 resultados)
    const total = response.data.paging?.total || 0;

    // Retorna itens + total
    res.json({ items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Endpoint que retorna detalhes de um único item
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar detalhes do produto
    const productResponse = await axios.get(
      `https://api.mercadolibre.com/items/${id}`,
    );
    const item = productResponse.data;

    // Buscar categoria para obter path_from_root
    const categoryResponse = await axios.get(
      `https://api.mercadolibre.com/categories/${item.category_id}`,
    );
    const category_path_from_root =
      categoryResponse.data?.path_from_root
        ?.map((cat) => cat.name)
        .join(' > ') || '';

    // Buscar descrição
    const descriptionResponse = await axios.get(
      `https://api.mercadolibre.com/items/${id}/description`,
    );
    const description =
      descriptionResponse.data.plain_text || 'Descrição não disponível';

    // Atualiza o nickname do vendedor, se disponível
    let sellerId = null;
    let sellerNickname = '';
    if (item.seller_id) {
      sellerId = item.seller_id;
      const sellerResponse = await axios.get(
        `https://api.mercadolibre.com/users/${sellerId}`,
      );
      sellerNickname = sellerResponse.data.nickname || '';
    }

    // Extrair atributos
    const attributes = (item.attributes || []).map((attr) => ({
      id: attr.id,
      name: attr.name,
      value_name: attr.value_name,
    }));

    // Monta a resposta
    res.json({
      id: item.id,
      title: item.title,
      price: {
        currency:
          item.currency ||
          item.currency_id ||
          item.price?.currency ||
          item.price?.currency_id ||
          item.sale_price?.currency ||
          item.sale_price?.currency_id ||
          '$',
        amount:
          item.price ||
          item.amount ||
          item.price?.amount ||
          item.sale_price?.amount ||
          '',
        decimals:
          item.decimals ||
          item.price?.decimals ||
          item.sale_price?.decimals ||
          '',
        regular_amount:
          item.original_price ||
          item.price?.regular_amount ||
          item.sale_price?.regular_amount ||
          '',
      },
      category_path_from_root,
      picture: item.pictures || item.thumbnail || '',
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
      installments: {
        quantity: item.installments?.quantity,
        amount: item.installments?.amount,
      },
      description,
      seller: {
        id: sellerId,
        nickname: sellerNickname,
      },
      attributes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do produto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
