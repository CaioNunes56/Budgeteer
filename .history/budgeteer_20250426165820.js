document.addEventListener('DOMContentLoaded', () => {
    const analyzeBudgetButton = document.getElementById('analyze');

    analyzeBudgetButton.addEventListener('click', async () => {
        const budgetData = {};

        // Need to change for the actual values/names.
        const housingAmount = document.getElementById('housing');
        const foodAmount = document.getElementById('groceries');
        const childCareAmount = document.getElementById('childcare');
        const leisureAmount = document.getElementById('diningOut');
        const savingsAmount = document.getElementById('savings');
        const healthcareAmount = document.getElementById('health');

        budgetData['housing'] = parseFloat(foodAmount.value);
        budgetData['groceries'] = parseFloat(housingAmount.value);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSent)
        })
    })
})