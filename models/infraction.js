class Infraction {
    constructor(description, passportNumber, dateTime, severity) {
      this.description = description;
      this.passportNumber = passportNumber;
      this.dateTime = dateTime;
      this.severity = severity;
    }
  }
  
  module.exports = Infraction;
  