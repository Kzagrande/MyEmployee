// models/agencyModel.js
class PlanningModel {
    constructor({name,employee_id, sector,work_schedule, type_, manager_1, manager_2, manager_3 }) {
      this.name = name;
      this.employee_id = employee_id;
      this.sector = sector;
      this.work_schedule = work_schedule;
      this.type_ = type_;
      this.status = 'ACTIVE';
      this.manager_1 = manager_1;
      this.manager_2 = manager_2;
      this.manager_3 = manager_3;
    }
  
    // Métodos adicionais, se necessário
  }
  
  export default PlanningModel;
  