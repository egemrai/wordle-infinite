

interface WordForTableProps{
    word: string
}

function WordForTable({word}:WordForTableProps){

    const guessTable = word.split('').map((letter,i)=>{
        return <p key={i} className="letterDiv "> {letter}</p>
    })
    return(
        <>
        {guessTable}
        </>
    )
}

export default WordForTable