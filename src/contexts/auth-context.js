import {createContext, useContext, useEffect, useReducer, useRef} from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
    INITIALIZE: 'INITIALIZE',
    SIGN_IN: 'SIGN_IN',
    SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    permissions: []  // Permissions state added
};

const handlers = {
    [HANDLERS.INITIALIZE]: (state, action) => {
        if (!action.payload) {
            return {
                ...state,
                isLoading: false
            };
        }

        const {user, permissions} = action.payload;

        return {
            ...state,
            ...(user ? {
                isAuthenticated: true,
                isLoading: false,
                user,
                permissions
            } : {
                isLoading: false
            })
        };
    },
    [HANDLERS.SIGN_IN]: (state, action) => {
        const {user, permissions} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
            permissions  // Permissions added to state
        };
    },
    [HANDLERS.SIGN_OUT]: (state) => {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
            permissions: []  // Reset permissions on sign out
        };
    }
};

const reducer = (state, action) => (
    handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({undefined});

export const AuthProvider = (props) => {
    const {children} = props;
    const [state, dispatch] = useReducer(reducer, initialState);
    const initialized = useRef(false);

    const fetchPermissions = async () => {
        try {
            const token = window.localStorage.getItem('token');
            // fetch permissions from your API
            const res = await fetch('http://localhost:3000/permissions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error('Yetkiler alınırken bir hata oluştu');
            }
            const data = await res.json();
            return data.permissions;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    };

    const initialize = async () => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initialized.current) {
            return;
        }

        initialized.current = true;

        let isAuthenticated = false;

        try {
            isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
        } catch (err) {
            console.error(err);
        }

        if (isAuthenticated) {
            const user = {
                id: '5e86809283e28b96d2d38537',
                avatar: '/assets/avatars/avatar-anika-visser.png',
                name: 'Anika Visser',
                email: 'anika.visser@devias.io'
            };
            // hey copilot can you write fetchPermissions function for me?
            const permissions = await fetchPermissions();  // Fetch permissions here
            dispatch({
                type: HANDLERS.INITIALIZE,
                payload: {user, permissions}
            });
        } else {
            dispatch({
                type: HANDLERS.INITIALIZE
            });
        }
    };

    useEffect(
        () => {
            initialize();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const skip = () => {
        try {
            window.sessionStorage.setItem('authenticated', 'true');
        } catch (err) {
            console.error(err);
        }

        const user = {
            id: '5e86809283e28b96d2d38537',
            avatar: '/assets/avatars/avatar-anika-visser.png',
            name: 'Anika Visser',
            email: 'anika.visser@devias.io'
        };

        dispatch({
            type: HANDLERS.SIGN_IN,
            payload: {user, permissions: []}  // Placeholder for permissions
        });
    };

    const signIn = async (email, password) => {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        const result = await response.json();
        if (result.token) {
            window.localStorage.setItem('token', result.token);
            window.localStorage.setItem('role', result.role);
            window.sessionStorage.setItem('authenticated', 'true');

            const permissions = await fetchPermissions();  // Fetch permissions here

            dispatch({
                type: HANDLERS.SIGN_IN,
                payload: {user: result.user, permissions}
            });
        } else {
            throw new Error(result.error || 'Login failed'); // Hata mesajını döndür
        }
    };

    const signUp = async (companyName,
                          companyAddress,
                          companyPhone,
                          companyEmail,
                          companyFormUrl,
                          firstName,
                          lastName,
                          email,
                          phone,
                          password) => {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyName,
                companyAddress,
                companyPhone,
                companyEmail,
                companyFormUrl,
                firstName,
                lastName,
                email,
                phone,
                password
            })
        });

        const result = await response.json();

        if (result.success) {
            return;
        } else {
            const result = await response.json();
            throw new Error(result.message || 'Registration failed');
        }
    };

    const signOut = () => {
        window.localStorage.clear();
        window.sessionStorage.clear();

        dispatch({
            type: HANDLERS.SIGN_OUT,
            payload: {
                user: null,
                permissions: []
            }
        });
    };

    const forgotPassword = async (email) => {
        const response = await fetch('http://localhost:3000/forgotPassword', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email}),
        });
        if (response.ok) {
            return await response.json(); // If the response was successful, return the data.
        } else {
            // If the response was not successful, throw an error.
            const error = await response.json();
            throw new Error(error.message);
        }
    };

    const resetPassword = async (password, token) => {
        console.log("fetch password", password);
        console.log("fetch token", token);
        const response = await fetch('http://localhost:3000/resetPassword', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password, token}), // Send token in the request body
        });
        if (response.ok) {
            console.log("response.ok")
            return await response.json(); // If the response was successful, return the data.
        } else {
            // If the response was not successful, throw an error.
            const error = await response.json();
            throw new Error(error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                skip,
                signIn,
                signUp,
                signOut,
                forgotPassword,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);