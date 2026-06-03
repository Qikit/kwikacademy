/**
 * Перемешивает варианты ответа вопроса (Fisher-Yates) и пересчитывает
 * correctIndex на новую позицию правильного варианта.
 *
 * Чистая функция: источник случайности инжектируется (`rng`), по умолчанию
 * Math.random. Не мутирует входной массив.
 */
export function shuffleOptions(
  options: string[],
  correctIndex: number,
  rng: () => number = Math.random,
): { options: string[]; correctIndex: number } {
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    options: order.map((i) => options[i]),
    correctIndex: order.indexOf(correctIndex),
  };
}

/**
 * Перемешивает массив (Fisher-Yates), не мутируя вход. Источник случайности
 * инжектируется. Для тренажёров: новый порядок элементов на каждый заход.
 */
export function shuffleArray<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
