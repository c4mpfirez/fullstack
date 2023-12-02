import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(Array(anecdotes.length).fill(0))
  const mostVotes = vote.indexOf(Math.max(...vote))


  const Next = () => {
    console.log('Next anecdote')
    const randomIndex = Math.floor(Math.random()*anecdotes.length)
    setSelected(randomIndex)
  }
  
  const handleVote = () => {
    console.log('Vote received')
    const copy = [...vote]
    copy[selected] += 1
    setVote(copy)
  }
  
  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {vote[selected]} votes</div>
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={Next} text="next anecdote" />
      <h2>Anecdote with most votes</h2>
      {mostVotes !== -1 && (
        <div>
          <div>{anecdotes[mostVotes]}</div>
          <div>has {vote[mostVotes]} votes</div>
        </div>
      )}
    </div>
  )
}

export default App

