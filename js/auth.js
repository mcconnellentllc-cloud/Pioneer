// Simple member access check
// Include this script on any page you want to protect

(function() {
    // Check if user has member access
    if (localStorage.getItem('memberAuth') !== 'true') {
        // Not logged in - redirect to members page
        window.location.href = 'members.html';
    }
})();
