import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useForm } from 'react-hook-form';
import { Button, Form } from "react-bootstrap";
import WordForTable from './components/WordForTable';
import words from './data/words';
import alphabet from './data/alphabet';
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

  const alphabetKeys = alphabet.map((letter,i)=>{
    return (
      <button key={i} id={`${letter}`+'Letter'} className='alphabetLetterBox'
      onClick={()=>{
        if((wordInput.current as HTMLInputElement).value.length < 5){
          {setCurrentGuess((wordInput.current as HTMLInputElement).value + letter);
          (wordInput.current as HTMLInputElement).value = (wordInput.current as HTMLInputElement).value + letter}
        }
      }}>{letter}</button>
    )
  })

  useEffect(()=>{
    setFinalWordLetterCount(finalWordArray.reduce((acc:any,letter)=>{
          acc[letter] = (acc[letter]||0)+1
          return acc
        },{})
    )

    const userAgent = navigator.userAgent //mobile kontrol
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent))

    wordInput.current?.focus()
  },[])

  
  useEffect(()=>{
    console.log("finalWordLetterCount:",finalWordLetterCount)
    if(guessLevel===1){
      const guess = document.getElementById('1stGuess')
      
      let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')                                                                 // tablodaki kutuyu yeşil yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
          // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1 //letterCountda harf yeşil yanarsa ve hala 1 tane daha varsa, 1 harf kalmasına rağmen 2 kere sarı yanmasın diye
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')                                                                // tablodaki kutuyu sarı yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
          letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1 //letterCountda harf sarı yanarsa, harfin değerini 1 düşürüyorum ki tekrar o harf gelirse 1 tane olmasına rağmen 2. harf de sarı yanıp 2 tane o harften varmış gibi göstermesin diye
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')                                                                  // tablodaki kutuyu gri yapmak için
          if(!document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.contains('bgYellow')){
            document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
          }   
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
      console.log("letterCount1.:",letterCount)
    }

    if(guessLevel===2){
      const guess = document.getElementById('2ndGuess')

      let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')                                                                 // tablodaki kutuyu yeşil yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
          // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')                                                                // tablodaki kutuyu sarı yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
          letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')                                                                  // tablodaki kutuyu gri yapmak için
          if(!document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.contains('bgYellow')){
            document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
          }   
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
      console.log("letterCount2.:",letterCount)
    }

    if(guessLevel===3){
      const guess = document.getElementById('3rdGuess')

      let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')                                                                 // tablodaki kutuyu yeşil yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
          // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')                                                                // tablodaki kutuyu sarı yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
          letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')                                                                  // tablodaki kutuyu gri yapmak için
          if(!document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.contains('bgYellow')){
            document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
          }   
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
      console.log("letterCount3.:",letterCount)
      console.log("finalWordLetterCount.:",finalWordLetterCount)
    }

    if(guessLevel===4){
      const guess = document.getElementById('4thGuess')

      let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')                                                                 // tablodaki kutuyu yeşil yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
          // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')                                                                // tablodaki kutuyu sarı yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
          letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')                                                                  // tablodaki kutuyu gri yapmak için
          if(!document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.contains('bgYellow')){
            document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
          }   
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
      const correctWord = document.getElementById('correctWord')

      let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
      let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
        }
      }

      for(let i=0; i<5; i++){
        if(guess?.children[i].innerHTML.replace(' ','') === finalWordArray[i]){
          guess?.children[i].classList.add('bgGreen')                                                                 // tablodaki kutuyu yeşil yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
          // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] >0){
          guess?.children[i].classList.add('bgYellow')                                                                // tablodaki kutuyu sarı yapmak için
          document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
          letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1
        }
        else if(letterCount[guess?.children[i].innerHTML.replace(' ','')!] === undefined || letterCount[guess?.children[i].innerHTML.replace(' ','')!] === 0){
          guess?.children[i].classList.add('bgGrey')                                                                  // tablodaki kutuyu gri yapmak için
          if(!document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.contains('bgYellow')){
            document.getElementById(`${guess?.children[i].innerHTML.replace(' ','')}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
          }   
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
      if(foundCount > 0){
        document.getElementById('successMessage')!.innerHTML = "Bir kelimeyi bulamadın hoş geldin demet akalın"
        document.getElementById('successMessage')?.classList.add('makeOpaque')

        for(let i=0; i<5; i++){
          correctWord?.children[i].classList.add('bgGreen')
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
          
          // handleSubmit(pushNewWord)()
        }
      }}>
        <div id='mainDiv' className="allWordsDiv test">
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
            <div id='correctWord' className="wordDiv absolute">
              {guessLevel===5 && found ===false && <WordForTable word={finalWord}/> }
            </div>
          </div>

          <div className='alphabetDiv'>
            {alphabetKeys}

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
            register("word").ref(e); // RHF ref
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
