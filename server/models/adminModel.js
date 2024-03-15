// models/adminModel.js
class dissmissalModel {
    constructor({employee_id,employee_name,dismissal_date,termination_type,reason}) {
      this.employee_id = employee_id;
      this.employee_name = employee_name;
      this.dismissal_date = dismissal_date;
      this.termination_type = termination_type;
      this.reason = reason;
    }
  }
  
  export default dissmissalModel;
  