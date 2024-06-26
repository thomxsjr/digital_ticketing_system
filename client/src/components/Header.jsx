import '../assets/stylesheets/Header.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AddBalance from './AddBalance'


export default function Header(){

    const [username, setUsername] = useState("")
    const [pfp, setPfp] = useState("")
    const [balance, setBalance] = useState()

    const [balanceBox, setBalanceBox] = useState(false)

    useEffect( () => {
        let processing = true
        axiosFetchData(processing)
        return () => {
            processing = false
        }
    },[])

    const axiosFetchData = async(processing) => {
        await axios.get('http://localhost:4000/getUser')
        .then(res => {
            if (processing) {
                setUsername(res.data.username)
                setPfp(res.data.pfp)
                setBalance(res.data.balance)
            }
        })
        .catch(err => console.log(err))
    }

    return(
        <>
            { balanceBox ? <AddBalance setBalanceBox={setBalanceBox} balance={balance}/> : null}
            <div className='maincontainer'>
                <a href="/profile"><img className="pfp" src={pfp} /></a>
                <div className='name'>
                    <h1>{ username }</h1>
                </div>
                <a href=""></a>
                <div className='balance'>
                    <p onClick={()=>{setBalanceBox(!balanceBox)}}>₹ {balance} </p>
                </div>
            </div>
            
        </>
    )
}
