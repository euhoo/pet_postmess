/*Примеры*/
const messageExample = {
	message: 'enableCoordinateSelection',
	payload: {
		id: '123123', // id для установки соответствия
		data: 'someData', //данные
		sender: 'GIS'
	}
};

const gisOptionsExample = {
	/*
	 senderTarget используется для отправки сообщений.
	 gервый случай для ГИСа открытого в дочернем окне, второй - если в том же
	*/
	targetToSend: window.opener || window.top,
	/*
	используется для получения сообщений
	*/
	targetToReceive: window,
};

const reactFromGwtOptionsExample = {
	// targetToSend: window.top.bggisMapWindow,
	// targetToReceive: window.top,

};

const listenersExample = {
	// enableCoordinateSelection: [
	// 	{id: 'someElementId', func: (data) => {console.log(data)} }
	// ]
};
/*Конец примеров*/
