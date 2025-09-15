import axios from 'axios';
const SUPERFRETE_API_URL = 'https://api.superfrete.com';
const SUPERFRETE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTc5MTMzNDksInN1YiI6IlJLa2xFUkVkT0xoSkVEdmprTTZLd2J3SG1OdTIifQ.ZiWd8MxCijXuttYtTWm7XKyP24EO18fibP9mo0vnmos';
export const calculateShipping = async (req, res) => {
    const { cepDestino, items } = req.body;
    try {
        const response = await axios.post(`${SUPERFRETE_API_URL}/api/v1/calculator`, {
            from: { postal_code: '60850705' }, // CEP de origem (loja)
            to: { postal_code: cepDestino },
            services: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17', // Todos os serviços
            options: {
                insurance_value: items.reduce((total, item) => total + item.price * item.quantity, 0),
                receipt: false,
                own_hand: false,
            },
            items: items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                sku: item.sku,
                description: item.name,
                 weight: 0.5, // Peso em kg - ajuste conforme necessário
                 width: 27,  // Largura em cm - ajuste conforme necessário
                 height: 25, // Altura em cm - ajuste conforme necessário
                 length: 30, // Comprimento em cm - ajuste conforme necessário
                 insurance_value: item.price,
            })),
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPERFRETE_TOKEN}`,
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Erro ao calcular frete:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Não foi possível calcular o frete. Verifique o CEP e tente novamente.' });
    }
};
//# sourceMappingURL=shippingController.js.map