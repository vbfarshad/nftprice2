const pricesDiv = document.getElementById("prices");
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8'; // Your API key from Reservoir

const collectionContracts = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example collection 1
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',   // Another collection contract
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',
    '0xB852c6b5892256C264Cc2C888eA462189154D8d7',
];

collectionContracts.forEach(collectionContract => {
    fetch(`https://api.reservoir.tools/collections/v5?id=${collectionContract}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.collections && data.collections.length > 0) {
            const collection = data.collections[0];
            const collectionName = collection.name;
            const collectionIcon = collection.image;

            const collectionDiv = document.createElement('div');
            collectionDiv.classList.add('collection');

            const collectionHeader = `
                <div class="collection-header">
                    <img src="${collectionIcon}" alt="${collectionName}" width="50" height="50">
                    <h2>${collectionName}</h2>
                </div>`;
            collectionDiv.innerHTML = collectionHeader;

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Price (ETH)</th>
                        <th>Marketplace</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            collectionDiv.appendChild(table);
            pricesDiv.appendChild(collectionDiv);

            fetch(`https://api.reservoir.tools/tokens/v5?collection=${collectionContract}`, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
                const tbody = table.querySelector('tbody');

                if (data.tokens) {
                    data.tokens.forEach(token => {
                        const price = token.market.floorAsk.price.amount.native || "Not for sale";
                        const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                        const tokenId = token.token.tokenId;

                        // Icons for OpenSea and Blur
                        const openseaIcon = '<img src="https://opensea.io/static/images/logos/opensea-logo.svg" alt="OpenSea" width="20" height="20">';
                        const blurIcon = '<img src="https://imgs.blur.io/_assets/homepage/logo.png" alt="Blur" width="20" height="20">';

                        const row = `
                            <tr>
                                <td>
                                    <img src="${token.token.image}" alt="${title}" width="50" height="50">
                                    ${title}
                                </td>
                                <td>${price} ETH</td>
                                <td>
                                    <a href="https://opensea.io/assets/${collectionContract}/${tokenId}" target="_blank">${openseaIcon}</a> |
                                    <a href="https://blur.io/eth/asset/${collectionContract}/${tokenId}" target="_blank">${blurIcon}</a>
                                </td>
                            </tr>`;
                        tbody.innerHTML += row;
                    });
                } else {
                    tbody.innerHTML = "<tr><td colspan='3'>No tokens found for this collection.</td></tr>";
                }
            })
            .catch(error => {
                console.error('Error fetching token data:', error);
                const tbody = table.querySelector('tbody');
                tbody.innerHTML = "<tr><td colspan='3'>Failed to load prices.</td></tr>";
            });
        } else {
            pricesDiv.innerHTML += `<p>No data for contract: ${collectionContract}</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching collection data:', error);
        pricesDiv.innerHTML += `<p>Error fetching collection data for contract: ${collectionContract}</p>`;
    });
});
