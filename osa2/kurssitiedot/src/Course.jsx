const Header = ({ course }) => {
    return (
      <div>
        <h1>{course}</h1>
      </div>
    )
  }

  const Part = ({ part, exercises }) => {
    console.log('rekisteröity harjoitukset osasta',part);
    return (
      <div>
        <p>{part} {exercises}</p>
      </div>
    )
  }

  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))}
      </div>
    )
  }

  const Total = ({ parts }) => {
    const allExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    console.log(`kurssin harjoitukset yhteensä ${allExercises}`);
    return (
      <h3>
        <p>total of {allExercises} exercises</p>
      </h3>
    )
  }

  const Course = ({ course }) => {
    console.log(`tallennetaan harjoitukset kurssista ${course.name}`);
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course