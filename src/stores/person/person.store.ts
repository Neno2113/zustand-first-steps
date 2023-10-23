import { type StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { firebaseStorage } from "../../storages/firebase.storage";
import { logger } from "../middlewares/logger.middleware";
import { useWeddingBoundStore } from "../wedding";




interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: ( value: string ) => void;
    setLastName: ( value: string ) => void;
}


const storeApi: StateCreator<PersonState & Actions, [["zustand/devtools", unknown]]>  = (set) => ({
    
    firstName: '',
    lastName: '',

    setFirstName: ( value: string ) => set( ({ firstName: value}), false, 'setFirstName'),
    setLastName: ( value: string ) => set( ({ lastName: value}), false, 'setLastName'),
});





export const usePersonStore = create<PersonState & Actions>()( 
    devtools(
        persist(
            storeApi
            ,{ 
                name: 'person-storage',
                storage: firebaseStorage,
            }
        )
    )
)

usePersonStore.subscribe( (nextState, ) => {

    const { firstName, lastName } = nextState;

    useWeddingBoundStore.getState().setFirstName(firstName);
    useWeddingBoundStore.getState().setLastName(lastName);
})