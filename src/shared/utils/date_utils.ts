import { addDays, startOfDay } from "date-fns";

export function getUpcomingWeekdays() {
  const today = startOfDay(new Date()); // Garantir que estamos começando o cálculo do início do dia
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  let nextThursday, nextFriday, nextSaturday;

  if (dayOfWeek === 5) {
    // Hoje é sexta-feira
    nextFriday = today;
    nextSaturday = startOfDay(addDays(today, 1)); // Amanhã é sábado
    nextThursday = startOfDay(addDays(today, 6)); // Próxima quinta-feira
  } else if (dayOfWeek === 6) {
    // Hoje é sábado
    nextSaturday = today;
    nextThursday = startOfDay(addDays(today, 5)); // Próxima quinta-feira
    nextFriday = startOfDay(addDays(today, 6)); // Próxima sexta-feira
  } else {
    // Domingo, segunda, terça ou quarta
    nextThursday = startOfDay(addDays(today, (4 - dayOfWeek + 7) % 7)); // Próxima quinta-feira
    nextFriday = startOfDay(addDays(today, (5 - dayOfWeek + 7) % 7)); // Próxima sexta-feira
    nextSaturday = startOfDay(addDays(today, (6 - dayOfWeek + 7) % 7)); // Próximo sábado
  }

  return { nextThursday, nextFriday, nextSaturday };
}
