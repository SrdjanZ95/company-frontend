import React from 'react';
import { useAuthContext } from '../../shared/auth/AuthContext';
import { apiUrl } from '../../shared/client/api';
import ButtonsCard from '../../shared/components/basic/ButtonsCard';
import Menu from '../../shared/components/menu/Menu';
import useIsMounted from '../../shared/hooks/useIsMounted';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteCard from '../../shared/components/basic/DeleteCard';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validate from './InvoicesValidator';
import { isValid } from '../../shared/util/ValidationUtil';



const Invoices = () =>{
    const notify = (message) => toast.error(message, {position:toast.POSITION.TOP_RIGHT,autoClose:8000});
    const[invoices, setInvoices] = React.useState({data:[]});
    const[sellers, setSellers] = React.useState({data:[]});
    const[customers, setCustomers] = React.useState({data:[]});
    const[isLoaded, setIsLoaded] = React.useState(false);
    const[refreshInvoices,setRefreshInvoices] = React.useState(false);
    const[createInvoiceWindow, setCreateInvoiceWindow] = React.useState(false);
    const isMounted = useIsMounted();
    const {getRequest, postRequest, putRequest, deleteRequest} = useAuthContext();
    const[createInvoice, setCreateInvoice] = React.useState({
        sellerId:0,
        customerId:0,
        selerName:"",
        customerName:"",
        date:new Date(),
        amount: 0,
        errors:[],
    });
    const[idInvoice] = React.useState({id:0});
    const[editInvoice, setEditInvoice] = React.useState({
        sellerId:0,
        customerId:0,
        selerName:"",
        customerName:"",
        date:new Date(),
        amount: 0,
        disabled: true,
    });
    const[editInvoiceWindow, setEditInvoiceWindow] = React.useState(false);
    const[deleteInvoiceWindow, setDeleteInvoiceWindow] = React.useState(false);

    const handleCreateInvoiceWindow = () => {
        setCreateInvoice({...createInvoice, sellerId:0, customerId:0, selerName:"asd", customerName:"dsa", date: new Date(), amount:0});
        setCreateInvoiceWindow(true);
    };

    const handleDiscardCreateWindow = () => {
        setCreateInvoiceWindow(false);
    };

    const handleDeleteInvoiceWindow = () => {
      if(editInvoice.disabled === false)
      {
        setDeleteInvoiceWindow(true);
      }
    };

    const handleDiscardInvoiceWindow = () => {
        setDeleteInvoiceWindow(false);
    };

    const handleEditInvoiceWindow = () => {
      if(editInvoice.disabled === false){
        setEditInvoiceWindow(true);
      }
    };

    const handleDiscardEditWindow = () => {
        setEditInvoiceWindow(false);
    };

    //handle create invoice
    const handleSelerName = (event) =>{
        var selectedValue = event.target.value;
        for(var i = 0; i < sellers.data.length; i++)
        {
            if(selectedValue === sellers.data[i].sellerName)
            {
                var id = sellers.data[i].id;
                setCreateInvoice({...createInvoice, sellerId:id,selerName:selectedValue});
            }
        }
    };

    const handleCustomerName = (event) =>{
        var selectedCustomerValue = event.target.value;
        for(var i = 0; i < customers.data.length; i++){
            if(selectedCustomerValue === customers.data[i].name)
            {
                var id = customers.data[i].id;
                setCreateInvoice({...createInvoice, customerId:id,customerName:selectedCustomerValue});
            }
        }
    };

    const handleDate = (date) => {
        const defaultDateIfNull = date === null ? new Date() : date;
        setCreateInvoice({ ...createInvoice, date: defaultDateIfNull });
      };

    const handleAmount = (event) =>{
        setCreateInvoice({...createInvoice, amount:event.target.value});
    };

    //EDIT
    const handleEditSelerName = (event) =>{
        var selectedValue = event.target.value;
        for(var i = 0; i < sellers.data.length; i++)
        {
          if(selectedValue === sellers.data[i].sellerName)
            {
                var id = sellers.data[i].id;
                setEditInvoice({...editInvoice, sellerId:id,selerName:selectedValue});
            }
        }
    };

    const handleEditCustomerName = (event) =>{
        var selectedCustomerValue = event.target.value;
        for(var i = 0; i < customers.data.length; i++){
            if(selectedCustomerValue === customers.data[i].name)
            {
                var id = customers.data[i].id;
                setEditInvoice({...editInvoice, customerId:id,customerName:selectedCustomerValue});
            }
        }
    };

    const handleEditAmount = (event) =>{
        setEditInvoice({...editInvoice, amount:event.target.value});
    };

    //GET:INVOICES
    React.useEffect(() => {
        getRequest(apiUrl("Invoices"))
          .then((response) => {
            if (isMounted.current) {
                if (!!response ) {
                    setInvoices({...invoices, data:response});
                    setIsLoaded(true);
                  }
            }
          })
          .catch((error) => console.error(error));
        // eslint-disable-next-line
      }, [refreshInvoices == true]);

      //GET: Customers
      React.useEffect(() => {
        getRequest(apiUrl("Customers"))
          .then((response) => {
            if (isMounted.current) {
                if (!!response ) {
                    setCustomers({...customers, data:response})
                   // setIsLoaded(true);
                  }
            }
          })
          .catch((error) => console.error(error));
        // eslint-disable-next-line
      }, []);

      //GET: SELLERS
        React.useEffect(() => {
            getRequest(apiUrl("Sellers?isActive=true"))
            .then((response) => {
                if (isMounted.current) {
                    if (!!response ) {
                       setSellers({...sellers, data:response});
                    }
                }
            })
            .catch((error) => console.error(error));
            // eslint-disable-next-line
        }, []);

      const prepareValidForm = () => {
        const{date,errors, ...rest} = createInvoice;
        return{
            ...rest,
            date:createInvoice.date.toISOString().split("T")[0],
        };
      };

      const prepareEditValidForm = () => {
        const{disabled, ...rest} = editInvoice;
        return{
          ...rest
        };
      };
     
    //POST: CREATE
    const handleCreateInvoice = (event) =>{
        event.preventDefault();
        const violations = validate(prepareValidForm());
        if(isValid({errors: violations})){
        setRefreshInvoices(false);
        postRequest(apiUrl("Invoices"), prepareValidForm())
        .then(response => {
          setCreateInvoiceWindow(false);
          setRefreshInvoices(true);
        })
        .catch(error => console.error(error));
        }else{
          setCreateInvoice({ ...createInvoice, errors: violations });
          for(var i = 0; i < createInvoice.errors.length; i++){
            notify(createInvoice.errors[i].message);
          }
        }
      };
      

       var table = document.getElementById('table');
       if(isLoaded === true)
       {
         for(var i = 0; i < table.rows.length; i++)
            {       
                table.rows[i].onclick = function(){
                idInvoice.id = this.id;
                for(var i = 0; i < invoices.data.length; i++){
                    if(idInvoice.id === invoices.data[i].id){
                    setEditInvoice({selerName:invoices.data[i].selerName, customerName:invoices.data[i].customerName, date:invoices.data[i].date, amount:invoices.data[i].amount, disabled:false});
                    this.className+="flex flex-row border-2 rounded-lg px-2 py-1 mb-1 bg-red-500";            
                    }
                }   
              } 
            }
        }

       //PUT: EDIT
      const handleEditInvoice = (event) =>{
        event.preventDefault();
        setRefreshInvoices(false);
        putRequest(apiUrl("Invoices/"+idInvoice.id), prepareEditValidForm())
        .then(response => {
          setEditInvoiceWindow(false);
          setRefreshInvoices(true);
        })
        .catch(error => console.error(error));
      };

      //DELETE
      const handleDeleteInvoice = (event) =>{
        event.preventDefault();
        setRefreshInvoices(false);
        deleteRequest(apiUrl("Invoices/"+idInvoice.id))
        .then(response => {
          setDeleteInvoiceWindow(false);
          setRefreshInvoices(true);
        })
        .catch(error => console.error(error));
      };
      
    return(
        <div className='flex flex-col'>
            <ToastContainer />
            <div className='self-center bg-default-background border-2 border-primary-border rounded-lg px-20 py-0.5 mb-12'>
                <span className='font-semibold text-white'>INVOICES</span>
            </div>
            <div className='flex justify-center mb-36'>
               <ButtonsCard createCWindow={handleCreateInvoiceWindow} editWindow={handleEditInvoiceWindow} deleteWindow={handleDeleteInvoiceWindow}/>
            </div>
            <Menu/>
            <div className='flex justify-center'>
            <table id='table' className='flex flex-col w-76'>
                    <tr className='bg-default-background text-white border-2 border-primary-border rounded-lg px-4 py-2 mb-2'>
                        <th className="font-bold text-lg pr-20">Seller</th>
                        <th className="font-bold text-lg pr-20">Customer</th>
                        <th className="font-bold text-lg pr-20">Date</th>
                        <th className="font-bold text-lg pr-20">Amount</th>
                    </tr>
                        {!!invoices && !!invoices.data && invoices.data.map((invoice,index)=>{
                            return(
                                    <tr id={invoice.id} key={index} className="flex flex-row border-2 border-primary-border rounded-lg px-2 py-1 mb-1">
                                        <td className="w-1/4">{invoice.selerName}</td>
                                        <td className="w-1/4">{invoice.customerName}</td>
                                        <td className="w-1/4">{invoice.date}</td>
                                        <td className="w-1/4">{invoice.amount}$</td>
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
                />
             }                
            </div>
            {/* Ako je createCutomerWindow == true prikazi mi createWindow, u suprotnom skloni ga */}
            <div className={!!createInvoiceWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                  <div className='bg-default-background rounded-lg px-2 mb-2'>
                    <span className="text-white text-lg font-bold mr-3">Create an invoice</span>
                    <span className="text-white text-lg font-bold">x</span>
                  </div>
                  <label htmlFor="sellername">Seller</label>
                  <select name="sellername"  onChange={handleSelerName} className="border-2 border-primary-border rounded-lg" >
                    <option value="">-Select seller-</option>
                    {!!sellers && !!sellers.data &&  sellers.data.map((seller,index)=>{
                        return(
                            <option key={index} value={seller.sellerName}>{seller.sellerName}</option>
                        );
                    })}
                  </select>
                  <div className='flex flex-col'>
                    <label htmlFor="customerName">Customer</label>
                    <select name="customerName" className='border-2 border-primary-border rounded-lg' id="cars"  onChange={handleCustomerName}>
                    <option value="">-Select customer-</option>
                    {!!customers && !!customers.data && customers.data.map((customer,index)=>{
                        return(
                            <option key={index} value={customer.name}>{customer.name}</option>
                        );
                    })}
                  </select>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="adress">Date</label>
                    <DatePicker 
                        className='border-2 border-primary-border rounded-lg'
                        id="date"
                        dateFormatCalendar="yyyy-MM-dd"
                        selected={createInvoice.date}
                        onChange={(date) => handleDate(date)}
                        maxDate={new Date()}
                    />
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="amount">Amount</label>
                    <input className='border-2 border-primary-border rounded-lg' type="number" id="amount" name="amount" min={1} value={createInvoice.amount}  onChange={handleAmount}></input>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button font-semibold text-white border-2 border-discard-border rounded-lg px-4 py-0.5' onClick={handleDiscardCreateWindow}>Discard</button>
                    <button className='bg-default-background font-semibold text-white border-2 border-boder-create rounded-lg px-4 py-0.5' onClick={handleCreateInvoice}>Create</button>
                  </div>
                </form>
            </div>
            <div className={!!editInvoiceWindow?'flex self-center absolute mt-12 my-auto':'flex self-center hidden absolute mt-12 my-auto'}>
                <form className='flex flex-col bg-white border-2 border-primary-border rounded-3xl p-4 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]'>
                  <div className='bg-default-background rounded-lg px-2 mb-2'>
                    <span className="text-white text-lg font-bold mr-3">Edit an invoice</span>
                    <span className="text-white text-lg font-bold">x</span>
                  </div>
                  <label htmlFor="surname">Seller</label>
                  <select name="cars"  onChange={handleEditSelerName} className="border-2 border-primary-border rounded-lg" value={editInvoice.selerName}>
                    {!!sellers && !!sellers.data &&  sellers.data.map((seller,index)=>{
                        return(
                            <option key={index} value={seller.sellerName}>{seller.sellerName}</option>
                        );
                    })}
                  </select>
                  <div className='flex flex-col'>
                    <label htmlFor="surname">Customer</label>
                    <select className='border-2 border-primary-border rounded-lg' onChange={handleEditCustomerName} value={editInvoice.customerName}>
                    {!!customers && !!customers.data && customers.data.map((customer,index)=>{
                        return(
                            <option key={index} value={customer.name}>{customer.name}</option>
                        );
                    })}
                  </select>
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="adress">Date</label>
                    <DatePicker 
                        className='border-2 border-primary-border rounded-lg'
                        id="date"
                        dateFormat="yyyy-MM-dd"
                        selected={invoices.date}
                        onChange={(date) => handleDate(date)}
                        maxDate={new Date()}
                    />                        
                  </div>
                  <div className='flex flex-col'>
                    <label htmlFor="age">Amount</label>
                    <input className='border-2 border-primary-border rounded-lg' type="number" id="age" name="age" min={1} value={editInvoice.amount}  onChange={handleEditAmount}></input>
                  </div>
                  <div className='flex justify-between py-2'>
                    <button className='bg-discard-button font-semibold text-white border-2 border-discard-border rounded-lg px-4 py-0.5' onClick={handleDiscardEditWindow}>Discard</button>
                    <button className='bg-default-background font-semibold text-white border-2 border-boder-create rounded-lg px-4 py-0.5' onClick={handleEditInvoice}>Edit</button>
                  </div>
                </form>
            </div>
            <div className={!!deleteInvoiceWindow?'flex self-center absolute z-40 mt-36 shadow-[rgba(255,255,255,0.8)_0_0_1000px_1000px]':'flex self-center hidden absolute z-40 mt-36'}>
              <DeleteCard deleteWindow={handleDeleteInvoice} discardWindow={handleDiscardInvoiceWindow}/>
            </div>
        </div>
    );
}

export default Invoices;