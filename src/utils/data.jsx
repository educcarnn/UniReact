import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

export const formatarData = (data) => {
    try {
      // Tenta fazer o parse da data
      const dataParseada = parseISO(data);
      // Formata a data
      return format(dataParseada, "dd 'de' MMMM 'às' HH:mm", { locale: pt });
    } catch (error) {
      // Se houver um erro ao fazer o parse, retorna a data original
      return data;
    }
  };