console.log("JavaScript is working!");

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

        let stringToSend = `What is the total when all the values in this budget: ${JSON.stringify(budgetData)} are added up to each other?
        Give me two financial advices about this budget (How can I lower my expenses (Do that only for the highest value category), how can I better balance everything out)`;


        stringToSend = "What is the hostory of the world";
        const apiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyD48msYI5xDeKxlPKSrwBMtpkaRIZH77IM';
        const dataSent = {
            "contents": [{ "parts": [{ "text": stringToSend}] }]
        };

        const jsonstring = JSON.stringify(dataSent)

        const answer = await fetch(apiURL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            
            body: jsonstring
        });

        const responseData = await answer.json();
        console.log(responseData);
    })
})
