import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";
import { motion } from "motion/react";
import { questions } from "../../assets/questions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Quiz = () => {
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(questions[index]);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  let[correct,setCorrect] = useState(false);
  
  const key = "highScore";

// Call this whenever score changes or at the end of the quiz
const saveHighScore = (score) => {
  const prevHigh = parseInt(localStorage.getItem(key)) || 0;
  if (score > prevHigh) {
    localStorage.setItem(key, score);
  }
};
  

  let option1 = useRef(null);
  let option2 = useRef(null);
  let option3 = useRef(null);
  let option4 = useRef(null);
  let nextbtn = useRef(null);
  let submitbtn = useRef(null);

  let option_arr = [option1, option2, option3, option4];

  // Timer logic
  useEffect(() => {
    
    setTimeLeft(30); // reset timer on question change
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          next(); // move to next question automatically
          return 30; // reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup interval on unmount or question change
  }, [index]);

  const checkAns = (el, ans) => {
    if (lock === false) {
      if (question.ans === ans) {
        el.target.classList.add("right");
        setCorrect(true);
        setScore(score + 1);
      } else {
        setCorrect(false);
        el.target.classList.add("wrong");
        option_arr[question.ans - 1].current.classList.add("right");
      }
      setLock(true);
    }
  };

  const next = (el) => {
    if(index == questions.length-1)
    {
        el.target.style.display = "none";
        submitbtn.current.style.display ="block";
        saveHighScore(score);
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
      setQuestion(questions[index + 1]);
      setLock(false);
      option_arr.forEach((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("right");
      });
    }
  };
   const restart = () => {
         
         setIndex(0);
         setScore(0);
          nextbtn.current.style.display ="block";
         option_arr.forEach((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("right");
      });
   }
  

  return (
   <motion.div
  className="container mx-auto max-w-xl bg-white p-8 rounded-2xl shadow-2xl font-['UrbanistBold']"
  initial={{ opacity: 0, y: 50, scale: 0.8 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  exit={{ opacity: 0, y: -30, scale: 0.9 }}
>
  {/* Header */}
  <motion.h1
    className="text-4xl font-bold text-center mb-4 text-blue-600"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ x: 10 }}
  >
    Quiz App
  </motion.h1>
  <hr className="mb-6 border-blue-300" />

  {/* Question */}
  <h2 className="text-lg sm:text-xl mb-4 font-medium text-gray-800">
    {index + 1}. {question.question}
  </h2>

  {/* Timer */}
  <div className="mb-4 text-right font-semibold text-blue-500">
    Time Left: <span className="text-lg">{timeLeft}s</span>
  </div>

  {/* Options */}
  <ul className="flex flex-col gap-3 mb-6">
    {[option1, option2, option3, option4].map((ref, i) => (
      <motion.li
        key={i}
        ref={ref}
        onClick={(e) => checkAns(e, i + 1)}
        className="cursor-pointer p-3 border rounded-lg border-gray-300 hover:bg-blue-50 transition-colors duration-200 text-gray-700"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
      >
        {question[`option${i + 1}`]}
      </motion.li>
    ))}
  </ul>

  {/* Buttons */}
<div className="flex justify-between gap-4 mb-6">
  {index < questions.length - 1 ? (
    <button
      ref={nextbtn}
      onClick={next}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
    >
      Next <FontAwesomeIcon icon={faArrowRight} />
    </button>
  ) : (
    <button
      ref={submitbtn}
      onClick={() => alert(`Quiz submitted! Your score: ${score}`)}
      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
    >
      Submit <FontAwesomeIcon icon={faArrowRight} />
    </button>
  )}

  <button
    onClick={restart}
    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
  >
    Restart
  </button>
</div>


  {/* Stats Panel */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-4 bg-gray-50 rounded-xl shadow">
    <div className="text-center sm:text-left">
      <p className="text-sm font-medium text-gray-500">Question</p>
      <p className="text-lg font-bold text-gray-800">{index + 1} / {questions.length}</p>
    </div>

    <div className="text-center">
      <p className="text-sm font-medium text-gray-500">Score</p>
      <p className="text-lg font-bold text-gray-800">{score} / {questions.length}</p>
    </div>

    <div className="text-center sm:text-right">
      <p className="text-sm font-medium text-gray-500">High Score</p>
      <p className="text-lg font-bold text-gray-800">{localStorage.getItem(key) || 0}</p>
    </div>
  </div>
</motion.div>

  );
};

export default Quiz;
