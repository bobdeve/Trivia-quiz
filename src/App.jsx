// App.js
import { useState, useEffect } from "react";
import axios from "axios";
import Questions from "../../Questions";

function App() {
  // State to manage quiz-related information
  const [newQuiz, setNewQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Effect to fetch trivia questions when a new quiz is initiated
  useEffect(() => {
    if (newQuiz) {
      fetchTriviaQuestions();
    }
  }, [newQuiz]);
  
  const filtereduserAnswer = userAnswers.filter(value => value !== undefined && value !== "");
  // Function to fetch trivia questions from the API
  const fetchTriviaQuestions = async () => {
    try {
      // Fetch trivia questions from the Open Trivia Database API
      const response = await axios.get("https://opentdb.com/api.php?amount=5");
      const { results } = response.data;

      // Update the state with the fetched trivia questions
      setFetchedData(results);
         
      // Reset user answers and correct answers count when fetching new questions
      setUserAnswers([]);
      setCorrectAnswersCount(0);
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
    }
  };
  console.log(filtereduserAnswer)
  // Function to handle checking user answers and calculating the score
  const handleCheckAnswer = () => {
    // Set showResults to true to display correct answers and prevent further changes
    setShowResults(true);

    // Calculate and log the correct answers count, the below example shows the reduce method in array
    // array.reduce((accumulator, currentValue, index, array) => {
    //   // Callback logic using accumulator, currentValue, index, and array
    // }, initialValue);
    
   const newCorrectAnswersCount = userAnswers.reduce ((count,currentValue,index) => {
    let correctAnswer= false;
     if (fetchedData[index]?.type === 'boolean') {
      correctAnswer = fetchedData[index]?.correct_answer.toLowerCase() === currentValue.toLowerCase()
     }
     else {
      correctAnswer = fetchedData[index]?.correct_answer === currentValue
     }
     return  correctAnswer? count + 1 : count
},0)

    // Log the new correct answers count
    // console.log("New Correct Answers Count:", newCorrectAnswersCount);

    // Update the correct answers count in the state
    setCorrectAnswersCount(newCorrectAnswersCount);
  };

  // Function to move to the next quiz
  const handleNextQuiz = () => {
    // Set newQuiz to true to trigger fetching new questions
    setNewQuiz(true);
    fetchTriviaQuestions();

    // Reset showResults to false to enable user interaction for the next quiz
    setShowResults(false);
  };

  // Function to start a new quiz
  const handleStartQuiz = () => {
    // Set newQuiz to true to trigger fetching new questions
    setNewQuiz(true);
  };

  // Function to update the selected answer in the userAnswers array
  const handleUpdateSelectedAnswer = (index, selectedAnswer) => {
    // Update userAnswers array with the selected answer for the current question
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = selectedAnswer;
      return newAnswers;
    });
  };

  // Render the UI
  return (
    <main>
      <div className="random-shape"></div>
      <div className="random-shape2"></div>
      {newQuiz &&
        fetchedData.map((data, index) => (
          <Questions
            key={index}
            question={data?.question}
            correct={data?.correct_answer}
            incorrect={data?.incorrect_answers}
            showResults={showResults}
            onAnswerSelected={(selectedAnswer) => handleUpdateSelectedAnswer(index, selectedAnswer)
            }
          />
        ))}
      {newQuiz && (
        <button
          className="check-answer-button"
          onClick={showResults ? handleNextQuiz : handleCheckAnswer}
          disabled= {filtereduserAnswer.length ===  fetchedData.length ? false : true}
        >
          {showResults ? "Next Quiz" : "Check Answer"}
        </button>
      )}
      {!newQuiz && (
        <div className="intro-page">
          <h1>Quizzical</h1>
          <p>Test your knowledge by answering random question all around the world</p>
          <button className="start-quiz-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      )}

      {showResults && correctAnswersCount !== null && (
        <div className="score-container">
          <p>{`You scored ${correctAnswersCount}/${fetchedData.length} correct answers`}</p>
        </div>
      )}
    </main>
  );
}

export default App;
