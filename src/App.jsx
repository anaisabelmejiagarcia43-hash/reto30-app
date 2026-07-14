import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home, Calendar, UtensilsCrossed, TrendingUp, Check, Droplet,
  Flame, ChevronLeft, X, Moon, Sun, Play,
  Smile, Leaf, Lock, Plus, Minus, Sparkles, Clock,
  Target, Ruler, BatteryMedium, BedDouble, Heart, Camera, Settings,
  Download, Upload, AlertCircle, Trash2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { loadState, saveState, savePhoto, getAllPhotos, deletePhoto, exportBackup, importBackup } from "./storage.js";

/* ============================== DATA ============================== */

const QUOTES = [
  "Hoy no tiene que ser perfecto, solo tiene que ser hecho.",
  "Tu cuerpo escucha todo lo que tu mente le dice. Háblale bonito hoy.",
  "No estás empezando de cero, estás empezando con experiencia.",
  "Un día a la vez. Eso es todo lo que se necesita.",
  "El progreso no siempre se ve en la báscula, a veces se ve en cómo te sientes.",
  "No busques motivación, busca constancia. La motivación va y viene, el hábito se queda.",
  "Estás construyendo la versión de ti que se siente fuerte, no la que se ve perfecta.",
  "Levantarte hoy y moverte ya es una victoria.",
  "Compárate solo con la persona que eras ayer.",
  "Tu esfuerzo de hoy es el resultado que verás en unas semanas.",
  "No tienes que sentir ganas, solo tienes que empezar.",
  "Cada gota de sudor es una carta de amor a tu futuro yo.",
  "El descanso también es parte del entrenamiento. Está bien parar cuando tu cuerpo lo pide.",
  "Estás más cerca hoy que ayer, aunque no lo sientas así.",
  "Nadie llega a la meta sin días difíciles en el camino. Sigue.",
  "Tu constancia de hoy vale más que la intensidad de un solo día.",
  "No se trata de ser la mejor, se trata de ser mejor que ayer.",
  "Tu cuerpo puede hacerlo. Es tu mente la que necesitas convencer hoy.",
  "Pequeños pasos diarios se convierten en grandes cambios mensuales.",
  "Hoy eliges cuidarte. Eso ya dice mucho de ti.",
  "No dejes que un mal día borre semanas de buenos hábitos.",
  "El cambio real pasa en los días en que no tienes ganas y lo haces igual.",
  "Estás entrenando algo más que tu cuerpo: estás entrenando tu disciplina.",
  "Falta menos de lo que crees. No te rindas ahora.",
  "Tu meta no es llegar rápido, es no abandonar.",
  "Celebra lo que tu cuerpo puede hacer hoy, no solo cómo se ve.",
  "La versión fuerte de ti ya está en camino, solo sigue mostrándote.",
  "Ya llegaste hasta aquí. Eso ya es más de lo que muchos intentan.",
  "Un cumpleaños especial merece que llegues sintiéndote orgullosa de ti.",
  "Lo lograste. 30 días de elegirte a ti misma, todos los días.",
];

const CHALLENGES = [
  "Toma tu primer vaso de agua apenas te levantes.",
  "Camina 10 minutos extra hoy, aunque sea dentro de casa.",
  "Hoy dedica 3 minutos a estirar antes de dormir.",
  "Prueba comer sin pantallas al menos en una comida.",
  "Escribe una razón por la que empezaste este reto.",
  "Hoy prioriza dormir 15 minutos antes de lo usual.",
  "Toma agua antes de cada comida principal.",
  "Haz una pausa activa de 2 minutos cada hora sentada.",
  "Hoy cambia una gaseosa por agua con limón.",
  "Tómate una foto de progreso, aunque no quieras verla todavía.",
  "Agradece a tu cuerpo por algo que hizo hoy.",
  "Prepara tu snack saludable con anticipación para mañana.",
  "Hoy camina o estírate al aire libre, aunque sean 5 minutos.",
  "Anota cómo te sentiste después de entrenar.",
  "Bebe un vaso de agua extra antes de dormir.",
  "Hoy evita el celular 15 minutos antes de dormir.",
  "Sonríe al verte al espejo antes de entrenar.",
  "Organiza tu espacio de entrenamiento antes de empezar.",
  "Hoy agrega una porción extra de verduras a tu almuerzo.",
  "Revisa tu progreso de la semana y celebra un logro pequeño.",
  "Hoy entrena con música que te haga sentir imparable.",
  "Toma nota de tu nivel de energía antes y después de entrenar.",
  "Hoy sal a caminar aunque sean 10 minutos después de comer.",
  "Escríbete una nota motivadora para el día 30.",
  "Hidrátate apenas despiertes, antes del café.",
  "Hoy agradece tres cosas de tu cuerpo, no de tu apariencia.",
  "Prepara tu lista de mercado para la última semana.",
  "Hoy entrena pensando en cómo te vas a sentir el día de tu cumpleaños.",
  "Revisa tus fotos del día 1 y del día 29. Mira el camino recorrido.",
  "Celebra este día. Lo lograste, un mes completo cuidándote.",
];

const WORKOUTS = {
  cardioP: { title: "Cardio para Principiantes 🔥 Sin Equipo", creator: "Steph Delmor", url: "https://www.youtube.com/watch?v=KYLhSfBhZ1c", duration: "12-15 min", level: "Principiante", goal: "Activar el cuerpo y quemar calorías", muscles: ["Cuerpo completo", "Cardiovascular"], tips: ["Calienta articulaciones 1 min antes de empezar", "Sigue tu propio ritmo, no el de la instructora si necesitas bajar intensidad"], mistakes: ["Saltar el calentamiento", "Aguantar la respiración durante el movimiento"] },
  fullBody10: { title: "Rutina en Casa Cuerpo Completo 10 Minutos ¡Sin Equipo!", creator: "Fitness en casa", url: "https://www.youtube.com/watch?v=u3k0vnbeMeg", duration: "10 min", level: "Principiante", goal: "Tonificar cuerpo completo", muscles: ["Piernas", "Glúteo", "Core", "Brazos"], tips: ["Mantén el abdomen activado todo el video", "Controla el movimiento, no la velocidad"], mistakes: ["Arquear la espalda baja", "Hacer el rango de movimiento a medias"] },
  gluteoPilates: { title: "Glúteo y Pierna | Pilates con Steph", creator: "Steph Delmor", url: "https://www.youtube.com/watch?v=IEMw-_rMpdw", duration: "15-18 min", level: "Principiante-Intermedio", goal: "Fortalecer y levantar glúteo, tonificar pierna", muscles: ["Glúteo", "Cuádriceps", "Isquiotibiales"], tips: ["Aprieta el glúteo en la parte más alta de cada movimiento", "Puedes usar una banda si tienes, si no, con tu peso es suficiente"], mistakes: ["Usar solo la pierna sin activar el glúteo", "Ir muy rápido perdiendo la técnica"] },
  calistenia: { title: "Rutina de Calistenia para Cuerpo Completo (sin material)", creator: "Fitness en casa", url: "https://www.youtube.com/watch?v=VYHwKgZ6mu0", duration: "20 min", level: "Intermedio", goal: "Fuerza funcional y movilidad", muscles: ["Cuerpo completo", "Core"], tips: ["Haz pausas cortas si lo necesitas, mejor pausar que perder la forma", "Respira de forma constante"], mistakes: ["Bloquear las rodillas en sentadillas", "No calentar muñecas antes de apoyos"] },
  fuerza20: { title: "Fuerza con tu Propio Peso 20 Min", creator: "Fitness en casa", url: "https://www.youtube.com/watch?v=nyWNYDCDXkM", duration: "20 min", level: "Intermedio", goal: "Fuerza y resistencia muscular", muscles: ["Piernas", "Glúteo", "Core", "Brazos"], tips: ["Ten agua cerca, esta rutina sube el ritmo cardíaco", "Enfócate en la técnica antes que en la velocidad"], mistakes: ["Curvar la espalda en plancha", "No hidratarte durante la rutina"] },
  gluteoBeginner: { title: "Glúteos Redondos y Piernas Tonificadas | Principiantes Sin Equipo", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=CbIZjyaLRk4", duration: "15 min", level: "Principiante", goal: "Levantar y redondear glúteo, tonificar pierna", muscles: ["Glúteo", "Cuádriceps", "Isquiotibiales"], tips: ["Siente el músculo trabajando, no solo el cansancio", "Mantén el core activado para proteger la espalda"], mistakes: ["Empujar con la espalda baja en vez del glúteo", "Pies mal alineados en sentadillas"] },
  gluteoIntensa: { title: "Crecer Glúteos en Casa | Rutina Intensa Sin Equipamiento", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=QvAq-7Gj4zE", duration: "18 min", level: "Intermedio", goal: "Fuerza y volumen de glúteo", muscles: ["Glúteo", "Pierna"], tips: ["Aprieta 2 segundos arriba de cada repetición", "Si sientes la rodilla en vez del glúteo, revisa tu postura"], mistakes: ["Rango de movimiento muy corto", "No activar el glúteo antes de empezar"] },
  gluteo16: { title: "Crecer Glúteos en 16 Minutos | Rutina Intensa en Casa", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=0ZXIbqgnIE4", duration: "16 min", level: "Intermedio-Avanzado", goal: "Máxima activación de glúteo", muscles: ["Glúteo", "Pierna", "Core"], tips: ["Esta rutina sube de intensidad, respeta tu ritmo", "Usa un tapete si tienes rodillas sensibles"], mistakes: ["No descansar entre series si el cuerpo lo pide", "Perder la postura por cansancio"] },
  abdomen9: { title: "Cintura de Avispa y Abdomen Plano en 9 Minutos", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=kDHxg8FPI9Q", duration: "9 min", level: "Principiante", goal: "Tonificar cintura y abdomen", muscles: ["Abdomen", "Oblicuos"], tips: ["Exhala en el esfuerzo de cada ejercicio", "Mantén la espalda baja pegada al piso en ejercicios acostados"], mistakes: ["Hacer el movimiento solo con el cuello", "Aguantar la respiración"] },
  abdomenMejores: { title: "Mejores Ejercicios para Cintura y Abdomen en 9 Minutos", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=F9ABJjxKKos", duration: "9 min", level: "Principiante", goal: "Definir cintura y abdomen", muscles: ["Abdomen", "Oblicuos", "Core"], tips: ["Activa el abdomen antes de cada repetición", "Controla el descenso, no lo dejes caer"], mistakes: ["Tirar del cuello con las manos", "Movimientos muy rápidos sin control"] },
  abdomen10dias: { title: "Cintura de Avispa y Abdomen Plano en 10 Días", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=PwsdAf4dU5A", duration: "12 min", level: "Intermedio", goal: "Definición de core", muscles: ["Abdomen", "Oblicuos", "Transverso"], tips: ["Metetu ombligo hacia adentro en cada ejercicio de plancha", "La calidad del movimiento importa más que la velocidad"], mistakes: ["Levantar demasiado la cadera en plancha", "No respirar de forma constante"] },
  costillas: { title: "Reducir Costillas Anchas y Definir Cintura", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=rlXqgrV8uR4", duration: "12 min", level: "Intermedio", goal: "Tonificar oblicuos y cintura", muscles: ["Oblicuos", "Abdomen"], tips: ["No esperes cambiar tu estructura ósea, sí puedes tonificar y estilizar", "Concéntrate en apretar el core, no en ir rápido"], mistakes: ["Comparar tu cuerpo con el de la instructora", "Hacerlo con el estómago muy lleno"] },
  abdomenBajo: { title: "Eliminar Grasa del Abdomen Bajo en 12 Minutos", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=s7GJGDxLOPY", duration: "12 min", level: "Intermedio", goal: "Fortalecer abdomen bajo", muscles: ["Abdomen bajo", "Core"], tips: ["La grasa localizada no se elimina solo entrenando esa zona, pero sí fortaleces el músculo", "Apoya la espalda baja en el piso"], mistakes: ["Subir las piernas muy rápido", "No activar el abdomen bajo antes de mover las piernas"] },
  abdomen7dias: { title: "Cintura de Avispa y Abdomen Plano en 7 Días", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=zQ79vnRezkM", duration: "10 min", level: "Intermedio", goal: "Tonificar cintura", muscles: ["Abdomen", "Oblicuos"], tips: ["Estos resultados llegan con constancia, no en una sola sesión", "Mantén una buena postura durante todo el video"], mistakes: ["Saltarte el calentamiento", "No mantener el core activado"] },
  abdomen2semanas: { title: "Abdominales y Cintura en 2 Semanas | Principiantes", creator: "Pau Fit", url: "https://www.youtube.com/watch?v=TLvoi98XTDg", duration: "10 min", level: "Principiante", goal: "Base de fuerza abdominal", muscles: ["Abdomen", "Core"], tips: ["Perfecta para empezar si nunca has entrenado abdomen", "Ve a tu ritmo, puedes pausar entre ejercicios"], mistakes: ["Forzar el cuello hacia arriba", "No descansar si sientes dolor agudo"] },
  zumba1: { title: "Zumba para Principiantes para Bajar de Peso en Casa", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=OxMNo8vAMVY", duration: "20 min", level: "Principiante", goal: "Cardio divertido y quema de calorías", muscles: ["Cuerpo completo", "Cardiovascular"], tips: ["No te preocupes por hacerlo perfecto, muévete a tu manera", "Baja la intensidad si te falta el aire, sigue moviéndote"], mistakes: ["Detenerte por completo en vez de bajar el ritmo", "No tomar agua durante la sesión"] },
  zumba2: { title: "Zumba para Principiantes en Casa (Bajar de Peso Bailando)", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=sLWc4HObWHE", duration: "20 min", level: "Principiante", goal: "Cardio para cintura y abdomen bailando", muscles: ["Cuerpo completo", "Core"], tips: ["Disfruta la música, eso también es parte del hábito", "Marca el paso con los pies antes de sumar los brazos"], mistakes: ["Compararte con el ritmo de otros", "Dejar de moverte en vez de simplificar el paso"] },
  zumba3: { title: "Zumba para Bajar de Peso en Casa: Clase Completa", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=woQwB-OeVu0", duration: "25 min", level: "Intermedio", goal: "Resistencia cardiovascular", muscles: ["Cuerpo completo"], tips: ["Ten una toalla y agua cerca", "Si te mareas, camina en el puesto hasta recuperar el ritmo"], mistakes: ["No calentar antes de la clase", "Forzar pasos que no controlas todavía"] },
  zumba4: { title: "Zumba para Bajar de Peso en Casa: Clase Virtual Completa", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=8d6Tb2pg2WI", duration: "25 min", level: "Intermedio", goal: "Cardio de mayor duración", muscles: ["Cuerpo completo", "Cardiovascular"], tips: ["Ya llevas semanas entrenando, confía en tu resistencia", "Hidrátate antes de empezar"], mistakes: ["Saltarte el enfriamiento al final", "No bajar el ritmo cuando el cuerpo lo pide"] },
  zumba5: { title: "Zumba para Bajar de Peso: Bailoterapia", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=sV1UYlUnta4", duration: "20 min", level: "Intermedio", goal: "Cardio y coordinación", muscles: ["Cuerpo completo"], tips: ["Es normal no seguir cada paso perfecto, el objetivo es moverte", "Aprovecha para soltar el estrés del día"], mistakes: ["Dejar de moverte si te pierdes un paso", "No respirar por la boca cuando lo necesitas"] },
  zumbaFinal: { title: "Clase de Zumba Completa para Bajar de Peso | 30 Min", creator: "Cardio baile", url: "https://www.youtube.com/watch?v=fk1wylMZTIs", duration: "30 min", level: "Todos los niveles", goal: "Celebrar tu progreso con una clase completa", muscles: ["Cuerpo completo", "Cardiovascular"], tips: ["Disfruta esta clase, es tu cierre de reto", "Mira atrás y nota cuánto más resistes hoy que el día 1"], mistakes: ["Compararte con el día 1 de forma negativa en vez de celebrar el avance"] },
};

const PLAN = [
  ["cardioP","Semana 1 · Fundamentos","Hoy solo se trata de moverte y sentir tu cuerpo despertar."],
  ["gluteoBeginner","Semana 1 · Fundamentos","Aprende la técnica antes que la intensidad, hoy sienta las bases."],
  ["abdomen2semanas","Semana 1 · Fundamentos","Vamos a activar el core con calma y buena técnica."],
  ["zumba1","Semana 1 · Fundamentos","Día de cardio bailando, disfruta el movimiento."],
  ["fullBody10","Semana 1 · Fundamentos","Cuerpo completo, hoy trabajamos todo en 10 minutos."],
  ["gluteoBeginner","Semana 1 · Fundamentos","Repite la técnica de piernas y glúteo, ya la conoces mejor."],
  ["rest","Semana 1 · Descanso activo","Camina 15-20 min y estira. Tu cuerpo se recupera y crece en el descanso."],
  ["calistenia","Semana 2 · Construyendo fuerza","Subimos la intensidad: hoy cuerpo completo con calistenia."],
  ["gluteoIntensa","Semana 2 · Construyendo fuerza","Hoy vamos con más intensidad en glúteo y pierna."],
  ["abdomenMejores","Semana 2 · Construyendo fuerza","Un poco más de reto para tu abdomen hoy."],
  ["zumba2","Semana 2 · Construyendo fuerza","Cardio bailando, hoy con enfoque en cintura y abdomen."],
  ["gluteoPilates","Semana 2 · Construyendo fuerza","Pilates para glúteo y pierna, siente cada repetición."],
  ["gluteoBeginner","Semana 2 · Construyendo fuerza","Haz 2 rondas completas hoy en vez de 1, ya tienes más resistencia."],
  ["rest","Semana 2 · Descanso activo","Estira 10 minutos y toma fotos de progreso. Ya llevas 2 semanas."],
  ["fuerza20","Semana 3 · Intensidad","20 minutos de fuerza, hoy exigimos un poco más."],
  ["gluteoIntensa","Semana 3 · Intensidad","Aumenta el ritmo en cada ejercicio de glúteo hoy."],
  ["abdomen10dias","Semana 3 · Intensidad","Hoy trabajamos el core con más control y precisión."],
  ["zumba3","Semana 3 · Intensidad","Clase completa de cardio, un poco más larga que antes."],
  ["fullBody10","Semana 3 · Intensidad","Repite el cuerpo completo pero añade 10 repeticiones extra por ejercicio."],
  ["gluteo16","Semana 3 · Intensidad","Rutina intensa de glúteo, ya tienes 3 semanas de base."],
  ["rest","Semana 3 · Descanso activo","Descanso activo: camina, estira, hidrátate. Revisa cómo te sientes."],
  ["abdomen9","Semana 4 · Últimos días","Últimos días, hoy afinamos el abdomen."],
  ["gluteoBeginner","Semana 4 · Últimos días","Haz esta rutina con el doble de energía que el día 2."],
  ["zumba4","Semana 4 · Últimos días","Cardio bailando con más resistencia que nunca."],
  ["calistenia","Semana 4 · Últimos días","Cuerpo completo, aumenta el ritmo entre ejercicios."],
  ["abdomenBajo","Semana 4 · Últimos días","Enfócate en abdomen bajo, cierra esta zona con fuerza."],
  ["gluteoIntensa","Semana 4 · Últimos días","Últimа rutina intensa de glúteo antes del cierre."],
  ["rest","Semana 4 · Descanso activo","Descansa, hidrátate y prepárate para los últimos 2 días."],
  ["zumbaFinal","Día 29 · Recta final","Disfruta esta clase completa, mira cuánto has avanzado."],
  ["fuerza20","Día 30 · ¡Lo lograste!","Cierre de reto: dalo todo y celebra este mes de constancia."],
];

const BREAKFASTS = [
  { name: "Pancakes de avena con banano y miel", time: "10 min", macros: "≈320 kcal · 14g prot · 45g carb · 8g grasa" },
  { name: "Bowl de yogur griego con fresas, arándanos y miel", time: "5 min", macros: "≈280 kcal · 18g prot · 32g carb · 7g grasa" },
  { name: "Arepa de choclo rellena de huevo revuelto y queso mozzarella", time: "12 min", macros: "≈350 kcal · 17g prot · 38g carb · 13g grasa" },
  { name: "Wrap de huevo, queso campesino, tomate y lechuga", time: "8 min", macros: "≈310 kcal · 16g prot · 30g carb · 12g grasa" },
  { name: "Batido de banano, avena, canela y yogur griego", time: "5 min", macros: "≈290 kcal · 15g prot · 42g carb · 6g grasa" },
  { name: "Arepa de yuca con queso mozzarella y jugo de mango natural", time: "12 min", macros: "≈340 kcal · 12g prot · 48g carb · 10g grasa" },
  { name: "Pancakes de avena con manzana, canela y miel", time: "10 min", macros: "≈310 kcal · 13g prot · 44g carb · 7g grasa" },
  { name: "Bowl de yogur griego con mango, miel y canela", time: "5 min", macros: "≈270 kcal · 17g prot · 34g carb · 6g grasa" },
  { name: "Arepa rellena de huevos pericos con tomate y cebolla", time: "12 min", macros: "≈330 kcal · 16g prot · 36g carb · 12g grasa" },
  { name: "Wrap de huevo y pollo desmechado con lechuga", time: "10 min", macros: "≈320 kcal · 22g prot · 28g carb · 10g grasa" },
];
const SNACKS_DAY = [
  "Manzana con miel y canela", "Banano pequeño", "Fresas con yogur griego", "Arándanos con un toque de miel",
  "Uvas frescas", "Mango picado en cubos", "Batido de fresa y yogur griego", "Yogur griego con miel",
  "Gajos de manzana con canela", "Batido pequeño de mango", "Banano con canela", "Yogur griego con banano",
];
const LUNCHES = [
  { name: "Pollo a la plancha con arroz, papa criolla y ensalada de tomate y lechuga", time: "25 min", macros: "≈480 kcal · 35g prot · 50g carb · 12g grasa" },
  { name: "Carne molida con arepa y ensalada de tomate, cebolla y pimentón", time: "25 min", macros: "≈460 kcal · 30g prot · 45g carb · 14g grasa" },
  { name: "Atún al limón con papa cocida y brócoli al vapor", time: "20 min", macros: "≈400 kcal · 32g prot · 40g carb · 8g grasa" },
  { name: "Cerdo a la plancha con maduro asado y ensalada verde", time: "25 min", macros: "≈470 kcal · 28g prot · 48g carb · 14g grasa" },
  { name: "Pollo al limón con puré de papa y brócoli", time: "25 min", macros: "≈430 kcal · 33g prot · 42g carb · 10g grasa" },
  { name: "Carne a la plancha con papa criolla y ensalada de lechuga y tomate", time: "25 min", macros: "≈450 kcal · 31g prot · 44g carb · 12g grasa" },
  { name: "Atún con arroz y ensalada de pimentón y cebolla", time: "18 min", macros: "≈420 kcal · 30g prot · 46g carb · 8g grasa" },
  { name: "Pollo desmechado con arepa y ensalada de tomate", time: "20 min", macros: "≈410 kcal · 32g prot · 40g carb · 9g grasa" },
  { name: "Cerdo magro con papa y brócoli al vapor", time: "25 min", macros: "≈440 kcal · 29g prot · 42g carb · 13g grasa" },
  { name: "Carne molida con maduro y ensalada verde", time: "25 min", macros: "≈460 kcal · 28g prot · 46g carb · 14g grasa" },
];
const DINNERS = [
  { name: "Huevos pericos con arepa pequeña y tomate", time: "12 min", macros: "≈300 kcal · 16g prot · 28g carb · 12g grasa" },
  { name: "Wrap de pollo desmechado con lechuga y tomate", time: "10 min", macros: "≈290 kcal · 24g prot · 24g carb · 8g grasa" },
  { name: "Atún con ensalada de tomate, lechuga y limón", time: "10 min", macros: "≈250 kcal · 26g prot · 12g carb · 8g grasa" },
  { name: "Tortilla de huevo con queso campesino y ensalada", time: "12 min", macros: "≈310 kcal · 18g prot · 14g carb · 18g grasa" },
  { name: "Pollo a la plancha con ensalada de brócoli", time: "15 min", macros: "≈280 kcal · 30g prot · 12g carb · 9g grasa" },
  { name: "Wrap de atún con lechuga y tomate", time: "10 min", macros: "≈270 kcal · 25g prot · 22g carb · 8g grasa" },
  { name: "Huevos revueltos con queso mozzarella y tomate", time: "10 min", macros: "≈295 kcal · 17g prot · 10g carb · 19g grasa" },
  { name: "Ensalada de pollo con lechuga, tomate y pimentón", time: "15 min", macros: "≈260 kcal · 28g prot · 14g carb · 8g grasa" },
  { name: "Arepa pequeña con queso y huevo", time: "12 min", macros: "≈305 kcal · 15g prot · 30g carb · 13g grasa" },
  { name: "Atún con arepa de choclo pequeña y ensalada", time: "12 min", macros: "≈310 kcal · 24g prot · 30g carb · 9g grasa" },
];

const DESSERTS = [
  "Brownie de avena y cacao sin azúcar refinada","Cheesecake fit de yogur griego y fresas","Helado casero de banano congelado (nice cream)",
  "Galletas de avena y banano al horno","Mousse de mango y yogur griego","Gelatina de fresas naturales sin azúcar",
  "Paletas de yogur griego con arándanos","Copa de yogur griego con miel y canela","Trufas de avena, miel y cacao",
  "Helado de fresas y yogur griego","Pudín de chía con mango","Galletas de avena y manzana",
  "Brownie de banano sin harina","Mousse de fresa ligero","Gelatina de mango natural",
  "Paletas de mango y yogur","Cheesecake de limón fit","Copa de frutos rojos con miel",
  "Nice cream de mango congelado","Galletas de avena y canela","Trufas de banano y avena",
  "Mousse de cacao y yogur griego","Gelatina de arándanos","Paletas de fresa y banano",
  "Helado de yogur griego y mango","Brownie fit de cacao y banano","Copa de yogur con fresas y miel",
  "Galletas de avena rellenas de banano","Mousse de mango ligero","Gelatina light de frutos rojos",
  "Paletas de yogur griego y fresa","Cheesecake de mango fit","Trufas de cacao y miel",
  "Nice cream de fresa congelada","Galletas crocantes de avena","Copa de mango y yogur con canela",
  "Brownie de cacao y yogur griego","Mousse de banano y canela","Gelatina de mango y fresa",
  "Paletas de arándanos con miel","Helado fit de banano y cacao","Copa de frutos rojos y yogur griego",
];

const SNACKS_LIB = {
  "Salados": ["Rodajas de arepa asada con queso campesino","Huevo duro con tomate en rodajas","Arepa pequeña con queso mozzarella","Rollitos de queso campesino","Tortilla pequeña con queso y tomate","Palitos de queso campesino con tomate","Huevo duro con sal y limón","Arepa de choclo pequeña sola","Queso campesino en cubos","Rodajas de tomate con queso mozzarella","Huevo pericos en porción pequeña","Tortilla enrollada con queso"],
  "Dulces": ["Banano con miel","Fresas con miel","Mango picado","Uvas congeladas","Manzana en rodajas con canela","Yogur griego con miel","Arándanos naturales","Batido pequeño de fresa","Compota casera de manzana sin azúcar","Banano congelado en trozos","Ensalada de frutas pequeña","Yogur griego con mango"],
  "Para la ansiedad": ["Yogur griego con canela (calma y llena)","Infusión de canela caliente","Agua con limón bien fría","Fruta picada en trozos grandes para masticar despacio","Yogur griego congelado en cubos","Té de manzanilla con miel","Gelatina natural de fresas","Palitos de manzana con canela"],
  "Antes de entrenar": ["Banano pequeño","Tostada pequeña de arepa con miel","Batido ligero de banano y avena","Un puñado de uvas","Mango en trozos pequeños"],
  "Después de entrenar": ["Yogur griego con banano","Huevo duro con arepa pequeña","Batido de banano y yogur griego","Queso campesino con fruta","Wrap pequeño de huevo y queso"],
};

const GROCERY = {
  "Proteínas": ["Huevos","Pollo","Carne molida","Carne de res","Cerdo","Atún enlatado"],
  "Lácteos": ["Queso mozzarella","Queso campesino","Yogur griego"],
  "Carbohidratos": ["Arepas","Arepas de choclo","Arepas de yuca","Tortillas","Papa","Papa criolla","Maduro","Plátano","Arroz"],
  "Verduras": ["Tomate","Lechuga","Brócoli","Pimentón","Cebolla"],
  "Frutas": ["Manzana","Fresas","Arándanos","Banano","Mango","Uvas"],
  "Despensa": ["Miel","Canela","Limón"],
};

const ACHIEVEMENTS = [
  { id: "week1", label: "Primera semana", desc: "Completa los primeros 7 días", icon: "🌱" },
  { id: "streak7", label: "7 días seguidos", desc: "Una racha de 7 días sin fallar", icon: "🔥" },
  { id: "day14", label: "14 días", desc: "Mitad del camino recorrido", icon: "🌿" },
  { id: "day21", label: "21 días", desc: "3 semanas completas", icon: "🍃" },
  { id: "day30", label: "30 días", desc: "Reto completo", icon: "🏆" },
  { id: "kilo", label: "Primer kilo", desc: "Registra tu primera pérdida de peso", icon: "⚖️" },
  { id: "goal", label: "Meta cumplida", desc: "Alcanza tu peso meta", icon: "🎯" },
];

const CHECKLIST_ITEMS = [
  { key: "entrenamiento", label: "Entrenamiento" },
  { key: "agua", label: "Tomé suficiente agua" },
  { key: "fruta", label: "Comí fruta" },
  { key: "verduras", label: "Comí verduras" },
  { key: "proteina", label: "Comí proteína" },
  { key: "dormi", label: "Dormí bien" },
  { key: "sinMecato", label: "No comí mecato" },
  { key: "sinGaseosa", label: "No tomé gaseosa" },
];

const OLIVE = "#6b7353";
const OLIVE_DARK = "#4f5540";
const CREAM = "#faf8f3";
const BEIGE = "#efe9dc";

/* ============================== HELPERS ============================== */

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultState = {
  onboarded: false,
  name: "",
  startDate: null,
  startWeight: 79,
  currentWeight: 79,
  goalWeight: 72,
  completed: {},
  checklists: {},
  measurements: [],
  groceryChecked: {},
  freeMeals: [],
  darkMode: false,
};

function LeafCheck({ done, size = 18 }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full transition-all ${done ? "scale-100" : "scale-95 opacity-40"}`}
      style={{ width: size + 10, height: size + 10, background: done ? OLIVE : "transparent", border: done ? "none" : "2px solid #c7c0ac" }}
    >
      {done ? <Leaf size={size - 4} color="white" /> : null}
    </span>
  );
}

function dayIndexToday(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), 30);
}

/* ============================== APP ============================== */

export default function App() {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [selectedDay, setSelectedDay] = useState(null);
  const [nutritionView, setNutritionView] = useState("desserts");
  const [progressView, setProgressView] = useState("track");
  const [photos, setPhotos] = useState([]);

  // Load saved state once on first mount. This is what makes the app
  // remember everything even after closing the browser or restarting the phone:
  // the data lives in the browser's localStorage / IndexedDB, not in memory.
  useEffect(() => {
    const saved = loadState();
    if (saved) setState({ ...defaultState, ...saved });
    getAllPhotos().then(setPhotos).catch(() => {});
    setLoaded(true);
  }, []);

  // Persist on every change, debounced slightly so rapid taps don't spam writes.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => saveState(state), 150);
    return () => clearTimeout(t);
  }, [state, loaded]);

  const addPhoto = useCallback(async (day, dataUrl) => {
    const entry = { id: `photo-${day}-${Date.now()}`, day, date: todayKey(), dataUrl };
    await savePhoto(entry);
    setPhotos((p) => [...p, entry]);
  }, []);

  const removePhoto = useCallback(async (id) => {
    await deletePhoto(id);
    setPhotos((p) => p.filter((ph) => ph.id !== id));
  }, []);

  const doExport = useCallback(() => exportBackup(state), [state]);
  const doImport = useCallback(async (file) => {
    const restored = await importBackup(file);
    setState({ ...defaultState, ...restored });
    const ph = await getAllPhotos();
    setPhotos(ph);
  }, []);

  const isDark = state.darkMode;
  const bg = isDark ? "#1c1c19" : CREAM;
  const cardBg = isDark ? "#26261f" : "#ffffff";
  const textMain = isDark ? "#f2efe6" : "#2a2a24";
  const textSub = isDark ? "#b8b6a8" : "#6b6a5c";
  const border = isDark ? "#3a3a30" : "#e8e2d0";

  const currentDay = useMemo(() => dayIndexToday(state.startDate), [state.startDate]);
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const percent = Math.round((completedCount / 30) * 100);

  const streak = useMemo(() => {
    let s = 0;
    for (let d = currentDay; d >= 1; d--) {
      if (state.completed[d]) s++;
      else break;
    }
    return s;
  }, [state.completed, currentDay]);

  const pendingDays = useMemo(() => {
    const arr = [];
    for (let d = 1; d < currentDay; d++) {
      if (!state.completed[d]) arr.push(d);
    }
    return arr;
  }, [state.completed, currentDay]);

  const unlockedAchievements = useMemo(() => {
    const u = new Set();
    if (completedCount >= 7) u.add("week1");
    if (streak >= 7) u.add("streak7");
    if (completedCount >= 14) u.add("day14");
    if (completedCount >= 21) u.add("day21");
    if (completedCount >= 30) u.add("day30");
    if (state.startWeight - state.currentWeight >= 1) u.add("kilo");
    if (state.currentWeight <= state.goalWeight) u.add("goal");
    return u;
  }, [completedCount, streak, state.startWeight, state.currentWeight, state.goalWeight]);

  const setField = (key, val) => setState((s) => ({ ...s, [key]: val }));

  const startChallenge = () => {
    setState((s) => ({ ...s, onboarded: true, startDate: todayKey() }));
  };

  const toggleDayComplete = (day) => {
    setState((s) => ({ ...s, completed: { ...s.completed, [day]: !s.completed[day] } }));
  };

  const setChecklistItem = (day, key, val) => {
    setState((s) => ({
      ...s,
      checklists: { ...s.checklists, [day]: { ...(s.checklists[day] || {}), [key]: val } },
    }));
  };

  const addMeasurement = (entry) => {
    setState((s) => ({ ...s, measurements: [...s.measurements, entry], currentWeight: entry.weight || s.currentWeight }));
  };

  const toggleGrocery = (item) => {
    setState((s) => ({ ...s, groceryChecked: { ...s.groceryChecked, [item]: !s.groceryChecked[item] } }));
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: CREAM }}>
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Leaf color={OLIVE} size={32} />
          <p style={{ color: OLIVE }} className="text-sm">Preparando tu reto...</p>
        </div>
      </div>
    );
  }

  if (!state.onboarded) {
    return <Welcome onStart={startChallenge} isDark={isDark} />;
  }

  const quote = QUOTES[(currentDay - 1) % QUOTES.length];

  return (
    <div className="min-h-screen w-full font-sans pb-24" style={{ background: bg, color: textMain }}>
      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: bg }}>
        <header className="flex items-center justify-between px-5 pt-6 pb-2">
          <div>
            <p className="text-xs tracking-widest uppercase" style={{ color: OLIVE }}>Reto 30 días</p>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>
              {tab === "home" && "Tu progreso"}
              {tab === "calendar" && "Calendario"}
              {tab === "nutrition" && "Nutrición"}
              {tab === "progress" && "Seguimiento"}
            </h1>
          </div>
          <button
            onClick={() => setField("darkMode", !isDark)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: cardBg, border: `1px solid ${border}` }}
          >
            {isDark ? <Sun size={16} color={textMain} /> : <Moon size={16} color={textMain} />}
          </button>
        </header>

        <main className="px-5">
          {tab === "home" && (
            <HomeScreen
              state={state} currentDay={currentDay} percent={percent} streak={streak}
              quote={quote} cardBg={cardBg} border={border} textSub={textSub}
              pendingDays={pendingDays}
              onOpenDay={(d) => { setSelectedDay(d); setTab("calendar"); }}
              onWeightChange={(w) => setField("currentWeight", w)}
            />
          )}
          {tab === "calendar" && !selectedDay && (
            <CalendarGrid
              state={state} currentDay={currentDay} cardBg={cardBg} border={border}
              onOpen={(d) => setSelectedDay(d)}
            />
          )}
          {tab === "calendar" && selectedDay && (
            <DayDetail
              day={selectedDay} state={state} cardBg={cardBg} border={border} textSub={textSub}
              photos={photos.filter((p) => p.day === selectedDay)}
              onAddPhoto={(dataUrl) => addPhoto(selectedDay, dataUrl)}
              onRemovePhoto={removePhoto}
              onBack={() => setSelectedDay(null)}
              onToggleComplete={() => toggleDayComplete(selectedDay)}
              onChecklist={(key, val) => setChecklistItem(selectedDay, key, val)}
            />
          )}
          {tab === "nutrition" && (
            <NutritionHub
              view={nutritionView} setView={setNutritionView}
              cardBg={cardBg} border={border} textSub={textSub}
              groceryChecked={state.groceryChecked} onToggleGrocery={toggleGrocery}
            />
          )}
          {tab === "progress" && (
            <ProgressHub
              view={progressView} setView={setProgressView}
              state={state} cardBg={cardBg} border={border} textSub={textSub}
              unlocked={unlockedAchievements}
              onAddMeasurement={addMeasurement}
              onAddFreeMeal={() => setState((s) => ({ ...s, freeMeals: [...s.freeMeals, todayKey()] }))}
              onGoalChange={(v) => setField("goalWeight", v)}
              onExport={doExport} onImport={doImport}
              photos={photos} onRemovePhoto={removePhoto}
            />
          )}
        </main>

        <nav
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around items-center py-3 px-2"
          style={{ background: cardBg, borderTop: `1px solid ${border}` }}
        >
          {[
            { id: "home", icon: Home, label: "Inicio" },
            { id: "calendar", icon: Calendar, label: "Calendario" },
            { id: "nutrition", icon: UtensilsCrossed, label: "Nutrición" },
            { id: "progress", icon: TrendingUp, label: "Progreso" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id !== "calendar") setSelectedDay(null); }}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors"
              style={{ color: tab === id ? OLIVE : textSub, background: tab === id ? (isDark ? "#33352a" : BEIGE) : "transparent" }}
            >
              <Icon size={20} />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ============================== WELCOME ============================== */

function Welcome({ onStart, isDark }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: isDark ? "#1c1c19" : CREAM }}>
      <div className="max-w-sm w-full text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center" style={{ background: BEIGE }}>
          <Leaf size={34} color={OLIVE} />
        </div>
        <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: OLIVE }}>Reto de transformación</p>
        <h1 className="text-3xl mb-4" style={{ fontFamily: "Georgia, serif", color: "#2a2a24" }}>30 días para sentirte fuerte</h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#6b6a5c" }}>
          Un plan diario de entrenamiento en casa, alimentación colombiana sencilla y seguimiento real,
          pensado para llegar a tu cumpleaños sintiéndote más fuerte, más ligera y orgullosa de tu constancia.
          Sin gimnasio. Sin equipos. Solo tú y tu cuerpo, un día a la vez.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-8 text-xs" style={{ color: "#6b6a5c" }}>
          <div className="p-3 rounded-2xl" style={{ background: "#fff" }}>
            <p className="text-lg font-semibold" style={{ color: OLIVE }}>30</p>días de plan
          </div>
          <div className="p-3 rounded-2xl" style={{ background: "#fff" }}>
            <p className="text-lg font-semibold" style={{ color: OLIVE }}>0</p>equipo necesario
          </div>
          <div className="p-3 rounded-2xl" style={{ background: "#fff" }}>
            <p className="text-lg font-semibold" style={{ color: OLIVE }}>100%</p>a tu ritmo
          </div>
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-medium tracking-wide"
          style={{ background: OLIVE }}
        >
          Comenzar mi reto
        </button>
        <p className="text-[11px] mt-4" style={{ color: "#9a9686" }}>Tu progreso se guarda automáticamente en este dispositivo.</p>
      </div>
    </div>
  );
}

/* ============================== HOME ============================== */

function HomeScreen({ state, currentDay, percent, streak, quote, cardBg, border, textSub, pendingDays, onOpenDay, onWeightChange }) {
  const lost = (state.startWeight - state.currentWeight).toFixed(1);
  return (
    <div className="space-y-4 mt-2">
      {pendingDays && pendingDays.length > 0 && (
        <div className="rounded-3xl p-4 flex items-start gap-3" style={{ background: "#fdf1e0", border: "1px solid #f0d9ae" }}>
          <AlertCircle size={16} color="#b5772e" className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: "#8a5a1f" }}>
              {pendingDays.length === 1
                ? `El día ${pendingDays[0]} quedó pendiente.`
                : `Tienes ${pendingDays.length} días pendientes: ${pendingDays.join(", ")}.`}
            </p>
            <button onClick={() => onOpenDay(pendingDays[0])} className="text-xs underline mt-1" style={{ color: "#8a5a1f" }}>
              Ir a ese día
            </button>
          </div>
        </div>
      )}
      <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10" style={{ background: OLIVE }} />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-xs" style={{ color: textSub }}>Día</p>
            <p className="text-4xl font-semibold" style={{ fontFamily: "Georgia, serif", color: OLIVE }}>{currentDay}<span className="text-lg" style={{ color: textSub }}>/30</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Flame size={16} color="#c17a4a" />
              <span className="text-sm font-medium">{streak} días seguidos</span>
            </div>
            <p className="text-xs mt-1" style={{ color: textSub }}>{percent}% completado</p>
          </div>
        </div>
        <div className="w-full h-2 rounded-full mt-4 overflow-hidden" style={{ background: border }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: OLIVE }} />
        </div>
        <button
          onClick={() => onOpenDay(currentDay)}
          className="mt-4 w-full py-3 rounded-2xl text-white text-sm font-medium flex items-center justify-center gap-2"
          style={{ background: OLIVE }}
        >
          <Play size={14} fill="white" /> Ir al día {currentDay}
        </button>
      </div>

      <div className="rounded-3xl p-5 flex items-start gap-3" style={{ background: BEIGE }}>
        <Sparkles size={18} color={OLIVE} className="mt-0.5 shrink-0" />
        <p className="text-sm italic leading-relaxed" style={{ color: "#4a4a3c" }}>{quote}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <WeightCard label="Inicial" value={`${state.startWeight} kg`} cardBg={cardBg} border={border} textSub={textSub} />
        <WeightEditable label="Actual" value={state.currentWeight} onChange={onWeightChange} cardBg={cardBg} border={border} textSub={textSub} />
        <WeightCard label="Meta" value={`${state.goalWeight} kg`} cardBg={cardBg} border={border} textSub={textSub} />
      </div>

      <div className="rounded-3xl p-4 flex items-center justify-between" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <Target size={16} color={OLIVE} />
          <p className="text-sm">Has bajado</p>
        </div>
        <p className="text-sm font-semibold" style={{ color: OLIVE }}>{lost > 0 ? `${lost} kg` : "Aún sin registrar"}</p>
      </div>

      <MiniCalendarStrip state={state} currentDay={currentDay} onOpenDay={onOpenDay} border={border} cardBg={cardBg} textSub={textSub} />
    </div>
  );
}

function WeightCard({ label, value, cardBg, border, textSub }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <p className="text-[10px] uppercase tracking-wide" style={{ color: textSub }}>{label}</p>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}

function WeightEditable({ label, value, onChange, cardBg, border, textSub }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ background: cardBg, border: `2px solid ${OLIVE}` }}>
      <p className="text-[10px] uppercase tracking-wide" style={{ color: textSub }}>{label}</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <button onClick={() => onChange(Math.max(30, +(value - 0.1).toFixed(1)))} className="opacity-60"><Minus size={12} /></button>
        <p className="text-sm font-semibold">{value} kg</p>
        <button onClick={() => onChange(+(value + 0.1).toFixed(1))} className="opacity-60"><Plus size={12} /></button>
      </div>
    </div>
  );
}

function MiniCalendarStrip({ state, currentDay, onOpenDay, border, cardBg, textSub }) {
  const days = Array.from({ length: 7 }, (_, i) => currentDay - 2 + i).filter((d) => d >= 1 && d <= 30);
  return (
    <div>
      <p className="text-xs mb-2" style={{ color: textSub }}>Esta semana</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const done = !!state.completed[d];
          const isToday = d === currentDay;
          return (
            <button
              key={d}
              onClick={() => onOpenDay(d)}
              className="flex flex-col items-center gap-1 min-w-[52px] py-2 rounded-2xl"
              style={{ background: isToday ? OLIVE : cardBg, border: isToday ? "none" : `1px solid ${border}` }}
            >
              <span className="text-[10px]" style={{ color: isToday ? "#fff" : textSub }}>Día</span>
              <span className="text-sm font-semibold" style={{ color: isToday ? "#fff" : "inherit" }}>{d}</span>
              <LeafCheck done={done} size={12} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== CALENDAR ============================== */

function CalendarGrid({ state, currentDay, cardBg, border, onOpen }) {
  return (
    <div className="mt-2">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
          const done = !!state.completed[d];
          const isToday = d === currentDay;
          const locked = d > currentDay + 1;
          const pending = !done && d < currentDay;
          return (
            <button
              key={d}
              disabled={locked}
              onClick={() => onOpen(d)}
              className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 relative"
              style={{
                background: done ? OLIVE : isToday ? BEIGE : cardBg,
                border: `1px solid ${pending ? "#e0a94f" : isToday ? OLIVE : border}`,
                opacity: locked ? 0.4 : 1,
              }}
            >
              {locked && <Lock size={10} className="absolute top-1.5 right-1.5 opacity-50" />}
              {pending && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#e0a94f" }} />}
              <span className="text-sm font-semibold" style={{ color: done ? "#fff" : "inherit" }}>{d}</span>
              {done && <Leaf size={10} color="#fff" />}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-center mt-4 opacity-60">
        <span style={{ color: "#e0a94f" }}>●</span> día pendiente · los días futuros se desbloquean uno a uno para seguir tu ritmo real.
      </p>
    </div>
  );
}

/* ============================== DAY DETAIL ============================== */

function DayDetail({ day, state, cardBg, border, textSub, photos, onAddPhoto, onRemovePhoto, onBack, onToggleComplete, onChecklist }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAddPhoto(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const [planId, phase, note] = PLAN[day - 1];
  const workout = WORKOUTS[planId];
  const isRest = planId === "rest";
  const breakfast = BREAKFASTS[(day - 1) % BREAKFASTS.length];
  const lunch = LUNCHES[(day - 1) % LUNCHES.length];
  const dinner = DINNERS[(day - 1) % DINNERS.length];
  const snack1 = SNACKS_DAY[(day - 1) % SNACKS_DAY.length];
  const snack2 = SNACKS_DAY[(day + 5) % SNACKS_DAY.length];
  const checklist = state.checklists[day] || {};
  const done = !!state.completed[day];

  return (
    <div className="mt-2 pb-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-3" style={{ color: OLIVE }}>
        <ChevronLeft size={16} /> Volver al calendario
      </button>

      <div className="rounded-3xl p-5 mb-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
        <p className="text-xs" style={{ color: OLIVE }}>{phase}</p>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>Día {day}</h2>
        <p className="text-sm mt-2 italic" style={{ color: textSub }}>{note}</p>
      </div>

      <Section title="Entrenamiento" icon={<Play size={14} color={OLIVE} />} cardBg={cardBg} border={border}>
        {isRest ? (
          <p className="text-sm" style={{ color: textSub }}>Hoy es descanso activo: camina, estira y deja que tu cuerpo se recupere. El descanso también construye resultados.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">{workout.title}</p>
            <p className="text-xs" style={{ color: textSub }}>{workout.creator}</p>
            <a href={workout.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl text-white mt-1" style={{ background: OLIVE }}>
              <Play size={12} fill="white" /> Ver video
            </a>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2" style={{ color: textSub }}>
              <p><Clock size={11} className="inline mr-1" />{workout.duration}</p>
              <p>Nivel: {workout.level}</p>
              <p className="col-span-2">Objetivo: {workout.goal}</p>
              <p className="col-span-2">Músculos: {workout.muscles.join(", ")}</p>
            </div>
            <details className="mt-2 text-xs" style={{ color: textSub }}>
              <summary className="cursor-pointer" style={{ color: OLIVE }}>Consejos y errores comunes</summary>
              <ul className="list-disc ml-4 mt-1 space-y-1">{workout.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
              <ul className="list-disc ml-4 mt-1 space-y-1 opacity-80">{workout.mistakes.map((t, i) => <li key={i}>Evita: {t}</li>)}</ul>
            </details>
          </div>
        )}
      </Section>

      <Section title="Alimentación" icon={<UtensilsCrossed size={14} color={OLIVE} />} cardBg={cardBg} border={border}>
        <MealRow label="Desayuno" meal={breakfast} />
        <MealRow label="Snack" simple={snack1} />
        <MealRow label="Almuerzo" meal={lunch} />
        <MealRow label="Snack" simple={snack2} />
        <MealRow label="Cena" meal={dinner} />
      </Section>

      <Section title="Reto del día" icon={<Sparkles size={14} color={OLIVE} />} cardBg={cardBg} border={border}>
        <p className="text-sm">{CHALLENGES[(day - 1) % CHALLENGES.length]}</p>
      </Section>

      <Section title="Foto de progreso" icon={<Camera size={14} color={OLIVE} />} cardBg={cardBg} border={border}>
        <div className="flex gap-2 flex-wrap">
          {photos.map((p) => (
            <div key={p.id} className="relative w-16 h-16 rounded-xl overflow-hidden">
              <img src={p.dataUrl} alt={`Foto día ${day}`} className="w-full h-full object-cover" />
              <button onClick={() => onRemovePhoto(p.id)} className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5">
                <X size={10} color="#fff" />
              </button>
            </div>
          ))}
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ border: `1px dashed ${border}` }}
          >
            <Plus size={16} style={{ color: OLIVE }} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
        </div>
        <p className="text-[11px] mt-2" style={{ color: textSub }}>Tus fotos se guardan solo en este dispositivo, nunca se suben a internet.</p>
      </Section>

      <Section title="Checklist" icon={<Check size={14} color={OLIVE} />} cardBg={cardBg} border={border}>
        <div className="space-y-2">
          {CHECKLIST_ITEMS.map((item) => (
            <label key={item.key} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={!!checklist[item.key]} onChange={(e) => onChecklist(item.key, e.target.checked)} className="w-4 h-4 accent-[#6b7353]" />
              {item.label}
            </label>
          ))}
        </div>
      </Section>

      <button
        onClick={onToggleComplete}
        className="w-full py-3 rounded-2xl font-medium mt-2"
        style={{ background: done ? BEIGE : OLIVE, color: done ? OLIVE : "white" }}
      >
        {done ? "Día marcado como completado ✓" : "Marcar día como completado"}
      </button>
    </div>
  );
}

function Section({ title, icon, children, cardBg, border }) {
  return (
    <div className="rounded-3xl p-4 mb-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 mb-2">{icon}<p className="text-sm font-semibold">{title}</p></div>
      {children}
    </div>
  );
}

function MealRow({ label, meal, simple }) {
  return (
    <div className="py-2 border-b last:border-b-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
      <p className="text-[10px] uppercase tracking-wide opacity-60">{label}</p>
      {simple ? (
        <p className="text-sm">{simple}</p>
      ) : (
        <>
          <p className="text-sm">{meal.name}</p>
          <p className="text-[11px] opacity-60">{meal.time} · {meal.macros}</p>
        </>
      )}
    </div>
  );
}

/* ============================== NUTRITION HUB ============================== */

function NutritionHub({ view, setView, cardBg, border, textSub, groceryChecked, onToggleGrocery }) {
  return (
    <div className="mt-2">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[{ id: "desserts", label: "Postres" }, { id: "snacks", label: "Snacks" }, { id: "grocery", label: "Lista de mercado" }].map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} className="px-4 py-2 rounded-full text-xs whitespace-nowrap"
            style={{ background: view === v.id ? OLIVE : cardBg, color: view === v.id ? "#fff" : "inherit", border: `1px solid ${view === v.id ? OLIVE : border}` }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === "desserts" && (
        <div className="grid grid-cols-2 gap-2">
          {DESSERTS.map((d, i) => (
            <div key={i} className="rounded-2xl p-3 text-xs" style={{ background: cardBg, border: `1px solid ${border}` }}>{d}</div>
          ))}
        </div>
      )}

      {view === "snacks" && (
        <div className="space-y-4">
          {Object.entries(SNACKS_LIB).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-xs font-semibold mb-2" style={{ color: OLIVE }}>{cat}</p>
              <div className="grid grid-cols-2 gap-2">
                {items.map((s, i) => (
                  <div key={i} className="rounded-2xl p-3 text-xs" style={{ background: cardBg, border: `1px solid ${border}` }}>{s}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "grocery" && (
        <div className="space-y-4">
          {Object.entries(GROCERY).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-xs font-semibold mb-2" style={{ color: OLIVE }}>{cat}</p>
              <div className="rounded-2xl p-2" style={{ background: cardBg, border: `1px solid ${border}` }}>
                {items.map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm px-2 py-2 border-b last:border-b-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <input type="checkbox" checked={!!groceryChecked[item]} onChange={() => onToggleGrocery(item)} className="w-4 h-4 accent-[#6b7353]" />
                    <span className={groceryChecked[item] ? "line-through opacity-50" : ""}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== PROGRESS HUB ============================== */

function ProgressHub({ view, setView, state, cardBg, border, textSub, unlocked, onAddMeasurement, onAddFreeMeal, onGoalChange, onExport, onImport, photos, onRemovePhoto }) {
  const [form, setForm] = useState({ weight: state.currentWeight, waist: "", hip: "", leg: "", arm: "", abdomen: "", mood: "bien", energy: "media", sleep: "bien", water: "6" });
  const importRef = useRef(null);
  const [importMsg, setImportMsg] = useState("");

  const handleImportFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      await onImport(file);
      setImportMsg("Datos restaurados correctamente.");
    } catch (err) {
      setImportMsg("No se pudo leer ese archivo de respaldo.");
    }
    e.target.value = "";
  };

  const submit = () => {
    onAddMeasurement({
      date: todayKey(),
      weight: parseFloat(form.weight) || state.currentWeight,
      waist: form.waist, hip: form.hip, leg: form.leg, arm: form.arm, abdomen: form.abdomen,
      mood: form.mood, energy: form.energy, sleep: form.sleep, water: form.water,
    });
  };

  const chartData = state.measurements.map((m, i) => ({ name: `#${i + 1}`, peso: m.weight }));

  return (
    <div className="mt-2">
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[{ id: "track", label: "Registrar" }, { id: "stats", label: "Estadísticas" }, { id: "achievements", label: "Logros" }, { id: "free", label: "Comida libre" }, { id: "backup", label: "Respaldo" }].map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} className="px-4 py-2 rounded-full text-xs whitespace-nowrap"
            style={{ background: view === v.id ? OLIVE : cardBg, color: view === v.id ? "#fff" : "inherit", border: `1px solid ${view === v.id ? OLIVE : border}` }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === "track" && (
        <div className="rounded-3xl p-4 space-y-3" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <Field label="Peso (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cintura (cm)" value={form.waist} onChange={(v) => setForm({ ...form, waist: v })} icon={<Ruler size={12} />} />
            <Field label="Cadera (cm)" value={form.hip} onChange={(v) => setForm({ ...form, hip: v })} icon={<Ruler size={12} />} />
            <Field label="Pierna (cm)" value={form.leg} onChange={(v) => setForm({ ...form, leg: v })} icon={<Ruler size={12} />} />
            <Field label="Brazo (cm)" value={form.arm} onChange={(v) => setForm({ ...form, arm: v })} icon={<Ruler size={12} />} />
          </div>
          <Field label="Abdomen (cm)" value={form.abdomen} onChange={(v) => setForm({ ...form, abdomen: v })} icon={<Ruler size={12} />} />
          <SelectField label="Estado de ánimo" icon={<Smile size={12} />} value={form.mood} onChange={(v) => setForm({ ...form, mood: v })} options={["genial", "bien", "normal", "cansada", "desmotivada"]} />
          <SelectField label="Energía" icon={<BatteryMedium size={12} />} value={form.energy} onChange={(v) => setForm({ ...form, energy: v })} options={["alta", "media", "baja"]} />
          <SelectField label="Sueño" icon={<BedDouble size={12} />} value={form.sleep} onChange={(v) => setForm({ ...form, sleep: v })} options={["excelente", "bien", "regular", "mal"]} />
          <Field label="Vasos de agua" value={form.water} onChange={(v) => setForm({ ...form, water: v })} icon={<Droplet size={12} />} />
          <button onClick={submit} className="w-full py-3 rounded-2xl text-white text-sm font-medium" style={{ background: OLIVE }}>Guardar registro de hoy</button>
        </div>
      )}

      {view === "stats" && (
        <div className="space-y-4">
          <div className="rounded-3xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <p className="text-sm font-semibold mb-2">Evolución de peso</p>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={border} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="peso" stroke={OLIVE} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs" style={{ color: textSub }}>Registra al menos 2 días para ver tu gráfico de peso.</p>
            )}
          </div>
          <div className="rounded-3xl p-4" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <p className="text-sm font-semibold mb-2">Cumplimiento</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={[
                { name: "Entrenos", val: Object.values(state.completed).filter(Boolean).length },
                { name: "Registros", val: state.measurements.length },
                { name: "Racha", val: Object.keys(state.completed).length },
              ]}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="val" fill={OLIVE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "achievements" && (
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const on = unlocked.has(a.id);
            return (
              <div key={a.id} className="rounded-2xl p-4 text-center" style={{ background: on ? BEIGE : cardBg, border: `1px solid ${border}`, opacity: on ? 1 : 0.5 }}>
                <p className="text-2xl mb-1">{a.icon}</p>
                <p className="text-xs font-semibold">{a.label}</p>
                <p className="text-[10px] mt-1" style={{ color: textSub }}>{a.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {view === "free" && (
        <div className="rounded-3xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="flex items-center gap-2 mb-2"><Heart size={16} color={OLIVE} /><p className="text-sm font-semibold">Tu comida libre semanal</p></div>
          <p className="text-sm mb-3" style={{ color: textSub }}>
            Una comida libre a la semana no arruina tu progreso. Disfrútala sin culpa, es parte de un plan sostenible, no un error.
          </p>
          <button onClick={onAddFreeMeal} className="w-full py-3 rounded-2xl text-white text-sm font-medium" style={{ background: OLIVE }}>Registrar comida libre de esta semana</button>
          <p className="text-xs mt-3" style={{ color: textSub }}>Comidas libres registradas: {state.freeMeals.length}</p>
        </div>
      )}

      {view === "backup" && (
        <div className="space-y-4">
          <div className="rounded-3xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2 mb-2"><Settings size={16} color={OLIVE} /><p className="text-sm font-semibold">Copia de seguridad</p></div>
            <p className="text-sm mb-4" style={{ color: textSub }}>
              Tu progreso ya se guarda automáticamente en este teléfono. Aun así, te recomendamos exportar
              una copia de vez en cuando, o antes de cambiar de celular, para no depender de un solo dispositivo.
            </p>
            <button onClick={onExport} className="w-full py-3 rounded-2xl text-white text-sm font-medium flex items-center justify-center gap-2 mb-2" style={{ background: OLIVE }}>
              <Download size={14} /> Exportar copia de seguridad
            </button>
            <button onClick={() => importRef.current && importRef.current.click()} className="w-full py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2" style={{ border: `1px solid ${OLIVE}`, color: OLIVE }}>
              <Upload size={14} /> Restaurar desde un archivo
            </button>
            <input ref={importRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
            {importMsg && <p className="text-xs mt-2" style={{ color: OLIVE }}>{importMsg}</p>}
            <p className="text-[11px] mt-3" style={{ color: textSub }}>
              El archivo exportado incluye todo tu progreso, medidas y fotos. Guárdalo en Drive, iCloud o
              donde prefieras. Para restaurarlo en un celular nuevo, abre la app aquí e importa ese archivo.
            </p>
          </div>

          {photos && photos.length > 0 && (
            <div className="rounded-3xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
              <p className="text-sm font-semibold mb-3">Todas tus fotos de progreso</p>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={p.dataUrl} alt={`Día ${p.day}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-black/50 text-white px-1 rounded">D{p.day}</span>
                    <button onClick={() => onRemovePhoto(p.id)} className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5">
                      <Trash2 size={9} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, icon }) {
  return (
    <label className="block">
      <span className="text-[11px] opacity-60 flex items-center gap-1">{icon}{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal"
        className="w-full mt-1 px-3 py-2 rounded-xl text-sm bg-transparent border" style={{ borderColor: "#c7c0ac" }} />
    </label>
  );
}
function SelectField({ label, value, onChange, options, icon }) {
  return (
    <label className="block">
      <span className="text-[11px] opacity-60 flex items-center gap-1">{icon}{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl text-sm bg-transparent border" style={{ borderColor: "#c7c0ac" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
