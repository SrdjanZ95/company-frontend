import React from 'react';
import EditIcon from '../../../assets/icons/EditIcon';

function ButtonsCard({createCWindow, editWindow, deleteWindow, ...rest}){
    return(
        <div className='flex flex-row border-2 border-primary-border rounded-lg px-2 py-1 absolute '>
            <button className='bg-create-button border-2 rounded-full px-3 pb-2 mr-2' onClick={createCWindow}>
                <span className='font-bold text-4xl text-white'>+</span>
            </button>
            <button className='flex bg-edit-button border-2 rounded-full px-4 pb-2.5 mr-2' onClick={editWindow}>
                <span className='self-center font-bold' ><EditIcon className="pt-1.5 h-5 w-5" color="white"/></span>
            </button>
            <button className='border-2 bg-delete-button rounded-full px-4' onClick={deleteWindow}>
                <span className='font-bold text-xl text-white'>X</span>
            </button>
        </div>
    );
}

export default ButtonsCard;