// Markets Data Display
// This can be connected to a real-time API in the future

(function() {
    // Sample market data - replace with API calls for live data
    const marketData = {
        corn: { price: 4.42, change: -0.03 },
        wheat: { price: 5.48, change: +0.05 },
        milo: { price: 4.15, change: -0.02 },
        millet: { price: 12.50, change: +0.25 },
        'cattle-live': { price: 192.50, change: +1.25 },
        'cattle-feeder': { price: 262.75, change: +2.50 }
    };

    function formatPrice(price) {
        return '$' + price.toFixed(2);
    }

    function formatChange(change) {
        const sign = change >= 0 ? '+' : '';
        return sign + change.toFixed(2);
    }

    function updateMarkets() {
        for (const [commodity, data] of Object.entries(marketData)) {
            const priceEl = document.getElementById(commodity + '-price');
            const changeEl = document.getElementById(commodity + '-change');

            if (priceEl) {
                priceEl.textContent = formatPrice(data.price);
            }

            if (changeEl) {
                changeEl.textContent = formatChange(data.change);
                changeEl.classList.remove('up', 'down');
                changeEl.classList.add(data.change >= 0 ? 'up' : 'down');
            }
        }
    }

    // Update on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMarkets);
    } else {
        updateMarkets();
    }
})();
