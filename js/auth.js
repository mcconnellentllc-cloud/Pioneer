(function() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('key') && params.get('key').toLowerCase() === 'mcconnell') {
        localStorage.setItem('memberAuth', 'true');
        var who = params.get('who');
        var name = who ? decodeURIComponent(who) : 'Unknown';
        fetch('https://api.airtable.com/v0/app1NuXlsl0KMFbxW/' + encodeURIComponent('Logins'), {
            method: 'POST',
            headers: { 'Authorization': 'Bearer patHIt2PyWkCWV1cz.f237c55211f452d9778946cac976bea1752fb173ecff3c81225fb1b2a1288120', 'Content-Type': 'application/json' },
            body: JSON.stringify({ records: [{ fields: { 'Name': name, 'Method': 'magic link', 'Page': window.location.pathname.split('/').pop(), 'Timestamp': new Date().toISOString() } }] })
        }).catch(function() {});
        window.history.replaceState({}, '', window.location.pathname);
    }
    if (localStorage.getItem('memberAuth') !== 'true') {
        window.location.href = 'members.html';
    }
})();
