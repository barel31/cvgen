interface Event {
    type: string;
    payload: any;
}

interface EventCallback {
    (event: Event): void;
}

const listeners: { [eventType: string]: EventCallback[] } = {};

function on(eventType: string, callback: EventCallback) {
    if (!listeners[eventType]) {
        listeners[eventType] = [];
    }
    listeners[eventType].push(callback);
}

function off(eventType: string, callback: EventCallback) {
    if (!listeners[eventType]) {
        return;
    }
    const index = listeners[eventType].indexOf(callback);
    if (index !== -1) {
        listeners[eventType].splice(index, 1);
    }
}

function emit(type: string, payload: any) {
    if (!listeners[type]) return
    listeners[type].forEach(callback => callback(payload));
}

function showSuccessMsg() {
    emit('show-msg', 'Personal details saved successfully')
}
function showDeleteMsg(section: string) {
    emit('show-msg', `${section} Section removed successfully`)
}

export const eventBus = {
    on,
    off,
    emit,
    showSuccessMsg,
    showDeleteMsg
}
