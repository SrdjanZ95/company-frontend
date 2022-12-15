const validate = (createSeller) => {
    const violations = [];
  
    if (createSeller.sellerName.length < 3) {
      violations.push({
        field: "sellerName",
        message: "Ime prodavca mora biti popunjeno" ,
      });
    }
  
    if (createSeller.hqAdress.length < 3) {
      violations.push({
        field: "hqAdress",
        message: "Adresa mora biti popunjena",
      });
    }

    return violations;
  };
  
  export default validate;
  