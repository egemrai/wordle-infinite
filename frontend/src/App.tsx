import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import { Form } from "react-bootstrap";
import WordForTable from './components/WordForTable';
import GuessWordForTable from './components/GuessWordForTable';
import FinalWordForTable from './components/FinalWordForTable';
import AlphabetKeys from './components/AlphabetKeys';
import words from './data/words';
//oyunu kazanamazsan da bi şeyler ekle, submit enter falan onu ayarla
function App() {

  interface word{
    word:string
  }
  
  const [randomNumber, setRandomNumber] = useState<number>(Math.floor(Math.random()*words.length))
  const[guessLevel, setGuessLevel] = useState<number>(0)
  const[currentGuess, setCurrentGuess] = useState<string>('')
  const[allGuesses, setAllGuesses] = useState<string[]>([])
  const[finalWord, setFinalWord] = useState<string>(words[randomNumber]||'lunna')
  const[finalWordArray, setFinalWordArray] = useState<string[]>(words[randomNumber].split('')||['l','u','n','n','a'])
  const[finalWordLetterCount, setFinalWordLetterCount] = useState<Record<string,number>>({})
  const[found, setFound] = useState<boolean>(false)
  const[isMobile, setIsMobile] = useState<boolean>(false)

  const wordInput = useRef<HTMLElement|null>(null)

  const {register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }} = useForm<word>({mode:"all"})

  function pushNewWord(data:word){
    if(words.includes(data.word)){
      setAllGuesses((prev)=>{
          const newAllGuesses = [...prev,data.word]
          localStorage.setItem("allGuesses",JSON.stringify(newAllGuesses))
          return newAllGuesses
        }
      )
      setGuessLevel((prev)=>{
        const newGuessLevel = prev+1
        localStorage.setItem("guessLevel",JSON.stringify(newGuessLevel))
        return newGuessLevel
      })
      reset() // reset direkt inputları sıfırlıyor, alttaki as HTMLInputElement dalgası yerine bunu kullanabilirim
      // (wordInput.current as HTMLInputElement).value = ("")   // react hook form için daha iyi, submit ettiğimde yeni guess yerine öncekini kullanıyor ref ile inputu sildiğimde
      setCurrentGuess('')

      // localStorage.setItem("allGuesses",JSON.stringify([...allGuesses!,data.word]))
      // localStorage.setItem("guessLevel",JSON.stringify(guessLevel!+1))
      localStorage.setItem("finalWord",JSON.stringify(finalWord))
      localStorage.setItem("finalWordArray",JSON.stringify(finalWord!.split('')))
    }
    else{
      document.getElementById('errorMessage')?.classList.add('makeOpaque')
      setTimeout(() => document.getElementById('errorMessage')?.classList.remove('makeOpaque'), 1000)
    }
  }

  function resetWord(){
    setFound(false)
    setGuessLevel(0)
    setCurrentGuess('')
    reset()
    setAllGuesses([])
    const resetRandomNumber = Math.floor(Math.random()*words.length)
    setFinalWord(words[resetRandomNumber])
    setFinalWordArray(words[resetRandomNumber].split(''))
    document.getElementById('successMessage')?.classList.remove('makeOpaque')
    setFinalWordLetterCount(words[resetRandomNumber].split('').reduce((acc:any,letter)=>{
          acc[letter] = (acc[letter]||0)+1
          return acc
        },{})
    )
    
    localStorage.clear()
  }


  useEffect(()=>{
    const userAgent = navigator.userAgent //mobile kontrol
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent))

    wordInput.current?.focus()

    try {
    const cachedAllGuesses = localStorage.getItem("allGuesses")
    const cachedGuessLevel = localStorage.getItem("guessLevel")
    const cachedFinalWord = localStorage.getItem("finalWord")
    const cachedFinalWordArray = localStorage.getItem("finalWordArray")

    if (cachedAllGuesses && cachedGuessLevel && cachedFinalWord && cachedFinalWordArray) {
      setAllGuesses(JSON.parse(cachedAllGuesses))
      setFinalWord(JSON.parse(cachedFinalWord))
      setFinalWordArray(JSON.parse(cachedFinalWordArray))
      setGuessLevel(JSON.parse(cachedGuessLevel))
    } 
    else {
    setAllGuesses([])
    setGuessLevel(0)
    }
    }
    catch (err) {
      console.error("localStorage parse hatası:", err);
    }
  },[])

  useEffect(()=>{
    setFinalWordLetterCount(finalWordArray.reduce((acc:any,letter)=>{
          acc[letter] = (acc[letter]||0)+1
          return acc
        },{})
    )
    wordInput.current?.focus() // kelime doğru bilinirse ve reset atılırsa, sonraki klavye vuruşunda reset butonunu focusluyordu. onu önlemek için
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[finalWord])

  
  return (
    <>
      <div className="allPage" 
      onClick={()=>wordInput.current?.focus()}
      onKeyDown={(e)=>{
        if(e.key==="Enter"){
          // e.preventDefault()
          
          // handleSubmit(pushNewWord)()
        }
      }}>
        <div id='mainDiv' className="allWordsDiv test">
          <p id='errorMessage' className='errorMessage absolute'>böyle kelime mi var</p>
          <p id='successMessage' className='errorMessage absolute'>e</p>
          <div className="wordDiv relative">
              {guessLevel===0 ? <GuessWordForTable word={currentGuess}/> : <WordForTable word={allGuesses![0]||''} finalWordLetterCount={finalWordLetterCount} guessLevel={guessLevel} order={1} finalWordArray={finalWordArray} setFound={setFound} />}
            
          </div>

          <div className="wordDiv relative">
              {guessLevel===1 ? <GuessWordForTable word={currentGuess}/> : <WordForTable word={allGuesses[1]||''} finalWordLetterCount={finalWordLetterCount} guessLevel={guessLevel} order={2} finalWordArray={finalWordArray} setFound={setFound}/>}
          </div>

          <div className="wordDiv relative">
              {guessLevel===2 ? <GuessWordForTable word={currentGuess}/> : <WordForTable word={allGuesses[2]||''} finalWordLetterCount={finalWordLetterCount} guessLevel={guessLevel} order={3} finalWordArray={finalWordArray} setFound={setFound}/>}
          </div>

          <div className="wordDiv relative">
              {guessLevel===3 ? <GuessWordForTable word={currentGuess}/> : <WordForTable word={allGuesses[3]||''} finalWordLetterCount={finalWordLetterCount} guessLevel={guessLevel} order={4} finalWordArray={finalWordArray} setFound={setFound}/>}
          </div>

          <div className="wordDiv relative">
              {guessLevel===4 ? <GuessWordForTable word={currentGuess}/> : <WordForTable word={allGuesses[4]||''} finalWordLetterCount={finalWordLetterCount} guessLevel={guessLevel} order={5} finalWordArray={finalWordArray} setFound={setFound}/>}
          </div>

          <div className="wordDiv relative">
              {(guessLevel===5 && found ===false) ? <FinalWordForTable word={finalWord} found={found} setFound={setFound}/> : (found ? <FinalWordForTable word={finalWord} found={found} setFound={setFound}/> : <GuessWordForTable word={''}/>)   }
          </div>

          <div id='alphabetDiv' className='alphabetDiv'>
            {<AlphabetKeys allGuesses={allGuesses} finalWord={finalWord} guessLevel={guessLevel} setCurrentGuess={setCurrentGuess} wordInput={wordInput}/>}
            <button className='resetButton absolute'
            onClick={()=>resetWord()}>↻</button>

            <button
            onClick={()=>{setCurrentGuess((wordInput.current as HTMLInputElement).value.slice(0,(wordInput.current as HTMLInputElement).value.length-1));
                          (wordInput.current as HTMLInputElement).value = (wordInput.current as HTMLInputElement).value.slice(0,(wordInput.current as HTMLInputElement).value.length-1)
            }}
            id='deleteButton'
            className='deleteButton'
            type='button'
            >
              del
            </button>

            <button
            // onClick={()=>{handleSubmit(pushNewWord)() }}
            id='goButton'
            className='enterButton'
            type='submit'
            disabled={isSubmitting||found}
            form="enterButton">
              enter
            </button>
          </div>

        </div>

        <Form onSubmit={handleSubmit(pushNewWord)}
        id="enterButton"
        onKeyDown={(e)=>{
          wordInput.current?.focus()
          if(e.key==='Enter'){
            // e.preventDefault()
            handleSubmit(pushNewWord)()
          }
          
        }}>
        
          <Form.Control
          readOnly={isMobile}
          disabled={found}
          className='wordInput'
          autoComplete='off'
          autoFocus={true}
          maxLength={5}
          {...register("word",{
                  required:"Required",
                  pattern: {
                    value: /^[abcçdefgğhıijklmnoöprsştuüvyz]{5}$/,
                    message: 'Sadece 5 harfli küçük Türkçe karakterler girebilirsiniz.'
                  }
                })}
          ref={(e:HTMLElement |null) => {
            register("word").ref(e); // RHF(react hook form) ref
            wordInput.current = e;   // kendi ref
          }}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/[^abcçdefgğhıijklmnoöprsştuüvyz]/g, "")
            setCurrentGuess(e.currentTarget.value)
          }}
          // onChange={(e)=>{
          //   e.currentTarget.value = e.currentTarget.value.replace(/[^abcçdefgğhıijklmnoöprsştuüvyz]/g, "")
          //   setCurrentGuess(e.target.value)
          // }}
          />
        </Form>
      </div>
    </>
  )
}

export default App;
