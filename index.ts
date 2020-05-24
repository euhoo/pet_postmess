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
    // targetToSend: window.top.bggisMapWindow,
    // targetToReceive: window.top,

};

const listenersExample = {
    // enableCoordinateSelection: [
    // 	{id: 'someElementId', func: (data) => {console.log(data)} }
    // ]
};
/*Конец примеров*/


type Payload_T<T = any> = {
    id: string
    data: T
	sender: string
}
type Method_T<T> = {
    id: string,
    func: (data: T) => {}
}
type Listeners_T<T = any> = {
    [key: string]: Method_T<T>[]
}
type AppOptions_T = {
    targetToSend: Window
    targetToReceive: Window,
    target: string,//window.location.origin для одного домена
}
const listeners: Listeners_T = {};
const appOptions: AppOptions_T = {
    targetToSend: window.opener || window.top,
    targetToReceive: window,
    target: '*',//window.location.origin для одного домена
};


const makeInitListener = <T = any>(targetToReceive: Window) => {
    targetToReceive.addEventListener('message', (event: MessageEvent) => {
            if (event?.data) {
                const {message, payload}: { message: string, payload: Payload_T<T> } = event.data;
                if (payload) {

                    const {id, data} = payload;
                    if (id && message) {
                        const methods: Method_T<T>[] = listeners?.[message] || [];
                        if (methods) {
                            const elementArr = methods.filter(item => item.id === id);
                            if (elementArr.length) {
                                const [element] = elementArr;
                                const {func} = element;
                                func && func(data)
                            }
                        }
                    }
                }
            }
        }
    )
};

const init = (options: AppOptions_T) => {
	const {targetToSend, targetToReceive, target} = options;
    appOptions.targetToSend = targetToSend;
    appOptions.targetToReceive = targetToReceive;
    appOptions.target = target;
    makeInitListener(appOptions.targetToReceive);
};


class postmessClass<Postmess_I> {
    private id: string;
    private options: AppOptions_T;
    private sender: string;

    constructor(id: string, sender: string, options: AppOptions_T) {
        // при подписке передать сюда любой уникальный id.
        // можно было бы его тут формировать, но не хочу подтягивать сюда сторонние библиотеки
        this.id = id;
        this.options = options;
        this.sender = sender;
    }

    subscribe = <T = any>(methodName: string, func: (data:T) => {}) => {
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
    unsubscribe = (methodName: string) => {
        //нахожу метод в listeners
        const methods = listeners[methodName] || [];
        // убираю из него подписчика с таким же id, если есть
        const newMethods = methods.filter(item => item.id !== this.id);
        //обновляю listeners
        listeners[methodName] = newMethods;
    };

    sendMessage = <T = any>(method:string, data: T) => {
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

const postmess = (id: string, senderName: string) => new postmessClass(id, senderName, appOptions);
export default {
    init,
    postmess,
}
