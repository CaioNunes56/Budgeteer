let auth0Client = null;

// Configure the Auth0 client
async function configureClient() {
    auth0Client = await createAuth0Client({
        domain: "dev-mwel3gbeogijpxg8.us.auth0.com",        // Replace this
        clientId: "kXOjAmfXWIboql8iXLsO2X1sbjFD7mjT",    // Replace this
        authorizationParams: {
            redirect_uri: "https://caionunes56.github.io/Budgeteer/"
        }
    });
}

// Handle page loading
window.onload = async () => {
    await configureClient();

    // Handle redirect back from Auth0
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        await auth0Client.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/Budgeteer/");  // Clean the URL
    }

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (!isAuthenticated) {
        // If not logged in, redirect to login
        await auth0Client.loginWithRedirect();
    } else {
        console.log("User is authenticated!");
        // You can now continue showing the webpage
    }
};

// (Optional) Logout function if you want a logout button later
async function logout() {
    await auth0Client.logout({
        logoutParams: {
            returnTo: "https://caionunes56.github.io/Budgeteer/"
        }
    });
}