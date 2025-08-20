import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useForm } from 'react-hook-form';
import { Button, Form } from "react-bootstrap";
import WordForTable from './components/WordForTable';
import words from './words';
//oyunu kazanamazsan da bi şeyler ekle, submit enter falan onu ayarla
function App() {

  interface word{
    word:string
  }

  const[guessLevel, setGuessLevel] = useState<number>(0)
  const[currentGuess, setCurrentGuess] = useState<string>('')
  const[allGuesses, setAllGuesses] = useState<string[]>([])
  const[finalWord, setFinalWord] = useState<string>(process.env.REACT_APP_TheWord||'lunna')
  const[finalWordArray, setFinalWordArray] = useState<string[]>(process.env.REACT_APP_TheWord!.split('')||['l','u','n','n','a'])
  const[finalWordLetterCount, setFinalWordLetterCount] = useState<Record<string,number>>({})
  const[found, setFound] = useState<boolean>(false)

  const wordInput = useRef<HTMLElement|null>(null)

  const {register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }} = useForm<word>({mode:"all"})

  function pushNewWord(data:word){
    if(words.includes(data.word)){
      setAllGuesses((prev)=>[...prev,data.word])
      setGuessLevel((prev)=>prev+1);
      reset() // reset direkt inputları sıfırlıyor, alttaki as HTMLInputElement dalgası yerine bunu kullanabilirim
      // (wordInput.current as HTMLInputElement).value = ("")   // react hook form için daha iyi, submit ettiğimde yeni guess yerine öncekini kullanıyor ref ile inputu sildiğimde
      setCurrentGuess('')
    }
    else{
      document.getElementById('errorMessage')?.classList.add('makeOpaque')
      setTimeout(() => document.getElementById('errorMessage')?.classList.remove('makeOpaque'), 1000)
    }
  }

  useEffect(()=>{
    setFinalWordLetterCount(finalWordArray.reduce((acc:any,letter)=>{
          acc[letter] = (acc[letter]||0)+1
          return acc
        },{})
    )
    wordInput.current?.focus()
  },[])

  
  useEffect(()=>{
    if(guessLevel===1){
      const guess = document.getElementById('1stGuess')

      let letterCount:Record<string,number> = finalWordLetterCount // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          foundCount --
          if(foundCount === 0){
            document.getElementById('successMessage')!.innerHTML = "İlk seferde bildin, hayattaki tüm şansını harcadın"
            document.getElementById('successMessage')?.classList.add('makeOpaque')
            // setTimeout(() => document.getElementById('successMessage')?.classList.remove('makeOpaque'), 2000)
            setFound(true)
          }
        }
      }
    }

    if(guessLevel===2){
      const guess = document.getElementById('2ndGuess')

      let letterCount:Record<string,number> = finalWordLetterCount // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          foundCount --
          if(foundCount === 0){
            document.getElementById('successMessage')!.innerHTML = "İkinci seferde bildin wp"
            document.getElementById('successMessage')?.classList.add('makeOpaque')
            // setTimeout(() => document.getElementById('successMessage')?.classList.remove('makeOpaque'), 1000)
            setFound(true)
          }
        }
      }
    }

    if(guessLevel===3){
      const guess = document.getElementById('3rdGuess')

      let letterCount:Record<string,number> = finalWordLetterCount // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          foundCount --
          if(foundCount === 0){
            document.getElementById('successMessage')!.innerHTML = "Üçüncü seferde bildin fena değil"
            document.getElementById('successMessage')?.classList.add('makeOpaque')
            // setTimeout(() => document.getElementById('successMessage')?.classList.remove('makeOpaque'), 1000)
            setFound(true)
          }
        }
      }
    }

    if(guessLevel===4){
      const guess = document.getElementById('4thGuess')

      let letterCount:Record<string,number> = finalWordLetterCount // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          foundCount --
          if(foundCount === 0){
            document.getElementById('successMessage')!.innerHTML = "Dördüncü seferde bildin kelime zordu herhalde"
            document.getElementById('successMessage')?.classList.add('makeOpaque')
            // setTimeout(() => document.getElementById('successMessage')?.classList.remove('makeOpaque'), 1000)
            setFound(true)
          }
        }
      }
    }

    if(guessLevel===5){
      const guess = document.getElementById('5thGuess')

      let letterCount:Record<string,number> = finalWordLetterCount // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          foundCount --
          if(foundCount === 0){
            document.getElementById('successMessage')!.innerHTML = "Sonuncuda bildin ygs türkçe 17net herhalde"
            document.getElementById('successMessage')?.classList.add('makeOpaque')
            // setTimeout(() => document.getElementById('successMessage')?.classList.remove('makeOpaque'), 1000)
            setFound(true)
          }
        }
      }
    }
  },[guessLevel])
  

  return (
    <>
      <div className="allPage" 
      onClick={()=>wordInput.current?.focus()}
      onKeyDown={(e)=>{
        if(e.key==="Enter"){
          // e.preventDefault()
          alert('ege')
          // handleSubmit(pushNewWord)()
        }
      }}>
        <div className="allWordsDiv ">
          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div id='1stGuess' className="wordDiv absolute">
              {guessLevel===0 ? <WordForTable word={currentGuess}/> : <WordForTable word={allGuesses[0]||''}/>}
            </div>
            <p id='errorMessage' className='errorMessage absolute'>böyle kelime mi var</p>
            <p id='successMessage' className='errorMessage absolute'>e</p>
          </div>

          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div id='2ndGuess' className="wordDiv absolute">
              {guessLevel===1 ? <WordForTable word={currentGuess}/> : <WordForTable word={allGuesses[1]||''}/>}
            </div>
          </div>

          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div id='3rdGuess' className="wordDiv absolute">
              {guessLevel===2 ? <WordForTable word={currentGuess}/> : <WordForTable word={allGuesses[2]||''}/>}
            </div>
          </div>

          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div id='4thGuess' className="wordDiv absolute">
              {guessLevel===3 ? <WordForTable word={currentGuess}/> : <WordForTable word={allGuesses[3]||''}/>}
            </div>
          </div>

          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div id='5thGuess' className="wordDiv absolute">
              {guessLevel===4 ? <WordForTable word={currentGuess}/> : <WordForTable word={allGuesses[4]||''}/>}
            </div>
          </div>

          <div className="wordDiv relative">
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <p className="letterDiv"></p>
            <div className="wordDiv absolute">
              {guessLevel===5 && <WordForTable word={finalWord}/> }
            </div>
          </div>

          <Button
          // onClick={()=>{handleSubmit(pushNewWord)() }}
          id='goButton'
          className='goButton'
          type='submit'
          disabled={isSubmitting||found||true}
          form="enterButtonTest">GO</Button>
        </div>

        <Form onSubmit={handleSubmit(pushNewWord)}
        id="enterButton"
        onKeyDown={(e)=>{
          console.log('harf basıldı sürekli')
          console.log('harf basıldı sürekli2')
          wordInput.current?.focus()
          if(e.key==='Enter'){
            // e.preventDefault()
            handleSubmit(pushNewWord)()
          }
          
        }}>
        
          <Form.Control
          // onKeyDown={(e)=>{
          //   if(e.key==='Enter'){
          //     handleSubmit(pushNewWord)()
          //   }
          // }}
          disabled={found}
          className='wordInput'
          autoComplete='off'
          maxLength={5}
          {...register("word",{
                  required:"Required",
                  pattern: {
                    value: /^[abcçdefgğhıijklmnoöprsştuüvyz]{5}$/,
                    message: 'Sadece 5 harfli küçük Türkçe karakterler girebilirsiniz.'
                  }
                })}
          ref={(e:HTMLElement |null) => {
            register("word").ref(e); // RHF ref
            wordInput.current = e;   // kendi ref
          }}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/[^abcçdefgğhıijklmnoöprsştuüvyz]/g, "")
            setCurrentGuess(e.currentTarget.value)
          }}
          // onChange={(e)=>{
          //   setCurrentGuess(e.target.value)
          // }}
          />
        </Form>
      </div>
    </>
  )
}

export default App;
