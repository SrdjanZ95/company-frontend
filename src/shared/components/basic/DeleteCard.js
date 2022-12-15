import React from 'react';

const DeleteCard = ({deleteWindow, discardWindow}) =>{
    return(
        <div className='border-2 border-primary-border bg-white rounded-lg px-6 py-3'>
            <span className='bg-default-background flex content-center mx-9 rounded-lg px-2 py-0.5 text-white mb-2 font-bold '>Are you sure ?</span>
            <div className='mb-2'>
                <button className='border-2 border-red-400 bg-delete-button rounded-lg px-7 py-0.5 mr-2 font-semibold' onClick={deleteWindow}>Yes</button>
                <button className='border-2 border-discard-border bg-discard-button rounded-lg px-7 py-0.5 ml-2 font-semibold' onClick={discardWindow}>No</button>
            </div>
        </div>
    );
};

export default DeleteCard;