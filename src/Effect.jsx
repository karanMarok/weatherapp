import React, { useEffect, useState } from 'react' 

const Effect = () => {
    const [one, setOne] = useState(); 
    const [two, setTwo] = useState(0);
    
    useEffect(() => {
        setOne(1);
        
        console.log(two, one);
    }, [one, two])

    return (
        <>        
            <button onClick={() => setTwo((previous) => previous + 1)}>Click</button>   
        </>
    )
}
export default Effect