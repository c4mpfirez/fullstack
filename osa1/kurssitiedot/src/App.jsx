const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
      const Header = () => { 
        return (
          <div>
            <h1>{course.name}</h1>
          </div>
        )
      }

      const Content = ({ parts }) => {
        const Part = (props) => {
          console.log(props)
          return (
            <div>
              <p>{props.part} - {props.exercises}</p>
            </div>
          )
        }
        return (
          <div>
            <Part part={parts[0].name} exercises={parts[0].exercises} />
            <Part part={parts[1].name} exercises={parts[1].exercises} />
            <Part part={parts[2].name} exercises={parts[2].exercises} />
          </div>
        )
      }

      const Total = () => {
        console.log(course.parts)
        return (
          <div>
            <p>Number of exercises {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}</p>
          </div>
        )
      }
      return (
        <div>
          <Header/>
          <Content parts={course.parts}/>
          <Total/>
        </div>
      )
    }

    export default App
