

interface FinalWordForTableProps{
    word: string
    setFound: (e:boolean)=>void
}

function FinalWordForTable({word,setFound}:FinalWordForTableProps){

    document.getElementById('successMessage')!.innerHTML = "Bir kelimeyi bulamadın hoş geldin demet akalın"
        
    document.getElementById('successMessage')?.classList.add('makeOpaque')
    setFound(false)

    const guessTable = Array.from({length:5}).map((_,i)=>{                                                       
        document.getElementById(`${word[i]}Letter`)?.classList.add('bgGreen')  // alfabeyi yeşil yapmak için
        return <p key={i} className="letterDiv bgGreen"> {word[i]}</p> // tablodaki kutuyu yeşil yapmak için
    })
    return(
        <>
        {guessTable}
        </>
    )
}

export default FinalWordForTable