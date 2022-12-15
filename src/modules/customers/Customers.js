import React from 'react';
import { useAuthContext } from '../../shared/auth/AuthContext';
import { apiUrl } from '../../shared/client/api';
import ButtonsCard from '../../shared/components/basic/ButtonsCard';
import DeleteCard from '../../shared/components/basic/DeleteCard';
import Menu from '../../shared/components/menu/Menu';
import useIsMounted from '../../shared/hooks/useIsMounted';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validate from './CustomersValidator';
import { isValid } from '../../shared/util/ValidationUtil';

const Customers = () =>{

    const notify = (message) => toast.error(message, {position:toast.POSITION.TOP_RIGHT,autoClose:4000});
    const isMounted = useIsMounted();
    const {getRequest, postRequest, putRequest, deleteRequest} = useAuthContext();

    const[customers, setCustomers] = React.useState({data:[]});
    const[isLoaded, setIsLoaded] = React.useState(false);
    const[refreshCustomers,setRefreshCustomers] = React.useState(false);
    const[createCustomer, setCreateCustomer] = React.useState({
        name:"",
        surname:"",
        adress:"",
        age:18,
        errors:[],
    });
    const[createCustomerWindow, setCreateCustomerWindow] = React.useState(false);
    const[idCustomer] = React.useState({id:0});
    const[editCustomer, setEditCustomer] = React.useState({
      name:"",
      surname:"",
      adress:"",
      age:0,
      errors:[],
      disabled:true,
    });
    const[editCustomerWindow, setEditCustomerWindow] = React.useState(false);
    const[deleteCustomerWindow, setDeleteCustomerWindow] = React.useState(false);

    //create customer handle
    const handleName = (event) =>{
        setCreateCustomer({...createCustomer, name:event.target.value});
    };

    const handleSurname = (event) =>{
        setCreateCustomer({...createCustomer, surname:event.target.value});
    };

    const handleAdress = (event) =>{
        setCreateCustomer({...createCustomer, adress:event.target.value});
    };

    const handleAge = (event) =>{
        setCreateCustomer({...createCustomer, age:event.target.value});
    };

    //edit customer handle
    const handleEditName = (event) =>{
      setEditCustomer({...editCustomer, name:event.target.value});
      };

    const handleEditSurname = (event) =>{
      setEditCustomer({...editCustomer, surname:event.target.value});
      };

    const handleEditAdress = (event) =>{
      setEditCustomer({...editCustomer, adress:event.target.value});
      };

      const handleEditAge = (event) =>{
        setEditCustomer({...editCustomer, age:event.target.value});
    };

    const prepareValidForm = () => {
      const{errors, ...rest} = createCustomer;
      return{
        ...rest,
      };
    };

    const prepareEditValidForm = () => {
      const {errors, disabled, ...rest} = editCustomer;
      return{
        ...rest,
      };
    };

    //GET
    React.useEffect(() => {
        getRequest(apiUrl("Customers"))
          .then((response) => {
            if (isMounted.current) {
                if (!!response ) {
                    setCustomers({...customers, data:response})
                    setIsLoaded(true);
                  }
            }
          })
          .catch((error) => console.error(error));
        // eslint-disable-next-line
      }, [refreshCustomers==true]);

      //POST: CREATE
      const handleCreateCustomer = (event) =>{
        event.preventDefault();
        const violations = validate(prepareValidForm());
        if(isValid({errors: violations})){
          setRefreshCustomers(false);
          postRequest(apiUrl("Customers"), prepareValidForm())
          .then(response => {
            setCreateCustomerWindow(false);
            setRefreshCustomers(true);
          })
          .catch(error => console.error(error));
        }else{
          setCreateCustomer({ ...createCustomer, errors: violations });
          for(var i = 0; i < createCustomer.errors.length; i++){
            notify(createCustomer.errors[i].message);
          }
        }
      };

      //PUT: EDIT
      const handleEditCustomer = (event) =>{
        event.preventDefault();
        const violations = validate(prepareEditValidForm());
        if(isValid({errors: violations})){
        setRefreshCustomers(false);
        putRequest(apiUrl("Customers/"+idCustomer.id), prepareEditValidForm())
        .then(response => {
          setEditCustomerWindow(false);
          setRefreshCustomers(true);
        })
        .catch(error => console.error(error));
      }else{
          setEditCustomer({ ...editCustomer, errors: violations });
          for(var i = 0; i < editCustomer.errors.length; i++){
            notify(editCustomer.errors[i].message);
          }
        }
      };

      //DELETE
      const handleDeleteCustomer = (event) =>{
        event.preventDefault();
        setRefreshCustomers(false);
        deleteRequest(apiUrl("Customers/"+idCustomer.id))
        .then(response => {
          setDeleteCustomerWindow(false);
          setRefreshCustomers(true);
        })
        .catch(error => console.error(error));
      };

      const handleDiscardCustomerWindow = () => {
        setCreateCustomerWindow(false);
        setEditCustomerWindow(false);
        setDeleteCustomerWindow(false);
      };

      const handleCreateCustomerWindow = () =>{
        setCreateCustomer({...createCustomer, name:"",surname:"",adress:"",age:18});
        setCreateCustomerWindow(true);
      };

      const handleEditCustomerWindow = () =>{
        //var enabled = false;
        if(editCustomer.disabled === false){
          setEditCustomerWindow(true);
        }
      }
      
      const handleDeleteCustomerWindow = () =>{
        if(editCustomer.disabled === false){
        setDeleteCustomerWindow(true);
        }
      }

      var table = document.getElementById('table');
      if(isLoaded === true)
      {
        for(var i = 0; i < table.rows.length; i++)
        {       
          table.rows[i].onclick = function(){
            idCustomer.id = this.id;
            for(var i = 0; i < customers.data.length; i++){
              if(idCustomer.id === customers.data[i].id){
                setEditCustomer({name:customers.data[i].name, surname:customers.data[i].surname, adress:customers.data[i].adress, age:customers.data[i].age,disabled:false});
                this.className+="flex flex-row border-2 rounded-lg px-2 py-1 mb-1 bg-red-500";            
              }
            }    
          }  
        }
      }
      
    return(
        <div className='flex flex-col'>
            <div className='self-center'>
              <ToastContainer />
            </div>
            <div className='self-center bg-default-background border-2 border-primary-border rounded-lg px-20 py-0.5 mb-12'>
                <span className='font-semibold text-white'>CUSTOMERS</span>
            </div>
            <div className='flex justify-center mb-36'>
               <ButtonsCard  createCWindow={handleCreateCustomerWindow} editWindow={handleEditCustomerWindow} deleteWindow={handleDeleteCustomerWindow}/>
            </div>
            <Menu/>
            <div className='flex justify-center'>
                <table id='table' className='flex flex-col w-76'>
                    <tr className='bg-default-background text-white border-2 border-primary-border rounded-lg px-4 py-2 mb-2'>
                        <th className="font-bold text-lg pr-20">Name</th>
                        <th className="font-bold text-lg pr-20">Surname</th>
                        <th className="font-bold text-lg pr-20">Adress</th>
                        <th className="font-bold text-lg pr-20">Age</th>
                    </tr>
                        {!!customers && !!customers.data && customers.data.map((customer,index)=>{
                            return(
                                    <tr id={customer.id} key={index} className="flex flex-row border-2 border-primary-border rounded-lg px-2 py-1 mb-1">
                                        <td className="w-1/4">{customer.name}</td>
                                        <td className="w-1/4">{customer.surname}</td>
                                        <td className="w-1/4">{customer.adress}</td>
                                        <td className="w-1/4">{customer.age}</td>
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
            {/* Ako je createCutomerWindow == true prikazi mi createWindow, u suprotnom skloni ga */}
            <div className={!!createCustomerWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                  <div className='bg-default-background rounded-lg px-2 mb-2'>
                    <span className="text-white text-lg font-bold mr-3">Create an customer</span>
                    <span className="text-white text-lg font-bold">x</span>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="name">Name</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="name" name="name" value={createCustomer.name} onChange={handleName}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="surname">Surname</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="surname" name="surname" value={createCustomer.surname}  onChange={handleSurname}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="adress">Adress</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="adress" name="adress" value={createCustomer.adress}  onChange={handleAdress}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label className='font-bold' htmlFor="age">Age</label>
                    <input className='border-2 border-primary-border rounded-lg' type="number" id="age" name="age" min={18} value={createCustomer.age}  onChange={handleAge} ></input>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button border-2 border-discard-border text-white font-semibold rounded-lg px-4 py-0.5' onClick={handleDiscardCustomerWindow}>Discard</button>
                    <button className='bg-default-background border-2 border-create-border text-white font-semibold rounded-lg px-4 py-0.5' onClick={handleCreateCustomer}>Create</button>
                  </div>
                </form>
            </div>
            <div className={!!editCustomerWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                <div className='bg-default-background rounded-lg px-2 mb-2'>
                    <span className="text-white text-lg font-bold mr-3">Edit an customer</span>
                    <span className="text-white text-lg font-bold">x</span>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="name">Name</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="name" name="name" value={editCustomer.name} onChange={handleEditName}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="surname">Surname</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="surname" name="surname" value={editCustomer.surname}  onChange={handleEditSurname}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="adress">Adress</label>
                    <input className='border-2 border-primary-border rounded-lg' type="text" id="adress" name="adress" value={editCustomer.adress}  onChange={handleEditAdress}></input>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="age">Age</label>
                    <input className='border-2 border-primary-border rounded-lg' type="number" id="age" name="age" value={editCustomer.age} min={18}  onChange={handleEditAge}></input>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button border-2 border-discard-border  rounded-lg px-4 py-0.5' onClick={handleDiscardCustomerWindow}>Discard</button>
                    <button className='border-primary-border border-2 bg-default-background rounded-lg px-4 py-0.5' onClick={handleEditCustomer}>Edit</button>
                  </div>
                </form>
            </div>
            <div className={!!deleteCustomerWindow?'flex self-center absolute z-40 mt-36 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]':'flex self-center hidden absolute z-40 mt-36'}>
              <DeleteCard deleteWindow={handleDeleteCustomer} discardWindow={handleDiscardCustomerWindow}/>
            </div>
        </div>
    );
}

export default Customers;