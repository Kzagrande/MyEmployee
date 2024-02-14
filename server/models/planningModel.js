// models/agencyModel.js
class PlanningModel {
    constructor({name,employee_id, activity_p,area, sector, shift,work_schedule, type_, collar, status_op, manager_1, manager_2, manager_3, added_on_call }) {
      this.name = name;
      this.employee_id = employee_id;
      this.activity_p = activity_p;
      this.area = area;
      this.sector = sector;
      this.shift = shift;   
      this.work_schedule = work_schedule;
      this.type_ = type_;
      this.collar = collar;
      this.status_op = status_op;
      this.manager_1 = manager_1;
      this.manager_2 = manager_2;
      this.manager_3 = manager_3;
      this.added_on_call = added_on_call;
    }
  
    // Métodos adicionais, se necessário
  }
  
  export default PlanningModel;
  