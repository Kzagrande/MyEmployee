// models/agencyModel.js
class AgencyModel {
  constructor({
    employee_id,
    cpf,
    name,
    role_,
    bu,
    shift,
    company,
    hire_date,
    date_of_birth,
    ethnicity,
    gender,
    neighborhood,
    city,
    email,
    phone,
    integration_date,
  }) {
    this.employee_id = employee_id;
    this.cpf = cpf;
    this.name = name;
    this.role_ = role_;
    this.collar = this.calculateCollar();
    this.category = this.calculateCategory();
    this.bu = bu;
    this.shift = shift;
    this.schedule_time = this.calculateScheduleTime(this.shift);
    this.company = company;
    this.status = 'INTEGRATION';
    this.hire_date = hire_date;
    this.date_of_birth = date_of_birth;
    this.ethnicity = ethnicity;
    this.gender = gender;
    this.neighborhood = neighborhood;
    this.city = city;
    this.email = email;
    this.phone = phone;
    this.integration_date = integration_date;

    // Adicione um novo campo 'collar' com base na condição fornecida
  }

  // Método para calcular a cor com base no papel (role_)
  calculateCollar() {
    const allowedRoles = [
      "AUX. APOIO LOGISTICO",
      "CONFERENTE MATERIAIS",
      "INSTRUTOR TECNICO",
      "OPERADOR LOGISTICO",
    ];
    return allowedRoles.includes(this.role_) ? "BLUE" : "WHITE";
  }

  calculateCategory() {
    if (
      this.role_.startsWith("GERENTE") ||
      this.role_.startsWith("COORDENADOR") ||
      this.role_.startsWith("DIRETOR") ||
      this.role_.startsWith("SUPERVISOR")
    ) {
      return "MANAGEMENT";
    } else if (
      this.role_.startsWith("AUX") ||
      this.role_.startsWith("OPERADOR")
    ) {
      return "OPERATIONAL";
    } else if (this.role_.startsWith("CONFERENTE")) {
      return "INVENTORY";
    } else {
      return "ADMIN";
    }
  }

  calculateScheduleTime(shift){
    switch (shift) {
      case '1ST SHIFT':
          return '06:00 AS 14:20 SEGUNDA A SABADO';
      case '2ND SHIFT':
          return '14:20 AS 22:35 SEGUNDA A SABADO';
      case '3RD SHIFT':
          return '22:35 AS 06:00 SEGUNDA A SABADO';
      case '4TH SHIFT':
          return '06:00 AS 14:20 TERCA A DOMINGO';
      case '5TH SHIFT':
          return '14:20 AS 22:35 TERCA A DOMINGO';
      case '6TH SHIFT':
          return '22:35 AS 06:00 DOMINGO A SEXTA';
      case 'ADM':
          return '08:00 AS 17:48 SEGUNDA A SEXTA';
      default:
          // Se ney_this_shift não for nenhum dos casos acima, retorne uma string vazia ou outra mensagem adequada
          return '';
  }

  }
}

export default AgencyModel;
