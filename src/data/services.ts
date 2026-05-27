export interface ServiceItem {
  icon: "Flower2" | "Calendar" | "Repeat" | "Gift";
  title: string;
  description: string;
  cta: string;
}

export const services: ServiceItem[] = [
  {
    icon: "Flower2",
    title: "Bodas íntimas",
    description:
      "Diseño floral completo: ramo de novia, boutonnières, centros de mesa y arco ceremonial.",
    cta: "Solicitar cotización",
  },
  {
    icon: "Calendar",
    title: "Eventos privados",
    description:
      "Composiciones para cenas corporativas, inauguraciones, cumpleaños y lanzamientos.",
    cta: "Hablemos de tu evento",
  },
  {
    icon: "Repeat",
    title: "Suscripción semanal",
    description:
      "Un arreglo nuevo cada semana, entregado en casa u oficina. Ideal para espacios de marca.",
    cta: "Pedir información",
  },
  {
    icon: "Gift",
    title: "Regalos curados",
    description:
      "Ramo, vino natural y tarjeta hecha a mano. Mensajería el mismo día dentro de ZMG.",
    cta: "Cotizar a la medida",
  },
];
