const validate = (createCustomers) => {
    const violations = [];
  
    if (createCustomers.name.length < 3) {
      violations.push({
        field: "name",
        message: "Ime kupca mora biti popunjeno" ,
      });
    }
  
    if (createCustomers.surname.length < 3) {
      violations.push({
        field: "surname",
        message: "Prezime kupca mora biti popunjeno",
      });
    }

    if (createCustomers.adress.length < 3) {
        violations.push({
          field: "adress",
          message: "Adresa kupca mora biti popunjena",
        });
      }

      
    if (createCustomers.age < 18) {
      violations.push({
        field: "adress",
        message: "Godine kupca moraju biti vece od 18",
      });
    }
    return violations;
  };
  
  export default validate;
  