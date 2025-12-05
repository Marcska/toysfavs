// Google Sheet CSV URL (Replace this with your published CSV link)
// Instructions:
// 1. Open your Google Sheet
// 2. File > Share > Publish to web
// 3. Select 'Entire Document' and 'Comma-separated values (.csv)'
// 4. Click Publish and copy the link below
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQEHbccxMsJgEzCGaazwf--YSAnM3jQgHBGBS3ojpIkkICH6ffP88CPjkZW7GZxbpbeFABSoqcWdUHx/pub?gid=355954433&single=true&output=csv";
// Note: using a placeholder or demo URL until user provides one. 
// I will start with an empty array or a fallback to ensure the site loads if URL is invalid.

let products = [];

async function fetchProducts() {
    return new Promise(async (resolve, reject) => {
        if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL === "YOUR_CSV_URL_HERE") {
            console.warn("No Google Sheet URL provided. Using fallback empty products.");
            resolve([]);
            return;
        }

        let csvData = null;

        try {
            // Try 1: Direct Fetch
            console.log("Attempting direct fetch...");
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) throw new Error(`Direct fetch failed: ${response.status}`);
            csvData = await response.text();
            console.log("Direct fetch successful!");
        } catch (directError) {
            console.warn("Direct fetch failed, trying CORS proxy...", directError);

            try {
                // Try 2: CORS Proxy (allorigins.win)
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(GOOGLE_SHEET_CSV_URL)}`;
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
                csvData = await response.text();
                console.log("Proxy fetch successful!");
            } catch (proxyError) {
                console.error("All fetch attempts failed.");
                reject(proxyError);
                return;
            }
        }

        // Parse the CSV data
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                try {
                    // Transform CSV data to match our product structure/types
                    products = results.data.map(item => ({
                        id: parseInt(item.id) || Date.now(),
                        name: item.name,
                        price: parseFloat(item.price) || 0,
                        oldPrice: item.oldPrice ? parseFloat(item.oldPrice) : null,
                        category: item.category,
                        badge: item.badge === "null" || item.badge === "" ? null : item.badge,
                        badgeClass: item.badgeClass,
                        icon: item.icon,
                        rating: parseFloat(item.rating) || 5.0,
                        description: item.description,
                        image: item.image
                    }));
                    console.log("Products parsed:", products);
                    resolve(products);
                } catch (error) {
                    console.error("Error processing products:", error);
                    reject(error);
                }
            },
            error: function (error) {
                console.error("Error parsing CSV:", error);
                reject(error);
            }
        });
    });
}