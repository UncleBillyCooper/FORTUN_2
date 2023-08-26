import React from "react";

function WinnerCard(props) {
//    console.log(props.usCard.fields.lastWin)
    return(
        <div className="winner_card">
            
            <img className='ava' src={props.usCard.fields.ava}/>
            <h4 className='winner_card__name'>{props.usCard.fields.surname+' '+props.usCard.fields.firstname}</h4>
			<p>{props.usCard.fields.lastresult}</p>
			<img className='coins' src={props.gold} alt="coins"/>
        </div>
        
    )

}

export default WinnerCard;