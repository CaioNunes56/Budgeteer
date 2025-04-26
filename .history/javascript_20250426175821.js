console.log("✅ javascript.js has been loaded!");

let auth0Client = null;

async function configureClient() {
  auth0Client = await auth0.createAuth0Client({
    domain: "dev-mwel3gbeogijpxg8.us.auth0.com",
    clientId: "kXOjAmfXWIboql8iXLsO2X1sbjFD7mjT",
    authorizationParams: {
      redirect_uri: window.location.origin + window.location.pathname
    }
  });
  console.log("✅ Auth0 client created");
}

window.onload = async () => {
  console.log("🌐 window.onload fired");

  // 1) Initialize the Auth0 client
  await configureClient();

  // 2) Handle the redirect callback (if we just came back from Auth0)
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    console.log("🔄 Processing login callback");
    try {
      const result = await auth0Client.handleRedirectCallback();
      console.log("✅ Callback handled, appState:", result.appState);
    } catch (e) {
      console.error("❌ Error handling callback:", e);
    }
    // Clean up the URL so users don’t see code & state params
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 3) Check if user is authenticated
  const isAuthenticated = await auth0Client.isAuthenticated();
  console.log("🔑 isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    // 4) Not logged in → kick off the redirect to the Universal Login page
    console.log("➡️ Redirecting to Auth0 login");
    await auth0Client.loginWithRedirect();
  } else {
    console.log("🎉 User is authenticated — show your app now");
    // (You can now safely render protected UI)
  }
};

// (Optional) Call this when you want to log out:
async function logout() {
  console.log("🚪 Logging out");
  await auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin + "/"
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const analyzeBudgetButton = document.getElementById('analyze');

  analyzeBudgetButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      const budgetData = {};

      const housingAmount = document.getElementById('housing');
      const foodAmount = document.getElementById('groceries');
      const childCareAmount = document.getElementById('childcare');
      const leisureAmount = document.getElementById('diningOut');
      const savingsAmount = document.getElementById('savings');
      const healthcareAmount = document.getElementById('health');

      budgetData['housing'] = parseFloat(housingAmount.value);
      budgetData['groceries'] = parseFloat(foodAmount.value);
      budgetData['childcare'] = parseFloat(childCareAmount.value);
      budgetData['diningOut'] = parseFloat(leisureAmount.value);
      budgetData['savings'] = parseFloat(savingsAmount.value);
      budgetData['health'] = parseFloat(healthcareAmount.value);

      const stringToSend = `What is the total when all the values in this budget: ${JSON.stringify(budgetData)} are added up to each other?
      Give me two financial advices about this budget (How can I lower my expenses (Do that only for the highest value category), how can I better balance everything out)`;

      const apiKey = 'AIzaSyCNCdj6NO7svW8gOwnJgjlTsz9DK1ZSzm0';
      const apiURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
      const dataSent = {
          contents: [{ parts: [{ text: stringToSend}] }]
      };

      const answer = await fetch(apiURL, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(dataSent)
      });

      const responseData = await answer.json();
      console.log(responseData);
  })
})