console.log("JavaScript is working!");

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBudgetButton = document.getElementById('analyze');

  analyzeBudgetButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const budgetData = {};

    //Data collection from the html
    const housingAmount = document.getElementById('housing');
    const foodAmount = document.getElementById('groceries');
    const childCareAmount = document.getElementById('childcare');
    const leisureAmount = document.getElementById('diningOut');
    const savingsAmount = document.getElementById('savings');
    const healthcareAmount = document.getElementById('health');

    //jimmy code
    //This should make 2 parallel arrays: one for the extra category names, and one for the extra category values 
    //Since the name and value classes are created at the same time, they should always have an equal amount of indexes
    //Just in case, we'll run retrieval in a try catch.
    try{
        const extraAmountNames = document.getElementsByClassName('extraCategoryName');
        const extraAmounts = document.getElementsByClassName('extraCategoryValue');

        budgetData['extraAmountNames'] = [];
        budgetData['extraAmounts'] = [];

        for (let i = 0; i< extraAmounts.length; i++){
            const name = extraAmountNames[i].value;
            const amount = parseFloat(extraAmounts[i].value);

            budgetData['extraAmountNames'].push(name);
            budgetData['extraAmounts'].push(amount);
        }

    }
    catch (error){
        console.error("error during retrieval of extra categories", error)
    }


    budgetData['housing'] = parseFloat(housingAmount.value);
    budgetData['groceries'] = parseFloat(foodAmount.value);
    budgetData['childcare'] = parseFloat(childCareAmount.value);
    budgetData['diningOut'] = parseFloat(leisureAmount.value);
    budgetData['savings'] = parseFloat(savingsAmount.value);
    budgetData['health'] = parseFloat(healthcareAmount.value);
    
    //jimmy code
    console.log(budgetData);

    //Joining of the Data to a predefined prompt
    let stringToSend = `What is the total when all the values in this budget: ${JSON.stringify(budgetData)} are added up to each other?
        Give me two financial advices about this budget (How can I lower my expenses (Do that only for the highest value category), how can I better balance everything out)`;

    const apiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=AIzaSyD48msYI5xDeKxlPKSrwBMtpkaRIZH77IM';

    const dataSent = {
      "contents": [{ "parts": [{ "text": stringToSend}] }]
    };

    const listModelsURL = 'https://generativelanguage.googleapis.com/v1/models?key=AIzaSyD48msYI5xDeKxlPKSrwBMtpkaRIZH77IM';

    const jsonstring = JSON.stringify(dataSent);

    const answer = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataSent)
    });

    const responseData = await answer.json();
    console.log(responseData);

    if (responseData && responseData.candidates && responseData.candidates.length > 0) {
      const generatedText = responseData.candidates[0].content.parts[0].text;
      document.getElementById('AiText').textContent = generatedText;
      console.log("Generated Text:", generatedText);
    } else {
      console.error("Error: Could not retrieve generated text.");
      document.getElementById('AiText').textContent = "Error: Could not retrieve generated text.";
    }
  }); 
});
