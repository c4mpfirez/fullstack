import React, { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const percentage = all === 0 ? 0 : (good / all) * 100
  //console.log('used the statistics')

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${percentage} %`} />
      </tbody>
    </table>
  )
}

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Button = ({ handleClick, text }) => {
  //console.log('used the button')
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    console.log('good')
    setGood(good + 1)
  }

  const handleNeutral = () => {
    console.log('neutral')
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    console.log('bad')
    setBad(bad + 1)
  }

  const all = good + neutral + bad // for the feedback

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <h1>statistics</h1>
      {all === 0 ? (
        <div>No feedback given</div>
      ) : (
        <>
          <Statistics good={good} neutral={neutral} bad={bad} />
        </>
      )}
    </div>
  )
}

export default App

