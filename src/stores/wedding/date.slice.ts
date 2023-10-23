import { StateCreator } from "zustand";



export interface DateSlice {

    eventDate: Date;


    eventYYYMMDD : () => string;
    eventHHMM : () => string;

    setEventDate: ( parcialDate: string ) => void;
    setEventTime: ( parcialTime: string ) => void;
}



export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({

    eventDate: new Date(),

    eventYYYMMDD: () => {
        return get().eventDate.toISOString().split('T')[0];
    },
    eventHHMM: () => {
        const hours = get().eventDate.getHours().toString().padStart(2, '0');
        const minutes = get().eventDate.getMinutes().toString().padStart(2, '0');

        return `${ hours }:${ minutes }`;
    },
    setEventDate: (parcialDate: string ) => set( (state) => {
        const date = new Date(parcialDate);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const newDate = new Date( state.eventDate);
        newDate.setFullYear(year, month, day);
        console.log(newDate);
        

        return { eventDate: newDate };
    }),

    setEventTime: (eventTime: string) => set( ( state ) => {
        const hours = parseInt( eventTime.split(':')[0]);
        const minutes = parseInt( eventTime.split(':')[1]);

        const newDate =  new Date(state.eventDate);
        newDate.setHours( hours, minutes );

        return { eventDate: newDate }
    })


})