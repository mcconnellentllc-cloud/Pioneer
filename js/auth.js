(function() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('key') && params.get('key').toLowerCase() === 'mcconnell') {
        localStorage.setItem('memberAuth', 'true');
    }
    if (localStorage.getItem('memberAuth') !== 'true') {
        window.location.href = 'members.html';
    }
})();
