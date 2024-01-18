// models/agencyModel.js
class AgencyModel {
    constructor({ employee_id, name, cpf, role_, bu, shift, schedule_time, company, status, hire_date, date_of_birth, termination_date, reason, ethnicity, gender, neighborhood, city, email, phone }) {
      this.employee_id = employee_id;
      this.name = name;
      this.cpf = cpf;
      this.role_ = role_;
      this.bu = bu;
      this.shift = shift;
      this.schedule_time = schedule_time;
      this.company = company;
      this.status = status;
      this.hire_date = hire_date;
      this.date_of_birth = date_of_birth;
      this.termination_date = termination_date;
      this.reason = reason;
      this.ethnicity = ethnicity;
      this.gender = gender;
      this.neighborhood = neighborhood;
      this.city = city;
      this.email = email;
      this.phone = phone;
    }
  
    // Métodos adicionais, se necessário
  }
  
  export default AgencyModel;
  