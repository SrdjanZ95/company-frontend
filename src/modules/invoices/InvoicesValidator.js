const validate = (createInvoice) => {
    const violations = [];
  
    if (createInvoice.selerName.length < 3) {
      violations.push({
        field: "sellerName",
        message: "Ime prodavca mora biti popunjeno" ,
      });
    }
  
    if (createInvoice.customerName.length < 3) {
      violations.push({
        field: "customerName",
        message: "Ime kupca mora biti popunjeno",
      });
    }

    if (createInvoice.amount <= 0) {
        violations.push({
          field: "amount",
          message: "Cijena mora biti veca od 0",
        });
    }

    return violations;
  };
  
  export default validate;
  