import { Question } from './types';

// Helper to standardise dynamic question formatting and labels
function createQuestion(
  lessonId: string,
  index: number,
  levelStr: 'Nhận biết — Dễ' | 'Thông hiểu — Trung bình' | 'Vận dụng — Khó' | 'Vận dụng cao — Cực khó',
  questionText: string,
  options: string[],
  correctAnswer: string,
  explanation: string
): Question {
  // Ensure options are strictly unique and always have exactly 4 candidates
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const opt of options) {
    if (!seen.has(opt)) {
      seen.add(opt);
      deduped.push(opt);
    }
  }

  // If there are duplicate option values generated, backfill with mathematically near candidates
  if (deduped.length < 4) {
    let attempt = 1;
    while (deduped.length < 4 && attempt < 30) {
      const baseOpt = deduped[0] || correctAnswer || '0';
      let newOpt = baseOpt;

      // Extract a number inside LaTeX or plain text if possible to vary it
      const numMatch = baseOpt.match(/(-?\d+)/);
      if (numMatch) {
         const val = parseInt(numMatch[1], 10);
         const offset = attempt % 2 === 0 ? Math.floor(attempt / 2) : -Math.ceil(attempt / 2);
         const newVal = val + offset;
         newOpt = baseOpt.replace(numMatch[1], newVal.toString());
      } else {
         newOpt = `${baseOpt} v${attempt}`;
      }

      if (!seen.has(newOpt)) {
         seen.add(newOpt);
         deduped.push(newOpt);
      }
      attempt++;
    }
  }

  // Double check that the correct answer is indeed in the list
  if (!deduped.includes(correctAnswer)) {
    // If correct answer got omitted or wasn't in original list, put it as first element
    if (deduped.length > 0) {
      deduped[0] = correctAnswer;
    } else {
      deduped.push(correctAnswer);
    }
  }

  // Deterministic shuffle using a hash of the lessonId and index to guarantee stability across user renders
  let hash = 0;
  const seedStr = lessonId + index.toString() + "shuffle-v2";
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const getRand = (offset: number) => {
    const value = Math.abs(Math.sin(hash + offset) * 10000);
    return value - Math.floor(value);
  };
  
  const shuffled = [...deduped];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const r = getRand(i);
    const j = Math.floor(r * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return {
    id: `${lessonId}-q${index}`,
    questionText: `[Lớp 8 PRO • Cấp độ ${index}/20 — ${levelStr}] ${questionText}`,
    options: shuffled,
    correctAnswer,
    explanation
  };
}

// Deterministic seedable RNG helper, to ensure random questions are 100% stable per lesson & question index
function getDeterministicParams(lessonId: string, index: number) {
  let hash = 0;
  const str = lessonId + index.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const nextRand = (offset: number) => {
    const value = Math.abs(Math.sin(hash + offset) * 10000);
    return value - Math.floor(value);
  };
  return {
    getValRange: (min: number, max: number, offset = 0) => {
      const r = nextRand(offset);
      return Math.floor(r * (max - min + 1)) + min;
    },
    getSign: (offset = 0) => {
      return nextRand(offset) > 0.5 ? 1 : -1;
    }
  };
}

export function getQuizzesForLesson(lessonId: string): Question[] {
  const quizzes: Question[] = [];

  for (let index = 1; index <= 20; index++) {
    // Difficulty Tiering
    let levelStr: 'Nhận biết — Dễ' | 'Thông hiểu — Trung bình' | 'Vận dụng — Khó' | 'Vận dụng cao — Cực khó' = 'Nhận biết — Dễ';
    if (index >= 6 && index <= 12) levelStr = 'Thông hiểu — Trung bình';
    else if (index >= 13 && index <= 17) levelStr = 'Vận dụng — Khó';
    else if (index >= 18) levelStr = 'Vận dụng cao — Cực khó';

    const { getValRange, getSign } = getDeterministicParams(lessonId, index);

    // Dynamic generation based on Lesson ID
    switch (lessonId) {
      // --- CHAPTER I: ĐA THỨC ---
      case 'don-thuc-nhieu-bien': {
        const coef1 = getValRange(2, 9) * getSign(1);
        const coef2 = getValRange(2, 5) * getSign(2);
        const xExp1 = getValRange(1, 4);
        const yExp1 = getValRange(1, 4);
        const xExp2 = getValRange(1, 4);
        const yExp2 = getValRange(1, 4);

        if (index <= 5) {
          // Monomial identification/Coefficients/Parts
          if (index === 1) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Trong các biểu thức đại số sau, biểu thức nào là một đơn thức nhiều biến?`,
              [`$2x + 3y$`, `$${coef1}x^${xExp1}y^${yExp1}$`, `$\\frac{x - y}{3}$`, `$x^2 - 4xy + y^2$`],
              `$${coef1}x^${xExp1}y^${yExp1}$`,
              `Đơn thức chỉ có cấu tạo gồm hằng số hoặc một biến hoặc tích giữa số và biến. Biểu thức $${coef1}x^${xExp1}y^${yExp1}$ chính là một đơn thức. Các biểu thức còn lại đều chứa phép cộng hoặc phép trừ ngoài biến.`
            ));
          } else if (index === 2) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Xác định phần hệ số của đơn thức thu gọn $M = -\\frac{${coef1 * coef2}}{3}x^2y^3z$:`,
              [`$-\\frac{${coef1 * coef2}}{3}$`, `$\\frac{${coef1 * coef2}}{3}$`, `$2$`, `$x^2y^3z$`],
              `$-\\frac{${coef1 * coef2}}{3}$`,
              `Hệ số là nhân tử số đứng trước phần biến của đơn thức thu gọn. Ở đây phần hệ số chính là $-\\frac{${coef1 * coef2}}{3}$.`
            ));
          } else if (index === 3) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm phần biến của đơn thức $P = ${coef1}xy^2z^3$:`,
              [`$x$`, `$y^2$`, `$xy^2z^3$`, `$${coef1}$`],
              `$xy^2z^3$`,
              `Phần biến là phần chứa các chữ biến đã thu gọn và lũy thừa của chúng. Trong đơn thức $P = ${coef1}xy^2z^3$, phần biến là $xy^2z^3$.`
            ));
          } else if (index === 4) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cặp đơn thức nào sau đây là hai đơn thức đồng dạng?`,
              [`$3x^2y$ và $3xy^2$`, `$-5x^2y$ và $2x^2y$`, `$2x^2y^2$ và $2x^3y^3$`, `$x$ và $y$`],
              `$-5x^2y$ và $2x^2y$`,
              `Hai đơn thức đồng dạng là hai đơn thức có hệ số khác $0$ và có cùng phần biến. Biểu thức $-5x^2y$ và $2x^2y$ đều có chung phần biến là $x^2y$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Biểu thức nào sau đây KHÔNG phải là đơn thức?`,
              [`$0$`, `$2xy$`, `$x^2y \\cdot (x-1)$`, `$2.5x^3z^4$`],
              `$x^2y \\cdot (x-1)$`,
              `Biểu thức $x^2y \\cdot (x-1) = x^3y - x^2y$ chứa phép trừ đa thức hiệu nên không thể là đơn thức.`
            ));
          }
        } else if (index <= 12) {
          // Degree of monomial / Simple simplification/ Add-subtract
          const correctCoef = coef1 * coef2;
          const totalDegree = xExp1 + yExp1 + xExp2 + yExp2;
          if (index % 2 === 0) {
            const opt1Coef = (coef1 + coef2 === correctCoef) ? correctCoef + 5 : coef1 + coef2;
            const opt2XExp = xExp1 + xExp2 + 1;
            const opt3YExp = yExp1 + yExp2 + 1;
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Thu gọn đơn thức $A = ${coef1}x^${xExp1}y^${yExp1} \\cdot ${coef2}x^${xExp2}y^${yExp2}$ ta được đơn thức nào?`,
              [`$${correctCoef}x^${xExp1 + xExp2}y^${yExp1 + yExp2}$`, `$${opt1Coef}x^${xExp1 + xExp2}y^${yExp1 + yExp2}$`, `$${correctCoef}x^${opt2XExp}y^${yExp1 + yExp2}$`, `$${correctCoef}x^${xExp1 + xExp2}y^${opt3YExp}$`],
              `$${correctCoef}x^${xExp1 + xExp2}y^${yExp1 + yExp2}$`,
              `Ta nhân hệ số với hệ số: $${coef1} \\cdot ${coef2} = ${correctCoef}$. Nhân phần biến: $x^${xExp1} \\cdot x^${xExp2} = x^${xExp1 + xExp2}$ và $y^${yExp1} \\cdot y^${yExp2} = y^${yExp1 + yExp2}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm bậc của đơn thức thu gọn $N = ${coef1}x^${xExp1}y^${yExp1}z^${xExp2}$:`,
              [`$${xExp1 + yExp1 + xExp2}$`, `$${xExp1}$`, `$${yExp1}$`, `$${Math.max(xExp1, yExp1, xExp2)}$`],
              `$${xExp1 + yExp1 + xExp2}$`,
              `Bậc của đơn thức là tổng các số mũ của tất cả các biến. Vậy bậc là $${xExp1} + ${yExp1} + ${xExp2} = ${xExp1 + yExp1 + xExp2}$.`
            ));
          }
        } else if (index <= 17) {
          // Harder simplification / Evaluations
          const valX = 1;
          const valY = -1;
          const resultVal = coef1 * Math.pow(valX, xExp1) * Math.pow(valY, yExp1);
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính giá trị của đơn thức $B = ${coef1}x^${xExp1}y^${yExp1}$ tại $x = ${valX}$, $y = ${valY}$:`,
            [`$${resultVal}$`, `$${-resultVal}$`, `$${resultVal + 5}$`, `$0$`],
            `$${resultVal}$`,
            `Thay $x = ${valX}$, $y = ${valY}$ vào đơn thức: $B = ${coef1} \\cdot (${valX})^${xExp1} \\cdot (${valY})^${yExp1} = ${resultVal}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho đơn thức $P = \\left(-\\frac{1}{2}x^a y^2\\right) \\cdot \\left(4x^3 y^b\\right)$ có bậc tổng quát bằng $10$ và biết rằng bậc của x bằng gấp đôi bậc của y. Tìm cặp số nguyên dương $(a, b)$:`,
              [`$a=3, b=2$`, `$a=4, b=1$`, `$a=2, b=3$`, `$a=3, b=3$`],
              `$a=3, b=2$`,
              `Thu gọn đơn thức: $P = -2 x^{a+3} y^{2+b}$. Bậc của đơn thức là $(a+3) + (2+b) = 10 \\Rightarrow a+b = 5$. Mà số mũ của x gấp đôi số mũ của y: $a+3 = 2(2+b) \\Rightarrow a - 2b = 1$. Giải hệ thu được $a = 3, b = 2$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho đơn thức $P = \\left(-\\frac{1}{2}x^a y^2\\right) \\cdot \\left(4x^3 y^b\\right)$ có bậc tổng quát bằng $12$ và biết rằng bậc của x bằng gấp đôi bậc của y. Tìm cặp số nguyên dương $(a, b)$:`,
              [`$a=5, b=2$`, `$a=4, b=3$`, `$a=3, b=4$`, `$a=6, b=1$`],
              `$a=5, b=2$`,
              `Thu gọn đơn thức: $P = -2 x^{a+3} y^{2+b}$. Bậc của đơn thức là $(a+3) + (2+b) = 12 \\Rightarrow a+b = 7$. Số mũ x gấp đôi y: $a+3 = 2(2+b) \\Rightarrow a - 2b = 1$. Giải hệ ta thu được $b = 2, a = 5$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho đơn thức $P = \\left(-\\frac{1}{2}x^a y^2\\right) \\cdot \\left(4x^3 y^b\\right)$ có bậc tổng quát bằng $14$ và biết rằng bậc của x bằng bậc của y. Tìm cặp số nguyên dương $(a, b)$:`,
              [`$a=4, b=5$`, `$a=5, b=4$`, `$a=3, b=6$`, `$a=4, b=4$`],
              `$a=4, b=5$`,
              `Thu gọn đơn thức: $P = -2 x^{a+3} y^{2+b}$. Bậc là $(a+3) + (2+b) = 14 \\Rightarrow a+b = 9$. Số mũ x bằng y: $a+3 = 2+b \\Rightarrow b - a = 1$. Giải hệ ta được $a = 4, b = 5$.`
            ));
          }
        }
        break;
      }

      case 'da-thuc-nhieu-bien': {
        const c1 = getValRange(2, 6);
        const c2 = getValRange(2, 6);
        if (index <= 5) {
          if (index === 1) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Biểu thức nào sau đây là đa thức nhiều biến?`,
              [`$2x^2 - xy + 3y^2$`, `$\\frac{4x^2}{y}$`, `$\\frac{x+y}{x-y}$`, `$\\sqrt{xy} + x$`],
              `$2x^2 - xy + 3y^2$`,
              `Đa thức là tổng của các đơn thức. Chỉ có $2x^2 - xy + 3y^2$ là tổng của 3 đơn thức hợp lệ. Biểu thức còn lại dưới mẫu chứa biến hoặc chứa căn số biến.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Liệt kê các hạng tử của đa thức $A = x^2y - ${c1}xy + 5$:`,
              [`$x^2y, -${c1}xy, 5$`, `$x^2y, ${c1}xy, 5$`, `$x^2, xy, 5$`, `$x^2y, -${c1}xy$`],
              `$x^2y, -${c1}xy, 5$`,
              `Các hạng tử của đa thức $A$ chính là các đơn thức thành phần trong tổng: $x^2y$, $-${c1}xy$, và $5$.`
            ));
          }
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thu gọn đa thức $M = x^3 - ${c1}x^2y + ${c2}x^3 + ${c1}x^2y - 2$ và tìm bậc của nó:`,
            [`$M = ${1 + c2}x^3 - 2$, bậc $3$`, `$M = ${1 - c2}x^3 - 2$, bậc $3$`, `$M = x^3 - 2$, bậc $1$`, `$M = x^3 + ${2*c1}x^2y$, bậc $3$`],
            `$M = ${1 + c2}x^3 - 2$, bậc $3$`,
            `Nhóm hạng tử đồng dạng: $M = (x^3 + ${c2}x^3) + (-${c1}x^2y + ${c1}x^2y) - 2 = ${1 + c2}x^3 - 2$. Bậc của đa thức thu gọn này bằng bậc của $x^3$, tức là $3$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Giá trị của đa thức $Q = x^2 - 2xy + y^2$ tại $x = ${c1+3}$, $y = ${c1}$ là:`,
            [`$9$`, `$${(c1 + 5) * (c1 + 5)}$`, `$${(c1 + 6) * (c1 + 6)}$`, `$${(c1 + 7) * (c1 + 7)}$`],
            `$9$`,
            `Nhận ra $Q = (x-y)^2$. Thế $x = ${c1+3}$, $y = ${c1}$ vào biểu thức: $Q = (${c1+3} - ${c1})^2 = 3^2 = 9$.`
          ));
        } else {
          const maxN = index === 18 ? 4 : (index === 19 ? 5 : 6);
          const tgtDeg = index === 18 ? 6 : (index === 19 ? 7 : 8);
          const termB = index === 18 ? `- 3x^2y^4` : (index === 19 ? `- 3x^2y^5` : `- 3x^2y^6`);
          const termBBeg = index === 18 ? `2+4 = 6` : (index === 19 ? `2+5 = 7` : `2+6 = 8`);

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Biết đa thức $P(x,y) = x^n y^2 ${termB} + 5x^2y$ có bậc thu gọn bằng ${tgtDeg}. Hỏi giá trị của $n$ lớn nhất có thể là bao nhiêu?`,
            [`$${maxN}$`, `$${maxN - 1}$`, `$${maxN + 1}$`, `$${maxN - 2}$`],
            `$${maxN}$`,
            `Đa thức có bậc bằng ${tgtDeg}. Các hạng tử là $x^ny^2$ (bậc $n+2$), $${termB}$ (bậc ${termBBeg}$), và $5x^2y$ (bậc $3$). Để bậc đa thức bằng ${tgtDeg}$, hạng tử $x^ny^2$ phải có bậc không vượt quá ${tgtDeg}$, tức là $n+2 \\le ${tgtDeg} \\Rightarrow n \\le ${maxN}$. Vậy $n$ lớn nhất là $${maxN}$.`
          ));
        }
        break;
      }

      case 'da-thuc-cong-tru': {
        const c1 = getValRange(3, 8);
        const c2 = getValRange(2, 5);
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính tổng $P + Q$ biết $P = ${c1}x$ và $Q = -${c2}x$:`,
            [`$${c1 - c2}x$`, `$${c1 + c2}x$`, `$${-c1 - c2}x$`, `$x$`],
            `$${c1 - c2}x$`,
            `Cộng hai đơn thức đồng dạng: $P + Q = ${c1}x + (-${c2}x) = (${c1} - ${c2})x = ${c1 - c2}x$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hai đa thức $A = x^2 - ${c1}xy + 2$ và $B = ${c2}xy - 5$. Tính hiệu $A - B$:`,
            [`$x^2 - ${c1 + c2}xy + 7$`, `$x^2 - ${c1 + c2}xy - 3$`, `$x^2 + ${c2 - c1}xy - 3$`, `$x^2 - ${c1 - c2}xy + 7$`],
            `$x^2 - ${c1 + c2}xy + 7$`,
            `Thực hiện hiệu: $A - B = (x^2 - ${c1}xy + 2) - (${c2}xy - 5) = x^2 - ${c1}xy - ${c2}xy + 2 + 5 = x^2 - ${c1 + c2}xy + 7$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm đa thức $C$ sao cho $C + (x^2 - y^2) = ${c1}x^2 + y^2$:`,
            [`$${c1-1}x^2 + 2y^2$`, `$${c1+1}x^2$`, `$${c1-1}x^2 - y^2$`, `$${c1}x^2 + 2y^2$`],
            `$${c1-1}x^2 + 2y^2$`,
            `Ta có $C = (${c1}x^2 + y^2) - (x^2 - y^2) = ${c1}x^2 - x^2 + y^2 + y^2 = ${c1-1}x^2 + 2y^2$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho biểu thức đại số $S = (2x^2 + xy - y^2) - (x^2 + 2xy - y^2) + (xy - x^2)$. Chứng minh giá trị của $S$ thỏa mãn điều gì?`,
              [`Giá trị của S luôn bằng 0 với mọi x, y`, `S có bậc bằng 2`, `S biểu thị quan hệ hàm bậc nhất`, `S luôn luôn nhận giá trị dương`],
              `Giá trị của S luôn bằng 0 với mọi x, y`,
              `Phá ngoặc và thu gọn: $S = 2x^2 + xy - y^2 - x^2 - 2xy + y^2 + xy - x^2 = (2x^2 - x^2 - x^2) + (xy - 2xy + xy) + (-y^2 + y^2) = 0$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho biểu thức đại số $S = (x^2 - xy + 1) + (xy - x^2 + 2)$. Chứng minh giá trị của $S$ thỏa mãn điều gì?`,
              [`Giá trị của S luôn bằng 3 với mọi x, y`, `S phụ thuộc vào x`, `S luôn bằng 0`, `S có bậc bằng 2`],
              `Giá trị của S luôn bằng 3 với mọi x, y`,
              `Thu gọn: $S = x^2 - xy + 1 + xy - x^2 + 2 = (x^2 - x^2) + (-xy + xy) + 1 + 2 = 3$. Giá trị của $S$ luôn bằng $3$ với mọi $x, y$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho biểu thức đại số $S = (2x^2 - 3xy + y^2) - (2x^2 - 3xy + y^2 - 5)$. Chứng minh giá trị của $S$ bằng bao nhiêu?`,
              [`$5$`, `$0$`, `$10$`, `Phụ thuộc vào x và y`],
              `$5$`,
              `Phá ngoặc thu gọn: $S = (2x^2 - 2x^2) + (-3xy + 3xy) + (y^2 - y^2) + 5 = 5$. Vậy $S$ luôn bằng 5.`
            ));
          }
        }
        break;
      }

      case 'da-thuc-nhan': {
        const c1 = getValRange(2, 5);
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thực hiện phép nhân $${c1}x \\cdot (x - 3)$:`,
            [`$${c1}x^2 - ${3*c1}x$`, `$${c1}x - 3$`, `$${c1}x^2 - 3$`, `$${c1}x^2 - 3x$`],
            `$${c1}x^2 - ${3*c1}x$`,
            `Nhân đơn thức $${c1}x$ với từng hạng tử của đa thức: $${c1}x \\cdot x - ${c1}x \\cdot 3 = ${c1}x^2 - ${3*c1}x$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Khai triển phép nhân đa thức $(x + ${c1})(x - 2)$ được kết quả:`,
            [`$x^2 + ${c1-2}x - ${2*c1}$`, `$x^2 - ${2*c1}$`, `$x^2 + ${c1}x - 2$`, `$x^2 + ${c1+2}x + 2$`],
            `$x^2 + ${c1-2}x - ${2*c1}$`,
            `Ta nhân: $(x + ${c1})(x - 2) = x \\cdot x - 2x + ${c1}x - ${2*c1} = x^2 + (${c1 - 2})x - ${2*c1}$.`
          ));
        } else if (index <= 17) {
          const opt1 = c1 - 1;
          const opt2 = c1;
          const opt3 = (c1 - 1 === 1) ? c1 + 1 : 1;
          const opt4 = -c1;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm hệ số của $x^2$ sau khi rút gọn tích biểu thức $P = (x^2 - x + 1)(x + ${c1})$:`,
            [`$${opt1}$`, `$${opt2}$`, `$${opt3}$`, `$${opt4}$`],
            `$${c1 - 1}$`,
            `Nhân phân phối: $P = x^2(x + ${c1}) - x(x + ${c1}) + 1(x + ${c1}) = x^3 + ${c1}x^2 - x^2 - ${c1}x + x + ${c1} = x^3 + (${c1}-1)x^2 + (1-${c1})x + ${c1}$. Hệ số của $x^2$ là $${c1}-1$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Chứng minh rằng giá trị của biểu thức $T = (x - 5)(2x + 3) - 2x(x - 3) + x + 7$ không phụ thuộc vào giá trị của biến $x$:`,
              [`Giá trị T luôn bằng -8`, `Giá trị T luôn bằng -15`, `T vẫn phụ thuộc vào x`, `Giá trị T luôn bằng 0`],
              `Giá trị T luôn bằng -8`,
              `Khai triển và thu gọn: $T = (2x^2 + 3x - 10x - 15) - (2x^2 - 6x) + x + 7 = 2x^2 - 7x - 15 - 2x^2 + 6x + x + 7 = -8$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Rút gọn và chứng minh giá trị của biểu thức $T = (x - 2)(x + 3) - x(x + 1) + 10$ không phụ thuộc vào $x$:`,
              [`Giá trị T luôn bằng 4`, `Giá trị T luôn bằng 10`, `Giá trị T luôn bằng 0`, `T vẫn phụ thuộc vào x`],
              `Giá trị T luôn bằng 4`,
              `Khai triển: $(x^2 + 3x - 2x - 6) - (x^2 + x) + 10 = x^2 + x - 6 - x^2 - x + 10 = 4$. Vậy giá trị luôn bằng 4.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Rút gọn và chứng minh biểu thức $T = (x + 4)(x - 4) - (x^2 - 5)$ có giá trị là hằng số:`,
              [`Giá trị T luôn bằng -11`, `Giá trị T luôn bằng -16`, `Giá trị T luôn bằng 5`, `Giá trị T luôn bằng 1`],
              `Giá trị T luôn bằng -11`,
              `Khai triển: $(x^2 - 16) - x^2 + 5 = -11$.`
            ));
          }
        }
        break;
      }

      case 'da-thuc-chia': {
        const c1 = getValRange(3, 8);
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thực hiện phép tính chia đơn thức $(12x^5y^3) : (3x^2y)$:`,
            [`$4x^3y^2$`, `$4x^5y^2$`, `$9x^3y^2$`, `$4x^2y^2$`],
            `$4x^3y^2$`,
            `Lấy hệ số chia hệ số: $12 : 3 = 4$. Chia các biến tương ứng: $x^5 : x^2 = x^3$, $y^3 : y^1 = y^2$. Vậy đáp án là $4x^3y^2$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thực hiện phép chia đa thức cho đơn thức: $(6x^4y^2 - ${2*c1}x^3y^3) : (2x^2y^2)$:`,
            [`$3x^2 - ${c1}xy$`, `$3x^2 - ${c1}y$`, `$3x^2 - ${2*c1}xy$`, `$3x^2y - ${c1}x$`],
            `$3x^2 - ${c1}xy$`,
            `Chia từng hạng tử của đa thức cho đơn thức: $(6x^4y^2) : (2x^2y^2) = 3x^2$ và $(-${2*c1}x^3y^3) : (2x^2y^2) = -${c1}xy$. Kết quả là $3x^2 - ${c1}xy$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm số tự nhiên $n$ nhỏ nhất để đa thức $A = 5x^5 - 2x^4y^3$ chia hết cho đơn thức $B = 3x^n$:`,
            [`$n = 4$`, `$n = 5$`, `$n = 3$`, `$n = 0$`],
            `$n = 4$`,
            `Đa thức $A$ muốn chia hết cho đơn thức $B$ thì lũy thừa của $x$ trong từng hạng tử của $A$ phải lớn hơn hoặc bằng lũy thừa $n$ của $B$. Các số mũ là $5$ và $4$. Vậy điều kiện là $n \\le 4$, số tự nhiên $n$ lớn nhất là $4$ nhưng để chia hết nói chung ta cần $n \\le 4$. Câu hỏi hỏi số tự nhiên n lớn nhất (hay nhỏ nhất) thì n lớn nhất là 4.`
          ));
        } else {
          const k = index === 18 ? 3 : (index === 19 ? 4 : 5);
          const m = index === 18 ? 5 : (index === 19 ? 6 : 8);
          // P:Q = x^2 - k*x + m
          // at x = 10: 100 - 10*k + m
          const ansVal = 100 - 10 * k + m;
          const opt1 = ansVal + 10;
          const opt2 = ansVal - 15;
          const opt3 = ansVal + 25;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Biết đa thức $P = x^3 - ${k}x^2 + ${m}x$ và $Q = x$. Kết quả phép tính $P : Q$ tại $x = 10$ bằng:`,
            [`$${ansVal}$`, `$${opt1}$`, `$${opt2}$`, `$${opt3}$`],
            `$${ansVal}$`,
            `Thực hiện phép chia: $P : Q = (x^3 - ${k}x^2 + ${m}x) : x = x^2 - ${k}x + ${m}$. Thế $x = 10$: $10^2 - ${k} \\cdot 10 + ${m} = 100 - ${10*k} + ${m} = ${ansVal}$.`
          ));
        }
        break;
      }

      // --- CHAPTER II: HẰNG ĐẲNG THỨC ---
      case 'hdt-binh-phuong': {
        const c = getValRange(1, 5);
        if (index <= 5) {
          if (index % 2 === 1) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khai triển hằng đẳng thức $(x + ${c})^2$ ta được:`,
              [`$x^2 + ${2*c}x + ${c*c}$`, `$x^2 + ${c*c}$`, `$x^2 + ${2*c}x + ${c*c + 3}$`, `$x^2 + ${c}x + ${c*c + 2}$`],
              `$x^2 + ${2*c}x + ${c*c}$`,
              `Áp dụng $(A+B)^2 = A^2 + 2AB + B^2$ ta được $(x+${c})^2 = x^2 + 2 \\cdot x \\cdot ${c} + ${c}^2 = x^2 + ${2*c}x + ${c*c}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khai triển hằng đẳng thức $(x - ${c})^2$ ta được:`,
              [`$x^2 - ${2*c}x + ${c*c}$`, `$x^2 - ${c*c}$`, `$x^2 - ${2*c}x + ${c*c + 3}$`, `$x^2 - ${c}x + ${c*c + 2}$`],
              `$x^2 - ${2*c}x + ${c*c}$`,
              `Áp dụng $(A-B)^2 = A^2 - 2AB + B^2$ ta được $(x-${c})^2 = x^2 - 2 \\cdot x \\cdot ${c} + ${c}^2 = x^2 - ${2*c}x + ${c*c}$.`
            ));
          }
        } else if (index <= 12) {
          if (index % 2 === 0) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm số thích hợp điền vào chỗ trống: $x^2 + ${2*c}x + \\dots = (x + ${c})^2$`,
              [`$${c*c}$`, `$${c*c + 1}$`, `$${c*c + 2}$`, `$${c*c + 3}$`],
              `$${c*c}$`,
              `Đồng nhất với $(A+B)^2 = A^2 + 2AB + B^2$, có $A=x, B=${c}$. Hạng tử cuối là $B^2 = ${c}^2 = ${c*c}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Viết biểu thức dạng tích của Hiệu hai bình phương $x^2 - ${c*c}$:`,
              [`$(x - ${c})(x + ${c})$`, `$(x - ${c})^2$`, `$(x + ${c})^2$`, `$(x - ${c + 3})(x + ${c + 3})$`],
              `$(x - ${c})(x + ${c})$`,
              `Áp dụng hằng đẳng thức $A^2 - B^2 = (A-B)(A+B)$ có $A=x, B=${c}$ ta được $(x-${c})(x+${c})$.`
            ));
          }
        } else if (index <= 17) {
          const b = index - 12; // varies as 1, 2, 3, 4, 5
          const num = 100 - b;
          const correctAns = `$(100 - ${b})^2 = 100^2 - 2 \\cdot 100 \\cdot ${b} + ${b}^2 = ${num * num}$`;
          const opt1 = `${num} \\cdot ${num} = ${num * num}`;
          const opt2 = `$(100 - ${b})^2 = 100^2 - ${b}^2 = ${10000 - b*b}$`;
          const opt3 = `$(100 - ${b})^2 = 100^2 - 2 \\cdot 100 \\cdot ${b} - ${b}^2 = ${10000 - 200*b - b*b}$`;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính nhanh giá trị bình phương của số $${num}^2$ bằng cách áp dụng hằng đẳng thức hiệu (bình phương của một hiệu):`,
            [
              correctAns,
              `$${num}^2 = ${opt1}$`,
              `$${num}^2 = ${opt2}$`,
              `$${num}^2 = ${opt3}$`
            ],
            correctAns,
            `Ta viết $${num} = 100 - ${b}$. Áp dụng hằng đẳng thức bình phương của một hiệu $(A-B)^2 = A^2 - 2AB + B^2$: $${num}^2 = (100 - ${b})^2 = 100^2 - 2 \\cdot 100 \\cdot ${b} + ${b}^2 = 10000 - ${200*b} + ${b*b} = ${num * num}$.`
          ));
        } else {
          const valX = index; // index is 18, 19, or 20
          const valY = getValRange(2, 5);
          const sumXY = valX + valY;
          const prodXY = valX * valY;
          const correctVal = valX * valX + valY * valY;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho biết $x + y = ${sumXY}$ và $x \\cdot y = ${prodXY}$. Tính giá trị của biểu thức $A = x^2 + y^2$:`,
            [`$${correctVal}$`, `$${sumXY * sumXY}$`, `$${correctVal + 10}$`, `$${correctVal - 10}$`],
            `$${correctVal}$`,
            `Ta có hằng đẳng thức: $x^2 + y^2 = (x+y)^2 - 2xy$. Thay số vào: $${sumXY}^2 - 2 \\cdot ${prodXY} = ${sumXY * sumXY} - ${2 * prodXY} = ${correctVal}$.`
          ));
        }
        break;
      }

      case 'hdt-lap-phuong': {
        if (index <= 5) {
          const k = getValRange(1, 3);
          const correctAns = `$x^3 + ${3*k}x^2 + ${3*k*k}x + ${k*k*k}$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Khai triển hằng đẳng thức lập phương của một tổng $(x + ${k})^3$ ta được kết quả:`,
            [
              correctAns,
              `$x^3 + ${k}x^2 + ${k}x + ${k*k*k}$`,
              `$x^3 + ${3*k}x + ${k*k*k}$`,
              `$x^3 + ${k*k*k}$`
            ],
            correctAns,
            `Khai triển hằng đẳng thức $(A+B)^3 = A^3 + 3A^2B + 3AB^2 + B^3$ với $A=x, B=${k}$ ta được: $x^3 + 3 \\cdot x^2 \\cdot ${k} + 3 \\cdot x \\cdot ${k}^2 + ${k}^3 = x^3 + ${3*k}x^2 + ${3*k*k}x + ${k*k*k}$.`
          ));
        } else if (index <= 12) {
          const k = getValRange(1, 3);
          const correctAns = `$(x - ${k})^3$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thu gọn biểu thức đa thức sau thành một lũy thừa lập phương: $x^3 - ${3*k}x^2 + ${3*k*k}x - ${k*k*k}$:`,
            [
              correctAns,
              `$(x - ${2*k})^3$`,
              `$(x + ${k})^3$`,
              `$(x - ${k*k})^3$`
            ],
            correctAns,
            `Đồng nhất biểu thức $x^3 - 3 \\cdot x^2 \\cdot ${k} + 3 \\cdot x \\cdot ${k}^2 - ${k}^3 = (x - ${k})^3$.`
          ));
        } else if (index <= 17) {
          const k = getValRange(1, 3);
          const baseVal = 10 * (k + 1); // 20, 30, 40
          const xVal = baseVal - k; // 19, 28, 37
          const ansVal = baseVal * baseVal * baseVal; // 8000, 27000, 64000
          const opt1 = Math.floor(ansVal / 2);
          const opt2 = ansVal + 1000;
          const opt3 = ansVal - 1000;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Biết giá trị của biểu thức $P = x^3 + ${3*k}x^2 + ${3*k*k}x + ${k*k*k}$ tại $x = ${xVal}$. Giá trị của $P$ là:`,
            [`$${ansVal}$`, `$${opt1}$`, `$${opt2}$`, `$${opt3}$`],
            `$${ansVal}$`,
            `Thu gọn biểu thức: $P = (x + ${k})^3$. Thế $x = ${xVal}$: $P = (${xVal} + ${k})^3 = ${baseVal}^3 = ${ansVal}$.`
          ));
        } else {
          const a = getValRange(1, 3);
          let b = getValRange(2, 4);
          if (a === b) {
            b = (b === 4) ? 2 : b + 1;
          }
          const coeff = 3 * a * b * b;
          const opt1 = -coeff;
          const opt2 = 3 * a * a * b;
          const opt3 = -3 * a * a * b;

          const termAStr = a === 1 ? 'x' : `${a}x`;
          const termBStr = `${b}y`;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hằng đẳng thức khai triển của biểu thức $(${termAStr} - ${termBStr})^3$. Tìm hệ số của hạng tử tích $xy^2$:`,
            [`$${coeff}$`, `$${opt1}$`, `$${opt2}$`, `$${opt3}$`],
            `$${coeff}$`,
            `Khai triển $(${termAStr} - ${termBStr})^3 = (${termAStr})^3 - 3(${termAStr})^2(${termBStr}) + 3(${termAStr})(${termBStr})^2 - (${termBStr})^3 = ${a*a*a}x^3 - ${3*a*a*b}x^2y + ${coeff}xy^2 - ${b*b*b}y^3$. Hạng tử chứa $xy^2$ có hệ số là $3 \\cdot (${termAStr}) \\cdot (-${termBStr})^2 = ${coeff}xy^2$. Hệ số là $${coeff}$.`
          ));
        }
        break;
      }

      case 'hdt-tong-hieu-lap-phuong': {
        if (index <= 5) {
          const k = getValRange(2, 4);
          const correctAns = `$(x - ${k})(x^2 + ${k}x + ${k*k})$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Viết hằng đẳng thức hiệu hai lập phương $x^3 - ${k*k*k}$ dưới dạng tích:`,
            [
              correctAns,
              `$(x - ${k})^3$`,
              `$(x - ${k})(x^2 - ${k}x + ${k*k})$`,
              `$(x + ${k})(x^2 - ${k}x + ${k*k})$`
            ],
            correctAns,
            `Áp dụng hằng đẳng thức hiệu hai lập phương $A^3 - B^3 = (A-B)(A^2 + AB + B^2)$ với $A=x, B=${k}$ ta được: $x^3 - ${k*k*k} = (x - ${k})(x^2 + ${k}x + ${k*k})$.`
          ));
        } else if (index <= 12) {
          const k = getValRange(1, 4);
          const correctAns = `$x^3 + ${k*k*k}$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Rút gọn biểu thức sau bằng phương pháp hằng đẳng thức: $(x + ${k})(x^2 - ${k}x + ${k*k})$:`,
            [
              correctAns,
              `$x^3 - ${k*k*k}$`,
              `$(x + ${k})^3$`,
              `$x^3 + ${k*k}$`
            ],
            correctAns,
            `Đây là hằng đẳng thức tổng hai lập phương: $(A+B)(A^2 - AB + B^2) = A^3 + B^3$ với $A=x, B=${k}$. Do đó kết quả rút gọn là $x^3 + ${k}^3 = x^3 + ${k*k*k}$.`
          ));
        } else if (index <= 17) {
          const k = getValRange(1, 4);
          const val = k * k * k;
          const correctAns = `$-${val}$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm giá trị của biểu thức $C = (x - ${k})(x^2 + ${k}x + ${k*k}) - x^3$ tại mọi giá trị của biến $x$:`,
            [correctAns, `$${val}$`, `$0$`, `$-${k*k}$`],
            correctAns,
            `Rút gọn biểu thức hằng đẳng thức hiệu hai lập phương: $C = (x^3 - ${k*k*k}) - x^3 = -${k*k*k}$. Do đó giá trị luôn bằng $-${k*k*k}$ với mọi $x$.`
          ));
        } else {
          const b = getValRange(1, 3);
          const yVal = b - 0.5; // 0.5, 1.5, 2.5
          const xVal = 100 + yVal; // 100.5, 101.5, 102.5
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính nhanh giá trị phân thức đại số sau: $\\frac{x^3 - y^3}{x^2 + xy + y^2}$ khi biết $x = ${xVal}$ và $y = ${yVal}$:`,
            [`$100$`, `$200$`, `$101$`, `$50$`],
            `$100$`,
            `Tử thức $x^3 - y^3 = (x-y)(x^2+xy+y^2)$. Rút gọn phân thức ta thu được biểu thức tối gọn là $x - y$. Thay số $x=${xVal}, y=${yVal}$ ta có $${xVal} - ${yVal} = 100$.`
          ));
        }
        break;
      }

      case 'phan-tich-nhan-tu': {
        const c1 = getValRange(2, 6);
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân tích đa thức sau thành nhân tử bằng phương pháp đặt nhân tử chung: $${c1}x^2 - ${2*c1}x$:`,
            [`$${c1}x(x - 2)$`, `$${c1}x(x - 1)$`, `$x(x - ${2*c1})$`, `$${c1}(x^2 - 2x)$`],
            `$${c1}x(x - 2)$`,
            `Đặt nhân tử chung $${c1}x$ ra ngoài dấu ngoặc ta được $${c1}x(x-2)$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân tích đa thức thành nhân tử bằng phương pháp dùng hằng đẳng thức: $x^2 - ${c1*c1}$:`,
            [`$(x - ${c1})(x + ${c1})$`, `$(x - ${c1})^2$`, `$(x + ${c1})^2$`, `$(x - ${c1*c1})(x + 1)$`],
            `$(x - ${c1})(x + ${c1})$`,
            `Sử dụng hằng đẳng thức hiệu hai bình phương $A^2 - B^2 = (A-B)(A+B)$ thu được $(x-${c1})(x+${c1})$.`
          ));
        } else if (index <= 17) {
          const b = getValRange(1, 4);
          const correctAns = `$(x + ${b} - y)(x + ${b} + y)$`;
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân tích đa thức $M = x^2 - y^2 + ${2*b}x + ${b*b}$ thành nhân tử bằng phương pháp nhóm hạng tử:`,
            [
              correctAns,
              `$(x - y)(x + y)$`,
              `$(x - ${b} - y)(x - ${b} + y)$`,
              `$(x + y + ${b})^2$`
            ],
            correctAns,
            `Nhóm hạng tử: $M = (x^2 + ${2*b}x + ${b*b}) - y^2 = (x+${b})^2 - y^2$. Áp dụng hằng đẳng thức hiệu hai bình phương ta thu được $(x+${b}-y)(x+${b}+y)$.`
          ));
        } else {
          const a = getValRange(1, 3);
          let b = getValRange(2, 5);
          if (a === b) {
            b += 1;
          }
          const sum = a + b;
          const prod = a * b;
          const correctAns = `$(x - ${a})(x - ${b})$`;

          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân tích đa thức bậc hai sau thành tích (phương pháp tách hạng tử trung gian): $A = x^2 - ${sum}x + ${prod}$:`,
            [
              correctAns,
              `$(x - 1)(x - ${prod})$`,
              `$(x + ${a})(x + ${b})$`,
              `$(x - ${sum})(x + 1)$`
            ],
            correctAns,
            `Tách hạng tử trung gian: $A = x^2 - ${a}x - ${b}x + ${prod} = x(x-${a}) - ${b}(x-${a}) = (x-${a})(x-${b})$.`
          ));
        }
        break;
      }

      // --- CHAPTER III: TỨ GIÁC ---
      case 'tu-giac-long': {
        const valA = getValRange(70, 110);
        const valB = getValRange(80, 120);
        const valC = getValRange(60, 90);
        const valD = 360 - (valA + valB + valC);
        if (index <= 5) {
          if (index % 3 === 1) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính tổng số đo bốn góc ở bốn đỉnh của một tứ giác lồi bất kỳ:`,
              [`$360^\\circ$`, `$180^\\circ$`, `$540^\\circ$`, `$270^\\circ$`],
              `$360^\\circ$`,
              `Theo định lí trong SGK, tổng bốn góc của một tứ giác lồi luôn bằng $360^\\circ$.`
            ));
          } else if (index % 3 === 2) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tứ giác lồi ABCD có tổng số đo các góc ngoài tại bốn đỉnh (mỗi đỉnh chọn một góc ngoài) bằng bao nhiêu?`,
              [`$360^\\circ$`, `$180^\\circ$`, `$720^\\circ$`, `$540^\\circ$`],
              `$360^\\circ$`,
              `Tổng các góc ngoài (mỗi đỉnh chọn một góc) của một đa giác lồi bất kỳ, bao gồm cả tứ giác lồi, luôn bằng $360^\\circ$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Một tứ giác lồi có ba góc vuông. Số đo của góc còn lại bằng bao nhiêu độ?`,
              [`$90^\\circ$`, `$180^\\circ$`, `$120^\\circ$`, `$60^\\circ$`],
              `$90^\\circ$`,
              `Tổng bốn góc bằng $360^\\circ$. Có ba góc vuông bằng $90^\\circ$, góc còn lại bằng $360^\\circ - 3 \\cdot 90^\\circ = 90^\\circ$ (là góc vuông còn lại).`
            ));
          }
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tứ giác ABCD có số đo các góc: $\\hat{A} = ${valA}^\\circ$, $\\hat{B} = ${valB}^\\circ$, $\\hat{C} = ${valC}^\\circ$. Tìm số đo góc $\\hat{D}$:`,
            [`$${valD}^\\circ$`, `$${valD + 10}^\\circ$`, `$${valD - 10}^\\circ$`, `$90^\\circ$`],
            `$${valD}^\\circ$`,
            `Tổng bốn góc bằng $360^\\circ$. Ta có: $\\hat{D} = 360^\\circ - (\\hat{A} + \\hat{B} + \\hat{C}) = 360^\\circ - (${valA}^\\circ + ${valB}^\\circ + ${valC}^\\circ) = ${valD}^\\circ$.`
          ));
        } else if (index <= 17) {
          if (index % 2 === 0) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tứ giác ABCD biết $\\hat{A} : \\hat{B} : \\hat{C} : \\hat{D} = 1:2:3:4$. Số đo của góc lớn nhất $\\hat{D}$ là:`,
              [`$144^\\circ$`, `$120^\\circ$`, `$108^\\circ$`, `$150^\\circ$`],
              `$144^\\circ$`,
              `Gọi khối lượng các góc tỉ lệ là $x$. Ta có: $x + 2x + 3x + 4x = 360^\\circ \\Rightarrow 10x = 360^\\circ \\Rightarrow x = 36^\\circ$. Góc lớn nhất $\\hat{D} = 4x = 4 \\cdot 36 = 144^\\circ$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tứ giác ABCD biết tỉ số số đo các góc $\\hat{A} : \\hat{B} : \\hat{C} : \\hat{D} = 1:2:4:5$. Số đo của góc lớn nhất $\\hat{D}$ là:`,
              [`$150^\\circ$`, `$130^\\circ$`, `$120^\\circ$`, `$144^\\circ$`],
              `$150^\\circ$`,
              `Tổng tỉ lệ các góc là $1+2+4+5 = 12$ phần. Mỗi phần có giá trị là $360^\\circ / 12 = 30^\\circ$. Góc lớn nhất tương ứng với $5$ phần, có số đo $\\hat{D} = 5 \\cdot 30^\\circ = 150^\\circ$.`
            ));
          }
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Trong một tứ giác lồi, có nhiều nhất bao nhiêu góc nhọn (góc nhỏ hơn $90^\\circ$)?`,
              [`$3$`, `$2$`, `$4$`, `$1$`],
              `$3$`,
              `Nếu cả 4 góc đều là góc nhọn ($\\hat{X} < 90^\\circ$), tổng 4 góc sẽ nhỏ hơn $360^\\circ$, mâu thuẫn định lý. Nếu có tối đa 3 góc nhọn thì tổng vẫn hoàn toàn có thể bằng $360^\\circ$ (ví dụ: $3$ góc $80^\\circ$ và $1$ góc $120^\\circ$).`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Trong một tứ giác lồi, có nhiều nhất bao nhiêu góc tù (góc lớn hơn $90^\\circ$)?`,
              [`$3$`, `$2$`, `$4$`, `$1$`],
              `$3$`,
              `Nếu cả 4 góc đều là góc tù ($\\hat{X} > 90^\\circ$), tổng 4 góc sẽ lớn hơn $360^\\circ$, mâu thuẫn định lý. Do đó tối đa chỉ có 3 góc tù.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Trong một tứ giác lồi, có nhiều nhất bao nhiêu góc vuông (góc bằng $90^\\circ$)?`,
              [`$4$`, `$3$`, `$2$`, `$1$`],
              `$4$`,
              `Hình chữ nhật hoặc hình vuông là các tứ giác lồi có cả 4 góc đều là góc vuông ($90^\\circ$). Do đó số góc vuông lớn nhất trong tứ giác lồi là 4.`
            ));
          }
        }
        break;
      }

      case 'hinh-thang-can': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hình thang cân là hình thang có tính chất đặc trưng nào dưới đây?`,
            [`Có hai góc kề một đáy bằng nhau`, `Có hai cạnh bên song song`, `Có hai góc đối kề bằng nhau`, `Có hai đường chéo vuông góc`],
            `Có hai góc kề một đáy bằng nhau`,
            `Theo định nghĩa trong SGK, hình thang cân là hình thang có hai góc kề một đáy bằng nhau.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hình thang cân ABCD (AB // CD) có góc $\\hat{D} = 70^\\circ$. Số đo góc $\\hat{C}$ kề đáy CD bằng:`,
            [`$70^\\circ$`, `$110^\\circ$`, `$180^\\circ$`, `$90^\\circ$`],
            `$70^\\circ$`,
            `Trong hình thang cân, hai góc kề đáy bằng nhau kề một đáy. Nên góc $\\hat{C} = \\hat{D} = 70^\\circ$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm phát biểu SAI trong các nhận xét về hình thang cân dưới đây:`,
            [`Hai cạnh bên bằng nhau`, `Hai đường chéo bằng nhau`, `Hai góc kề một đáy bằng nhau`, `Hai cạnh đáy luôn có độ dài bằng nhau`],
            `Hai cạnh đáy luôn có độ dài bằng nhau`,
            `Trong hình thang cân, hai cạnh đáy thường không bằng nhau (nếu hai cạnh đáy bằng nhau thì hình thang trở thành hình bình hành).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thang cân ABCD (AB // CD, AB < CD). Kẻ AH vuông góc với CD ($H \\in CD$) và BK vuông góc với CD ($K \\in CD$). Kết luận nào sau đây là KHÔNG chính xác?`,
              [`$DH = CK$`, `$AH = BK$`, `$DH = KC = \\frac{CD - AB}{2}$`, `$DH > CK$`],
              `$DH > CK$`,
              `Hai tam giác vuông ADH và BCK có cạnh huyền AD = BC (cạnh bên hình thang cân), góc nhọn D = góc C nên $\\Delta ADH = \\Delta BCK$ (cạnh huyền-góc nhọn) $\\Rightarrow DH = CK$. Do đó kết luận $DH > CK$ là sai.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thang cân ABCD (AB // CD) có đáy lớn $CD = 10\\text{ cm}$, đáy nhỏ $AB = 4\\text{ cm}$. Kẻ đường cao AH vuông góc với CD ($H \\in CD$). Độ dài đoạn thẳng DH bằng:`,
              [`$3\\text{ cm}$`, `$6\\text{ cm}$`, `$5\\text{ cm}$`, `$2\\text{ cm}$`],
              `$3\\text{ cm}$`,
              `Kẻ đường cao BK từ đỉnh B vuông góc với CD. Ta chứng minh được $DH = CK = (CD - AB) / 2 = (10 - 4)/2 = 3\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính chu vi của hình thang cân ABCD (AB // CD) biết hai đáy $AB = 6\\text{ cm}$, $CD = 14\\text{ cm}$ và đường cao $AH = 3\\text{ cm}$ ($H \\in CD$):`,
              [`$30\\text{ cm}$`, `$25\\text{ cm}$`, `$28\\text{ cm}$`, `$34\\text{ cm}$`],
              `$30\\text{ cm}$`,
              `Ta có $DH = (CD - AB)/2 = (14 - 6)/2 = 4\\text{ cm}$. Độ dài cạnh bên $AD = \\sqrt{AH^2 + DH^2} = \\sqrt{3^2 + 4^2} = 5\\text{ cm}$. Chu vi hình thang cân là $6 + 14 + 5 + 5 = 30\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      case 'hinh-binh-hang': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hình bình hành là tứ giác có đặc trưng nào dưới đây?`,
            [`Có các cạnh đối song song`, `Có bốn góc bằng nhau`, `Có bốn cạnh bằng nhau`, `Có hai đường chéo vuông góc`],
            `Có các cạnh đối song song`,
            `Theo định nghĩa, hình bình hành là tứ giác có các cạnh đối song song.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hình bình hành ABCD có góc $\\hat{A} = 110^\\circ$. Góc $\\hat{C}$ bằng bao nhiêu?`,
            [`$110^\\circ$`, `$70^\\circ$`, `$180^\\circ$`, `$90^\\circ$`],
            `$110^\\circ$`,
            `Trong hình bình hành, các góc đối diện bằng nhau: $\\hat{C} = \\hat{A} = 110^\\circ$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm điều kiện nhận biết hình bình hành SAI trong các phát biểu sau:`,
            [`Tứ giác có các góc đối bằng nhau là hình bình hành`, `Tứ giác có một cặp cạnh đối song song và cặp cạnh đối còn lại bằng nhau là hình bình hành`, `Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành`, `Tứ giác có các cạnh đối bằng nhau là hình bình hành`],
            `Tứ giác có một cặp cạnh đối song song và cặp cạnh đối còn lại bằng nhau là hình bình hành`,
            `Phát biểu này là sai (đó có thể là hình thang cân chứ không phải hình bình hành. Ví dụ: hình thang cân AB//CD có AD = BC, nhưng nó không phải hình bình hành).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình bình hành ABCD có chu vi bằng 30cm, biết cạnh AB dài hơn cạnh BC là 3cm. Độ dài cạnh BC là:`,
              [`$6\\text{ cm}$`, `$9\\text{ cm}$`, `$12\\text{ cm}$`, `$5\\text{ cm}$`],
              `$6\\text{ cm}$`,
              `Gọi độ dài BC là $x$ ($x > 0$), thì AB = $x+3$. Chu vi hình bình hành là $2 \\cdot (AB + BC) = 30 \\Rightarrow (x+3) + x = 15 \\Rightarrow 2x = 12 \\Rightarrow x = 6\\text{ cm}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình bình hành ABCD có chu vi bằng 40cm, biết cạnh AB dài hơn cạnh BC là 4cm. Độ dài cạnh BC là:`,
              [`$8\\text{ cm}$`, `$12\\text{ cm}$`, `$16\\text{ cm}$`, `$10\\text{ cm}$`],
              `$8\\text{ cm}$`,
              `Gọi độ dài BC là $x$ ($x > 0$), thì AB = $x+4$. Chu vi hình bình hành là $2 \\cdot (AB + BC) = 40 \\Rightarrow (x+4) + x = 20 \\Rightarrow 2x = 16 \\Rightarrow x = 8\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình bình hành ABCD có chu vi bằng 50cm, biết cạnh AB dài hơn cạnh BC là 5cm. Độ dài cạnh BC là:`,
              [`$10\\text{ cm}$`, `$15\\text{ cm}$`, `$20\\text{ cm}$`, `$12.5\\text{ cm}$`],
              `$10\\text{ cm}$`,
              `Gọi độ dài BC là $x$ ($x > 0$), thì AB = $x+5$. Chu vi hình bình hành là $2 \\cdot (AB + BC) = 50 \\Rightarrow (x+5) + x = 25 \\Rightarrow 2x = 20 \\Rightarrow x = 10\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      case 'hinh-chu-nhat': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Một tứ giác là hình chữ nhật khi tứ giác đó thỏa mãn định nghĩa nào?`,
            [`Có bốn góc vuông`, `Có hai đường chéo song song`, `Có các cạnh bằng nhau`, `Có bốn cạnh song song`],
            `Có bốn góc vuông`,
            `Định nghĩa: Hình chữ nhật là tứ giác có bốn góc vuông.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Biết hai đường chéo của hình chữ nhật ABCD cắt nhau tại O. Nếu AC = 12cm thì đoạn thẳng OB dài bao nhiêu?`,
            [`$6\\text{ cm}$`, `$12\\text{ cm}$`, `$24\\text{ cm}$`, `$3\\text{ cm}$`],
            `$6\\text{ cm}$`,
            `Trong hình chữ nhật, hai đường chéo bằng nhau ($BD = AC = 12\\text{ cm}$) và cắt nhau tại trung điểm của mỗi đường. Vậy $OB = BD / 2 = 12 / 2 = 6\\text{ cm}$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hình bình hành cần thêm điều kiện gì để trở thành hình chữ nhật?`,
            [`Có một góc vuông`, `Có hai đường chéo vuông góc`, `Có các cạnh bằng nhau`, `Có các góc đối bù nhau`],
            `Có một góc vuông`,
            `Dấu hiệu nhận biết: Hình bình hành có một góc vuông là hình chữ nhật.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A, đường trung tuyến AM. Biết BC = 10cm. Tính độ dài trung tuyến AM:`,
              [`$5\\text{ cm}$`, `$10\\text{ cm}$`, `$20\\text{ cm}$`, `$7.5\\text{ cm}$`],
              `$5\\text{ cm}$`,
              `Trong tam giác vuông, độ dài đường trung tuyến ứng với cạnh huyền bằng một nửa cạnh huyền: $AM = BC / 2 = 10 / 2 = 5\\text{ cm}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A, đường trung tuyến AM. Biết BC = 12cm. Tính độ dài trung tuyến AM:`,
              [`$6\\text{ cm}$`, `$12\\text{ cm}$`, `$24\\text{ cm}$`, `$8\\text{ cm}$`],
              `$6\\text{ cm}$`,
              `Trong tam giác vuông, độ dài đường trung tuyến ứng với cạnh huyền bằng một nửa cạnh huyền: $AM = BC / 2 = 12 / 2 = 6\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A, đường trung tuyến AM. Biết BC = 16cm. Tính độ dài trung tuyến AM:`,
              [`$8\\text{ cm}$`, `$16\\text{ cm}$`, `$32\\text{ cm}$`, `$12\\text{ cm}$`],
              `$8\\text{ cm}$`,
              `Trong tam giác vuông, độ dài đường trung tuyến ứng với cạnh huyền bằng một nửa cạnh huyền: $AM = BC / 2 = 16 / 2 = 8\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      case 'hinh-thoi-vuong': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hình thoi là tứ giác có cấu trúc như thế nào?`,
            [`Có bốn cạnh bằng nhau`, `Có bốn góc vuông`, `Có hai đường chéo bằng nhau`, `Có một góc vuông`],
            `Có bốn cạnh bằng nhau`,
            `Tứ giác có bốn cạnh bằng nhau là hình thoi.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hai đường chéo của một hình thoi bằng 6cm và 8cm. Tính độ dài cạnh của hình thoi đó:`,
            [`$5\\text{ cm}$`, `$10\\text{ cm}$`, `$7\\text{ cm}$`, `$14\\text{ cm}$`],
            `$5\\text{ cm}$`,
            `Trong hình thoi, hai đường chéo vuông góc tại trung điểm. Nửa độ dài hai đường chéo là 3cm và 4cm. Áp dụng định lí Pythagore: $cạnh^2 = 3^2 + 4^2 = 25 \\Rightarrow cạnh = 5\\text{ cm}$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho một hình chữ nhật ABCD. Nếu nối trung điểm của bốn cạnh hình chữ nhật đó ta được hình gì?`,
            [`Hình thoi`, `Hình chữ nhật`, `Hình bình hành`, `Hình vuông`],
            `Hình thoi`,
            `Tứ giác nối các trung điểm của hình chữ nhật có bốn cạnh bằng nhau (mỗi cạnh bằng nửa độ dài đường chéo hình chữ nhật do đường trung bình), do đó nó là hình thoi.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Trong các phát biểu sau về hình vuông, phát biểu nào sau đây là SAI?`,
              [`Hình thoi có một góc vuông là hình vuông`, `Hình chữ nhật có hai đường chéo vuông góc là hình vuông`, `Hình chữ nhật có hai cạnh kề kề kẹp bằng nhau là hình vuông`, `Hình bình hành có hai đường chéo bằng nhau là hình vuông`],
              `Hình bình hành có hai đường chéo bằng nhau là hình vuông`,
              `Hình bình hành có hai đường chéo bằng nhau mới chỉ là hình chữ nhật chứ chưa đủ điều kiện để là hình vuông.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thoi có hai đường chéo có độ dài bằng nhau. Tứ giác này chắc chắn là hình gì?`,
              [`Hình vuông`, `Hình chữ nhật`, `Hình bình hành`, `Hình thang cân`],
              `Hình vuông`,
              `Hình thoi có hai đường chéo bằng nhau là hình vuông. Do đó đây chắc chắn là hình vuông.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tứ giác có hai đường chéo bằng nhau và vuông góc với nhau tại trung điểm của mỗi đường. Tứ giác này là hình gì?`,
              [`Hình vuông`, `Hình thoi`, `Hình chữ nhật`, `Hình bình hành`],
              `Hình vuông`,
              `Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành. Hình bình hành có hai đường chéo vuông góc là hình thoi. Hình thoi có hai đường chéo bằng nhau là hình vuông.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER IV: ĐỊNH LÍ THALÈS ---
      case 'thales-dinh-li': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Định lý Thalès thuận trong tam giác phát biểu mối quan hệ gì?`,
            [`Nếu đường thẳng song song với một cạnh thì định ra các đoạn thẳng tỉ lệ`, `Hai đường thẳng vuông góc`, `Ba đường trung tuyến đồng quy`, `Cạnh huyền bình phương tỷ lệ`],
            `Nếu đường thẳng song song với một cạnh thì định ra các đoạn thẳng tỉ lệ`,
            `Nội dung định lý Thalès: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tam giác ABC có MN // BC ($M \\in AB, N \\in AC$). Biết AM = 3cm, AB = 9cm, AN = 4cm. Độ dài AC bằng:`,
            [`$12\\text{ cm}$`, `$8\\text{ cm}$`, `$16\\text{ cm}$`, `$6\\text{ cm}$`],
            `$12\\text{ cm}$`,
            `Áp dụng định lý Thalès: $AM / AB = AN / AC \\Rightarrow 3 / 9 = 4 / AC \\Rightarrow 1 / 3 = 4 / AC \\Rightarrow AC = 12\\text{ cm}$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Biết đoạn thẳng AB = 5cm và CD = 15cm. Tính tỉ số của hai đoạn thẳng AB và CD:`,
            [`$1/3$`, `$3$`, `$1/5$`, `$5/15$`],
            `$1/3$`,
            `Tỉ số của hai đoạn thẳng bằng tỉ số độ dài của chúng cùng đơn vị đo: $AB / CD = 5 / 15 = 1/3$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC, đường thẳng d song song với BC cắt AB tại D, AC tại E sao cho $AD/DB = 3/2$. Biết đoạn thẳng $CE = 6\\text{ cm}$. Tính độ dài đoạn thẳng AE:`,
              [`$9\\text{ cm}$`, `$4\\text{ cm}$`, `$12\\text{ cm}$`, `$15\\text{ cm}$`],
              `$9\\text{ cm}$`,
              `Theo định lý Thalès: $AD / DB = AE / EC \\Rightarrow 3/2 = AE / 6 \\Rightarrow AE = (3 \\cdot 6) / 2 = 9\\text{ cm}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC, đường thẳng d song song với BC cắt AB tại D, AC tại E sao cho $AD/DB = 2/3$. Biết đoạn thẳng $CE = 9\\text{ cm}$. Tính độ dài đoạn thẳng AE:`,
              [`$6\\text{ cm}$`, `$4.5\\text{ cm}$`, `$12\\text{ cm}$`, `$13.5\\text{ cm}$`],
              `$6\\text{ cm}$`,
              `Theo định lý Thalès: $AD / DB = AE / EC \\Rightarrow 2/3 = AE / 9 \\Rightarrow AE = (2 \\cdot 9) / 3 = 6\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC, đường thẳng d song song với BC cắt AB tại D, AC tại E sao cho $AD/DB = 1/2$. Biết đoạn thẳng $CE = 8\\text{ cm}$. Tính độ dài đoạn thẳng AE:`,
              [`$4\\text{ cm}$`, `$2\\text{ cm}$`, `$16\\text{ cm}$`, `$12\\text{ cm}$`],
              `$4\\text{ cm}$`,
              `Theo định lý Thalès: $AD / DB = AE / EC \\Rightarrow 1/2 = AE / 8 \\Rightarrow AE = (1 \\cdot 8) / 2 = 4\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      case 'duong-trung-binh': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Đường trung bình của tam giác là đoạn thẳng nối hai vị trí nào?`,
            [`Trung điểm hai cạnh của tam giác`, `Đỉnh và trọng tâm`, `Đỉnh hợp với trực tâm`, `Hai chân đường cao`],
            `Trung điểm hai cạnh của tam giác`,
            `Định nghĩa: Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tam giác ABC có MN là đường trung bình song song với cạnh BC. Biết MN = 5cm. Độ dài BC là:`,
            [`$10\\text{ cm}$`, `$2.5\\text{ cm}$`, `$5\\text{ cm}$`, `$15\\text{ cm}$`],
            `$10\\text{ cm}$`,
            `Theo tính chất đường trung bình, $MN = BC / 2 \\Rightarrow BC = 2 \\cdot MN = 2 \\cdot 5 = 10\\text{ cm}$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tam giác ABC có chu vi bằng 24cm. Ba đường trung bình của tam giác này tạo thành một tam giác mới có chu vi bằng:`,
            [`$12\\text{ cm}$`, `$6\\text{ cm}$`, `$18\\text{ cm}$`, `$48\\text{ cm}$`],
            `$12\\text{ cm}$`,
            `Mỗi cạnh của tam giác trung bình bằng một nửa cạnh tương ứng của tam giác lớn. Nên chu vi tam giác mới bằng một nửa chu vi tam giác cũ: $24 / 2 = 12\\text{ cm}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thang ABCD (AB // CD). Gọi M, N lần lượt là trung điểm của hai cạnh bên AD, BC. Cho AB = 8cm, MN = 12cm. Tính độ dài cạnh đáy CD:`,
              [`$16\\text{ cm}$`, `$10\\text{ cm}$`, `$12\\text{ cm}$`, `$20\\text{ cm}$`],
              `$16\\text{ cm}$`,
              `MN là đường trung bình của hình thang, ta có công thức: $MN = (AB + CD) / 2 \\Rightarrow 12 = (8 + CD) / 2 \\Rightarrow 24 = 8 + CD \\Rightarrow CD = 16\\text{ cm}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thang ABCD (AB // CD). Gọi M, N lần lượt là trung điểm của hai cạnh bên AD, BC. Cho AB = 6cm, MN = 10cm. Tính độ dài cạnh đáy CD:`,
              [`$14\\text{ cm}$`, `$8\\text{ cm}$`, `$12\\text{ cm}$`, `$18\\text{ cm}$`],
              `$14\\text{ cm}$`,
              `MN là đường trung bình của hình thang: $MN = (AB + CD) / 2 \\Rightarrow 10 = (6 + CD) / 2 \\Rightarrow 20 = 6 + CD \\Rightarrow CD = 14\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hình thang ABCD (AB // CD). Gọi M, N lần lượt là trung điểm của hai cạnh bên AD, BC. Cho AB = 10cm, MN = 15cm. Tính độ dài cạnh đáy CD:`,
              [`$20\\text{ cm}$`, `$12.5\\text{ cm}$`, `$15\\text{ cm}$`, `$25\\text{ cm}$`],
              `$20\\text{ cm}$`,
              `MN là đường trung bình của hình thang: $MN = (AB + CD) / 2 \\Rightarrow 15 = (10 + CD) / 2 \\Rightarrow 30 = 10 + CD \\Rightarrow CD = 20\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      case 'duong-phan-giac': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Đường phân giác trong của một góc trong tam giác chia cạnh đối diện thành hai đoạn thẳng như thế nào?`,
            [`Tỉ lệ với hai cạnh kề hai đoạn thẳng ấy`, `Bằng với hai cạnh kề tương đương`, `Kính thước bằng nhau`, `Song song`],
            `Tỉ lệ với hai cạnh kề hai đoạn thẳng ấy`,
            `Nội dung tính chất: Trong một tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề với hai đoạn thẳng ấy.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tam giác ABC có AD là tia phân giác trong góc A ($D \\in BC$). Biết AB = 6cm, AC = 8cm. Tính tỉ số BD/CD:`,
            [`$3/4$`, `$4/3$`, `$1/2$`, `$2/3$`],
            `$3/4$`,
            `Theo tính chất đường phân giác: $BD / CD = AB / AC = 6 / 8 = 3/4$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho tam giác ABC có AB = 5cm, AC = 10cm, phân giác trong AD. BC có độ dài bằng 9cm. Tính độ dài đoạn CD:`,
            [`$6\\text{ cm}$`, `$3\\text{ cm}$`, `$4.5\\text{ cm}$`, `$5\\text{ cm}$`],
            `$6\\text{ cm}$`,
            `Ta có $BD / CD = AB / AC = 5 / 10 = 1/2 \\Rightarrow CD = 2BD$. Độ dài $BC = BD + CD = BD + 2BD = 3BD = 9\\text{ cm} \\Rightarrow BD = 3\\text{ cm}, CD = 6\\text{ cm}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC có AM là đường trung tuyến và AD là đường phân giác. Khi nào điểm D trùng điểm M?`,
              [`Tam giác ABC cân tại đỉnh A`, `Tam giác ABC vuông tại A`, `Độ dài AB dài gấp đôi AC`, `D luôn trùng M`],
              `Tam giác ABC cân tại đỉnh A`,
              `Trong tam giác cân tại A, đường phân giác kẻ từ đỉnh đồng thời cũng là đường trung tuyến, nên điểm chân phân giác D sẽ trùng đúng với trung điểm M.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC cân tại A có AB = 10cm, BC = 12cm. Gọi AD là đường phân giác của góc A. Độ dài đoạn BD là:`,
              [`$6\\text{ cm}$`, `$5\\text{ cm}$`, `$10\\text{ cm}$`, `$12\\text{ cm}$`],
              `$6\\text{ cm}$`,
              `Trong tam giác ABC cân tại A, đường phân giác AD xuất phát từ đỉnh cân đồng thời là đường trung tuyến. Do đó, D là trung điểm BC, nên $BD = BC / 2 = 12 / 2 = 6\\text{ cm}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC có AB = 8cm, AC = 12cm. Gọi AD là đường phân giác của góc A. Biết $BD = 4\\text{ cm}$. Tính độ dài đoạn CD:`,
              [`$6\\text{ cm}$`, `$4\\text{ cm}$`, `$8\\text{ cm}$`, `$12\\text{ cm}$`],
              `$6\\text{ cm}$`,
              `Theo tính chất đường phân giác: $BD / CD = AB / AC \\Rightarrow 4 / CD = 8 / 12 = 2/3 \\Rightarrow CD = (4 \\cdot 3) / 2 = 6\\text{ cm}$.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER V: DỮ LIỆU VÀ BIỂU ĐỒ ---
      case 'data-collect': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hãy phân loại dữ liệu: "Tên các loài hoa quốc hoa của các nước Đông Nam Á" thuộc dạng dữ liệu nào?`,
            [`Dữ liệu không là số (định tính)`, `Dữ liệu là số (định lượng)`, `Số liệu liên tục`, `Số liệu rời rạc`],
            `Dữ liệu không là số (định tính)`,
            `Tên hoa là các từ ngữ, thông tin mô tả phi số, nên nó thuộc loại dữ liệu không là số (dữ liệu định tính).`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Số liệu nào dưới đây là số liệu liên tục?`,
            [`Chiều cao của các học sinh lớp 8`, `Số thành viên trong gia đình`, `Số bút bi bán ra trong ngày`, `Số học sinh vắng học`],
            `Chiều cao của các học sinh lớp 8`,
            `Chiều cao có thể nhận bất kì giá trị số thực nào trong một khoảng liên tục (như 152.5 cm, 160.75 cm...) nên nó là số liệu liên tục. Các đại lượng còn lại đều gò bó trong các số nguyên đếm được (rời rạc).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Phương pháp nào sau đây là phương pháp gián tiếp để thu thập dữ liệu?`,
              [`Thu thập bảng số liệu từ báo điện tử của Tổng cục Thống kê`, `Làm khảo sát trực tiếp từng học sinh`, `Bấm đo đạc nhiệt độ từng phòng học`, `Hút thử và đếm hạt ngô nảy mầm`],
              `Thu thập bảng số liệu từ báo điện tử của Tổng cục Thống kê`,
              `Khi tìm kiếm và tổng hợp thông tin có sẵn trên internet, tài liệu đã công bố - đó là phương pháp thu thập gián tiếp (dữ liệu thứ cấp).`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Phương pháp nào sau đây là phương pháp trực tiếp để thu thập dữ liệu?`,
              [`Phỏng vấn trực tiếp cư dân trong khu phố`, `Tìm kiếm dữ liệu niên giám năm ngoái`, `Đọc số liệu từ chatbot AI`, `Đọc tin tức tổng hợp trên báo điện tử`],
              `Phỏng vấn trực tiếp cư dân trong khu phố`,
              `Phỏng vấn trực tiếp đối tượng điều tra là phương pháp thu thập dữ liệu trực tiếp (dữ liệu sơ cấp).`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khi muốn đánh giá mức độ yêu thích môn Toán của học sinh, cách chọn mẫu nào dưới đây là KHÔNG khách quan?`,
              [`Chỉ khảo sát học sinh trong câu lạc bộ Học sinh giỏi Toán`, `Chọn ngẫu nhiên 5 học sinh từ mỗi lớp học trong trường`, `Khảo sát toàn bộ danh sách học sinh theo thứ tự ngẫu nhiên`, `Khảo sát ngẫu nhiên 100 học sinh tại sân trường giờ giải lao`],
              `Chỉ khảo sát học sinh trong câu lạc bộ Học sinh giỏi Toán`,
              `Học sinh thuộc CLB Toán có xu hướng yêu thích môn học này vượt trội hơn thông thường, làm sai lệch kết quả đại diện cho toàn bộ học sinh.`
            ));
          }
        }
        break;
      }

      case 'data-chart': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Để biểu diễn cơ cấu tỉ lệ phần trăm (%) các loại món ăn sáng yêu thích của học sinh, ta nên chọn biểu đồ nào?`,
            [`Biểu đồ hình quạt tròn`, `Biểu đồ đoạn thẳng`, `Biểu đồ cột`, `Biểu đồ cột kép`],
            `Biểu đồ hình quạt tròn`,
            `Biểu đồ quạt tròn là công cụ hiệu quả trực quan nhất để mô tả tỉ lệ cơ cấu phần trăm so với tổng thể.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Để theo dõi xu hướng biến động nhiệt độ trong ngày qua các giờ khác nhau, ta chọn loại biểu đồ nào tối ưu nhất?`,
            [`Biểu đồ đoạn thẳng`, `Biểu đồ hình quạt tròn`, `Biểu đồ cột kép`, `Bảng tần số`],
            `Biểu đồ đoạn thẳng`,
            `Biểu đồ đoạn thẳng (hoặc biểu đồ đường) là công cụ chuyên sâu nhất để phản ánh xu hướng phát triển và dao động số liệu liên tục theo thời gian.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Biểu đồ cột kép thường được sử dụng khi nào trong thực tế?`,
              [`Để so sánh từng cặp đại lượng của hai nhóm đối tượng khác nhau`, `Chỉ dùng để vẽ nhiệt độ lượng mưa`, `Khi dữ liệu toàn là chữ`, `Mô tả sự biến động liên tục`],
              `Để so sánh từng cặp đại lượng của hai nhóm đối tượng khác nhau`,
              `Biểu đồ cột kép giúp đặt song song các cột dữ liệu biểu đạt của hai nhóm khác nhau tại từng mốc so sánh trực quan tiện lợi.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Để biểu diễn sự thay đổi của tỉ lệ phần trạng dân số sử dụng Internet theo thời gian (qua các năm), ta nên chọn loại biểu đồ nào biểu diễn trực quan nhất?`,
              [`Biểu đồ đoạn thẳng`, `Biểu đồ hình quạt tròn`, `Bảng số liệu rời rạc`, `Biểu đồ tranh`],
              `Biểu đồ đoạn thẳng`,
              `Biểu đồ đoạn thẳng (hoặc biểu đồ đường) là công cụ tối ưu nhất để mô tả sự biến động, xu hướng tăng trưởng của số liệu liên tục theo thời gian.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Một biểu đồ hình quạt tròn biểu diễn cơ cấu chi tiêu của một gia đình. Nếu chi phí ăn uống chiếm đúng $40\\%$ tổng chi tiêu, góc ở tâm biểu diễn phần ăn uống là bao nhiêu độ?`,
              [`$144^\\circ$`, `$40^\\circ$`, `$90^\\circ$`, `$120^\\circ$`],
              `$144^\\circ$`,
              `Một hình tròn đầy đủ tương ứng với $100\\%$ và có góc ở tâm là $360^\\circ$. Chi phí ăn uống tương ứng góc ở tâm là: $360^\\circ \\cdot 40\\% = 144^\\circ$.`
            ));
          }
        }
        break;
      }

      case 'data-analysis': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Một học sinh vẽ biểu đồ tròn cơ cấu phần trăm sở thích thể thao có các tỉ lệ: Bóng đá 50%, Cầu lông 30%, Bơi lội 35%. Số liệu này có điểm gì vô lý?`,
            [`Tổng phần trăm lớn hơn 100%`, `Số liệu bóng đá quá cao`, `Không ghi đơn vị`, `Sở thích bơi lội không nên nằm chung`],
            `Tổng phần trăm lớn hơn 100%`,
            `Tổng tỉ lệ phần trăm trong cơ cấu hình quạt tròn bắt buộc phải đúng bằng 100%. Tổng ở đây là 50% + 30% + 35% = 115% là không hợp lý.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Doanh thu một nhà sách tăng từ 200 triệu đồng (tháng 1) lên 250 triệu đồng (tháng 2). Hãy cho biết tốc độ tăng trưởng doanh thu này bằng bao nhiêu phần trăm?`,
              [`$25\\%$`, `$20\\%$`, `$50\\%$`, `$125\\%$`],
              `$25\\%$`,
              `Tốc độ tăng trưởng bằng: $\\frac{250 - 200}{200} \\cdot 100\\% = \\frac{50}{200} \\cdot 100\\% = 25\\%$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Doanh thu một doanh nghiệp tăng từ 100 triệu đồng lên 120 triệu đồng. Tốc độ tăng trưởng doanh thu này bằng bao nhiêu phần trăm?`,
              [`$20\\%$`, `$15\\%$`, `$25\\%$`, `$120\\%$`],
              `$20\\%$`,
              `Tốc độ tăng trưởng bằng: $\\frac{120 - 100}{100} \\cdot 100\\% = 20\\%$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Doanh thu một cửa hàng thời trang tăng từ 200 triệu đồng lên 300 triệu đồng. Tốc độ tăng trưởng doanh thu này bằng bao nhiêu phần trăm?`,
              [`$50\\%$`, `$100\\%$`, `$30\\%$`, `$150\\%$`],
              `$50\\%$`,
              `Tốc độ tăng trưởng bằng: $\\frac{300 - 200}{200} \\cdot 100\\% = 50\\%$.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER VI: PHÂN THỨC ĐẠI SỐ ---
      case 'phan-thuc-dai-so': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân thức đại số có dạng là biểu thức như thế nào?`,
            [`$A/B$ với A, B là các đa thức và B khác đa thức không`, `$A/B$ với A, B bắt buộc là các số thực`, `$A \\cdot B$`, `$A - B$`],
            `$A/B$ với A, B là các đa thức và B khác đa thức không`,
            `Theo định nghĩa, phân thức đại số là biểu thức có dạng $A / B$, trong đó $A, B$ là các đa thức và mẫu $B$ phải khác đa thức không.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Điều kiện xác định của phân thức đại số $\\frac{x - 3}{x - 7}$ là:`,
            [`$x \\neq 7$`, `$x \\neq 3$`, `$x > 3$`, `$x \\neq 0$`],
            `$x \\neq 7$`,
            `Mẫu thức phải khác $0$. Ta cần: $x - 7 \\neq 0 \\Rightarrow x \\neq 7$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Để hai phân thức bằng nhau $\\frac{A}{B} = \\frac{C}{D}$, ta cần thỏa mãn đẳng thức tích chéo nào?`,
            [`$A \\cdot D = B \\cdot C$`, `$A \\cdot C = B \\cdot D$`, `$A + D = B + C$`, `$A : D = B : C$`],
            `$A \\cdot D = B \\cdot C$`,
            `Theo tính chất cơ bản, $\\frac{A}{B} = \\frac{C}{D} \\Leftrightarrow A \\cdot D = B \\cdot C$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm điều kiện xác định của phân thức đại số $F = \\frac{2x + 1}{x^2 - 9}$:`,
              [`$x \\neq 3$ và $x \\neq -3$`, `$x \\neq 9$`, `$x \\neq 3$`, `$x > 3$`],
              `$x \\neq 3$ và $x \\neq -3$`,
              `Mẫu là $x^2 - 9$. Điều kiện mẫu khác $0$: $x^2 - 9 \\neq 0 \\Rightarrow (x-3)(x+3) \\neq 0 \\Rightarrow x \\neq 3$ và $x \\neq -3$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm điều kiện xác định của phân thức đại số $F = \\frac{x - 2}{x^2 - 16}$:`,
              [`$x \\neq 4$ và $x \\neq -4$`, `$x \\neq 16$`, `$x \\neq 4$`, `$x > 4$`],
              `$x \\neq 4$ và $x \\neq -4$`,
              `Mẫu là $x^2 - 16$. Điều kiện mẫu khác $0$: $x^2 - 16 \\neq 0 \\Rightarrow (x-4)(x+4) \\neq 0 \\Rightarrow x \\neq 4$ và $x \\neq -4$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm điều kiện xác định của phân thức đại số $F = \\frac{5}{x^2 - 25}$:`,
              [`$x \\neq 5$ và $x \\neq -5$`, `$x \\neq 25$`, `$x \\neq 5$`, `$x > 5$`],
              `$x \\neq 5$ và $x \\neq -5$`,
              `Mẫu là $x^2 - 25$. Điều kiện mẫu khác $0$: $x^2 - 25 \\neq 0 \\Rightarrow (x-5)(x+5) \\neq 0 \\Rightarrow x \\neq 5$ và $x \\neq -5$.`
            ));
          }
        }
        break;
      }

      case 'phan-thuc-tinh-chat': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Rút gọn phân thức đại số sau: $\\frac{x^2 - xy}{5x - 5y}$`,
            [`$\\frac{x}{5}$`, `$\\frac{y}{5}$`, `$x - y$`, `$\\frac{x-y}{5}$`],
            `$\\frac{x}{5}$`,
            `Phân tích tử: $x(x-y)$. Phân tích mẫu: $5(x-y)$. Rút gọn nhân tử chung $(x-y)$ ta có kết quả $\\frac{x}{5}$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phân thức nào sau đây bằng với phân thức $\\frac{x - y}{3}$ sau khi đổi dấu?`,
            [`$\\frac{y - x}{-3}$`, `$\\frac{y - x}{3}$`, `$\\frac{x - y}{-3}$`, `$\\frac{-x - y}{3}$`],
            `$\\frac{y - x}{-3}$`,
            `Theo quy tắc đổi dấu, ta đổi dấu đồng thời cả tử và mẫu: $\\frac{x-y}{3} = \\frac{-(x-y)}{-3} = \\frac{y-x}{-3}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Rút gọn phân thức: $\\frac{x^2 - 4}{2x - 4}$:`,
              [`$\\frac{x + 2}{2}$`, `$x + 2$`, `$\\frac{x - 2}{2}$`, `$x - 2$`],
              `$\\frac{x + 2}{2}$`,
              `Tử thức là $x^2 - 4 = (x-2)(x+2)$. Mẫu thức là $2(x-2)$. Chia cả tử và mẫu cho nhân tử chung $(x-2)$, ta được $\\frac{x+2}{2}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Rút gọn phân thức: $\\frac{x^2 - 9}{3x - 9}$:`,
              [`$\\frac{x + 3}{3}$`, `$x + 3$`, `$\\frac{x - 3}{3}$`, `$x - 3$`],
              `$\\frac{x + 3}{3}$`,
              `Tử thức là $x^2 - 9 = (x-3)(x+3)$. Mẫu thức là $3(x-3)$. Chia cả tử và mẫu cho nhân tử chung $(x-3)$, ta được $\\frac{x+3}{3}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Rút gọn phân thức: $\\frac{x^2 - 16}{4x - 16}$:`,
              [`$\\frac{x + 4}{4}$`, `$x + 4$`, `$\\frac{x - 4}{4}$`, `$x - 4$`],
              `$\\frac{x + 4}{4}$`,
              `Tử thức là $x^2 - 16 = (x-4)(x+4)$. Mẫu thức là $4(x-4)$. Chia cả tử và mẫu cho nhân tử chung $(x-4)$, ta được $\\frac{x+4}{4}$.`
            ));
          }
        }
        break;
      }

      case 'phan-thuc-cong-tru': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính tổng hai phân thức cùng mẫu thức: $\\frac{2x}{x+1} + \\frac{2}{x+1}$:`,
            [`$2$`, `$\\frac{2x+2}{2x+2}$`, `$x + 1$`, `$\\frac{2}{x+1}$`],
            `$2$`,
            `ộng tử: $\\frac{2x+2}{x+1} = \\frac{2(x+1)}{x+1} = 2$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Quy đồng mẫu thức hai phân thức $\\frac{1}{x^2y}$ và $\\frac{3}{xy^2}$ ta được mẫu thức chung tốt nhất là:`,
            [`$x^2y^2$`, `$xy$`, `$x^3y^3$`, `$x^2y$`],
            `$x^2y^2$`,
            `Mẫu thức chung nhỏ nhất chứa cả hai mẫu $x^2y$ và $xy^2$ chính là $x^2y^2$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Thực hiện phép trừ phân thức đại số sau: $\\frac{1}{x - 2} - \\frac{1}{x}$:`,
              [`$\\frac{2}{x(x - 2)}$`, `$\\frac{-2}{x(x - 2)}$`, `$0$`, `$\\frac{x - 2}{x(x - 2)}$`],
              `$\\frac{2}{x(x - 2)}$`,
              `MTC là $x(x-2)$. Quy đồng và trừ tử: $\\frac{x - (x - 2)}{x(x-2)} = \\frac{2}{x(x-2)}$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Thực hiện phép trừ phân thức đại số sau: $\\frac{1}{x - 3} - \\frac{1}{x}$:`,
              [`$\\frac{3}{x(x - 3)}$`, `$\\frac{-3}{x(x - 3)}$`, `$0$`, `$\\frac{x - 3}{x(x - 3)}$`],
              `$\\frac{3}{x(x - 3)}$`,
              `MTC là $x(x-3)$. Quy đồng và trừ tử: $\\frac{x - (x - 3)}{x(x-3)} = \\frac{3}{x(x-3)}$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Thực hiện phép trừ phân thức đại số sau: $\\frac{1}{x - 4} - \\frac{1}{x}$:`,
              [`$\\frac{4}{x(x - 4)}$`, `$\\frac{-4}{x(x - 4)}$`, `$0$`, `$\\frac{x - 4}{x(x - 4)}$`],
              `$\\frac{4}{x(x - 4)}$`,
              `MTC là $x(x-4)$. Quy đồng và trừ tử: $\\frac{x - (x - 4)}{x(x-4)} = \\frac{4}{x(x-4)}$.`
            ));
          }
        }
        break;
      }

      case 'phan-thuc-nhan-chia': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Thực hiện phép tính nhân phân thức: $\\frac{3x^2}{y^3} \\cdot \\frac{y}{x}$:`,
            [`$\\frac{3x}{y^2}$`, `$\\frac{3x^2}{y^2}$`, `$3xy$`, `$\\frac{3x^3}{y^4}$`],
            `$\\frac{3x}{y^2}$`,
            `Nhân tử với tử: $3x^2 \\cdot y$. Nhân mẫu với mẫu: $y^3 \\cdot x$. Rút gọn và tối giản ta thu được $\\frac{3x}{y^2}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính phép chia phân thức sau: $\\frac{x^2 - y^2}{5} : \\frac{x - y}{10}$`,
              [`$2(x + y)$`, `$2(x - y)$`, `$\\frac{x + y}{2}$`, `$50(x-y)$`],
              `$2(x + y)$`,
              `Áp dụng nhân với nghịch đảo: $\\frac{(x-y)(x+y)}{5} \\cdot \\frac{10}{x-y}$. Rút gọn $(x-y)$ và chia $10 : 5 = 2$. Do đó thu được $2(x+y)$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính phép chia phân thức sau: $\\frac{x^2 - y^2}{3} : \\frac{x - y}{6}$`,
              [`$2(x + y)$`, `$2(x - y)$`, `$\\frac{x + y}{2}$`, `$18(x-y)$`],
              `$2(x + y)$`,
              `Áp dụng nhân với nghịch đảo: $\\frac{(x-y)(x+y)}{3} \\cdot \\frac{6}{x-y}$. Rút gọn $(x-y)$ và chia $6 : 3 = 2$. Do đó thu được $2(x+y)$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính phép chia phân thức sau: $\\frac{x^2 - y^2}{4} : \\frac{x - y}{12}$`,
              [`$3(x + y)$`, `$3(x - y)$`, `$\\frac{x + y}{3}$`, `$48(x-y)$`],
              `$3(x + y)$`,
              `Áp dụng nhân với nghịch đảo: $\\frac{(x-y)(x+y)}{4} \\cdot \\frac{12}{x-y}$. Rút gọn $(x-y)$ và chia $12 : 4 = 3$. Do đó thu được $3(x+y)$.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER VII: PHƯƠNG TRÌNH BẬC NHẤT ---
      case 'pt-bac-nhat': {
        const aVal = getValRange(2, 5);
        const bVal = getValRange(3, 15);
        const ans = -bVal / aVal;
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Phương trình nào dưới đây là phương trình bậc nhất một ẩn?`,
            [`$${aVal}x + ${bVal} = 0$`, `$x^2 - 4 = 0$`, `$2x + y = 3$`, `$\\frac{1}{x} + 2 = 0$`],
            `$${aVal}x + ${bVal} = 0$`,
            `Bậc nhất một ẩn có dạng $ax + b = 0$ với $a \\neq 0$. Biểu thức $${aVal}x + ${bVal} = 0$ thỏa mãn chuẩn xác.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Giải phương trình bậc nhất sau: $3x - 15 = 0$:`,
            [`$x = 5$`, `$x = -5$`, `$x = 3$`, `$x = 15$`],
            `$x = 5$`,
            `Chuyển vế: $3x = 15 \\Rightarrow x = 15 / 3 = 5$.`
          ));
        } else if (index <= 17) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tìm tập nghiệm của phương trình $5 - (x - 2) = 1$:`,
            [`$S = \\{6\\}$`, `$S = \\{4\\}$`, `$S = \\{2\\}$`, `$S = \\{0\\}$`],
            `$S = \\{6\\}$`,
            `Giải: $5 - x + 2 = 1 \\Rightarrow 7 - x = 1 \\Rightarrow x = 6$. Tập nghiệm $S = \\{6\\}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giải phương trình có chứa mẫu số nguyên sau: $\\frac{x + 1}{2} - \\frac{x - 1}{3} = 2$:`,
              [`$x = 7$`, `$x = 5$`, `$x = 9$`, `$x = 11$`],
              `$x = 7$`,
              `Quy đồng mẫu 6: $3(x+1) - 2(x-1) = 12 \\Rightarrow 3x + 3 - 2x + 2 = 12 \\Rightarrow x + 5 = 12 \\Rightarrow x = 7$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giải phương trình có chứa mẫu số nguyên sau: $\\frac{x + 1}{2} - \\frac{x - 1}{3} = 3$:`,
              [`$x = 13$`, `$x = 11$`, `$x = 15$`, `$x = 9$`],
              `$x = 13$`,
              `Quy đồng mẫu 6: $3(x+1) - 2(x-1) = 18 \\Rightarrow 3x + 3 - 2x + 2 = 18 \\Rightarrow x + 5 = 18 \\Rightarrow x = 13$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giải phương trình có chứa mẫu số nguyên sau: $\\frac{x + 1}{2} - \\frac{x - 1}{3} = 1$:`,
              [`$x = 1$`, `$x = 2$`, `$x = 0$`, `$x = -1$`],
              `$x = 1$`,
              `Quy đồng mẫu 6: $3(x+1) - 2(x-1) = 6 \\Rightarrow 3x + 3 - 2x + 2 = 6 \\Rightarrow x + 5 = 6 \\Rightarrow x = 1$.`
            ));
          }
        }
        break;
      }

      case 'pt-giai-toan': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Bước đầu tiên và quan trọng nhất khi giải bài toán bằng cách lập phương trình là:`,
            [`Chọn ẩn số và đặt điều kiện thích hợp cho ẩn`, `Giải phương trình`, `Tính nhẩm tổng số`, `Viết câu trả lời cuối`],
            `Chọn ẩn số và đặt điều kiện thích hợp cho ẩn`,
            `Theo quy trình 3 bước, bước đầu tiên bắt buộc phải là: Chọn ẩn và đặt điều kiện tối ưu dồi dào phù hợp cho ẩn số.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Một xe máy đi từ A đến B với vận tốc $40\\text{ km/h}$. Nếu gọi quãng đường AB là $x$ (km, $x>0$) thì thời gian xe máy đi hết quãng đường là:`,
            [`$\\frac{x}{40}$ giờ`, `$40x$ giờ`, `$x - 40$ giờ`, `$40/x$ giờ`],
            `$\\frac{x}{40}$ giờ`,
            `Thời gian bằng quãng đường chia cho vận tốc: $t = S/v = x/40$ (giờ).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm hai số biết tổng của chúng là 40, và số lớn gấp ba lần số bé. Số bé là:`,
              [`$10$`, `$30$`, `$15$`, `$8$`],
              `$10$`,
              `Gọi số bé là $x$ ($x > 0$), số lớn là $3x$. Đưa về phương trình tổng: $x + 3x = 40 \\Rightarrow 4x = 40 \\Rightarrow x = 10$. Số bé bằng $10$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm hai số biết tổng của chúng là 60, và số lớn gấp ba lần số bé. Số bé là:`,
              [`$15$`, `$45$`, `$20$`, `$12$`],
              `$15$`,
              `Gọi số bé là $x$ ($x > 0$), số lớn là $3x$. Đưa về phương trình tổng: $x + 3x = 60 \\Rightarrow 4x = 60 \\Rightarrow x = 15$. Số bé bằng $15$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm hai số biết tổng của chúng là 80, và số lớn gấp ba lần số bé. Số bé là:`,
              [`$20$`, `$60$`, `$25$`, `$15$`],
              `$20$`,
              `Gọi số bé là $x$ ($x > 0$), số lớn là $3x$. Đưa về phương trình tổng: $x + 3x = 80 \\Rightarrow 4x = 80 \\Rightarrow x = 20$. Số bé bằng $20$.`
            ));
          }
        }
        break;
      }

      case 'hamso-khainiem': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hàm số $y = f(x) = -2x + 5$. Tính giá trị của $f(2)$:`,
            [`$1$`, `$9$`, `$-1$`, `$5$`],
            `$1$`,
            `Thay $x = 2$ vào công thức hàm số: $f(2) = -2 \\cdot 2 + 5 = -4 + 5 = 1$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Điểm nào dưới đây thuộc đồ thị của hàm số $y = 3x - 1$?`,
              [`$A(1; 2)$`, `$B(0; 2)$`, `$C(2; 4)$`, `$D(-1; 4)$`],
              `$A(1; 2)$`,
              `Thử tọa độ điểm A(1; 2): Thế $x = 1$, ta được $y = 3 \\cdot 1 - 1 = 2$ (Đúng). Do đó điểm A thuộc đồ thị.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Điểm nào dưới đây thuộc đồ thị của hàm số $y = 2x - 3$?`,
              [`$A(2; 1)$`, `$B(0; 1)$`, `$C(1; 2)$`, `$D(-1; 2)$`],
              `$A(2; 1)$`,
              `Thử tọa độ điểm A(2; 1): Thế $x = 2$, ta được $y = 2 \\cdot 2 - 3 = 1$ (Đúng). Do đó điểm A thuộc đồ thị.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Điểm nào dưới đây thuộc đồ thị của hàm số $y = 4x - 2$?`,
              [`$A(1; 2)$`, `$B(0; 2)$`, `$C(1; 4)$`, `$D(-1; 4)$`],
              `$A(1; 2)$`,
              `Thử tọa độ điểm A(1; 2): Thế $x = 1$, ta được $y = 4 \\cdot 1 - 2 = 2$ (Đúng). Do đó điểm A thuộc đồ thị.`
            ));
          }
        }
        break;
      }

      case 'hamso-bacnhat': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hàm số nào dưới đây là hàm số bậc nhất một ẩn?`,
            [`$y = 3x - 4$`, `$y = x^2 + 2$`, `$y = \\frac{2}{x}$`, `$y = 0x + 5$`],
            `$y = 3x - 4$`,
            `Hàm số bậc nhất có dạng $y = ax + b$ với $a \\neq 0$. Biểu thức $y = 3x - 4$ có $a = 3 \\neq 0$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Xác định tọa độ giao điểm của đồ thị hàm số $y = 2x - 6$ với trục tung Oy:`,
            [`$(0; -6)$`, `$(3; 0)$`, `$(0; 6)$`, `$(6; 0)$`],
            `$(0; -6)$`,
            `Giao với Oy tức là $x = 0 \\Rightarrow y = 2 \\cdot 0 - 6 = -6$. Tọa độ điểm giao là $(0; -6)$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giao điểm với trục hoành Ox của đồ thị hàm số bậc nhất $y = 2x - 4$ là điểm nào?`,
              [`$(2; 0)$`, `$(0; -4)$`, `$(-2; 0)$`, `$(0; 2)$`],
              `$(2; 0)$`,
              `Giao với Ox tức là $y = 0 \\Rightarrow 2x - 4 = 0 \\Rightarrow x = 2$. Do đó điểm giao là $(2; 0)$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giao điểm với trục hoành Ox của đồ thị hàm số bậc nhất $y = 3x - 6$ là điểm nào?`,
              [`$(2; 0)$`, `$(0; -6)$`, `$(-2; 0)$`, `$(0; 3)$`],
              `$(2; 0)$`,
              `Giao với Ox tức là $y = 0 \\Rightarrow 3x - 6 = 0 \\Rightarrow x = 2$. Do đó điểm giao là $(2; 0)$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Giao điểm với trục hoành Ox của đồ thị hàm số bậc nhất $y = 4x - 8$ là điểm nào?`,
              [`$(2; 0)$`, `$(0; -8)$`, `$(-2; 0)$`, `$(0; 4)$`],
              `$(2; 0)$`,
              `Giao với Ox tức là $y = 0 \\Rightarrow 4x - 8 = 0 \\Rightarrow x = 2$. Do đó điểm giao là $(2; 0)$.`
            ));
          }
        }
        break;
      }

      case 'hamso-hesogoc': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Trong phương trình đường thẳng $y = ax + b$, hệ số $a$ được gọi là:`,
            [`Hệ số góc`, `Hệ số tự do`, `Giao điểm Oy`, `Độ lệch độ`],
            `Hệ số góc`,
            `Trong phương trình $y=ax+b$, hệ số $a$ đứng trước biến $x$ được gọi là hệ số góc của đường thẳng.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Cho hai đường thẳng $(d): y = 2x - 1$ và $(d'): y = (m - 1)x + 5$. Tìm giá trị $m$ để hai đường thẳng song song:`,
            [`$m = 3$`, `$m = 2$`, `$m = 1$`, `$m = -1$`],
            `$m = 3$`,
            `Hai đường thẳng song song khi có hệ số góc bằng nhau: $a = a' \\Rightarrow m - 1 = 2 \\Rightarrow m = 3$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm điều kiện của $a$ để đường thẳng $y = ax + b$ tạo với trục Ox một góc tù:`,
              [`$a < 0$`, `$a > 0$`, `$a = 0$`, `$a \\ge 1$`],
              `$a < 0$`,
              `Tính chất: Nếu hệ số góc $a > 0$ thì góc tạo bởi đường thẳng và Ox là góc nhọn; nếu $a < 0$ thì góc tạo bởi đường thẳng và Ox là góc tù.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tìm điều kiện của $a$ để đường thẳng $y = ax + b$ tạo với trục Ox một góc nhọn:`,
              [`$a > 0$`, `$a < 0$`, `$a = 0$`, `$a \\le -1$`],
              `$a > 0$`,
              `Tính chất: Nếu hệ số góc $a > 0$ thì góc tạo bởi đường thẳng và Ox là góc nhọn; nếu $a < 0$ thì góc tạo bởi đường thẳng và Ox là góc tù.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Hệ số góc của đường thẳng song song với đường thẳng $y = -3x + 1$ là:`,
              [`$-3$`, `$3$`, `$1$`, `$-1/3$`],
              `$-3$`,
              `Hai đường thẳng song song thì hệ số góc của chúng bằng nhau. Đường thẳng $y = -3x + 1$ có hệ số góc bằng $-3$.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER VIII: XÁC SUẤT ---
      case 'xs-ket-qua': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Trong phép thử tung một con xúc xắc 6 mặt cân đối, có bao nhiêu kết quả có thể xảy ra?`,
            [`$6$`, `$12$`, `$1$`, `$2$`],
            `$6$`,
            `Tung xúc xắc 6 mặt thì có 6 số chấm tương ứng với 6 kết quả có thể xảy ra là 1, 2, 3, 4, 5, 6.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Gieo một con xúc xắc 6 mặt cân đối. Có bao nhiêu kết quả thuận lợi cho biến cố: "Số chấm xuất hiện là số nguyên tố"?`,
              [`$3$`, `$2$`, `$4$`, `$6$`],
              `$3$`,
              `Các số nguyên tố từ 1 đến 6 là 2, 3, 5. Vậy có đúng 3 kết quả thuận lợi.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Gieo một con xúc xắc 6 mặt cân đối. Có bao nhiêu kết quả thuận lợi cho biến cố: "Số chấm xuất hiện là số hợp số"?`,
              [`$2$`, `$3$`, `$4$`, `$1$`],
              `$2$`,
              `Các hợp số từ 1 đến 6 là 4 và 6 (số 1 không phải là số nguyên tố cũng không phải hợp số). Vậy có đúng 2 kết quả thuận lợi.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Gieo một con xúc xắc 6 mặt cân đối. Có bao nhiêu kết quả thuận lợi cho biến cố: "Số chấm xuất hiện chia hết cho 3"?`,
              [`$2$`, `$3$`, `$1$`, `$4$`],
              `$2$`,
              `Các số chia hết cho 3 từ 1 đến 6 là 3 và 6. Vậy có đúng 2 kết quả thuận lợi.`
            ));
          }
        }
        break;
      }

      case 'xs-tinh-toan': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Gieo một đồng xu cân đối đồng chất. Xác suất xuất hiện mặt Ngửa bằng bao nhiêu?`,
            [`$\\frac{1}{2}$`, `$1$`, `$0$`, `$\\frac{1}{4}$`],
            `$\\frac{1}{2}$`,
            `Hai mặt đồng xu có khả năng như nhau, tổng số kết quả là 2, sấp hoặc ngửa. Do đó xác suất là 1/2 = 0.5.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Một hộp đựng 4 viên bi xanh và 6 viên bi đỏ có kích thước như nhau. Lấy ngẫu nhiên 1 viên bi. Xác suất để chọn được viên bi đỏ là:`,
              [`$\\frac{3}{5}$`, `$\\frac{2}{5}$`, `$\\frac{1}{10}$`, `$\\frac{2}{3}$`],
              `$\\frac{3}{5}$`,
              `Tổng số bi trong hộp là $4 + 6 = 10$ viên bi. Số kết quả thuận lợi (bi đỏ) là 6. Xác suất P = 6/10 = 3/5.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Một hộp đựng 3 viên bi xanh và 7 viên bi đỏ có kích thước như nhau. Lấy ngẫu nhiên 1 viên bi. Xác suất để chọn được viên bi xanh là:`,
              [`$\\frac{3}{10}$`, `$\\frac{7}{10}$`, `$\\frac{1}{10}$`, `$\\frac{1}{3}$`],
              `$\\frac{3}{10}$`,
              `Tổng số bi trong hộp là $3 + 7 = 10$ viên bi. Số kết quả thuận lợi (bi xanh) là 3. Xác suất P = 3/10.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Một hộp đựng 5 viên bi xanh và 5 viên bi đỏ có kích thước như nhau. Lấy ngẫu nhiên 1 viên bi. Xác suất để chọn được viên bi đỏ là:`,
              [`$\\frac{1}{2}$`, `$\\frac{2}{5}$`, `$\\frac{3}{5}$`, `$\\frac{1}{5}$`],
              `$\\frac{1}{2}$`,
              `Tổng số bi trong hộp là $5 + 5 = 10$ viên bi. Số kết quả thuận lợi (bi đỏ) là 5. Xác suất P = 5/10 = 1/2.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER IX: TAM GIÁC ĐỒNG DẠNG ---
      case 'tg-dong-dang': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Nếu tam giác A'B'C' đồng dạng với tam giác ABC theo tỉ số k = 3, thì tỉ số các cạnh tương ứng là:`,
            [`$3$`, `$1/3$`, `$9$`, `$6$`],
            `$3$`,
            `Tỉ số đồng dạng k chính là tỉ số độ dài các cạnh tương ứng: A'B'/AB = 3.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Nếu tam giác A'B'C' đồng dạng với tam giác ABC theo tỉ số k = 2, thì diện tích tam giác A'B'C' gấp mấy lần diện tích tam giác ABC?`,
            [`$4$`, `$2$`, `$8$`, `$1.5$`],
            `$4$`,
            `Tỉ số diện tích của hai tam giác đồng dạng bằng bình phương tỉ số đồng dạng: $S_{A'B'C'} / S_{ABC} = k^2 = 2^2 = 4$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Hãy chọn phát biểu SAI về tam giác đồng dạng:`,
              [`Hai tam giác bằng nhau thì không đồng dạng`, `Hai tam giác đều luôn luôn đồng dạng với nhau`, `Hai tam giác vuông cân luôn đồng dạng với nhau`, `Tính chất đồng dạng có tính bắc cầu`],
              `Hai tam giác bằng nhau thì không đồng dạng`,
              `Hai tam giác bằng nhau luôn đồng dạng với nhau theo tỉ số k = 1. Do đó phát biểu chúng không đồng dạng là sai.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC đồng dạng với tam giác MNP theo tỉ số $k_1 = 2$. Tam giác MNP đồng dạng with tam giác QRS theo tỉ số $k_2 = 3$. Tam giác ABC đồng dạng với tam giác QRS theo tỉ số nào?`,
              [`$6$`, `$5$`, `$1.5$`, `$2/3$`],
              `$6$`,
              `Theo tính chất bắc cầu, tỉ số đồng dạng tổng hợp bằng tích các tỉ số đồng dạng thành phần: $k = k_1 \\cdot k_2 = 2 \\cdot 3 = 6$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC đồng dạng với tam giác MNP theo tỉ số $k_1 = 1/2$. Tam giác MNP đồng dạng với tam giác QRS theo tỉ số $k_2 = 4$. Tam giác ABC đồng dạng với tam giác QRS theo tỉ số nào?`,
              [`$2$`, `$8$`, `$1/8$`, `$4.5$`],
              `$2$`,
              `Theo tính chất bắc cầu: $k = k_1 \\cdot k_2 = 1/2 \\cdot 4 = 2$.`
            ));
          }
        }
        break;
      }

      case 'tg-dong-dang-3-th': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Nếu hai tam giác có hai cặp góc tương ứng bằng nhau từng đôi một thì chúng đồng dạng theo trường hợp nào?`,
            [`Góc — Góc (g-g)`, `Cạnh — Góc — Cạnh (c-g-c)`, `Cạnh — Cạnh — Cạnh (c-c-c)`, `Hai góc vuông`],
            `Góc — Góc (g-g)`,
            `Theo hế quả lý thuyết góc, nếu hai góc của tam giác này bằng hai góc của tam giác kia thì hai tam giác đó đồng dạng (g-g).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hai tam giác ABC và MNP có $\\frac{AB}{MN} = \\frac{AC}{MP}$ và thêm góc $\\hat{A} = \\hat{M}$. Hai tam giác này đồng dạng theo trường hợp:`,
              [`Cạnh — Góc — Cạnh (c-g-c)`, `Góc — Góc (g-g)`, `Cạnh — Cạnh — Cạnh (c-c-c)`, `Không đồng dạng`],
              `Cạnh — Góc — Cạnh (c-g-c)`,
              `Trường hợp c-g-c: Hai cặp cạnh tương ứng tỉ lệ và góc xen giữa hai cạnh đó bằng nhau.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hai tam giác ABC và MNP có ba cặp cạnh tỉ lệ: $\\frac{AB}{MN} = \\frac{AC}{MP} = \\frac{BC}{NP}$. Hai tam giác này đồng dạng theo trường hợp nào?`,
              [`Cạnh — Cạnh — Cạnh (c-c-c)`, `Cạnh — Góc — Cạnh (c-g-c)`, `Góc — Góc (g-g)`, `Đồng dạng đặc biệt`],
              `Cạnh — Cạnh — Cạnh (c-c-c)`,
              `Trường hợp c-c-c: Ba cặp cạnh tương ứng tỉ lệ bằng nhau từng đôi một.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho hai tam giác ABC và MNP có hai cặp góc bằng nhau: $\\hat{A} = \\hat{M}$ và $\\hat{B} = \\hat{N}$. Hai tam giác này đồng dạng theo trường hợp nào?`,
              [`Góc — Góc (g-g)`, `Cạnh — Cạnh — Cạnh (c-c-c)`, `Cạnh — Góc — Cạnh (c-g-c)`, `Đồng dạng đặc biệt`],
              `Góc — Góc (g-g)`,
              `Trường hợp g-g: Hai cặp góc tương ứng bằng nhau từng đôi một.`
            ));
          }
        }
        break;
      }

      case 'pythagore': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Một tam giác vuông có hai cạnh góc vuông lần lượt là 3cm và 4cm. Tính độ dài cạnh huyền:`,
            [`$5\\text{ cm}$`, `$7\\text{ cm}$`, `$25\\text{ cm}$`, `$6\\text{ cm}$`],
            `$5\\text{ cm}$`,
            `Áp dụng định lý Pythagore: $cạnh\\,huyền^2 = 3^2 + 4^2 = 9 + 16 = 25 \\Rightarrow cạnh\\,huyền = 5\\text{ cm}$.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Một tam giác vuông có cạnh huyền dài 10cm và một cạnh góc vuông dài 8cm. Độ dài cạnh góc vuông còn lại là:`,
            [`$6\\text{ cm}$`, `$2\\text{ cm}$`, `$36\\text{ cm}$`, `$8\\text{ cm}$`],
            `$6\\text{ cm}$`,
            `Áp dụng Pythagore: $x^2 + 8^2 = 10^2 \\Rightarrow x^2 = 100 - 64 = 36 \\Rightarrow x = 6\\text{ cm}$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Độ dài bộ ba cạnh nào dưới đây cấu thành một tam giác vuông (theo Định lý Pythagore đảo)?`,
              [`5cm, 12cm, 13cm`, `3cm, 4cm, 6cm`, `4cm, 5cm, 6cm`, `2cm, 3cm, 4cm`],
              `5cm, 12cm, 13cm`,
              `Kiểm tra Pythagore đảo: $5^2 + 12^2 = 25 + 144 = 169 = 13^2$. Vậy đây đúng là tam giác vuông.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Độ dài bộ ba cạnh nào dưới đây cấu thành một tam giác vuông (theo Định lý Pythagore đảo)?`,
              [`6cm, 8cm, 10cm`, `3cm, 4cm, 6cm`, `5cm, 7cm, 9cm`, `2cm, 3cm, 4cm`],
              `6cm, 8cm, 10cm`,
              `Kiểm tra Pythagore đảo: $6^2 + 8^2 = 36 + 64 = 100 = 10^2$. Vậy đây đúng là tam giác vuông.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Độ dài bộ ba cạnh nào dưới đây cấu thành một tam giác vuông (theo Định lý Pythagore đảo)?`,
              [`8cm, 15cm, 17cm`, `3cm, 4cm, 6cm`, `4cm, 5cm, 6cm`, `2cm, 4cm, 5cm`],
              `8cm, 15cm, 17cm`,
              `Kiểm tra Pythagore đảo: $8^2 + 15^2 = 64 + 225 = 289 = 17^2$. Vậy đây đúng là tam giác vuông.`
            ));
          }
        }
        break;
      }

      case 'tg-vuong-dong-dang': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Để hai tam giác vuông đồng dạng, cần thêm chỉ tiêu điều kiện đơn giản nào?`,
            [`Có một cặp góc nhọn bằng nhau`, `Có chung cạnh huyền`, `Hai cạnh góc vuông bằng nhau`, `Có diện tích bằng nhau`],
            `Có một cặp góc nhọn bằng nhau`,
            `Vì hai tam giác đã sẵn có một góc vuông $90^\\circ$ bằng nhau, nên chỉ cần thêm một góc nhọn bằng nhau là đủ điều kiện đồng dạng (g-g).`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A có đường cao AH. Khi đó ta có cặp tam giác nào đồng dạng?`,
              [`$\\Delta HBA \\sim \\Delta HAC$`, `$\\Delta HBA = \\Delta HAC$`, `$\\Delta ABC \\sim \\Delta HAC$`, `Cả A và C đều đúng`],
              `Cả A và C đều đúng`,
              `Đường cao trong tam giác vuông chia tam giác đó thành hai tam giác vuông nhỏ đồng dạng với nhau và đồng dạng với tam giác lớn ban đầu.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A có đường cao AH. Khẳng định nào sau đây là ĐÚNG?`,
              [`$\\Delta HBA \\sim \\Delta ABC$`, `$\\Delta HBA = \\Delta ABC$`, `$\\Delta HAC = \\Delta ABC$`, `Không có tam giác nào đồng dạng`],
              `$\\Delta HBA \\sim \\Delta ABC$`,
              `Vì $\\hat{H} = \\hat{A} = 90^\\circ$ và tam giác HBA và ABC có chung góc nhọn B. Do đó $\\Delta HBA \\sim \\Delta ABC$ (g-g).`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Cho tam giác ABC vuông tại A có đường cao AH. Khẳng định nào sau đây là ĐÚNG?`,
              [`$\\Delta HAC \\sim \\Delta ABC$`, `$\\Delta HAC = \\Delta ABC$`, `$\\Delta HBA = \\Delta HAC$`, `Không có tam giác nào đồng dạng`],
              `$\\Delta HAC \\sim \\Delta ABC$`,
              `Vì $\\hat{H} = \\hat{A} = 90^\\circ$ và tam giác HAC và ABC có chung góc nhọn C. Do đó $\\Delta HAC \\sim \\Delta ABC$ (g-g).`
            ));
          }
        }
        break;
      }

      case 'hinh-dong-dang': {
        if (index <= 10) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Hình tròn bán kính $R_1 = 3\\text{ cm}$ và hình tròn bán kính $R_2 = 6\\text{ cm}$ có đồng dạng với nhau hay không?`,
            [`Luôn luôn đồng dạng với nhau`, `Không đồng dạng vì bán kính khác nhau`, `Chỉ đồng dạng khi đồng tâm`, `Chỉ đồng dạng khi tiếp xúc`],
            `Luôn luôn đồng dạng với nhau`,
            `Tất cả các hình tròn đều đồng dạng với nhau vì chúng có hình dạng giống nhau, chỉ khác nhau về kích cỡ tỉ số phóng to.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Hãy tìm khẳng định ĐÚNG khi nói về các hình đồng dạng phối cảnh (phép vị tự):`,
              [`Tâm phối cảnh có thể nằm trong, nằm ngoài hoặc trùng trên biên của hình`, `Hai hình đồng dạng phối cảnh có kích thước hoàn toàn bằng nhau`, `Góc nhọn bị phóng to`, `Cạnh bên luôn luôn vuông góc`],
              `Tâm phối cảnh có thể nằm trong, nằm ngoài hoặc trùng trên biên của hình`,
              `Phép đồng dạng phối cảnh định vị tỉ lệ phóng đều từ tâm chiếu xuyên qua, tâm đó có thể nằm bất kì vị trí nào trong mặt phẳng.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Nếu hai hình đồng dạng phối cảnh với nhau thì tỉ số khoảng cách giữa hai điểm bất kỳ của hình mới và hình cũ:`,
              [`Bằng tỉ số đồng dạng k`, `Bằng bình phương k`, `Luôn bằng 1`, `Thay đổi liên tục`],
              `Bằng tỉ số đồng dạng k`,
              `Trong phép đồng dạng phối cảnh, khoảng cách giữa hai điểm bất kỳ được phóng theo tỉ số đồng dạng $k$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Mọi cặp hình nào dưới đây luôn đồng dạng phối cảnh với nhau?`,
              [`Hai hình tròn bất kỳ`, `Hai tam giác vuông bất kỳ`, `Hai hình chữ nhật bất kỳ`, `Hai hình thoi bất kỳ`],
              `Hai hình tròn bất kỳ`,
              `Tất cả các hình tròn đều đồng dạng với nhau, và luôn có thể tìm được phép vị tự phù hợp biến đường tròn này thành đường tròn kia.`
            ));
          }
        }
        break;
      }

      // --- CHAPTER X: HÌNH KHỐI THỰC TIỄN ---
      case 'chop-tamgiac': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Mặt đáy của một hình chóp tam giác đều là hình gì?`,
            [`Hình tam giác đều`, `Hình tam giác vuông`, `Hình tam giác cân`, `Hình vuông`],
            `Hình tam giác đều`,
            `Theo định nghĩa trong SGK, hình chóp tam giác đều có mặt đáy là hình tam giác đều, các mặt bên là tam giác cân.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính diện tích xung quanh của một hình chóp tam giác đều có nửa chu vi đáy p = 15cm và độ dài trung đoạn d = 8cm:`,
            [`$120\\text{ cm}^2$`, `$240\\text{ cm}^2$`, `$60\\text{ cm}^2$`, `$30\\text{ cm}^2$`],
            `$120\\text{ cm}^2$`,
            `Công thức diện tích xung quanh chóp đều: $S_{xq} = p \\cdot d = 15 \\cdot 8 = 120\\text{ cm}^2$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khối chóp tam giác đều có diện tích mặt đáy bằng $24\\text{ cm}^2$ và chiều cao h bằng $10\\text{ cm}$. Thể tích V khối chóp bằng:`,
              [`$80\\text{ cm}^3$`, `$240\\text{ cm}^3$`, `$120\\text{ cm}^3$`, `$40\\text{ cm}^3$`],
              `$80\\text{ cm}^3$`,
              `Xài công thức: $V = \\frac{1}{3} \\cdot S_{đáy} \\cdot h = \\frac{1}{3} \\cdot 24 \\cdot 10 = 80\\text{ cm}^3$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khối chóp tam giác đều có diện tích mặt đáy bằng $30\\text{ cm}^2$ và chiều cao h bằng $12\\text{ cm}$. Thể tích V khối chóp bằng:`,
              [`$120\\text{ cm}^3$`, `$360\\text{ cm}^3$`, `$180\\text{ cm}^3$`, `$60\\text{ cm}^3$`],
              `$120\\text{ cm}^3$`,
              `Công thức: $V = \\frac{1}{3} \\cdot S_{đáy} \\cdot h = \\frac{1}{3} \\cdot 30 \\cdot 12 = 120\\text{ cm}^3$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Khối chóp tam giác đều có diện tích mặt đáy bằng $18\\text{ cm}^2$ và chiều cao h bằng $9\\text{ cm}$. Thể tích V khối chóp bằng:`,
              [`$54\\text{ cm}^3$`, `$162\\text{ cm}^3$`, `$81\\text{ cm}^3$`, `$27\\text{ cm}^3$`],
              `$54\\text{ cm}^3$`,
              `Công thức: $V = \\frac{1}{3} \\cdot S_{đáy} \\cdot h = \\frac{1}{3} \\cdot 18 \\cdot 9 = 54\\text{ cm}^3$.`
            ));
          }
        }
        break;
      }

      case 'chop-tugiac': {
        if (index <= 5) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Mặt bên của một hình chóp tứ giác đều là hình gì?`,
            [`Hình tam giác cân`, `Hình vuông`, `Hình chữ nhật`, `Hình tam giác đều`],
            `Hình tam giác cân`,
            `Trong hình chóp đều, các mặt bên luôn là tam giác cân có chung đỉnh.`
          ));
        } else if (index <= 12) {
          quizzes.push(createQuestion(
            lessonId, index, levelStr,
            `Tính thể tích hình chóp tứ giác đều có chiều cao h = 9cm và cạnh đáy hình vuông a = 4cm:`,
            [`$48\\text{ cm}^3$`, `$144\\text{ cm}^3$`, `$36\\text{ cm}^3$`, `$72\\text{ cm}^3$`],
            `$48\\text{ cm}^3$`,
            `Diện tích đáy hình vuông $S = a^2 = 16\\text{ cm}^2$. Thể tích $V = \\frac{1}{3} \\cdot 16 \\cdot 9 = 48\\text{ cm}^3$.`
          ));
        } else {
          if (index === 18) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính diện tích xung quanh của một hình chóp tứ giác đều có cạnh đáy a = 10cm và độ dài trung đoạn d = 12cm:`,
              [`$240\\text{ cm}^2$`, `$480\\text{ cm}^2$`, `$120\\text{ cm}^2$`, `$600\\text{ cm}^2$`],
              `$240\\text{ cm}^2$`,
              `Công thức $S_{xq} = p \\cdot d$ với nửa chu vi đáy $p = (4 \\cdot a) / 2 = 2 \\cdot a = 20\\text{ cm}$. Vậy $S_{xq} = 20 \\cdot 12 = 240\\text{ cm}^2$.`
            ));
          } else if (index === 19) {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính diện tích xung quanh của một hình chóp tứ giác đều có cạnh đáy a = 6cm và độ dài trung đoạn d = 10cm:`,
              [`$120\\text{ cm}^2$`, `$240\\text{ cm}^2$`, `$60\\text{ cm}^2$`, `$300\\text{ cm}^2$`],
              `$120\\text{ cm}^2$`,
              `Nửa chu vi đáy $p = (4 \\cdot 6) / 2 = 12\\text{ cm}$. Diện tích xung quanh: $S_{xq} = p \\cdot d = 12 \\cdot 10 = 120\\text{ cm}^2$.`
            ));
          } else {
            quizzes.push(createQuestion(
              lessonId, index, levelStr,
              `Tính diện tích xung quanh của một hình chóp tứ giác đều có cạnh đáy a = 8cm và độ dài trung đoạn d = 15cm:`,
              [`$240\\text{ cm}^2$`, `$480\\text{ cm}^2$`, `$120\\text{ cm}^2$`, `$360\\text{ cm}^2$`],
              `$240\\text{ cm}^2$`,
              `Nửa chu vi đáy $p = (4 \\cdot 8) / 2 = 16\\text{ cm}$. Diện tích xung quanh: $S_{xq} = p \\cdot d = 16 \\cdot 15 = 240\\text{ cm}^2$.`
            ));
          }
        }
        break;
      }

      default:
        // Generic fallback generator for remaining/undefined
        quizzes.push(createQuestion(
          lessonId, index, levelStr,
          `Câu hỏi tự ôn luyện kiến thức bài học: Cho biểu thức toán lớp 8 học tập. Hãy tìm lời giải phù hợp nhất?`,
          [`Đáp án Đúng`, `Đáp án B`, `Đáp án C`, `Đáp án D`],
          `Đáp án Đúng`,
          `Mô tả giải thích chi tiết cặn kẽ từng bước sư phạm giúp các em hiểu rõ hằng đẳng thức hoặc quy tắc toán học tương ứng.`
        ));
        break;
    }
  }

  return quizzes;
}
