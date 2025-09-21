

interface GuessWordForTableProps{
    word: string
}

function GuessWordForTable({word}:GuessWordForTableProps){

    const guessTable = Array.from({length:5}).map((_,i)=>{
        return <p key={i} className="guessLetterDiv "> {word[i]}</p>
    })
    return(
        <>
        {guessTable}
        </>
    )
    // const guessTable = word.split('').map((letter,i)=>{
    //     return <p key={i} className="letterDiv "> {letter}</p>
    // })
    // return(
    //     <>
    //     {guessTable}
    //     </>
    // )
}

export default GuessWordForTable