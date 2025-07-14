import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockGameData } from '../utils/mock';
import { AlertCircle, Lock, RotateCcw, Trash2 } from 'lucide-react';

const LockPickingGame = () => {
  const [gameState, setGameState] = useState(null);
  const [currentInput, setCurrentInput] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [animateCode, setAnimateCode] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGame = mockGameData.generateGame();
    setGameState(newGame);
    setCurrentInput('');
    setAttempts([]);
    setGameStatus('playing');
    setAnimateCode(true);
    setTimeout(() => setAnimateCode(false), 1000);
  };

  const handleDigitClick = (digit) => {
    if (currentInput.length < 5 && gameStatus === 'playing') {
      setCurrentInput(prev => prev + digit);
    }
  };

  const handleClear = () => {
    setCurrentInput('');
  };

  const handleSubmit = () => {
    if (currentInput.length === 5 && gameStatus === 'playing') {
      const feedback = mockGameData.checkGuess(gameState.secretCode, currentInput);
      const newAttempt = {
        guess: currentInput,
        feedback: feedback,
        attemptNumber: attempts.length + 1
      };
      
      const newAttempts = [...attempts, newAttempt];
      setAttempts(newAttempts);
      setCurrentInput('');

      // Check win condition
      if (feedback.correctPositions === 5) {
        setGameStatus('won');
      } else if (newAttempts.length >= 6) {
        setGameStatus('lost');
      }
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const renderDigitPad = () => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    return (
      <div className="grid grid-cols-5 gap-3 mb-6">
        {digits.map((digit) => (
          <Button
            key={digit}
            variant="outline"
            size="lg"
            onClick={() => handleDigitClick(digit)}
            disabled={gameStatus !== 'playing'}
            className="h-16 text-xl font-bold hover:scale-105 transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 border-2 hover:border-blue-300 shadow-lg"
          >
            {digit}
          </Button>
        ))}
      </div>
    );
  };

  const renderControlButtons = () => (
    <div className="flex gap-3 mb-6">
      <Button
        variant="destructive"
        size="lg"
        onClick={handleClear}
        disabled={gameStatus !== 'playing' || currentInput.length === 0}
        className="flex-1 h-14 text-lg font-semibold hover:scale-105 transition-all duration-200"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Clear
      </Button>
      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={gameStatus !== 'playing' || currentInput.length !== 5}
        className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-200"
      >
        Submit
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleReset}
        className="flex-1 h-14 text-lg font-semibold hover:scale-105 transition-all duration-200"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Reset
      </Button>
    </div>
  );

  const renderCurrentInput = () => (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-3">Current Input</p>
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                  index < currentInput.length
                    ? 'bg-blue-500 text-white border-blue-600 scale-110'
                    : 'bg-white border-gray-300'
                }`}
              >
                {currentInput[index] || ''}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAttempts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <AlertCircle className="w-6 h-6 mr-2 text-amber-600" />
          Attempts ({attempts.length}/6)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No attempts yet. Start guessing!</p>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => (
              <div
                key={attempt.attemptNumber}
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">Attempt {attempt.attemptNumber}: {attempt.guess}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Digits in code: </span>
                    {attempt.feedback.correctDigits.length > 0 ? (
                      <span className="text-green-600 font-bold">
                        {attempt.feedback.correctDigits.join(', ')}
                      </span>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Correct positions: </span>
                    <Badge variant="secondary" className="ml-1">
                      {attempt.feedback.correctPositions} out of 5
                    </Badge>
                  </p>
                  {attempt.feedback.correctPositionDetails.length > 0 && (
                    <p className="text-sm">
                      <span className="font-semibold">Correctly positioned: </span>
                      <span className="text-blue-600 font-bold">
                        {attempt.feedback.correctPositionDetails.join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGameStatus = () => {
    if (gameStatus === 'won') {
      return (
        <Card className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-lg text-green-600">You cracked the code!</p>
              <p className="text-sm text-gray-600 mt-2">
                The secret code was: <span className="font-bold">{gameState?.secretCode}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (gameStatus === 'lost') {
      return (
        <Card className="mb-6 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-700 mb-2">💥 You Lose! 💥</h2>
              <p className="text-lg text-red-600">Better luck next time!</p>
              <p className="text-sm text-gray-600 mt-2">
                The secret code was: <span className="font-bold">{gameState?.secretCode}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  if (!gameState) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className={`text-4xl font-bold flex items-center justify-center transition-all duration-1000 ${animateCode ? 'scale-110' : ''}`}>
            <Lock className="w-10 h-10 mr-3" />
            Lock Picking Game
          </CardTitle>
          <p className="text-indigo-100 text-lg mt-2">
            Crack the 5-digit security code! You have 6 attempts.
          </p>
        </CardHeader>
      </Card>

      {renderGameStatus()}
      {renderCurrentInput()}
      {renderDigitPad()}
      {renderControlButtons()}
      {renderAttempts()}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-800">Debug Info (Development Only)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Secret Code: <span className="font-bold">{gameState.secretCode}</span>
            </p>
            <p className="text-sm text-yellow-700">
              Unique Numbers: <span className="font-bold">{gameState.uniqueNumbers.join(', ')}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LockPickingGame;