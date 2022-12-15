import React from 'react';
import { useAuthContext } from '../../shared/auth/AuthContext';
import { apiUrl } from '../../shared/client/api';
import ButtonsCard from '../../shared/components/basic/ButtonsCard';
import DeleteCard from '../../shared/components/basic/DeleteCard';
import Menu from '../../shared/components/menu/Menu';
import useIsMounted from '../../shared/hooks/useIsMounted';
import { ThreeDots } from 'react-loader-spinner';
import validate from './SellersValidator';
import { isValid } from '../../shared/util/ValidationUtil';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sellers = () =>{

    const isMounted = useIsMounted();
    const {getRequest, postRequest, putRequest, deleteRequest} = useAuthContext();
    const notify = (message) => toast.error(message, {position:toast.POSITION.TOP_RIGHT,autoClose:4000});
    const[invoices, setInvoices] = React.useState({data:[]});
    const[sellers, setSellers] = React.useState({data:[]});
    const[refreshSellers, setRefreshSellers] = React.useState(false);
    const[isLoaded, setIsLoaded] = React.useState(false);
    const[createSeller, setCreateSeller] = React.useState({
        sellerName:"",
        hqAdress:"",
        isActive:false,
        errors:[],
    });
    const[createSellerWindow, setCreateSellerWindow] = React.useState(false);
    const[editSeller, setEditSeller] = React.useState({
        sellerName:"",
        hqAdress:"",
        isActive:false,
        errors:[],
        disabled:true,
    });
    const[editSellerWindow, setEditSellerWindow] = React.useState(false);
    const[idSeller] = React.useState({id:0});
    const[deleteSellerWindow, setDeleteSelerWindow] = React.useState(false);

    //handle create window
    const handleCreateSellerWindow = () =>{
      setCreateSeller({...createSeller,sellerName:"",hqAdress:"",isActive:false})
        setCreateSellerWindow(true);
    }
    const handleDiscardSellerWindow = () =>{
      setCreateSellerWindow(false);
    }

    const handleSellerName = (event) =>{
        setCreateSeller({...createSeller, sellerName:event.target.value});
    };

    const handleHqAdress = (event) =>{
        setCreateSeller({...createSeller, hqAdress:event.target.value});
    };

    const handleIsActive = (event) =>{
        var selectedValue = event.target.value;
        if(selectedValue === "active")
        {
            setCreateSeller({...createSeller, isActive:true});
        }
        else{
            setCreateSeller({...createSeller, isActive:false});
        }
        
    };

    const handleEditSellerWindow = () => {
      if(editSeller.disabled === false)
      {
        setEditSellerWindow(true);
      }
    }

    const handleDiscardEditWindow = () => {
      setEditSellerWindow(false);
    }
    const handleEditSellerName = (event) =>{
        setEditSeller({...editSeller, sellerName:event.target.value});
    };

    const handleEditHqAdress = (event) =>{
        setEditSeller({...editSeller, hqAdress:event.target.value});
    };

    const handleEditIsActive = (event) =>{
        var selectedValue = event.target.value;
        if(selectedValue === "active")
        {
            setEditSeller({...editSeller, isActive:true});
        }
        else{
            setEditSeller({...editSeller, isActive:false});
        }    
    };

    //handle delete window
    const handleDeleteSellerWindow = () =>{
      if(editSeller.disabled === false){
        setDeleteSelerWindow(true);
      }     
    };

    const handleDiscardWindow = () => {
      setDeleteSelerWindow(false);
    }

    //GET
    React.useEffect(() => {
        getRequest(apiUrl("Sellers"))
          .then((response) => {
            if (isMounted.current) {
                if (!!response ) {
                    setSellers({...sellers, data:response});
                    setIsLoaded(true);
                  }
            }
          })
          .catch((error) => console.error(error));
        // eslint-disable-next-line
      }, [refreshSellers === true]);

      //GET:INVOICES
    React.useEffect(() => {
      getRequest(apiUrl("Invoices"))
        .then((response) => {
          if (isMounted.current) {
              if (!!response ) {
                  setInvoices({...invoices, data:response});
                 // setIsLoaded(true);
                }
          }
        })
        .catch((error) => console.error(error));
      // eslint-disable-next-line
    }, []);

      const prepareValidForm = () => {
        const{errors, ...rest} = createSeller;
        return{
          ...rest
        };
      };

      const prepareEditValidForm = () => {
        const{errors, disabled, ...rest} = editSeller;
        return{
          ...rest
        };
      };

      //POST: CREATE
      const handleCreateSeller = (event) =>{
        event.preventDefault();
        const violations = validate(prepareValidForm());
        if(isValid({errors: violations})){
          setRefreshSellers(false);
          postRequest(apiUrl("Sellers"), prepareValidForm())
          .then(response => {
            setCreateSellerWindow(false);
            setRefreshSellers(true);
          })
          .catch(error => console.error(error));
        }else{
          setCreateSeller({ ...createSeller, errors: violations });
          for(var i = 0; i < createSeller.errors.length; i++){
            notify(createSeller.errors[i].message);
          }
        }
      };

      //PUT: EDIT
      const handleEditCustomer = (event) =>{
        event.preventDefault();
        const violations = validate(prepareEditValidForm());
        if(isValid({errors: violations})){
          setRefreshSellers(false);
          putRequest(apiUrl("Sellers/"+idSeller.id), prepareEditValidForm())
          .then(response => {
            setEditSellerWindow(false);
            setRefreshSellers(true);
        })
        .catch(error => console.error(error));
      }else{
          setEditSeller({ ...editSeller, errors: violations });
          for(var i = 0; i < editSeller.errors.length; i++){
            notify(editSeller.errors[i].message);
          }
        }
      };

      //DELETE
      const handleDeleteSeller = (event) =>{
        event.preventDefault();
        setRefreshSellers(false);
        deleteRequest(apiUrl("Sellers/"+idSeller.id))
        .then(response => {
          setDeleteSelerWindow(false);
          setRefreshSellers(true);
        })
        .catch(error => console.error(error));
      };

       var table = document.getElementById('table');
       if(isLoaded === true)
       {
         for(var i = 0; i < table.rows.length; i++)
          { 
            table.rows[i].onclick = function(){
              idSeller.id = this.id;
              for(var i = 0; i < sellers.data.length; i++){                
                if(idSeller.id === sellers.data[i].id){
                  setEditSeller({sellerName:sellers.data[i].sellerName, hqAdress:sellers.data[i].hqAdress, isActive:sellers.data[i].isActive, disabled:false});
                  this.className+="flex flex-row border-2 rounded-lg px-2 py-1 mb-1 bg-red-500";                              
                }
              }
            } 
          }
       }
       
    return(
        <div className='flex flex-col'>
          <ToastContainer />
            <div className='self-center bg-default-background border-2 border-primary-border rounded-lg px-20 py-0.5 mb-12'>
                <span className='font-semibold text-white'>SELLERS</span>
            </div>
            <div className='flex justify-center mb-36'>
               <ButtonsCard createCWindow={handleCreateSellerWindow} editWindow={handleEditSellerWindow} deleteWindow={handleDeleteSellerWindow}/>
            </div>
            <Menu/>
            <div className='flex justify-center'>
                <table id='table' className='flex flex-col w-76'>
                    <tr className='bg-default-background text-white border-2 border-primary-border rounded-lg px-4 py-2 mb-2'>
                        <th className="font-bold text-lg pr-20">Company name</th>
                        <th className="font-bold text-lg pr-20">HQ Adress</th>
                        <th className="font-bold text-lg pr-16">Is Active</th>
                    </tr>
                    {!!sellers && !!sellers.data && sellers.data.map((seller,index)=>{
                            return(
                              <tr id={seller.id} key={index} className="flex flex-row border-2 border-primary-border rounded-lg px-2 py-1 mb-1">
                                <td className="w-1/3">{seller.sellerName}</td>
                                <td className="pl-10 w-1/3">{seller.hqAdress}</td>
                                <td className="pl-8 w-1/3">{!!seller.isActive?"is Active":"is not Active"}</td>
                              </tr>
                            );
                        })}      
                </table>
            </div>
            <div className='flex justify-center'>
            {!isLoaded &&  
              <ThreeDots
                width={50}
                height={50}
                color="red"
                ariaLabel="loading"
                className="flex justify-center"
              />}          
            </div>
            {/* CREATE SELLER WINDOW */}
            <div className={!!createSellerWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                  <div className='bg-default-background rounded-lg px-2'>
                    <span className="text-lg text-white font-bold mr-3">Create an seller</span>
                    <span className="text-lg text-white font-bold">x</span>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="name">Name</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="sellerName" name="sellerName" value={createSeller.sellerName} onChange={handleSellerName}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="surname">Adress</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="hqAdress" name="hqAdress" value={createSeller.hqAdress}  onChange={handleHqAdress}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="adress">Active</label>
                    <select className='border-2 border-primary-border rounded-lg' id="isActive" name="isActive" onChange={handleIsActive}>
                        <option value="isNotActive">Is not Active</option>
                        <option value="active">Is Active</option>
                    </select>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button border-2 border-discard-border rounded-lg px-4 py-0.5' onClick={handleDiscardSellerWindow}>Discard</button>
                    <button className='bg-default-background border-primary-border text-white font-semibold border-black rounded-lg px-4 py-0.5' onClick={handleCreateSeller}>Create</button>
                  </div>
                </form>
            </div>
             {/* EDIT SELLER WINDOW */}
             <div className={!!editSellerWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                  <div className='bg-default-background rounded-lg px-2'>
                    <span className="text-lg text-white font-bold mr-3">Edit an seller</span>
                    <span className="text-lg text-white font-bold">x</span>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="name">Name</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="sellerName" name="sellerName" value={editSeller.sellerName} onChange={handleEditSellerName}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="surname">Adress</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="hqAdress" name="hqAdress" value={editSeller.hqAdress}  onChange={handleEditHqAdress}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="adress">Active</label>
                    <select className='border-2 border-primary-border rounded-lg' id="isActive" name="isActive" onChange={handleEditIsActive}>
                        {editSeller.isActive === false?<option value="isNotActive" selected>Is not Active</option>:<option value="isNotActive">Is not Active</option>}
                        {editSeller.isActive === true?<option value="active" selected>Is Active</option>:<option value="active">Is Active</option>}
                    </select>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button border-2 border-discard-border rounded-lg px-4 py-0.5' onClick={handleDiscardEditWindow}>Discard</button>
                    <button className='bg-default-background border-primary-border text-white font-semibold border-black rounded-lg px-4 py-0.5' onClick={handleEditCustomer}>Edit</button>
                  </div>
                </form>
            </div>
            <div className={!!deleteSellerWindow?'flex self-center rounded-lg absolute z-40 mt-36 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]':'flex self-center hidden absolute z-40 mt-36'}>
              <DeleteCard discardWindow={handleDiscardWindow} deleteWindow={handleDeleteSeller}/>
            </div>
        </div>
    );
}

export default Sellers;