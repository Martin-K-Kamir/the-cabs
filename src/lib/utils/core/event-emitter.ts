/* eslint-disable @typescript-eslint/no-explicit-any */

type EventListener = (...args: any[]) => void;

const eventsMap = new WeakMap<object, Map<string, EventListener[]>>();

function on<T extends string>(
    this: object,
    eventName: T,
    listener: EventListener,
) {
    const events = eventsMap.get(this) || new Map<string, EventListener[]>();
    if (!events.has(eventName)) {
        events.set(eventName, []);
    }
    events.get(eventName)!.push(listener);
    eventsMap.set(this, events);
}

function off<T extends string>(
    this: object,
    eventName: T,
    listener: EventListener,
) {
    const events = eventsMap.get(this);
    if (events && events.has(eventName)) {
        let foundFirstOccurrence = false;
        const filteredEvents = events.get(eventName)!.filter(fn => {
            if (fn === listener && !foundFirstOccurrence) {
                foundFirstOccurrence = true;
                return false;
            }
            return true;
        });

        if (filteredEvents.length === 0) {
            events.delete(eventName);
        } else {
            events.set(eventName, filteredEvents);
        }
    }
}

function emit<T extends string>(this: object, eventName: T, ...args: any[]) {
    const events = eventsMap.get(this);
    if (!events || !events.has(eventName)) {
        return false;
    }

    events.get(eventName)!.forEach(listener => {
        listener(...args);
    });

    return true;
}

type EventEmitterInstance<TEvents extends string> = {
    on: (eventName: TEvents, listener: EventListener) => void;
    off: (eventName: TEvents, listener: EventListener) => void;
    emit: (eventName: TEvents, ...args: any[]) => boolean;
};

export function eventEmitter<
    TEvents extends string,
>(): EventEmitterInstance<TEvents> {
    const instance = {};

    return {
        on: on.bind(instance),
        off: off.bind(instance),
        emit: emit.bind(instance),
    };
}

export type EventEmitter<TEvents extends string> = ReturnType<
    typeof eventEmitter<TEvents>
>;
