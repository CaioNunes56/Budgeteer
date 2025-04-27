console.log("JavaScript is working!");

document.addEventListener('DOMContentLoaded', () => {
  const analyzeBudgetButton = document.getElementById('analyze');

  analyzeBudgetButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const budgetData = {};

    // Data collection from the html
    const housingAmount = document.getElementById('housing');
    const foodAmount = document.getElementById('groceries');
    const childCareAmount = document.getElementById('childcare');
    const leisureAmount = document.getElementById('diningOut');
    const savingsAmount = document.getElementById('savings');
    const healthcareAmount = document.getElementById('health');

    // Jimmy code
    // This should make 2 parallel arrays: one for the extra category names, and one for the extra category values
    // Since the name and value classes are created at the same time, they should always have an equal amount of indexes
    // Just in case, we'll run retrieval in a try catch.
    try {
      const extraAmountNames = document.getElementsByClassName('extraCategoryName');
      const extraAmounts = document.getElementsByClassName('extraCategoryValue');

      budgetData['extraCategoryNames'] = [];
      budgetData['extraAmounts'] = [];

      for (let i = 0; i < extraAmounts.length; i++) {
        const name = extraAmountNames[i].value;
        const amount = parseFloat(extraAmounts[i].value);

        budgetData['extraAmountNames'].push(name);
        budgetData['extraAmounts'].push(amount);
      }
    } catch (error) {
      console.error("error during retrieval of extra categories", error);
    }

    budgetData['housing'] = parseFloat(housingAmount.value);
    budgetData['groceries'] = parseFloat(foodAmount.value);
    budgetData['childcare'] = parseFloat(childCareAmount.value);
    budgetData['diningOut'] = parseFloat(leisureAmount.value);
    budgetData['savings'] = parseFloat(savingsAmount.value);
    budgetData['health'] = parseFloat(healthcareAmount.value);

    // Jimmy code for troubleshooting
    console.log(budgetData);

    // Joining of the Data to a predefined prompt
    let stringToSend = `I am currently using you as an API in my website. For everything I ask you to do from this point on, you willl not provide any comments, questions or steps in your calculations or thinking process: I simply want each answer separated by a header for each section, to make it easier for me to send each part to a different page in my website.
    I will be using you to provide advice concerning budget allocation decisions. Please write everything in plain text, without using markdown. There will be values sent with extra options names and their values, include those as well.
    Here is the logic I am using to parse the data:
    function parseAIOutputDynamic(output) {
    const lines = output.trim().split('\\n');
    const data = {};
    let currentCategory = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === 'Total Budget') {
        currentCategory = 'totalBudget';
        data[currentCategory] = lines[i + 1]?.trim();
        i++; // Skip the next line as it's the value
      } else if (line && line !== 'true' && line !== 'false' && line !== 'Total Budget') {
        // Assume this line is a category header
        currentCategory = line.toLowerCase().replace(' ', '');
        data[currentCategory] = {};

        // Check for "well managed" status on the next line
        const wellManagedStr = lines[i + 1]?.trim();
        if (wellManagedStr === 'true' || wellManagedStr === 'false') {
          data[currentCategory].wellManaged = wellManagedStr === 'true';
          i++; // Skip the "true"/"false" line
        }

        // Extract advice until the next category-like line or end
        const adviceLines = [];
        for (let j = i + 1; j < lines.length; j++) { 
          const nextLine = lines[j].trim();
          if (nextLine && nextLine !== 'true' && nextLine !== 'false' && nextLine !== 'Total Budget') {
            // Heuristic: If the line is not a boolean or "Total Budget", consider it advice
            adviceLines.push(nextLine);
          } else {
            break; // Stop if we encounter something that looks like a new category or status
          }
        }
        data[currentCategory].advice = adviceLines.join(' ');
        i += adviceLines.length; // Skip the advice lines
      }
    }
    return data;
    }
    Here are the questions:
    What is the total for all the values in this budget: ${JSON.stringify(budgetData)}?
    For each category, provide a bool value indicating if the user is managing his money well (true) or if it needs some improvement(false) (the value should be under the header)
    For each category where the bool is true, Explain why they are doing good and give any relevant advice. If the bool is false, suggest important changes the user should make.`;

    const apiURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=AIzaSyAUff-DpCq92IKN8AnVm0wdyKMycKwOauk'; 

    const dataSent = {
      "contents": [{ "parts": [{ "text": stringToSend}] }]
    };

    try {
      const answer = await fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataSent)
      });

      if (!answer.ok) {
        console.error(`HTTP error! status: ${answer.status}`);
        const errorData = await answer.json();
        console.error("Error details:", errorData);
        document.getElementById('AiText').textContent = "Error analyzing budget.";
        return;
      }

      const responseData = await answer.json();
      console.log(responseData);

      if (responseData && responseData.candidates && responseData.candidates.length > 0) {
        const generatedText = responseData.candidates[0].content.parts[0].text;
        document.getElementById('AiText').textContent = generatedText;
        console.log("Generated Text:", generatedText);

        const parsedDataDynamic = parseAIOutputDynamic(generatedText);
        console.log(parsedDataDynamic);

        // Update HTML elements here using parsedDataDynamic
        if (parsedDataDynamic.totalBudget) {
          document.getElementById('total-budget').textContent = `Total: ${parsedDataDynamic.totalBudget}`;
        }

        for (const category in parsedDataDynamic) {
          if (category !== 'totalBudget') {
            const managedElement = document.getElementById(`${category}-managed`);
            const adviceElement = document.getElementById(`${category}-advice`);

            if (managedElement) {
              managedElement.textContent = parsedDataDynamic[category].wellManaged ? 'Well Managed' : 'Needs Improvement';
            }
            if (adviceElement) {
              adviceElement.textContent = parsedDataDynamic[category].advice;
            }
          }
        }
      } else {
        console.error("Error: Could not retrieve generated text from response.");
        document.getElementById('AiText').textContent = "Error analyzing budget.";
      }

    } catch (error) {
      console.error("Fetch error:", error);
      document.getElementById('AiText').textContent = "Error analyzing budget.";
    }
  }); // Closing the 'click' event listener
}); // Closing the 'DOMContentLoaded' event listener

function parseAIOutputDynamic(output) {
  const lines = output.trim().split('\n');
  const data = {};
  let currentCategory = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === 'Total Budget') {
      currentCategory = 'totalBudget';
      data[currentCategory] = lines[i + 1]?.trim();
      i++; // Skip the next line as it's the value
    } else if (line && line !== 'true' && line !== 'false' && line !== 'Total Budget') {
      // Assume this line is a category header
      currentCategory = line.toLowerCase().replace(' ', '');
      data[currentCategory] = {};

      // Check for "well managed" status on the next line
      const wellManagedStr = lines[i + 1]?.trim();
      if (wellManagedStr === 'true' || wellManagedStr === 'false') {
        data[currentCategory].wellManaged = wellManagedStr === 'true';
        i++; // Skip the "true"/"false" line
      }

      // Extract advice until the next category-like line or end
      const adviceLines = [];
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && nextLine !== 'true' && nextLine !== 'false' && nextLine !== 'Total Budget') {
          // Heuristic: If the line is not a boolean or "Total Budget", consider it advice
          adviceLines.push(nextLine);
        } else {
          break; // Stop if we encounter something that looks like a new category or status
        }
      }
      data[currentCategory].advice = adviceLines.join(' ');
      i += adviceLines.length; // Skip the advice lines
    }
  }
  return data;
}
