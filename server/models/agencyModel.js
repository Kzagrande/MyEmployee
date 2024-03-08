// models/agencyModel.js
class AgencyModel {
    constructor({ employee_id,cpf, name, role_, bu, shift, schedule_time, company, status, hire_date, date_of_birth, ethnicity, gender, neighborhood, city, email, phone,integration_date }) {
      this.employee_id = employee_id;
      this.cpf = cpf;
      this.name = name;
      this.role_ = role_;
      this.bu = bu;
      this.shift = shift;
      this.schedule_time = schedule_time;
      this.company = company;
      this.status = status;
      this.hire_date = hire_date;
      this.date_of_birth = date_of_birth;
      this.ethnicity = ethnicity;
      this.gender = gender;
      this.neighborhood = neighborhood;
      this.city = city;
      this.email = email;
      this.phone = phone;
      this.integration_date = integration_date;
    }
  
    // Métodos adicionais, se necessário
  }
  
  export default AgencyModel;
  