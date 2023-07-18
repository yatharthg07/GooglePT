// // JavaScript code for making the OpenAI API request and displaying the card
// async function fetchChatGPTResponse(query) {
//     const response = await fetch('https://api.openai.com/v1/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer YOUR SECRET API KEY'
//       },
//       body: JSON.stringify({
//         "model": "text-davinci-003",
//         "prompt": query,
//         "max_tokens": 100,
//         "temperature": 0,
//       })
//     });
  
//     if (!response.ok) {
//       // Handle the error response
//       console.error('Error:', response.status);
//       return;
//     }
  
//     try {
//       const data = await response.json();
  
//       if (!data.choices || data.choices.length === 0) {
//         // Handle the empty or missing choices
//         console.error('No choices found in the response');
//         return;
//       }
  
//       const completion = data.choices[0].text.trim();

//       // Create a container div for the card
//       const cardContainer = document.createElement('div');
//       cardContainer.id = 'my-card';
  
//       // Create the heading element
//       const heading = document.createElement('h2');
//       heading.textContent = 'GooglePT';
  
//       // Create the icon element
//       const icon = document.createElement('div');
//       icon.classList.add('icon');
  
//       // Add the heading and icon to the card container
//       cardContainer.appendChild(icon);
//       cardContainer.appendChild(heading);
  
  
//       // Find the element that contains the search results
//       const searchResultsElement = document.getElementById('rcnt');
  
//       // Insert the card above the search results
//       searchResultsElement.parentNode.insertBefore(cardContainer, searchResultsElement);
  
//       // Set the completion text in the card


//       const formattedCompletion = formatCompletionText(completion);
//       const completionText = document.createElement('div');
//       completionText.className = 'formatted-text'; // Add the class name to the completion text container
//       completionText.innerHTML = formattedCompletion;
//       cardContainer.appendChild(completionText);

//     } catch (error) {
//       // Handle JSON parsing errors
//       console.error('Error parsing JSON:', error);
//     }
//   }
  

// JavaScript code for making the OpenAI API request and displaying the card
async function fetchChatGPTResponse(query) {
  // Create a container div for the card
  const cardContainer = document.createElement('div');
  cardContainer.id = 'my-card';

  // Create the heading element
  const heading = document.createElement('h2');
  heading.textContent = 'GooglePT';

  // Create the icon element
  const icon = document.createElement('div');
  icon.classList.add('icon');

  // Add the heading and icon to the card container
  cardContainer.appendChild(icon);
  cardContainer.appendChild(heading);

  // Create the loading text element
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.textContent = '';

  // Add the loading text to the card
  cardContainer.appendChild(loadingText);

  // Find the element that contains the search results
  const searchResultsElement = document.getElementById('rcnt');

  // Insert the card above the search results
  searchResultsElement.parentNode.insertBefore(cardContainer, searchResultsElement);

  // Fetch the ChatGPT response from the OpenAI API
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SECRET_API_KEY'
    },
    body: JSON.stringify({
      "model": "text-davinci-003",
      "prompt": query,
      "max_tokens": 100,
      "temperature": 0,
    })
  });

  if (!response.ok) {
    // Handle the error response
    console.error('Error:', response.status);
    // You can display an error message in the card if needed
    loadingText.textContent = 'Error fetching response';
    return;
  }

  try {
    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      // Handle the empty or missing choices
      console.error('No choices found in the response');
      // You can display an error message in the card if needed
      loadingText.textContent = 'No response found';
      return;
    }

    const completion = data.choices[0].text.trim();

    // Set the completion text in the card
    const formattedCompletion = formatCompletionText(completion);
    const completionText = document.createElement('div');
    completionText.className = 'formatted-text'; // Add the class name to the completion text container
    completionText.innerHTML = formattedCompletion;
    cardContainer.appendChild(completionText);

    // Remove the loading text
    loadingText.remove();
  } catch (error) {
    // Handle JSON parsing errors
    console.error('Error parsing JSON:', error);
    // Show an error message in the card if needed
    loadingText.textContent = 'Error parsing response';
  }
}
  // Retrieve the search query and fetch the ChatGPT response
  const searchInput = document.querySelector('input[name="q"]');
  if (searchInput) {
    const query = searchInput.value;
    fetchChatGPTResponse(query);
  }
  

// Function to format the completion text with HTML tags
function formatCompletionText(text) {
  // Split the completion text into paragraphs
  const paragraphs = text.split('\n\n');

  // Initialize variables to track ordered and unordered lists
  let orderedListItems = [];
  let unorderedListItems = [];
  let insideOrderedList = false;
  let insideUnorderedList = false;

  // Format each paragraph
  const formattedParagraphs = paragraphs.map(paragraph => {
    // Check if the paragraph starts with a number followed by a period (list item)
    if (/^\d+\.\s/.test(paragraph)) {
      // If it's a list item, treat it as an ordered list
      insideOrderedList = true;
      orderedListItems.push(paragraph.replace(/^\d+\.\s/, ''));
      return '';
    } else if (/^\s*-\s/.test(paragraph) || /^\s*•\s/.test(paragraph)) {
      // If it starts with a hyphen or bullet character, treat it as an unordered list
      insideUnorderedList = true;
      unorderedListItems.push(paragraph.replace(/^\s*-\s/, '').replace(/^\s*•\s/, ''));
      return '';
    } else {
      // Wrap the paragraph in <div> tags to retain CSS styles
      let formattedParagraph = paragraph;

      // Add the ordered list if there are any items
      if (insideOrderedList) {
        formattedParagraph = `<ol><li>${orderedListItems.join('</li><li>')}</li></ol>${formattedParagraph}`;
        orderedListItems = []; // Reset ordered list items for the next step
        insideOrderedList = false;
      }

      // Add the unordered list if there are any items
      if (insideUnorderedList) {
        formattedParagraph = `<ul><li>${unorderedListItems.join('</li><li>')}</li></ul>${formattedParagraph}`;
        unorderedListItems = []; // Reset unordered list items for the next bullet points
        insideUnorderedList = false;
      }

      return `<div>${formattedParagraph}</div>`;
    }
  });

  // Close any open ordered list and unordered list at the end
  if (insideOrderedList) {
    formattedParagraphs.push(`<ol><li>${orderedListItems.join('</li><li>')}</li></ol>`);
  }
  if (insideUnorderedList) {
    formattedParagraphs.push(`<ul><li>${unorderedListItems.join('</li><li>')}</li></ul>`);
  }

  // Join the paragraphs to create a formatted response
  return formattedParagraphs.join('');
}
