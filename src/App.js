import React, { useState, useEffect } from 'react';
import bridge, {send} from '@vkontakte/vk-bridge';
// import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
// import '@vkontakte/vkui/dist/vkui.css';

import './styles/App.css'
// import IconPoints from "./img/IconPoints.png";
// import IconCencel from "./img/IconCencel.png";
import Wheel from "./img/wheel.png";
import RouletPointer from "./img/wheel-pointer.png";
import Gold from "./img/coins.png";
import WinnerCard from "./components/WinnerCard";

import GoldBig from "./img/coins_big.png";



const App = () => {
	
	const [userVK, setUserVK] = useState()
	const [currentUser, setCurrentUser] = useState(0)
	const [wheelAtrr, setWheel] = useState('roulet__wheel');
	const [wheelResult, setWheelRes] = useState(0)
	const [balanceRes, setBalanceRes] = useState(0)
	const wheelArray = [
		{wClass: 'roulet__wheel s1', Value: 'JACKPOT'},
		{wClass: 'roulet__wheel s2', Value: '750'},
		{wClass: 'roulet__wheel s3', Value: '200'},
		{wClass: 'roulet__wheel s4', Value: '150'},
		{wClass: 'roulet__wheel s5', Value: '100'},
		{wClass: 'roulet__wheel s6', Value: '10'},
		{wClass: 'roulet__wheel s7', Value: '400'},
		{wClass: 'roulet__wheel s8', Value: '250'},
	];

	

	const [userCards, setUserCards] = useState([])
	const [slisedUcards, setslisedUcards] = useState(userCards)
	// let slicedUserCards = userCards;
	// console.log(userCards)
	// Функция получает данные победителей из airtable


	useEffect(()=>{
		fetchData(),
		getWinnerList()
		
	}, [])

function getWinnerList() {
		const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464");
myHeaders.append("Cookie", "brw=brwOxN6gHHQs6bER1; AWSALB=UIrInupz9++Kr9bU7sQW9xPWvZC0T67zK/MsSOkg8fORQtwrrBJu0+ncv6skgQkRLoLWU/ckCrNqO5vzCPCjWuOH3DOaCj+CmJOar4aEONLIooDPzfeHyhxR+ISC; AWSALBCORS=UIrInupz9++Kr9bU7sQW9xPWvZC0T67zK/MsSOkg8fORQtwrrBJu0+ncv6skgQkRLoLWU/ckCrNqO5vzCPCjWuOH3DOaCj+CmJOar4aEONLIooDPzfeHyhxR+ISC");

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblBcsbuFmV3LEd94", requestOptions)
  .then(response => response.json())
  .then(result => setUserCards(result.records.reverse()))
  .catch(error => console.log('error', error))
	
  setslisedUcards(userCards.slice(0, 4)),
  console.log('подгрузка листа победителей')
}

// Функция вносит данные о победителе в таблицу при первоначальной загрузке

function setWinnerTable (img, fn, sn, lastRes) {
	var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "brw=brwOxN6gHHQs6bER1; AWSALB=Fs3VX11l9ku8wjmN0sZc3/wlvOUUDFGMfq1Xy+iJhZJwG1OcZHkIWiqoY4d3APxvOBAcvkTjbl5z+ai5LE+fWMpkMtf9R6FavJN0RJF4S+Zs7U8yvTLuWDChnwGn; AWSALBCORS=Fs3VX11l9ku8wjmN0sZc3/wlvOUUDFGMfq1Xy+iJhZJwG1OcZHkIWiqoY4d3APxvOBAcvkTjbl5z+ai5LE+fWMpkMtf9R6FavJN0RJF4S+Zs7U8yvTLuWDChnwGn");

var raw = JSON.stringify({
  "records": [
    {
      "fields": {
        "ava": img,
        "firstname": fn,
        "surname": sn,
        "lastresult": lastRes
      }
    }
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblBcsbuFmV3LEd94", requestOptions)
  .then(response => response.text())
  .then(result => console.log(/*result*/'Внесены данные о победителе'))
  .catch(error => console.log('error', error));
}

// Получаем данные из вк, проверяем на соответствие пользователя уже имеющимся записям в БД

async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo', {});
			// console.log(user.id)/*vk id*/
			// console.log(user.photo_200)/*фото */
			// console.log(user.first_name)/*имя */
			// console.log(user.last_name)/*фамилия */
			// await getWinnerList()
			await setUserVK(user)
			
			await getAirtable(user.photo_200, user.first_name, user.last_name, user.id)
			// console.log(currentUser)
			
		}

//получаем данные из airtable и сравниваем с данными юзера и вызываем функцию setAirtableUser, если их нет для регистрации нового пользователя

function getAirtable(uPH, uFN, uLN, a) {
	const myHeaders = new Headers();
	myHeaders.append(
	  "Authorization",
	  "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464"
	);
	myHeaders.append(
	  "Cookie",
	  "brw=brwOxN6gHHQs6bER1; AWSALB=JWPx+/nlUAIg/2CtFeLr+65y3S8DOiy/HbxTeSCiDZp0hYLFnUqoCwLmsH8OEYY1PhOYOB8rywiOedKb6t1OAmrhU1KS1neqFUaGr4fRA8JWoYZBKXAmVNYxYpFb; AWSALBCORS=JWPx+/nlUAIg/2CtFeLr+65y3S8DOiy/HbxTeSCiDZp0hYLFnUqoCwLmsH8OEYY1PhOYOB8rywiOedKb6t1OAmrhU1KS1neqFUaGr4fRA8JWoYZBKXAmVNYxYpFb"
	);
  
	const requestOptions = {
	  method: "GET",
	  headers: myHeaders,
	  redirect: "follow"
	};
  
	fetch(
	  "https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblp7uWgdy7lDuMat",
	  requestOptions
	)
	  .then((response) => response.json())
	  .then((result) => /*console.log(result.records[0].id)*/ {
		// return result.records[0].id;
		// return createStr();
		
		if (result.records.find(e=>e.fields.VK_id === a)) {
			
			updateAirLoading(uPH, uFN, uLN, result.records.find(e=>e.fields.VK_id === a).id),
			setCurrentUser(result.records.find(e=>e.fields.VK_id === a).id),
			setBalanceRes(result.records.find(e=>e.fields.VK_id === a).fields.balance)
			
		} else {
			// console.log('такого еще нет')
			setAirtableUser (uPH, uFN, uLN, a),
			setCurrentUser(result.records.find(e=>e.fields.VK_id === a).id)
		}

		// console.log(result.records.find(e=>e.fields.VK_id === a).id)
		// console.log(result.records[0].fields.VK_id)
		// console.log(result.records[0].fields.VK_id)
	  })
  
	  .catch((error) => console.log("error", error));
  }


// Изменяем запись при загрузке

function updateAirLoading(img, fn, sn, curid) {
	const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "brw=brwYN886fjK8RXYKO; AWSALB=KY3iMkSf2uw+R5wBUf0QFDdryC8lFa2b1iuM+gWiGM5Zbkm/jDQrF/Cogrxtp+cIo+frkeCflPVvxLQ9SLaftZmCNtOuyTa2Aq81OIuqRy8IAilgVjPRJs4daH7M; AWSALBCORS=KY3iMkSf2uw+R5wBUf0QFDdryC8lFa2b1iuM+gWiGM5Zbkm/jDQrF/Cogrxtp+cIo+frkeCflPVvxLQ9SLaftZmCNtOuyTa2Aq81OIuqRy8IAilgVjPRJs4daH7M");

const raw = JSON.stringify({
  "fields": {
    "ava": img,
    "firstname": fn,
    "surname": sn
  }
});

const requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const urlReq = 'https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblp7uWgdy7lDuMat/'+curid;

// console.log(urlReq)

fetch(urlReq, requestOptions)
  .then(response => response.json())
  .then(result => console.log(/*result*/"результат 21"))
  .catch(error => console.log('error', error));
}

// изменяем запись при получении баланса

function updateAirtableUser(bl, curid){
	const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "brw=brwYN886fjK8RXYKO; AWSALB=KY3iMkSf2uw+R5wBUf0QFDdryC8lFa2b1iuM+gWiGM5Zbkm/jDQrF/Cogrxtp+cIo+frkeCflPVvxLQ9SLaftZmCNtOuyTa2Aq81OIuqRy8IAilgVjPRJs4daH7M; AWSALBCORS=KY3iMkSf2uw+R5wBUf0QFDdryC8lFa2b1iuM+gWiGM5Zbkm/jDQrF/Cogrxtp+cIo+frkeCflPVvxLQ9SLaftZmCNtOuyTa2Aq81OIuqRy8IAilgVjPRJs4daH7M");

const raw = JSON.stringify({
  "fields": {
    "balance": bl
  }
});

const requestOptions = {
  method: 'PATCH',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const urlReq = 'https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblp7uWgdy7lDuMat/'+curid;

// console.log(urlReq)

fetch(urlReq, requestOptions)
  .then(response => response.json())
  .then(result => console.log(/*result*/"Баланс должен измениться"))
  .catch(error => console.log('error', error));
}

  // Включить попап

function PopupON() {
	const xxx = document.getElementsByClassName('popup_container')[0]
	//console.log(xxx)
	xxx.style.display = 'flex'

}

// выключить попап. выполняется при нажатии кнопки GREATE

async function PopupOFF() {
	const xxx = document.getElementsByClassName('popup_container')[0];
	
	xxx.style.display = 'none';
	
	await wheelResult==='JACKPOT' ? setBalanceRes(balanceRes+1000) : setBalanceRes(balanceRes+Number(wheelResult)) 
	await updateAirtableUser(balanceRes+Number(wheelResult-1), currentUser);
	await fetchData();
	
	setWheel('roulet__wheel');
	
}

function setAirtableUser (img, fn, sn, vkid) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", "Bearer patLFLkSVKDFtSfHP.7596d46c249fa15ed8e5e451051d0cb1e06146596333d683d910373d3588e464");
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Cookie", "brw=brwOxN6gHHQs6bER1; AWSALB=8id8JJXDZkXXD+tu6g8tT2/ZbBrsvlI/Ddrg38q+2q1kkAGcYNdKzZbMJSqA3c4rO2lTJ7TvxnPvKv2W/vXuAr+Pr5Dn8UDe/QOEGI1goXPZNOC0TNeaf6RPdq8f; AWSALBCORS=8id8JJXDZkXXD+tu6g8tT2/ZbBrsvlI/Ddrg38q+2q1kkAGcYNdKzZbMJSqA3c4rO2lTJ7TvxnPvKv2W/vXuAr+Pr5Dn8UDe/QOEGI1goXPZNOC0TNeaf6RPdq8f");

	var raw = JSON.stringify({
  		"records": [
    		{
      		"fields": {
        	"ava": img,
        	"firstname": fn,
        	"surname": sn,
			"balance": 0,
			"VK_id": vkid
     		 }
    		}
  		]
	});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.airtable.com/v0/appZFFKMuPYcE31Qf/tblp7uWgdy7lDuMat", requestOptions)
  .then(response => response.json())
  .then(result => console.log(/*result.records[0].id*/"результат 28"))
  
  .catch(error => console.log('error', error));

  
}


// Выполняется при нажатии кнопки speen wheel
	async function setClassWheel() {
		const x = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
		await setWheelRes(wheelArray[x].Value);
		await setWheel(wheelArray[x].wClass);
		await setWinnerTable(userVK.photo_200, userVK.first_name, userVK.last_name,  Number(wheelArray[x].Value));
		
		await getWinnerList();
		
		
		console.log('balanceRes: '+balanceRes);
		setTimeout(function () {
			PopupON()
		}, 2000)
				
	}

	

		

	

	return (
		<div className="App">
     
	 <header className='header'>
				{/* <div className='btnGroupe'>
					<img className='iconPoints'src={IconPoints} alt="иконка с точками"/>
					<img src={IconCencel} alt="крестик"/>
				</div> */}
			</header>
      <div className="content-container">
	  
		<h1>WHEEL OF FORTUNE</h1>
        <div className="roulet">
          <div className="roulet__box">
           
		  <div className='popup_container'>
			<div className='popup_container__block'>
				<h1>YOU WIN</h1>
				<div className='popup__result'>
					<h2>{wheelResult}</h2>
					<img src={GoldBig}/>
				</div>
				<button className="popup__btn" onClick={PopupOFF}>GREAT</button>
			</div>
		  </div>
		  <img className={wheelAtrr} src={Wheel} alt="Рулетка"/>
			<img className='roulet__pointer' src={RouletPointer} alt="Указатель"/>
          </div>
          <div className="balance">
            <div>JACKPOT 1000</div>
            <div>BALANCE {balanceRes}</div>
            <button className="balance__btn" onClick={setClassWheel/*setWinnerTable*//*fetchData*//*setAirtableUser*//*getFetch*//*getWinnerList*/}>SPEEN WHEEL</button>
          </div>
        </div>
        <div className="winner_list">
          <h2>WINNERS </h2>
		  
          <div className="cards_list">
			
			{userCards.length !== 0 ? slisedUcards.map(slisedUcard => <WinnerCard gold={Gold} usCard={slisedUcard} key={slisedUcard.id}/>) : "Список победителей пуст"}
		
			
		 
		   </div>
        </div>
      </div>
    </div>
	);
}

export default App;
