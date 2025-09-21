import alphabet from "../data/alphabet"

interface AlphabetKeysProps{
    allGuesses: string[]
    finalWord: string
    guessLevel: number
    wordInput: any
    setCurrentGuess: (e:string)=>void
}

const AlphabetKeys = ({allGuesses,guessLevel,finalWord,wordInput,setCurrentGuess}:AlphabetKeysProps)=>{
  

  const alphabetTable= alphabet.map((letter,i)=>{
    let className = "alphabetLetterBox"
    let greenCount = 0
    let yellowCount = 0
    let greyCount = 0

    for(let i = 0;i<guessLevel;i++){
      for(let e = 0;e<5;e++){
        if(finalWord[e] === allGuesses[i][e] && finalWord[e]===letter){
          greenCount++
        }
        else if(finalWord.includes(letter) && allGuesses[i][e].includes(letter)){
          yellowCount++
        }
        else if(allGuesses[i][e].includes(letter)){
          greyCount++
        }
      }
    }
    
    if(greenCount>0){
      className = "alphabetLetterBox bgGreen"
    }
    else if(yellowCount>0){
      className = "alphabetLetterBox bgYellow"
    }
    else if(greyCount>0){
      className = "alphabetLetterBox bgGrey"
    }
    
    return (
      <button key={i} id={`${letter}`+'Letter'} className={`${className}`}
      onClick={()=>{
        if((wordInput.current as HTMLInputElement).value.length < 5){
          setCurrentGuess((wordInput.current as HTMLInputElement).value + letter);
          (wordInput.current as HTMLInputElement).value = (wordInput.current as HTMLInputElement).value + letter
        }
      }}>{letter}</button>
    )
  })

  return (
    <>
    {alphabetTable}
    </>
  )
}

export default AlphabetKeys