document.addEventListener('DOMContentLoaded', () => {
    const analyseBudgetButton = document.getElementById('???');

    analyseBudgetButton.addEventListener('click', async () => {
        const budgetData = {};

        // Need to change for the actual values/names.
        const housingAmount = document.getElementById('housing');
        const foodAmount = document.getElementById('groceries');
        const childCareAmount = document.getElementById('childcare');
        const leisureAmount = document.getElementById('diningOut');
        const savingsAmount = document.getElementById('savings');

        budgetData['???'] = parseFloat(foodAmount.value)
        budgetData['???'] = parseFloat(housingAmount.value)
        budgetData['???'] = parseFloat(childCareAmount.value)
        budgetData['???'] = parseFloat(leisureAmount.value)

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