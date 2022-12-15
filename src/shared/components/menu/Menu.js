import { NavLink } from "react-router-dom";
import CustomersIcon from "../../../assets/icons/CustomersIcon";
import InvoicesIcon from "../../../assets/icons/InvoicesIcon";
import SelersIcon from "../../../assets/icons/SellersIcon";

function Menu (){
    return(
        <div className='flex flex-col border-2 border-primary-border rounded-lg absolute radius-lg p-2 '>
           <NavLink to='/Invoices' className='flex justify-center w-16 h-16 border-2 border-invoices-border rounded-full mb-2'>
                <InvoicesIcon className="self-center h-8 w-8" color="#C2E799"/>
           </NavLink>
           <NavLink to='/Sellers' className='flex justify-center w-16 h-16 border-2 border-sellers-border rounded-full mb-2'>
                <SelersIcon className="self-center h-8 w-8" color="#bfbfbf"/>
           </NavLink>
            <NavLink to='/Customers' className='flex justify-center w-16 h-16 border-2 border-customers-border rounded-full'>
                <CustomersIcon className="self-center h-8 w-8" color="#FEC776"/>
            </NavLink>         
        </div>
    );
}

export default Menu;