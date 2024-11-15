// Common subdomain list
const commonSubdomains = [
    'www', 'mail', 'ftp', 'admin', 'blog', 'dev', 'test', 'staging',
    'api', 'shop', 'store', 'app', 'mobile', 'secure', 'vpn', 'cdn',
    'cloud', 'portal', 'webmail', 'remote', 'support', 'docs', 'git',
    'm', 'beta', 'alpha', 'demo', 'db', 'server', 'ns1', 'ns2'
];

let subdomainResults = [];

window.findSubdomains = async function() {
    const domain = document.getElementById('domainInput').value.trim();
    if (!domain) {
        alert('Please enter a domain');
        return;
    }

    // Clear previous results
    subdomainResults = [];
    document.getElementById('subdomainTableBody').innerHTML = '';
    document.querySelector('.download-btn').style.display = 'none';

    for (const subdomain of commonSubdomains) {
        const fullDomain = `${subdomain}.${domain}`;
        try {
            const result = await checkSubdomain(fullDomain);
            if (result) {
                subdomainResults.push(result);
                addTableRow(result);
            }
        } catch (error) {
            console.error(`Error checking ${fullDomain}:`, error);
        }
    }

    if (subdomainResults.length > 0) {
        document.querySelector('.download-btn').style.display = 'block';
    }
};

async function checkSubdomain(domain) {
    try {
        const response = await fetch(`https://${domain}`, { mode: 'no-cors' });
        return {
            subdomain: domain,
            ip: 'N/A', // Due to browser limitations, we can't get IP directly
            status: 'Active'
        };
    } catch (error) {
        return null;
    }
}

function addTableRow(result) {
    const tbody = document.getElementById('subdomainTableBody');
    const row = tbody.insertRow();
    
    const subdomainCell = row.insertCell(0);
    const ipCell = row.insertCell(1);
    const statusCell = row.insertCell(2);

    subdomainCell.textContent = result.subdomain;
    ipCell.textContent = result.ip;
    statusCell.textContent = result.status;
}

window.downloadResults = function() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Subdomain,IP Address,Status\n"
        + subdomainResults.map(row => {
            return `${row.subdomain},${row.ip},${row.status}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subdomains.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};