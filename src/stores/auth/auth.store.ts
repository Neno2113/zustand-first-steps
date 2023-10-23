import type { AuthStatus, User } from "../../interfaces";
import { StateCreator, create } from 'zustand';
import { AuthService } from "../../services/auth.service";
import { devtools, persist } from 'zustand/middleware';


export interface AuthState {


    status: AuthStatus;
    token?: string;
    user?: User;

    loginUser: ( email: string, password: string ) => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    logoutUser: () => void

}



export const storeApi: StateCreator<AuthState> = ( set ) => ({

    status: 'pending',
    token: undefined,
    user: undefined,

    loginUser: async( email: string, password: string ) => {
        try {
            const { token, ...user } =  await AuthService.login(email, password);

            set({ status: 'authorized', token, user})

        } catch (error) {
            set({ status: 'unathorized', token: undefined, user: undefined})
            throw('Unauthorize')
        }

    },
    checkAuthStatus: async() => {

        try {
            const { token, ...user} = await AuthService.checkStatus();

            set({ status: 'authorized', token, user})

        } catch (error) {
            set({ status: 'unathorized', token: undefined, user: undefined})
            throw('Unauthorize')
        }
    },
    logoutUser: () => {
        set({ status: 'unathorized', token: undefined, user: undefined})
    }   

})



export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi

        , { name: 'auth-store'}
        )
    )
);


