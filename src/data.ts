import { Chapter } from './types';

export const CURRICULUM: Chapter[] = [
  {
    id: 'ch1',
    title: 'Chương I: Đa Thức',
    bookVolume: 1,
    lessons: [
      {
        id: 'don-thuc-nhieu-bien',
        title: 'Đơn thức nhiều biến',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 1',
        objective: 'Nhận biết đơn thức, đơn thức thu gọn; xác định hệ số, phần biến và bậc của đơn thức. Thực hiện cộng trừ đơn thức đồng dạng.',
        theory: [
          '1. Đơn thức: Là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến.',
          '2. Đơn thức thu gọn: Là đơn thức chỉ gồm tích của một số với các biến, mà mỗi biến đã được nâng lên lũy thừa với số mũ nguyên dương.',
          '3. Hệ số và phần biến: Trong đơn thức thu gọn, phần số gọi là hệ số, phần còn lại gọi là phần biến.',
          '4. Bậc của đơn thức: Tổng số mũ của tất cả các biến có trong đơn thức đó.'
        ],
        examples: [
          {
            problem: 'Thu gọn đơn thức sau và xác định hệ số, phần biến, bậc: $A = 2xy^2 \cdot (-3x^2y)$',
            solution: [
              'Nhân hệ số: $2 \cdot (-3) = -6$.',
              'Nhân phần biến: $x \cdot x^2 = x^3$, $y^2 \cdot y = y^3$.',
              'Kết quả thu gọn: $A = -6x^3y^3$.',
              'Đơn thức này có hệ số là $-6$, phần biến là $x^3y^3$ và bậc là $3 + 3 = 6$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch1-l1-q1',
            questionText: 'Trong các biểu thức sau, biểu thức nào là đơn thức nhiều biến?',
            options: [
              '$2x + 3y$',
              '$-5x^2y^3$',
              '$\frac{x+1}{y}$',
              '$x^2 - y^2$'
            ],
            correctAnswer: '$-5x^2y^3$',
            explanation: 'Đơn thức chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến. Biểu thức $-5x^2y^3$ là một tích các hằng số và biến số nên nó là đơn thức.'
          }
        ]
      },
      {
        id: 'da-thuc-nhieu-bien',
        title: 'Đa thức nhiều biến',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 2',
        objective: 'Nhận diện đa thức nhiều biến, hạng tử của đa thức; thực hiện thu gọn đa thức và xác định bậc của đa thức.',
        theory: [
          '1. Đa thức: Là tổng của những đơn thức. Mỗi đơn thức trong tổng gọi là một hạng tử của đa thức đó.',
          '2. Đa thức thu gọn: Là đa thức không còn chứa hai hạng tử nào đồng dạng với nhau.',
          '3. Bậc của đa thức: Bậc của hạng tử có bậc cao nhất trong dạng thu gọn của đa thức đó.'
        ],
        examples: [
          {
            problem: 'Thu gọn và tìm bậc của đa thức: $B = x^2y - 3xy^2 + 2x^2y + 5$',
            solution: [
              'Nhóm các hạng tử đồng dạng: $B = (x^2y + 2x^2y) - 3xy^2 + 5$.',
              'Thu gọn: $B = 3x^2y - 3xy^2 + 5$.',
              'Bậc của hạng tử $3x^2y$ là 3; $3xy^2$ là 3; số 5 có bậc là 0. Vậy bậc của đa thức $B$ là 3.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch1-l2-q1',
            questionText: 'Tìm bậc của đa thức $P = x^3y^2 - 2xy^3 + 3x^2y - x^3y^2 + 9$ sau khi thu gọn:',
            options: [
              '$5$',
              '$4$',
              '$3$',
              '$0$'
            ],
            correctAnswer: '$4$',
            explanation: 'Thu gọn đa thức ta được: $P = (x^3y^2 - x^3y^2) - 2xy^3 + 3x^2y + 9 = -2xy^3 + 3x^2y + 9$. Hạng tử có bậc cao nhất là $-2xy^3$ (bậc $1+3 = 4$). Nên bậc của đa thức $P$ và 4.'
          }
        ]
      },
      {
        id: 'da-thuc-cong-tru',
        title: 'Cộng và Trừ Đa thức',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 3',
        objective: 'Thực hiện thành thạo phép cộng và trừ hai đa thức bằng cách nhóm các hạng tử đồng dạng và thu gọn.',
        theory: [
          '1. Thu gọn đa thức: Nhóm các hạng tử đồng dạng với nhau rồi cộng các hệ số của chúng lại.',
          '2. Cộng hai đa thức: Viết tổng các hạng tử của hai đa thức đó rồi tiến hành thu gọn.',
          '3. Trừ hai đa thức: Đổi dấu tất cả các hạng tử của đa thức bị trừ, sau đó tiến hành cộng và thu gọn.'
        ],
        examples: [
          {
            problem: 'Thu gọn đa thức: A = x²y + 3xy² - 2x²y + xy² + 5',
            solution: [
              'Nhóm các hạng tử đồng dạng: A = (x²y - 2x²y) + (3xy² + xy²) + 5',
              'Cộng hệ số: A = -x²y + 4xy² + 5'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch1-q1',
            questionText: 'Tính tổng hai đa thức M = x + y và N = x - y:',
            options: [
              '2x',
              '2y',
              '2x + 2y',
              'x² - y²'
            ],
            correctAnswer: '2x',
            explanation: 'M + N = (x + y) + (x - y) = x + y + x - y = (x + x) + (y - y) = 2x.'
          }
        ]
      },
      {
        id: 'da-thuc-nhan',
        title: 'Phép nhân đa thức',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 4',
        objective: 'Thực hiện phép tính nhân đơn thức với đa thức và nhân đa thức với đa thức.',
        theory: [
          '1. Nhân đơn thức với đa thức: Ta nhân đơn thức với từng hạng tử của đa thức rồi cộng các tích lại với nhau.',
          'Formula: $A \cdot (B + C) = A \cdot B + A \cdot C$.',
          '2. Nhân đa thức với đa thức: Nhân mỗi hạng tử của đa thức này với từng hạng tử của đa thức kia rồi cộng các tích với nhau.',
          'Formula: $(A + B)(C + D) = AC + AD + BC + BD$.'
        ],
        examples: [
          {
            problem: 'Thực hiện phép tính: $C = (x + 3)(x - 2)$',
            solution: [
              'Nhân đa thức với đa thức: $C = x \cdot x + x \cdot (-2) + 3 \cdot x + 3 \cdot (-2)$.',
              'Thực hiện phép nhân: $C = x^2 - 2x + 3x - 6$.',
              'Thu gọn hạng tử đồng dạng: $C = x^2 + x - 6$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch1-l4-q1',
            questionText: 'Thực hiện phép nhân $x(2x - 3y)$ ta được kết quả là:',
            options: [
              '$2x^2 - 3xy$',
              '$2x^2 - 3y$',
              '$2x - 3xy$',
              '$2x^2 + 3xy$'
            ],
            correctAnswer: '$2x^2 - 3xy$',
            explanation: 'Ta nhân $x$ với từng hạng tử: $x \cdot 2x - x \cdot 3y = 2x^2 - 3xy$.'
          }
        ]
      },
      {
        id: 'da-thuc-chia',
        title: 'Phép chia đa thức cho đơn thức',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 5',
        objective: 'Hiểu điều kiện chia hết và thực hiện phép chia đơn thức cho đơn thức, đa thức cho đơn thức.',
        theory: [
          '1. Chia đơn thức cho đơn thức: Đơn thức A chia hết cho đơn thức B khi mọi biến của B đều là biến của A với số mũ không lớn hơn số mũ của nó trong A.',
          '2. Chia đa thức cho đơn thức: Ta chia từng hạng tử của đa thức cho đơn thức rồi cộng các kết quả thu được lại với nhau.',
          'Formula: $(A + B) : C = A:C + B:C$.'
        ],
        examples: [
          {
            problem: 'Tính phép chia: $D = (12x^3y^2 - 6x^2y^2) : 3x^2y$',
            solution: [
              'Chia từng hạng tử: $(12x^3y^2) : 3x^2y = 4xy$ và $(-6x^2y^2) : 3x^2y = -2y$.',
              'Cộng kết quả lại: $D = 4xy - 2y$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch1-l5-q1',
            questionText: 'Thực hiện phép tính $(8x^4y^3) : (2x^2y^2)$ được kết quả:',
            options: [
              '$4x^2y$',
              '$4xy^2$',
              '$4x^2$',
              '$4y$'
            ],
            correctAnswer: '$4x^2y$',
            explanation: '$(8 : 2) \cdot (x^4 : x^2) \cdot (y^3 : y^2) = 4x^2y$.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    title: 'Chương II: Hằng Đẳng Thức Đáng Nhớ',
    bookVolume: 1,
    lessons: [
      {
        id: 'hdt-binh-phuong',
        title: 'Bình phương của một Tổng và một Hiệu',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 6',
        objective: 'Nhận biết, ghi nhớ và biết cách áp dụng hằng đẳng thức bình phương của một tổng và một hiệu vào giải toán và tính nhanh.',
        theory: [
          '1. Bình phương của một tổng: Với hai biểu thức tùy ý A và B, ta có: (A + B)² = A² + 2AB + B²',
          '2. Bình phương của một hiệu: Với hai biểu thức tùy ý A và B, ta có: (A - B)² = A² - 2AB + B²',
          '3. Hiệu hai bình phương: Với hai biểu thức tùy ý A và B, ta có: A² - B² = (A - B)(A + B)'
        ],
        examples: [
          {
            problem: 'Khai triển biểu thức: (2x + y)²',
            solution: [
              'Áp dụng hằng đẳng thức bình phương của một tổng: (A + B)² = A² + 2AB + B²',
              'Đồng nhất: A = 2x, B = y',
              'Ta được: (2x + y)² = (2x)² + 2 · (2x) · y + y²',
              'Rút gọn: 4x² + 4xy + y²'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hdt-q1',
            questionText: '[Nhận biết — Dễ] Khai triển hằng đẳng thức $(x + 1)^2$ ta được kết quả là:',
            options: [
              '$x^2 + x + 1$',
              '$x^2 + 2x + 1$',
              '$x^2 + 2x + 2$',
              '$x^2 + 1$'
            ],
            correctAnswer: '$x^2 + 2x + 1$',
            explanation: 'Áp dụng công thức hằng đẳng thức $(A + B)^2 = A^2 + 2AB + B^2$ với $A = x, B = 1$. Ta có: $(x + 1)^2 = x^2 + 2 \\cdot x \\cdot 1 + 1^2 = x^2 + 2x + 1$.'
          },
          {
            id: 'hdt-q2',
            questionText: '[Nhận biết — Dễ] Khai triển hằng đẳng thức $(x - 5)^2$ ta được kết quả là:',
            options: [
              '$x^2 - 10x + 25$',
              '$x^2 - 5x + 25$',
              '$x^2 - 10x - 25$',
              '$x^2 - 25$'
            ],
            correctAnswer: '$x^2 - 10x + 25$',
            explanation: 'Áp dụng công thức $(A - B)^2 = A^2 - 2AB + B^2$ với $A = x$ và $B = 5$, ta được: $(x - 5)^2 = x^2 - 2 \\cdot x \\cdot 5 + 5^2 = x^2 - 10x + 25$.'
          }
        ]
      },
      {
        id: 'hdt-lap-phuong',
        title: 'Lập phương của một Tổng và một Hiệu',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 7',
        objective: 'Nắm vững công thức lập phương của một tổng và lập phương của một hiệu, biết phân tích các đa thức phức tạp.',
        theory: [
          '1. Lập phương của một tổng: Với hai biểu thức tùy ý A và B, ta có: (A + B)³ = A³ + 3A²B + 3AB² + B³',
          '2. Lập phương của một hiệu: Với hai biểu thức tùy ý A và B, ta có: (A - B)³ = A³ - 3A²B + 3AB² - B³',
          'Ví dụ tính chất: (B - A)³ = -(A - B)³'
        ],
        examples: [
          {
            problem: 'Khai triển biểu thức: (x + 2)³',
            solution: [
              'Áp dụng công thức lập phương của một tổng với A = x, B = 2:',
              '(x + 2)³ = x³ + 3 · x² · 2 + 3 · x · 2² + 2³',
              'Tính toán cơ bản: x³ + 6x² + 12x + 8.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hdt-q3',
            questionText: 'Tính nhanh kết quả biểu thức (a - 2b)³ khi khai triển:',
            options: [
              'a³ - 6a²b + 12ab² - 8b³',
              'a³ - 4a²b + 8ab² - 8b³',
              'a³ - 6a²b + 6ab² - 8b³',
              'a³ - 2a²b + 4ab² - 8b³'
            ],
            correctAnswer: 'a³ - 6a²b + 12ab² - 8b³',
            explanation: 'Sử dụng hằng đẳng thức (A - B)³ với A = a, B = 2b: (a - 2b)³ = a³ - 3 · a² · (2b) + 3 · a · (2b)² - (2b)³ = a³ - 6a²b + 12ab² - 8b³.'
          }
        ]
      },
      {
        id: 'hdt-tong-hieu-lap-phuong',
        title: 'Tổng và Hiệu hai Lập phương',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 8',
        objective: 'Nhận biết, ghi nhớ và biết cách biến đổi biểu thức dạng Tổng hai lập phương và Hiệu hai lập phương.',
        theory: [
          '1. Tổng hai lập phương: Với hai biểu thức tùy ý A và B, ta có: A³ + B³ = (A + B)(A² - AB + B²)',
          '2. Hiệu hai lập phương: Với hai biểu thức tùy ý A và B, ta có: A³ - B³ = (A - B)(A² + AB + B²)'
        ],
        examples: [
          {
            problem: 'Viết biểu thức x³ + 27 dưới dạng tích.',
            solution: [
              'Ta nhận thấy: 27 = 3³.',
              'Vậy x³ + 27 = x³ + 3³.',
              'Áp dụng hằng đẳng thức tổng hai lập phương với A = x, B = 3:',
              'x³ + 3³ = (x + 3)(x² - 3x + 3²) = (x + 3)(x² - 3x + 9).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hdt-q4',
            questionText: 'Rút gọn biểu thức sau bằng phương pháp hằng đẳng thức: (x - 2y)(x² + 2xy + 4y²)',
            options: [
              'x³ - 2y³',
              'x³ - 8y³',
              'x³ + 8y³',
              'x³ - 4y³'
            ],
            correctAnswer: 'x³ - 8y³',
            explanation: 'Đây chính là biểu thức khai triển của hiệu hai lập phương A³ - B³ với A = x, B = 2y. Ta có: (x - 2y)(x² + 2xy + (2y)²) = x³ - (2y)³ = x³ - 8y³.'
          }
        ]
      },
      {
        id: 'phan-tich-nhan-tu',
        title: 'Phân tích đa thức thành nhân tử',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 9',
        objective: 'Học cách biến đổi một đa thức thành một tích của những đơn thức và đa thức khác.',
        theory: [
          '1. Đặt nhân tử chung: Nhận thấy tất cả các hạng tử có thừa số chung thì đưa thừa số đó ra ngoài ngoặc.',
          '2. Dùng hằng đẳng thức: Áp dụng các công thức hằng đẳng thức đáng nhớ đã học.',
          '3. Nhóm hạng tử: Nhóm một cách thích hợp các hạng tử để làm xuất hiện nhân tử chung hoặc dùng hằng đẳng thức.'
        ],
        examples: [
          {
            problem: 'Phân tích đa thức thành nhân tử: $x^2 + 2x + 1 - y^2$',
            solution: [
              'Nhóm các hạng tử có dạng hằng đẳng thức: $(x^2 + 2x + 1) - y^2 = (x + 1)^2 - y^2$.',
              'Sử dụng hiệu hai bình phương: $(x + 1 - y)(x + 1 + y)$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch2-l9-q1',
            questionText: 'Phân tích biểu thức $3x^2 - 6x$ thành nhân tử được kết quả nào?',
            options: [
              '$3x(x - 2)$',
              '$3(x^2 - 2)$',
              '$x(3x - 6)$',
              '$3x(x + 2)$'
            ],
            correctAnswer: '$3x(x - 2)$',
            explanation: 'Cả hai hạng tử đều chứa nhân tử chung $3x$. Đặt $3x$ ra ngoài ta được $3x(x - 2)$.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    title: 'Chương III: Tứ Giác',
    bookVolume: 1,
    lessons: [
      {
        id: 'tu-giac-long',
        title: 'Tứ giác và Tổng các góc',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 10',
        objective: 'Hiêu định nghĩa tứ giác lồi và định lí tổng các góc trong một tứ giác bằng 360 độ.',
        theory: [
          '1. Tứ giác lồi: Là tứ giác luôn nằm trong một nửa mặt phẳng có bờ là đường thẳng chứa bất kì cạnh nào của tứ giác.',
          '2. Định lí tổng bốn góc: Trong một tứ giác, tổng bốn góc bằng 360°. Tổng góc A + B + C + D = 360°.'
        ],
        examples: [
          {
            problem: 'Tìm số đo góc D của tứ giác ABCD biết góc A = 80°, B = 100°, C = 70°',
            solution: [
              'Tổng bốn góc: A + B + C + D = 360°',
              'Thay số: 80° + 100° + 70° + D = 360° => 250° + D = 360°',
              'Kết luận: D = 360° - 250° = 110°'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch3-q1',
            questionText: 'Tổng số đo bốn góc ở các đỉnh của một tứ giác lồi bằng bao nhiêu?',
            options: [
              '180°',
              '360°',
              '270°',
              '540°'
            ],
            correctAnswer: '360°',
            explanation: 'Theo định lí tổng các góc của một tứ giác lồi, tổng số đo bằng 360° (tương đương với tổng góc của hai tam giác ghép lại).'
          }
        ]
      },
      {
        id: 'hinh-thang-can',
        title: 'Hình thang cân',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 11',
        objective: 'Biết định nghĩa hình thang, hình thang cân và các tính chất đặc trưng cùng dấu hiệu nhận biết.',
        theory: [
          '1. Hình thang: Là tứ giác có hai cạnh đối song song. Cạnh đáy song song, cạnh bên.',
          '2. Hình thang cân: Là hình thang có hai góc kề một đáy bằng nhau.',
          '3. Tính chất: Hai cạnh bên bằng nhau; Hai đường chéo bằng nhau.'
        ],
        examples: [
          {
            problem: 'Chứng minh hình thang cân ABCD (AB // CD) có hai góc kề đáy AD bằng nhau.',
            solution: [
              'Theo định nghĩa hình thang cân: góc C bằng góc D (ở đáy CD) và góc A bằng góc B (ở đáy AB).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch3-l11-q1',
            questionText: 'Tìm khẳng định SAI trong các khẳng định dưới đây về hình thang cân:',
            options: [
              'Hai đường chéo bằng nhau.',
              'Hai cạnh bên bằng nhau.',
              'Hai cạnh đáy bằng nhau.',
              'Hai góc kề một đáy bằng nhau.'
            ],
            correctAnswer: 'Hai cạnh đáy bằng nhau.',
            explanation: 'Trong hình thang cân, hai cạnh đáy thường không bằng nhau (nếu bằng nhau thì nó trở thành hình bình hành).'
          }
        ]
      },
      {
        id: 'hinh-binh-hang',
        title: 'Hình bình hành',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 12',
        objective: 'Sử dụng định nghĩa, tính chất và các dấu hiệu để nhận biết và giải các bài tập chứng minh hình bình hành.',
        theory: [
          '1. Định nghĩa: Hình bình hành là tứ giác có các cạnh đối song song.',
          '2. Tính chất: Các cạnh đối bằng nhau; các góc đối bằng nhau; hai đường chéo cắt nhau tại trung điểm của mỗi đường.'
        ],
        examples: [
          {
            problem: 'Cho tứ giác ABCD có AB = CD và AB // CD. Chứng minh ABCD là hình bình hành.',
            solution: [
              'Dấu hiệu nhận biết: Tứ giác có một cặp cạnh đối song song và bằng nhau là hình bình hành.',
              'Vì AB = CD và AB // CD, tứ giác ABCD là hình bình hành.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch3-l12-q1',
            questionText: 'Tính chất nào sau đây KHÔNG thuộc về hình bình hành?',
            options: [
              'Hai đường chéo bằng nhau.',
              'Các cạnh đối bằng nhau.',
              'Các góc đối bằng nhau.',
              'Hai đường chéo cắt nhau tại trung điểm mỗi đường.'
            ],
            correctAnswer: 'Hai đường chéo bằng nhau.',
            explanation: 'Hai đường chéo của hình bình hành thông thường không bằng nhau. Hai đường chéo bằng nhau là tính chất của hình chữ nhật hoặc hình thang cân.'
          }
        ]
      },
      {
        id: 'hinh-chu-nhat',
        title: 'Hình chữ nhật',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 13',
        objective: 'Nhận biết, vận dụng định nghĩa, đặc điểm tính chất và dấu hiệu chứng minh hình chữ nhật.',
        theory: [
          '1. Định nghĩa: Hình chữ nhật là tứ giác có bốn góc vuông.',
          '2. Tính chất: Có tất cả tính chất của hình bình hành và hình thang cân; hai đường chéo bằng nhau và cắt nhau tại trung điểm mỗi đường.'
        ],
        examples: [
          {
            problem: 'Chứng minh tứ giác có ba góc vuông là hình chữ nhật.',
            solution: [
              'Gọi tứ giác ABCD có $\\hat{A} = \\hat{B} = \\hat{C} = 90^o$.',
              'Tổng bốn góc là $360^o$ nên $\\hat{D} = 360^o - (90^o + 90^o + 90^o) = 90^o$.',
              'Tứ giác ABCD có 4 góc vuông nên là hình chữ nhật.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch3-l13-q1',
            questionText: 'Nếu một hình bình hành có hai đường chéo bằng nhau thì đó là hình gì?',
            options: [
              'Hình thoi',
              'Hình chữ nhật',
              'Hình thang cân',
              'Hình vuông'
            ],
            correctAnswer: 'Hình chữ nhật',
            explanation: 'Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật.'
          }
        ]
      },
      {
        id: 'hinh-thoi-vuong',
        title: 'Hình thoi và hình vuông',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 14',
        objective: 'Nắm vững định nghĩa và so sánh đặc tính đường chéo khác nhau giữa hình thoi và hình vuông.',
        theory: [
          '1. Hình thoi: Là tứ giác có bốn cạnh bằng nhau. Hai đường chéo vuông góc tại trung điểm của mỗi đường và là đường phân giác các góc.',
          '2. Hình vuông: Vừa là hình chữ nhật, vừa là hình thoi. Có bốn góc vuông và bốn cạnh bằng nhau.'
        ],
        examples: [
          {
            problem: 'Chứng minh hình thoi có một góc vuông là hình vuông.',
            solution: [
              'Hình thoi có bốn cạnh bằng nhau. Nếu có thêm một góc vuông $90^o$, do các góc kề một cạnh bù nhau nên các góc còn lại cũng là $90^o$. Vì vậy nó là hình vuông.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch3-l14-q1',
            questionText: 'Hình thoi cần thêm điều kiện nào sau đây để trở thành hình vuông?',
            options: [
              'Có hai đường chéo bằng nhau.',
              'Có hai đường chéo song song.',
              'Có bốn cạnh bằng nhau.',
              'Hai đường chéo vuông góc.'
            ],
            correctAnswer: 'Có hai đường chéo bằng nhau.',
            explanation: 'Hình thoi đã có hai đường chéo vuông góc. Nếu có thêm hai đường chéo bằng nhau, nó sẽ trở thành hình vuông.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    title: 'Chương IV: Định Lí Thalès',
    bookVolume: 1,
    lessons: [
      {
        id: 'thales-dinh-li',
        title: 'Định lí Thalès trong Tam giác',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 15',
        objective: 'Nắm vững định lí thuận và đảo của định lí Thalès, áp dụng để tính độ dài các đoạn thẳng tỉ lệ.',
        theory: [
          '1. Định lí Thalès thuận: Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tỉ lệ.',
          '  + Cho tam giác ABC, có đường thẳng song song với BC cắt AB tại D và AC tại E. Ta có: AD/AB = AE/AC hoặc AD/DB = AE/EC.',
          '2. Định lí Thalès đảo: Nếu một đường thẳng cắt hai cạnh và định ra các đoạn tỉ lệ thì nó song song với cạnh còn lại.'
        ],
        examples: [
          {
            problem: 'Cho ΔABC, DE || BC (D thuộc AB, E thuộc AC). Biết AD = 3cm, DB = 2cm, AE = 4.5cm. Tính EC.',
            solution: [
              'Áp dụng định lý Thalès: AD/DB = AE/EC',
              'Thay số: 3/2 = 4.5/EC',
              'Suy ra: EC = (2 · 4.5) / 3 = 9 / 3 = 3 cm'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch4-q1',
            questionText: 'Cho ΔABC có MN || BC (M thuộc AB, N thuộc AC). Tỉ lệ thức nào dưới đây là sai?',
            options: [
              'AM / MB = AN / NC',
              'AM / AB = AN / AC',
              'MB / AB = NC / AC',
              'AM / MB = NC / AN'
            ],
            correctAnswer: 'AM / MB = NC / AN',
            explanation: 'Theo định lý Thalès, ta phải có AM/MB = AN/NC. Cặp tỉ lệ này phải thẳng hàng đồng dạng, do đó phương án đảo ngược NC/AN là sai.'
          }
        ]
      },
      {
        id: 'duong-trung-binh',
        title: 'Đường trung bình của Tam giác',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 16',
        objective: 'Nhận biết đường trung bình của tam giác và ứng dụng tính chất của nó vào tính toán, chứng minh.',
        theory: [
          '1. Định nghĩa: Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.',
          '2. Tính chất: Đường trung bình song song với cạnh thứ ba và bằng nửa cạnh đó.',
          '  + Nếu MN là đường trung bình của ΔABC (M thuộc AB, N thuộc AC) => MN || BC và MN = BC / 2.'
        ],
        examples: [
          {
            problem: 'Cho tam giác ABC có chu vi là 18cm. Gọi M, N, P lần lượt là trung điểm của AB, AC, BC. Tính chu vi tam giác MNP.',
            solution: [
              'Ta có MN = BC/2, NP = AB/2, PM = AC/2 do tính chất đường trung bình.',
              'Chu vi ΔMNP = MN + NP + PM = BC/2 + AB/2 + AC/2 = (AB + BC + CA) / 2 = Chu vi ΔABC / 2',
              'Tính toán: 18 / 2 = 9 cm.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch4-q2',
            questionText: 'Cho tam giác ABC có BC = 12 cm. Độ dài đường trung bình MN song song với BC là:',
            options: [
              '6 cm',
              '24 cm',
              '12 cm',
              '8 cm'
            ],
            correctAnswer: '6 cm',
            explanation: 'Theo tính chất đường trung bình, MN = BC / 2 = 12 / 2 = 6 cm.'
          }
        ]
      },
      {
        id: 'duong-phan-giac',
        title: 'Tính chất đường phân giác của Tam giác',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 17',
        objective: 'Nhận biết, ghi nhớ và vận dụng tỉ số của các đoạn thẳng được tạo ra bởi tia phân giác của một góc trong tam giác.',
        theory: [
          '1. Định lí: Trong một tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn tỉ lệ với hai cạnh kề hai đoạn ấy.',
          '2. Hệ thức: Nếu AD là đường phân giác trong góc A của tam giác ABC ($D \\in BC$), ta luôn có: $\\frac{DB}{DC} = \\frac{AB}{AC}$.'
        ],
        examples: [
          {
            problem: 'Cho tam giác ABC có AB = 6cm, AC = 9cm và phân giác AD. Tính tỉ số BD/CD.',
            solution: [
              'Áp dụng tính chất đường phân giác góc A: BD/CD = AB/AC.',
              'Thay số: BD/CD = 6/9 = 2/3.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch4-l17-q1',
            questionText: 'Cho tam giác ABC có tia phân giác AM ($M \\in BC$). Khi đó tỉ số nào dưới đây là đúng?',
            options: [
              '$\\frac{MB}{MC} = \\frac{AB}{AC}$',
              '$\\frac{MB}{MC} = \\frac{AC}{AB}$',
              '$\\frac{MA}{MB} = \\frac{AC}{BC}$',
              '$\\frac{MC}{MB} = \\frac{AB}{AC}$'
            ],
            correctAnswer: '$\\frac{MB}{MC} = \\frac{AB}{AC}$',
            explanation: 'Theo tính chất đường phân giác, tỉ lệ thức đúng nhất là MB/MC = AB/AC.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch5',
    title: 'Chương V: Dữ Liệu và Biểu Đồ',
    bookVolume: 1,
    lessons: [
      {
        id: 'data-collect',
        title: 'Thu thập và Phân loại dữ liệu',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 18',
        objective: 'Tìm hiểu các phương pháp thu thập dữ liệu sơ cấp và thứ cấp; đồng thời phân loại số liệu rời rạc và liên tục.',
        theory: [
          '1. Phương pháp thu thập dữ liệu:',
          '  + Trực tiếp: Phỏng vấn, làm thí nghiệm, phiếu điều tra, quan sát và ghi chép.',
          '  + Gián tiếp: Tổng hợp từ Internet, niên giám thống kê, báo cáo của bộ ban ngành.',
          '2. Phân loại dữ liệu số:',
          '  + Số liệu rời rạc: Chỉ nhận các trị số đếm biệt lập (Ví dụ: số thành viên gia đình, số xe máy bán ra).',
          '  + Số liệu liên tục: Nhận mọi giá trị trong một khoảng liên tục (Ví dụ: chiều cao, nhiệt độ, lượng mưa).'
        ],
        examples: [
          {
            problem: 'Cho các loại dữ liệu sau: (a) Cân nặng của các bạn học sinh; (b) Số học sinh giỏi của từng khối. Hãy phân loại dữ liệu này.',
            solution: [
              '(a) Cân nặng có thể nhận mọi giá trị số thực dương lẻ như 45.2kg, 48.75kg... nên đây là số liệu liên tục.',
              '(b) Số học sinh giỏi bắt buộc là các số nguyên dương không âm (12, 13 học sinh...) nên đây là số liệu rời rạc.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'data-q1',
            questionText: 'Phương pháp nào sau đây là phương pháp thu thập dữ liệu trực tiếp?',
            options: [
              'Tìm kiếm dữ liệu trên trang web Tổng cục Thống kê',
              'Phát phiếu phiếu điều tra (hỏi ý kiến trực tiếp) cho học sinh',
              'Trích dẫn bảng vẽ từ một quyển sách giáo khoa cũ',
              'Đọc báo cáo tài chính của doanh nghiệp trên internet'
            ],
            correctAnswer: 'Phát phiếu phiếu điều tra (hỏi ý kiến trực tiếp) cho học sinh',
            explanation: 'Phát biểu phiếu điều tra trực tiếp hoặc thực hiện phỏng vấn tại chỗ là phương pháp thu thập dữ liệu gốc chủ động từ đối tượng nghiên cứu (sơ cấp).'
          }
        ]
      },
      {
        id: 'data-chart',
        title: 'Biểu diễn dữ liệu bằng Biểu đồ',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 19',
        objective: 'Lựa chọn và vẽ các loại biểu đồ cột kép, biểu đồ quạt tròn và biểu đồ đoạn thẳng để phản ánh chính xác nhất ý nghĩa số liệu.',
        theory: [
          '1. Biểu đồ cột / cột kép: Thích hợp so sánh quy mô hoặc giá trị của các đại lượng khác nhau.',
          '2. Biểu đồ hình quạt tròn: Phù hợp nhất để mô tả cơ cấu tỉ lệ phần trăm (%) của từng thành phần so với tổng thể.',
          '3. Biểu đồ đoạn thẳng: Công cụ tốt nhất để quan sát và biểu diễn xu hướng biến động theo thời gian liên tục.'
        ],
        examples: [
          {
            problem: 'Khi muốn làm báo cáo phân tích xu hướng tăng trưởng doanh thu cửa hàng qua các tháng 1, 2, 3, 4, ta nên chọn loại biểu đồ nào?',
            solution: [
              'Vì yêu cầu đại lượng biểu diễn thay đổi theo trục thời gian (các tháng liên tục) để chỉ ra xu hướng đi lên hay đi xuống, biểu đồ đoạn thẳng là sự lựa chọn hợp lý nhất.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'data-q2',
            questionText: 'Loại biểu đồ nào thích hợp nhất để biểu diễn tỉ lệ phần đóng góp (%) của từng khối lớp vào quỹ bảo vệ môi trường?',
            options: [
              'Biểu đồ cột kép',
              'Biểu đồ đoạn thẳng',
              'Biểu đồ hình quạt tròn',
              'Bảng số liệu dạng kẻ đường'
            ],
            correctAnswer: 'Biểu đồ hình quạt tròn',
            explanation: 'Biểu đồ hình quạt tròn tối ưu cho tỉ lệ %, giúp vẽ trực quan phần trăm diện tích của từng đối tượng so với tổng tròn 100%.'
          }
        ]
      },
      {
        id: 'data-analysis',
        title: 'Phân tích và Khai thác số liệu',
        subtitle: 'Sách giáo khoa Toán 8 Tập 1 - Bài 20',
        objective: 'Biết cách đọc biểu đồ, tính toán chênh lệch, so sánh các mốc và phát hiện những điểm dữ liệu bất thường hoặc sai lệch.',
        theory: [
          '1. Đọc và phân tích biểu đồ: Đọc kỹ tiêu đề biểu đồ, ghi chú các trục tọa độ hoặc chú thích màu của quạt tròn.',
          '2. Nhận xét tính hợp lý: Tổng các quạt tròn phần trăm cấu thành bắt buộc phải tròn trịa bằng 100%. Số học sinh không thể âm.'
        ],
        examples: [
          {
            problem: 'Một bạn học sinh lập biểu đồ quạt tròn về các phương tiện đi học: Xe đạp 40%, Xe bus 35%, Đi bộ 30%. Biểu đồ này có gì sai sót?',
            solution: [
              'Tổng phần trăm của các thành phần trong biểu đồ quạt tròn phải bằng 100%.',
              'Tuy nhiên, tổng ở đây là: 40% + 35% + 30% = 105% > 100%. Do đó, số liệu này chưa đúng và không hợp lệ.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'data-q3',
            questionText: 'Nếu doanh thu tháng 1 là 100 triệu, tháng 2 tăng vọt lên 150 triệu, thì doanh thu tháng 2 tăng bao nhiêu phần trăm so với tháng 1?',
            options: [
              '50%',
              '150%',
              '33.3%',
              '25%'
            ],
            correctAnswer: '50%',
            explanation: 'Tỷ lệ tăng trưởng bằng: (150 - 100) / 100 · 100% = 50%.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch6',
    title: 'Chương VI: Phân Thức Đại Số',
    bookVolume: 2,
    lessons: [
      {
        id: 'phan-thuc-dai-so',
        title: 'Khái niệm Phân thức đại số',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 21',
        objective: 'Hiểu định nghĩa phân thức đại số, điều kiện xác định và khái niệm hai phân thức bằng nhau.',
        theory: [
          '1. Định nghĩa: Phân thức đại số là biểu thức có dạng A / B, trong đó A, B là những đa thức và B phải khác đa thức 0. A được gọi là tử thức, B được gọi là mẫu thức.',
          '2. Hai phân thức bằng nhau: A / B = C / D nếu A · D = B · C.',
          '3. Điều kiện xác định: Mẫu thức B phải khác 0.'
        ],
        examples: [
          {
            problem: 'Tìm điều kiện xác định của phân thức: $\\frac{x + 1}{x - 2}$',
            solution: [
              'Để phân thức xác định, mẫu thức phải khác 0.',
              'Mẫu thức là x - 2.',
              'Do đó: x - 2 ≠ 0 => x ≠ 2.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch6-q1',
            questionText: 'Phân thức (x - 1) / (2x + 4) xác định khi nào?',
            options: [
              'x ≠ 1',
              'x ≠ -2',
              'x ≠ 2',
              'x ≠ 0'
            ],
            correctAnswer: 'x ≠ -2',
            explanation: 'Mẫu thức của phân thức là 2x + 4. Mẫu thức khác 0: 2x + 4 ≠ 0 => 2x ≠ -4 => x ≠ -2.'
          }
        ]
      },
      {
        id: 'phan-thuc-tinh-chat',
        title: 'Tính chất cơ bản của Phân thức đại số',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 22',
        objective: 'Làm quen các tính chất cơ bản, quy tắc rút gọn phân thức và phương pháp đổi dấu phân thức đại số.',
        theory: [
          '1. Tính chất cơ bản: Nhân hoặc chia cả tử và mẫu cho một đa thức khác 0: $\\frac{A}{B} = \\frac{A \\cdot M}{B \\cdot M}$ và $\\frac{A}{B} = \\frac{A : N}{B : N}$ (N là nhân tử chung).',
          '2. Quy tắc đổi dấu: Đổi dấu đồng thời cả tử và mẫu: $\\frac{A}{B} = \\frac{-A}{-B}$.'
        ],
        examples: [
          {
            problem: 'Rút gọn phân thức: $\\frac{x^2 - xy}{5x - 5y}$',
            solution: [
              'Phân tích tử: $x^2 - xy = x(x-y)$.',
              'Phân tích mẫu: $5x - 5y = 5(x-y)$.',
              'Rút gọn nhân tử chung $x-y$: Kết quả bằng $\\frac{x}{5}$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch6-l22-q1',
            questionText: 'Phân thức nào sau đây bằng với phân thức $\\frac{x - y}{y - x}$?',
            options: [
              '$-1$',
              '$1$',
              '$\\frac{x}{y}$',
              '$x - y$'
            ],
            correctAnswer: '$-1$',
            explanation: 'Ta có $y - x = -(x - y)$. Khi đó: $\\frac{x - y}{-(x - y)} = -1$.'
          }
        ]
      },
      {
        id: 'phan-thuc-cong-tru',
        title: 'Phép cộng và phép trừ Phân thức đại số',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 23',
        objective: 'Áp dụng quy đồng mẫu thức để cộng, trừ các phân thức cùng mẫu và khác mẫu thức.',
        theory: [
          '1. Cộng cùng mẫu: $\\frac{A}{M} + \\frac{B}{M} = \\frac{A + B}{M}$.',
          '2. Trừ phân thức: Cộng với phân thức đối: $\\frac{A}{B} - \\frac{C}{D} = \\frac{A}{B} + \\frac{-C}{D}$.',
          '3. Cộng khác mẫu: Quy đồng mẫu thức của các phân thức rồi cộng các phân thức cùng mẫu mới.'
        ],
        examples: [
          {
            problem: 'Tính tổng: $\\frac{1}{x} + \\frac{2}{x^2}$',
            solution: [
              'Mẫu thức chung (MTC): $x^2$.',
              'Quy đồng: $\\frac{1}{x} = \\frac{x}{x^2}$.',
              'Cộng hai phân thức: $\\frac{x}{x^2} + \\frac{2}{x^2} = \\frac{x+2}{x^2}$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch6-l23-q1',
            questionText: 'Thực hiện phép tính $\\frac{x}{x+1} + \\frac{1}{x+1}$ kết quả là:',
            options: [
              '$1$',
              '$x$',
              '$\\frac{x+1}{2x+2}$',
              '$\\frac{1}{x+1}$'
            ],
            correctAnswer: '$1$',
            explanation: 'Do cùng mẫu thức dồi dào, ta cộng các tử thức: $\\frac{x + 1}{x + 1} = 1$.'
          }
        ]
      },
      {
        id: 'phan-thuc-nhan-chia',
        title: 'Phép nhân và phép chia Phân thức đại số',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 24',
        objective: 'Thực hiện phép nhân và phép chia phân thức bằng phép biến đổi phân thức nghịch đảo.',
        theory: [
          '1. Phép nhân: $\\frac{A}{B} \\cdot \\frac{C}{D} = \\frac{A \\cdot C}{B \\cdot D}$.',
          '2. Phép chia: Nhân với phân thức nghịch đảo: $\\frac{A}{B} : \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C}$ (với $C \\neq 0$).'
        ],
        examples: [
          {
            problem: 'Tính phép tính: $\\frac{2x}{y^2} \\cdot \\frac{y}{x^2}$',
            solution: [
              'Nhân tử và mẫu: $\\frac{2x \\cdot y}{y^2 \\cdot x^2}$.',
              'Rút gọn nhân tử chung $xy$:$\\frac{2}{xy}$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch6-l24-q1',
            questionText: 'Rút gọn kết quả phép chia $\\frac{x^2}{3} : \\frac{x}{6}$:',
            options: [
              '$2x$',
              '$\\frac{x}{2}$',
              '$\\frac{x^3}{18}$',
              '$6x$'
            ],
            correctAnswer: '$2x$',
            explanation: 'Nghịch đảo và nhân: $\\frac{x^2}{3} \\cdot \\frac{6}{x} = \\frac{6x^2}{3x} = 2x$.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch7',
    title: 'Chương VII: Phương Trình Bậc Nhất Một Ẩn và Hàm Số Bậc Nhất',
    bookVolume: 2,
    lessons: [
      {
        id: 'pt-bac-nhat',
        title: 'Phương trình bậc nhất một ẩn',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 25',
        objective: 'Tìm hiểu định nghĩa phương trình bậc nhất một ẩn, quy tắc chuyển vế, quy tắc nhân và cách giải phương trình.',
        theory: [
          '1. Định nghĩa: Phương trình có dạng ax + b = 0, với a và b là hai số đã cho và a ≠ 0, được gọi là phương trình bậc nhất một ẩn.',
          '2. Quy tắc chuyển vế: Khi chuyển một hạng tử từ vế này sang vế kia của một phương trình, ta phải đổi dấu hạng tử đó.',
          '3. Cách giải phương trình ax + b = 0 (a ≠ 0): ax = -b => x = -b/a.'
        ],
        examples: [
          {
            problem: 'Giải phương trình: 3x - 12 = 0',
            solution: [
              'Chuyển hạng tử -12 sang vế phải: 3x = 12',
              'Chia cả hai vế cho 3: x = 12 / 3',
              'Kết luận nghiệm: x = 4'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch7-q1',
            questionText: 'Giải phương trình bậc nhất: 2x + 6 = 0:',
            options: [
              'x = 3',
              'x = -3',
              'x = -6',
              'x = 2'
            ],
            correctAnswer: 'x = -3',
            explanation: 'Giải: 2x + 6 = 0 => 2x = -6 => x = -6 / 2 = -3. Nghiệm là x = -3.'
          }
        ]
      },
      {
        id: 'pt-giai-toan',
        title: 'Giải bài toán bằng cách lập phương trình',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 26',
        objective: 'Tự tin giải quyết các bài toán đố thực tế qua ba bước lập và giải phương trình bậc nhất.',
        theory: [
          'Bước 1: Lập phương trình: Chọn ẩn số và đặt điều kiện; Biểu diễn các đại lượng chưa biết theo ẩn; Lập phương trình.',
          'Bước 2: Giải phương trình vừa lập được.',
          'Bước 3: Trả lời: Xem xét sự phù hợp thực tế của nghiệm rồi kết luận.'
        ],
        examples: [
          {
            problem: 'Tổng của hai số là 15. Số lớn gấp đôi số bé. Tìm hai số đó.',
            solution: [
              'Gọi số bé là $x$. Khi đó số lớn là $2x$.',
              'Ta có phương trình: $x + 2x = 15 \\Rightarrow 3x = 15 \\Rightarrow x = 5$.',
              'Vậy số bé là 5, số lớn là 10.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch7-l26-q1',
            questionText: 'Nếu gọi sản lượng lúa năm ngoái là x (tấn, x > 0). Sản lượng năm nay tăng 10% tức là tăng bao nhiêu theo x?',
            options: [
              '$0.1x$',
              '$1.1x$',
              '$10x$',
              '$x + 10$'
            ],
            correctAnswer: '$0.1x$',
            explanation: 'Tăng 10% của sản lượng cũ x, tức là lượng lúa tăng thêm bằng $10\\% \\cdot x = 0.1x$ tấn.'
          }
        ]
      },
      {
        id: 'hamso-khainiem',
        title: 'Khái niệm Hàm số và Đồ thị',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 27',
        objective: 'Tìm hiểu định nghĩa của hàm số, các cách biểu diễn hàm số (bảng, công thức) và biểu diễn điểm trên mặt phẳng Oxy.',
        theory: [
          '1. Định nghĩa hàm số: Nếu đại lượng y phụ thuộc vào đại lượng thay đổi x sao cho với mỗi giá trị của x, ta luôn tìm được duy nhất một giá trị tương ứng của y thì y được gọi là hàm số của x (x là biến số).',
          '2. Ký hiệu: y = f(x) hoặc y = g(x).',
          '3. Đồ thị hàm số: Tập hợp tất cả các điểm biểu diễn các cặp giá trị tương ứng (x; y) trên mặt phẳng Oxy chính là đồ thị.'
        ],
        examples: [
          {
            problem: 'Cho hàm số y = f(x) = 2x - 3. Tính f(0) và f(2)?',
            solution: [
              'Với x = 0 thay vào công thức: f(0) = 2 · 0 - 3 = -3.',
              'Với x = 2 thay vào công thức: f(2) = 2 · 2 - 3 = 4 - 3 = 1.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hsb-q2',
            questionText: 'Cho hàm số y = -2x. Điểm nào sau đây thuộc đồ thị hàm số?',
            options: [
              'A(1; 2)',
              'B(-1; 2)',
              'C(0; 2)',
              'D(2; -1)'
            ],
            correctAnswer: 'B(-1; 2)',
            explanation: 'Thay tọa độ điểm B(-1; 2) vào: x = -1 => y = -2 · (-1) = 2 (Đúng). Do đó điểm B thuộc đồ thị.'
          }
        ]
      },
      {
        id: 'hamso-bacnhat',
        title: 'Hàm số bậc nhất y = ax + b',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 28',
        objective: 'Hiểu định nghĩa hàm số bậc nhất y = ax + b (a ≠ 0), và cách xác định vẽ đồ thị đường thẳng đại diện.',
        theory: [
          '1. Định nghĩa: Hàm số bậc nhất là hàm số được cho bởi công thức y = ax + b trong đó a, b là các số cho trước và a ≠ 0.',
          '2. Cách vẽ đồ thị y = ax + b (a ≠ 0): Lấy 2 điểm giao trục tung A(0;b) và giao trục hoành B(-b/a; 0) rồi vẽ đường thẳng đi qua 2 điểm.'
        ],
        examples: [
          {
            problem: 'Cho hàm số y = 2x + 1. Tìm toạ độ giao điểm của đồ thị hàm số với trục tung Oy.',
            solution: [
              'Giao với trục Oy tức là x = 0.',
              'Thế x = 0 vào công thức ta được: y = 2 · 0 + 1 = 1.',
              'Vậy toạ độ giao điểm là (0; 1).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch7-l28-q1',
            questionText: 'Trong các hàm số sau, hàm số nào là hàm số bậc nhất một ẩn?',
            options: [
              '$y = 2x - 1$',
              '$y = x^2 + 1$',
              '$y = \\frac{1}{x}$',
              '$y = 0x + 3$'
            ],
            correctAnswer: '$y = 2x - 1$',
            explanation: 'Hàm số bậc nhất có dạng $y = ax + b$ với $a \\neq 0$. Biểu thức $y = 2x - 1$ thỏa mãn với $a = 2 \\neq 0$.'
          }
        ]
      },
      {
        id: 'hamso-hesogoc',
        title: 'Hệ số góc và Vị trí tương đối',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 29',
        objective: 'Xác định hệ số góc và tìm hiểu điều kiện song song, cắt nhau, trùng nhau giữa các đường thẳng trong mặt phẳng tọa độ.',
        theory: [
          'Cho hai đường thẳng bậc nhất: (d): y = ax + b (a ≠ 0) và (d\'): y = a\'x + b\' (a\' ≠ 0).',
          '1. Hệ số a gọi là hệ số góc của đường thẳng d: y = ax + b.',
          '2. Đường thẳng (d) song song với (d\') khi: a = a\' và b ≠ b\'.',
          '3. Đường thẳng (d) cắt đường thẳng (d\') khi: a ≠ a\'.'
        ],
        examples: [
          {
            problem: 'Xác định m để đường thẳng y = (m - 1)x + 2 song song với đường thẳng y = 3x - 4.',
            solution: [
              'Đồng nhất hệ số: a = m - 1; b = 2 và a\' = 3; b\' = -4.',
              'Để hai đường thẳng song song, ta cần: a = a\' và b ≠ b\'.',
              'Do b = 2 ≠ b\' = -4 (đã thỏa mãn), ta chỉ cần giải: m - 1 = 3 => m = 4.',
              'Kết luận: m = 4.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'hsb-q3',
            questionText: 'Đường thẳng nào song song với y = -4x + 1 trong các phương án sau?',
            options: [
              'y = 4x - 1',
              'y = -4x + 3',
              'y = -4x + 1',
              'y = 0.5x + 1'
            ],
            correctAnswer: 'y = -4x + 3',
            explanation: 'Để song song, ta phải có chung hệ số góc a = a\' = -4 và hệ số tự do b ≠ b\' (1 ≠ 3). Vậy y = -4x + 3 là đáp án chính xác.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch8',
    title: 'Chương VIII: Mở Đầu Về Tính Xác Suất Của Biến Cố',
    bookVolume: 2,
    lessons: [
      {
        id: 'xs-ket-qua',
        title: 'Kết quả có thể và kết quả thuận lợi',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 30',
        objective: 'Nhận biết các kết quả có thể và phân loại các kết quả thuận lợi cho một biến cố cụ thể.',
        theory: [
          '1. Kết quả có thể: Tất cả các kết quả xảy ra trong phép thử.',
          '2. Kết quả thuận lợi: Các kết quả của phép thử làm cho biến cố được thực hiện.'
        ],
        examples: [
          {
            problem: 'Tung con xúc xắc 6 mặt, liệt kê kết quả thuận lợi cho biến cố: "Số chấm xuất hiện chia hết cho 3".',
            solution: [
              'Phép thử có các số chấm từ 1 đến 6.',
              'Các số chấm chia hết cho 3 trong khoảng này là: 3 và 6.',
              'Vậy có 2 kết quả thuận lợi.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch8-l30-q1',
            questionText: 'Trong phép thử gieo một đồng xu 2 mặt cân đối, có bao nhiêu kết quả có thể xảy ra?',
            options: [
              '$1$',
              '$2$',
              '$3$',
              '$4$'
            ],
            correctAnswer: '$2$',
            explanation: 'Gieo đồng xu chỉ có hai kết quả có thể xảy ra là mặt Sấp (S) hoặc mặt Ngửa (N).'
          }
        ]
      },
      {
        id: 'xs-tinh-toan',
        title: 'Cách tính Xác suất của biến cố',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 31',
        objective: 'Biết cách tính xác suất của biến cố một cách khoa học bằng phương pháp lập tỉ số.',
        theory: [
          'Công thức: Xác suất của biến cố A là: $P(A) = \\frac{\\text{Số kết quả thuận lợi}}{\\text{Tổng số kết quả có thể}} = \\frac{k}{n}$.'
        ],
        examples: [
          {
            problem: 'Lấy ngẫu nhiên một quả cầu từ hộp có 3 quả xanh và 2 quả đỏ. Tính xác suất lấy được quả xanh.',
            solution: [
              'Tổng số quả cầu là: $3 + 2 = 5$.',
              'Số kết quả thuận lợi (quả màu xanh) là 3.',
              'Xác suất lấy được quả cầu xanh là $\\frac{3}{5} = 0.6$.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch8-l31-q1',
            questionText: 'Gieo một con xúc xắc 6 mặt cân đối. Xác suất xuất hiện mặt có số chấm lẻ là:',
            options: [
              '$\\frac{1}{2}$',
              '$\\frac{1}{3}$',
              '$\\frac{1}{6}$',
              '$\\frac{2}{3}$'
            ],
            correctAnswer: '$\\frac{1}{2}$',
            explanation: 'Tổng số chấm là 6. Các chấm lẻ là 1, 3, 5 (tức là có 3 kết quả thuận lợi). Xác suất bằng $\\frac{3}{6} = \\frac{1}{2}$.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch9',
    title: 'Chương IX: Tam Giác Đồng Dạng',
    bookVolume: 2,
    lessons: [
      {
        id: 'tg-dong-dang',
        title: 'Khái niệm hai Tam giác đồng dạng',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 32',
        objective: 'Hiểu định nghĩa hai tam giác đồng dạng, tỉ số đồng dạng và tính chất bắc cầu.',
        theory: [
          '1. Định nghĩa: Tam giác A\'B\'C\' gọi là đồng dạng với tam giác ABC nếu: các góc tương ứng bằng nhau (A\' = A, B\' = B, C\' = C) và các cạnh tương ứng tỉ lệ (A\'B\'/AB = B\'C\'/BC = C\'A\'/CA = k).',
          '2. Ký hiệu: ΔA\'B\'C\' ∽ ΔABC. Số k được gọi là tỉ số đồng dạng.'
        ],
        examples: [
          {
            problem: 'Nếu ΔA\'B\'C\' ∽ ΔABC với tỉ số k = 1/2 thì chu vi của ΔA\'B\'C\' như thế nào so với chu vi ΔABC?',
            solution: [
              'Chúng ta có các cạnh: A\'B\' = k·AB, B\'C\' = k·BC, C\'A\' = k·CA.',
              'Chu vi ΔA\'B\'C\' = A\'B\' + B\'C\' + C\'A\' = k(AB + BC + CA) = k · Chu vi ΔABC.',
              'Vì k = 1/2, chu vi ΔA\'B\'C\' bằng một nửa chu vi ΔABC.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch9-q1',
            questionText: 'Nếu ΔA\'B\'C\' ∽ ΔABC với tỉ số đồng dạng k = 3, thì diện tích ΔA\'B\'C\' gấp mấy lần diện tích ΔABC?',
            options: [
              '3 lần',
              '6 lần',
              '9 lần',
              '1.5 lần'
            ],
            correctAnswer: '9 lần',
            explanation: 'Tỉ số diện tích của hai tam giác đồng dạng bằng bình phương tỉ số đồng dạng: S\' / S = k² = 3² = 9. Diện tích gấp 9 lần.'
          }
        ]
      },
      {
        id: 'tg-dong-dang-3-th',
        title: 'Ba trường hợp đồng dạng của hai Tam giác',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 33',
        objective: 'Phân tích và chứng minh hai tam giác đồng dạng qua ba trường hợp: C.C.C, C.G.C, G.G.',
        theory: [
          '1. Trường hợp 1 (C.C.C): Nếu ba cạnh của tam giác này tỉ lệ với ba cạnh của tam giác kia.',
          '2. Trường hợp 2 (C.G.C): Nếu hai cạnh của tam giác này tỉ lệ với hai cạnh của tam giác kia và góc xen giữa bằng nhau.',
          '3. Trường hợp 3 (G.G): Nếu hai góc của tam giác này lần lượt bằng hai góc của tam giác kia.'
        ],
        examples: [
          {
            problem: 'Chứng minh ΔABC đồng dạng với ΔA\'B\'C\' khi biết góc A = A\', và AB/A\'B\' = AC/A\'C\' = 2.',
            solution: [
              'Do góc A = A\' (đồng cụ góc kẹp) và hai cạnh kẹp xung quanh tỉ lệ đều bằng 2, áp dụng trường hợp đồng dạng C.G.C suy ra hai tam giác đồng dạng.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch9-l33-q1',
            questionText: 'Chỉ cần chứng minh hai góc tương ứng của hai tam giác bằng nhau thì hai tam giác đồng dạng theo trường hợp gì?',
            options: [
              'Góc - Góc (g-g)',
              'Cạnh - Cạnh - Cạnh (c-c-c)',
              'Cạnh - Góc - Cạnh (c-g-c)',
              'Cạnh huyền - Cạnh góc vuông'
            ],
            correctAnswer: 'Góc - Góc (g-g)',
            explanation: 'Theo định lí, nếu hai góc của tam giác này bằng hai góc của tam giác kia thì hai tam giác đó đồng dạng (trường hợp g-g).'
          }
        ]
      },
      {
        id: 'pythagore',
        title: 'Định lý Pythagore và ứng dụng',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 34',
        objective: 'Áp dụng thuần thục định lý Pythagore thuận và đảo để tính độ dài cạnh và chứng minh tam giác vuông.',
        theory: [
          '1. Định lý thuận: Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng bình phương của hai cạnh góc vuông.',
          '  + ΔABC vuông tại A => BC² = AB² + AC².',
          '2. Định lý đảo: Nếu một tam giác có bình phương của một cạnh bằng tổng các bình phương của hai cạnh kia thì tam giác đó là tam giác vuông.',
          '  + Nếu ΔABC có BC² = AB² + AC² => ΔABC vuông tại A.'
        ],
        examples: [
          {
            problem: 'Tính độ dài cạnh huyền của một tam giác vuông có hai cạnh góc vuông là 5 cm và 12 cm.',
            solution: [
              'Gọi c là độ dài cạnh huyền. Áp dụng định lý Pythagore:',
              'c² = 5² + 12² = 25 + 144 = 169.',
              'Suy ra c = √169 = 13 cm.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'geo-q2',
            questionText: 'Một tam giác vuông có một cạnh góc vuông là 9 cm và cạnh huyền là 15 cm. Tính cạnh góc vuông còn lại.',
            options: [
              '12 cm',
              '10 cm',
              '8 cm',
              '11 cm'
            ],
            correctAnswer: '12 cm',
            explanation: 'Gọi x là độ dài cạnh cần tìm. Ta có: x² + 9² = 15² => x² + 81 = 225 => x² = 144 => x = 12 cm.'
          }
        ]
      },
      {
        id: 'tg-vuong-dong-dang',
        title: 'Các trường hợp đồng dạng của Tam giác vuông',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 35',
        objective: 'Sử dụng các dấu hiệu đồng dạng đặc biệt của góc vuông và tỉ số cạnh tương ứng cho tam giác vuông.',
        theory: [
          '1. Định lí 1: Tam giác vuông này có một góc nhọn bằng góc nhọn của tam giác vuông kia thì đồng dạng.',
          '2. Định lí 2: Tam giác vuông này có hai cạnh góc vuông tỉ lệ với hai cạnh góc vuông của tam giác vuông kia thì đồng dạng.',
          '3. Định lí 3: Cạnh huyền và một cạnh góc vuông tỷ lệ với nhau.'
        ],
        examples: [
          {
            problem: 'Cho tam giác ABC vuông tại A có AB = 3cm, AC = 4cm. Tam giác MNP vuông tại M có MN = 6cm, MP = 8cm. Chứng minh hai tam giác đồng dạng.',
            solution: [
              'Ta có góc A = góc M = $90^o$. Tỉ số cạnh góc vuông: AB/MN = 3/6 = 1/2 và AC/MP = 4/8 = 1/2.',
              'Do đó AB/MN = AC/MP. Vậy tam giác ABC đồng dạng tam giác MNP (Trường hợp C.G.C).'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch9-l35-q1',
            questionText: 'Nếu hai tam giác vuông có tỉ số cạnh huyền bằng tỉ số của một cặp cạnh góc vuông thì chúng đồng dạng theo trường hợp nào?',
            options: [
              'Cạnh huyền - Cạnh góc vuông',
              'Góc - Góc (g-g)',
              'Hai cạnh góc vuông bằng nhau',
              'Không đồng dạng'
            ],
            correctAnswer: 'Cạnh huyền - Cạnh góc vuông',
            explanation: 'Đây chính là dấu hiệu đồng dạng thứ ba đặc biệt dành riêng cho tam giác vuông.'
          }
        ]
      },
      {
        id: 'hinh-dong-dang',
        title: 'Hình đồng dạng',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 36',
        objective: 'Tìm hiểu khái niệm chung của hình đồng dạng và nhận diện hình đồng dạng phối cảnh.',
        theory: [
          '1. Tập hợp các hình có thiết kế giống nhau về hình dạng nhưng kích thước phóng to, thu nhỏ đều đặn được gọi là hình đồng dạng.',
          '2. Hình đồng dạng phối cảnh (phép vị tự): Trình bày các điểm chiếu tỉ mỉ.'
        ],
        examples: [
          {
            problem: 'Nêu hai ví dụ thực tế về hình đồng dạng.',
            solution: [
              'Ví dụ 1: Chiếc lá bồ đề mẫu lớn và hình thu nhỏ của nó trên ảnh chụp.',
              'Ví dụ 2: Hai khuôn mẫu hình vuông khác nhau về kích cỡ diện tích.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'ch9-l36-q1',
            questionText: 'Tập hợp các hình tròn có luôn đồng dạng với nhau không?',
            options: [
              'Luôn đồng dạng với nhau.',
              'Chỉ đồng dạng khi có chung bán kính.',
              'Không bao giờ đồng dạng.',
              'Chỉ đồng dạng khi đồng tâm.'
            ],
            correctAnswer: 'Luôn đồng dạng với nhau.',
            explanation: 'Các hình tròn luôn có chung hình dạng (vành tròn khép kín hoàn chỉnh), chỉ khác nhau về tỉ lệ bán kính phóng to phân định. Chúng luôn đồng dạng với nhau.'
          }
        ]
      }
    ]
  },
  {
    id: 'ch10',
    title: 'Chương X: Hình Khối Trong Thực Tiễn',
    bookVolume: 2,
    lessons: [
      {
        id: 'chop-tamgiac',
        title: 'Hình chóp Tam giác đều',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 37',
        objective: 'Nhận diện cấu tạo hình chóp tam giác đều. Tính diện tích xung quanh, trung đoạn d và thể tích hình chóp.',
        theory: [
          '1. Đặc điểm cấu hình hình chóp tam giác đều:',
          '  - Mặt đáy là tam giác đều.',
          '  - Tất cả các mặt bên là tam giác cân bằng nhau có chung đỉnh.',
          '  - Chiều cao h hạ từ đỉnh chóp đến trực tâm O của tam giác đều đáy.',
          '  - Trung đoạn d là đường cao hạ từ đỉnh chóp của mỗi mặt bên tam giác cân.',
          '2. Công thức tính toán:',
          '  - Diện tích xung quanh: S_xq = p · d (với p là nửa chu vi đáy, d là trung đoạn).',
          '  - Thể tích: V = (1/3) · S_đáy · h (với S_đáy là diện tích mặt đáy tam giác đều, h là chiều cao hình chóp).'
        ],
        examples: [
          {
            problem: 'Tính diện tích xung quanh của hình chóp tam giác đều có nửa chu vi đáy là 12 cm và độ dài trung đoạn d = 8 cm.',
            solution: [
              'Áp dụng công thức S...xq = p · d:',
              'S_xq = 12 · 8 = 96 cm².'
            ]
          }
        ],
        quizzes: [
          {
            id: 'geo-q3',
            questionText: 'Một hình chóp tam giác đều có diện tích đáy bằng 30 cm² và thể tích 90 cm³. Chiều cao của hình chóp ấy là:',
            options: [
              '3 cm',
              '9 cm',
              '6 cm',
              '12 cm'
            ],
            correctAnswer: '9 cm',
            explanation: 'Ta có V = (1/3) · S_đáy · h => 90 = (1/3) · 30 · h => 90 = 10 · h => h = 9 cm.'
          }
        ]
      },
      {
        id: 'chop-tugiac',
        title: 'Hình chóp Tứ giác đều',
        subtitle: 'Sách giáo khoa Toán 8 Tập 2 - Bài 38',
        objective: 'Nhận biết hình tháp chóp tứ giác đều và học cách tính toán diện tích mặt xung quanh, trung đoạn và thể tích hữu hạn.',
        theory: [
          '1. Đặc điểm cấu hình hình chóp tứ giác đều:',
          '  - Mặt đáy là hình vuông cạnh có chiều dài a.',
          '  - Bốn mặt bên là tam giác cân đều nối từ đỉnh chóp.',
          '  - Trung đoạn d là đường cao vẽ từ đỉnh chóp của mỗi mặt bên tam giác cân.',
          '2. Công thức tính toán:',
          '  - Diện tích xung quanh: S_xq = 2 · a · d (với a là cạnh đáy, d là trung đoạn). Hoặc S_xq = p · d với p = 2a.',
          '  - Thể tích: V = (1/3) · a² · h (với h là chiều cao hình chóp).'
        ],
        examples: [
          {
            problem: 'Tính thể tích một hình chóp tứ giác đều có chiều cao là 9 cm và độ dài cạnh đáy hình vuông là 4 cm.',
            solution: [
              'Tính diện tích đáy chóp (đáy là hình vuông): S_đáy = a² = 4² = 16 cm².',
              'Tính thể tích hình chóp: V = (1/3) · S_đáy · h = (1/3) · 16 · 9 = 48 cm³.'
            ]
          }
        ],
        quizzes: [
          {
            id: 'geo-q1',
            questionText: 'Hình chóp tứ giác đều có các mặt bên là hình gì?',
            options: [
              'Hình tam giác cân',
              'Hình tam giác đều',
              'Hình chữ nhật',
              'Hình vuông'
            ],
            correctAnswer: 'Hình tam giác cân',
            explanation: 'Trong cấu tạo của hình chóp đều (cả tam giác đều và tứ giác đều), các mặt bên luôn là những hình tam giác cân bằng nhau có chung đỉnh là đỉnh chóp.'
          }
        ]
      }
    ]
  }
];
