// models/adminModel.js
import moment from "moment";


class dissmissalModel {
  constructor({requester_id,requester_name,employee_id,employee_name,termination_type,reason,observation,fit_for_hiring,fit_for_hiring_reason,dismissal_date,


  }) {
    this.requester_id = requester_id,
    this.requester_name = requester_name,
    this.employee_id = employee_id,
    this.employee_name = employee_name,
    this.termination_type = termination_type,
    this.reason = reason,
    this.observation = observation,
    this.fit_for_hiring = fit_for_hiring,
    this.fit_for_hiring_reason = fit_for_hiring_reason,
    this.dismissal_date = dismissal_date,
    this.comunication_date = this.curdate();
  }

  curdate() {
    return moment().format("YYYY-MM-DD");
}

}



export default dissmissalModel;
