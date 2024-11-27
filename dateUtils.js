// Verifica se uma data está dentro dos últimos 12 meses
// Verifica se uma data está dentro dos últimos 12 meses (sempre usando UTC)
  const isWithinLast12Months = (date) => {

    const now = new Date(); // Data atual no UTC
    
    const oneYearAgo = new Date(now); // Subtração de 1 ano em milissegundos
    oneYearAgo.setUTCFullYear(now.getUTCFullYear() - 1);

    const givenDate = new Date(date); // Data fornecida convertida para UTC
    oneYearAgo.setMilliseconds(0);
    givenDate.setMilliseconds(0);

    // Log para depuração
    console.log("Comparação:", { givenDate, oneYearAgo });

    return givenDate >= oneYearAgo; // Retorna true se a data for dentro dos últimos 12 meses
};
  
  
  
  // Retorna a quantidade de pontos de uma infração com base na gravidade
  const getSeverityPoints = (severity) => {
    // Mapeamento de gravidade para pontos
    const points = {
      "Baixa": 3,
      "Média": 5,
      "Grave": 7,
      "Gravíssima": 12,
    };
  
    return points[severity] || 0; // Retorna os pontos associados ou 0 se a gravidade for inválida
  };
  
  // Verifica se uma data de infração conflita com um intervalo de viagem
  const conflictsWithPeriod = (infractionDate, startDate, endDate) => {
    const oneYearBeforeStart = new Date(startDate); // Data de 1 ano antes do início da viagem
    const oneYearAfterEnd = new Date(endDate); // Data de 1 ano após o término da viagem
  
    // Ajusta as datas para incluir o período de 1 ano antes e depois
    oneYearBeforeStart.setUTCFullYear(oneYearBeforeStart.getUTCFullYear() - 1);
    oneYearAfterEnd.setUTCFullYear(oneYearAfterEnd.getUTCFullYear() + 1);
  
    const date = new Date(infractionDate); // Data da infração
    // Retorna true se a data da infração estiver dentro do período de conflito
    return date >= oneYearBeforeStart && date <= oneYearAfterEnd;
  };
  
console.log(isWithinLast12Months("2023-05-01T10:00:00Z")); // Deve retornar true
console.log(isWithinLast12Months("2022-11-27T10:00:00Z")); // Deve retornar false
console.log(isWithinLast12Months("2024-01-01T10:00:00Z")); // Deve retornar true

  // Exporta as funções para serem usadas em outros módulos
  module.exports = { isWithinLast12Months, getSeverityPoints, conflictsWithPeriod };
  