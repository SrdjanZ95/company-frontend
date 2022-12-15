import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({children}) =>{

    const getRequest = (url) =>{
       return fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        })
        .then((response) => response.json())
        .catch((error) => new Error(error));
    };

    const postRequest = (url, body) =>{
        return fetch(url,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then((response) =>{
            if(response.ok){
                return response.json();
            }
            return response.json();
        })
    }

    const putRequest = (url, body) =>{
        return fetch(url,{
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then((response) =>{
            if(response.ok){
                return response.json();
            }
            return response.json();
        })
    }

    const deleteRequest = (url) =>{
        return fetch(url,{
            method:'DELETE',
        })
        .then((response) =>{
            if(response.ok){
                return response.json();
            }
            return response.json();
        })
    }   

    const contextPayload = React.useMemo(
        () => ({getRequest, postRequest, putRequest, deleteRequest}),
    )

    return (
        <AuthContext.Provider value={contextPayload}>
          {children}
        </AuthContext.Provider>
      );
}

export const useAuthContext = () => React.useContext(AuthContext);