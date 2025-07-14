// Mock data and game logic for frontend-only development

const generateUniqueNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 10);
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

const generateSecretCode = (uniqueNumbers) => {
  // Shuffle the unique numbers to create a random 5-digit code
  const shuffled = [...uniqueNumbers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.join('');
};

const checkGuess = (secretCode, guess) => {
  const secretDigits = secretCode.split('');
  const guessDigits = guess.split('');
  
  // Find digits that are in the secret code
  const correctDigits = guessDigits.filter(digit => secretDigits.includes(digit));
  
  // Find digits that are in the correct position
  let correctPositions = 0;
  const correctPositionDetails = [];
  
  for (let i = 0; i < 5; i++) {
    if (secretDigits[i] === guessDigits[i]) {
      correctPositions++;
      correctPositionDetails.push(`${guessDigits[i]} at position ${i + 1}`);
    }
  }
  
  return {
    correctDigits: [...new Set(correctDigits)], // Remove duplicates
    correctPositions,
    correctPositionDetails
  };
};

export const mockGameData = {
  generateGame: () => {
    const uniqueNumbers = generateUniqueNumbers();
    const secretCode = generateSecretCode(uniqueNumbers);
    
    return {
      id: Date.now(),
      uniqueNumbers,
      secretCode,
      maxAttempts: 6,
      createdAt: new Date()
    };
  },
  
  checkGuess,
  
  // Example game for testing
  exampleGame: {
    uniqueNumbers: [1, 3, 5, 7, 9],
    secretCode: "35197",
    maxAttempts: 6
  },
  
  // Example feedback for testing
  exampleFeedback: {
    guess: "15342",
    correctDigits: [1, 3, 5],
    correctPositions: 1,
    correctPositionDetails: ["5 at position 3"]
  }
};