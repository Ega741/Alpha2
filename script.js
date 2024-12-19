// Fetching Crypto Data for Ticker
async function fetchCryptoTicker() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
    const data = await response.json();
    const ticker = document.getElementById('ticker');

    ticker.innerHTML = data.map(coin => {
        const color = coin.price_change_percentage_24h > 0 ? '#00ff41' : '#ff0000';
        return `
            <span>
                ${coin.symbol.toUpperCase()}: $${coin.current_price.toFixed(2)} 
                <span style="color: ${color}">
                    (${coin.price_change_percentage_24h.toFixed(2)}%)
                </span>
            </span>
        `;
    }).join(' • ');
}

// Rendering Solana Chart
async function renderSolanaChart() {
    const ctx = document.getElementById('solanaChart').getContext('2d');
    const response = await fetch('https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=1');
    const data = await response.json();

    const prices = data.prices.map(price => price[1]);
    const labels = data.prices.map(price => new Date(price[0]).toLocaleTimeString());

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Solana (SOL) Price (USD)',
                data: prices,
                borderColor: '#00ff41',
                borderWidth: 2,
                backgroundColor: 'rgba(0, 255, 65, 0.2)',
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { color: '#00ff41' },
                },
                y: {
                    ticks: { color: '#00ff41' },
                },
            },
        },
    });
}

// ChatGPT Integration with Crypto Focus
async function handleChatGPTMessage(message) {
    const apiKey = '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'; // Replace with your API key
    const systemMessage = `
        You are a cryptocurrency expert assistant named Alpha Assistant. 
        Provide clear and accurate answers related to cryptocurrency, trading strategies, market trends, and blockchain technology. 
        Avoid answering questions unrelated to crypto topics.
    `;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Chatbot Logic
document.getElementById('chatbot-send').addEventListener('click', async () => {
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    const userMessage = input.value.trim();
    if (!userMessage) return;

    messages.innerHTML += `<div>User: ${userMessage}</div>`;
    input.value = '';

    const botResponse = await handleChatGPTMessage(userMessage);
    messages.innerHTML += `<div>Alpha Assistant: ${botResponse}</div>`;

    messages.scrollTop = messages.scrollHeight;
});

// Initialize
fetchCryptoTicker();
renderSolanaChart();

// Refresh Ticker Every 60 Seconds
setInterval(fetchCryptoTicker, 60000);
