

interface WordForTableProps{
    word: string
    finalWordLetterCount: object
    guessLevel: number
    order: number
    finalWordArray: string[]
    setFound: (e:boolean)=> void
}

function WordForTable({word,finalWordLetterCount,guessLevel,order,finalWordArray,setFound}:WordForTableProps){


    let letterCount:Record<string,number> = {...finalWordLetterCount} // Bulunması gereken kelimenin harflerinden tahmin edilen kelimenin harfleri yeşil denk gelirse, o arflerin sayısını düşüyorum finalWordLetterCount'den.
    let foundCount = 5  // harf doğruysa 1 azalıcak, hepsi doğru olup 0 olduğunda oyun biticek

    for(let i=0; i<5; i++){
      if(word[i] === finalWordArray[i]){
        letterCount[finalWordArray[i]] = letterCount[finalWordArray[i]] -1
      }
    }

    const guessTable = Array.from({length:5}).map((_,i)=>{

    if(word[i] === finalWordArray[i]){
        foundCount --
        if(foundCount === 0){
          switch (order){
            case 1:
            document.getElementById('successMessage')!.innerHTML = "İlk seferde bildin, hayattaki tüm şansını harcadın"
            break

            case 2:
            document.getElementById('successMessage')!.innerHTML = "İkinci seferde bildin wp"
            break

            case 3:
            document.getElementById('successMessage')!.innerHTML = "Üçüncü seferde bildin fena değil"
            break

            case 4:
            document.getElementById('successMessage')!.innerHTML = "Dördüncü seferde bildin kelime zordu herhalde"
            break

            case 5:
            document.getElementById('successMessage')!.innerHTML = "Sonuncuda bildin ygs türkçe 17net herhalde"
            break

            case 6:
            document.getElementById('successMessage')!.innerHTML = "İkinci seferde bildin wp"
            break
          }
          
          document.getElementById('successMessage')?.classList.add('makeOpaque')
          setFound(true)
        }
      }

      if(guessLevel<order){
        return <p key={i} className="letterDiv"> {''}</p>
      }
      else if(word[i] === finalWordArray[i]){                                                               
        // document.getElementById(`${word[i]}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
        // letterCount[guess?.children[i].innerHTML.replace(' ','')!] = letterCount[guess?.children[i].innerHTML.replace(' ','')!] - 1 //letterCountda harf yeşil yanarsa ve hala 1 tane daha varsa, 1 harf kalmasına rağmen 2 kere sarı yanmasın diye
        return <p key={i} className="letterDiv bgGreen"> {word[i]}</p> // tablodaki kutuyu yeşil yapmak için
      }
      else if(letterCount[word[i]] >0){                                                
        //document.getElementById(`${word[i]}Letter`)?.classList.add('bgYellow') // alfabeyi sarı yapmak için
        letterCount[word[i]] = letterCount[word[i]] - 1 //letterCountda harf sarı yanarsa, harfin değerini 1 düşürüyorum ki tekrar o harf gelirse 1 tane olmasına rağmen 2. harf de sarı yanıp 2 tane o harften varmış gibi göstermesin diye
        return <p key={i} className="letterDiv bgYellow"> {word[i]}</p> // tablodaki kutuyu sarı yapmak için
      }
      else if(letterCount[word[i]] === undefined || letterCount[word[i]] === 0){
        if(!document.getElementById(`${word[i]}Letter`)?.classList.contains('bgYellow')){
          //document.getElementById(`${word[i]}Letter`)?.classList.add('bgGrey') // alfabeyi gri yapmak için
        }
        return <p key={i} className="letterDiv bgGrey"> {word[i]}</p>     // tablodaki kutuyu gri yapmak için
      }


    })
    return(
        <>
        {guessTable}
        </>
    )
}

export default WordForTable