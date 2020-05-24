/*Gримеры*/
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
	targetToSend: window.top.bggisMapWindow,
	targetToReceive: window.top,

};

const listenersExample = {
	enableCoordinateSelection: [
		{id: 'someElementId', func: (data) => {console.log(data)} }
	]
};
/*Конец примеров*/

const listeners = {};
const appOptions = {
	targetToSend: window.opener || window.top,
	targetToReceive: window,
	target: '*',//window.location.origin для одного домена
};

const makeInitListener = (targetToReceive) => {
	targetToReceive.addEventListener('message', (event) => {
		if (event?.data) {
			const {message, payload = {}} = event.data;
			const {id, data} = payload;
			if (id && message) {
				const element = listeners?.[message]?.[id];
				if (element) {
					const {func} = element;
					func && func(data)
				}

			}
		}
	})
};

const init = ({targetToSend, targetToReceive, target}) => {
	appOptions.targetToSend = targetToSend;
	appOptions.targetToReceive = targetToReceive;
	appOptions.target = target;
	makeInitListener(appOptions.targetToReceive);
};




class postmessClass {
	constructor(id, sender, options) {
		// при подписке передать сюда любой уникальный id.
		// можно было бы его тут формировать, но не хочу подтягивать сюда сторонние библиотеки
		this.id = id;
		this.options = options;
		this.sender = sender;
	}
	subscribe = (methodName, func) => {
		//нахожу метод в listeners
		const methods = listeners[methodName] || [];
		// убираю из него подписчика с таким же id, если есть
		const newMethods = methods.filter(item => item.id !== this.id);
		// добавляю новую подписку
		newMethods.push({id: this.id, func});
		//обновляю listeners
		listeners[methodName] = newMethods;
		console.log('Успешная подписка,', listeners);

	};
	unsubscribe = (methodName) => {
		//нахожу метод в listeners
		const methods = listeners[methodName] || [];
		// убираю из него подписчика с таким же id, если есть
		const newMethods = methods.filter(item => item.id !== this.id);
		//обновляю listeners
		listeners[methodName] = newMethods;
	};

	sendMessage = (method, data) => {
		const {target, targetToSend} = this.options;
		const message = {
			message: method,
			payload: {
				id: this.id, // id для установки соответствия
				data, //данные
				sender: this.sender
			}
		};
		targetToSend.postMessage(message, target)
	}


}

const postmess = (id, senderName) => new postmessClass(id, senderName, appOptions);
export default {
	init,
	postmess,
}
