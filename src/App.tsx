import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Award, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Play, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Compass, 
  Calculator, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  User,
  RefreshCw,
  Send,
  Grid
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart as RechartsLineChart, 
  Line, 
  Legend 
} from 'recharts';
import { CURRICULUM } from './data';
import { ChatMessage, Question, Lesson } from './types';
import { MathRenderer } from './components/MathRenderer';

interface MathKey {
  display: string;
  before: string;
  after?: string;
  tooltip: string;
  category: 'basic' | 'algebra' | 'geometry' | 'symbol';
}

const MATH_KEYS: MathKey[] = [
  // Basic Operators
  { display: '+', before: '+', tooltip: 'Phép cộng', category: 'basic' },
  { display: '-', before: '-', tooltip: 'Phép trừ', category: 'basic' },
  { display: '·', before: ' \\cdot ', tooltip: 'Phép nhân (dạng dấu chấm)', category: 'basic' },
  { display: ':', before: ' : ', tooltip: 'Phép chia', category: 'basic' },
  { display: '=', before: ' = ', tooltip: 'Dấu bằng', category: 'basic' },
  { display: '(', before: '(', after: ')', tooltip: 'Mở đóng ngoặc tròn', category: 'basic' },
  { display: '[', before: '[', after: ']', tooltip: 'Mở đóng ngoặc vuông', category: 'basic' },
  { display: 'x', before: 'x', tooltip: 'Biến số x', category: 'basic' },
  { display: 'y', before: 'y', tooltip: 'Biến số y', category: 'basic' },
  { display: 'a', before: 'a', tooltip: 'Tham số b', category: 'basic' },
  { display: 'b', before: 'b', tooltip: 'Tham số b', category: 'basic' },

  // Algebra (Đại số)
  { display: 'x²', before: 'x^2', tooltip: 'Bình phương', category: 'algebra' },
  { display: 'x³', before: 'x^3', tooltip: 'Lập phương', category: 'algebra' },
  { display: 'xⁿ', before: 'x^{', after: '}', tooltip: 'Mũ n tổng quát', category: 'algebra' },
  { display: 'a/b', before: '\\frac{', after: '}{}', tooltip: 'Phân số LaTeX', category: 'algebra' },
  { display: '√x', before: '\\sqrt{', after: '}', tooltip: 'Căn bậc hai LaTeX', category: 'algebra' },
  { display: '±', before: '\\pm ', tooltip: 'Cộng trừ', category: 'algebra' },
  { display: 'Δ', before: '\\Delta ', tooltip: 'Biệt thức Delta', category: 'algebra' },

  // Geometry
  { display: 'ΔABC', before: '\\Delta ABC ', tooltip: 'Ký hiệu Tam giác ABC', category: 'geometry' },
  { display: 'Góc xOy', before: '\\angle xOy ', tooltip: 'Ký hiệu Góc xOy', category: 'geometry' },
  { display: 'Góc', before: '\\angle ', tooltip: 'Ký hiệu Góc chung', category: 'geometry' },
  { display: '° (Độ)', before: '^{\\circ}', tooltip: 'Ký hiệu nhiệt độ/số đo góc', category: 'geometry' },
  { display: '∥', before: ' \\parallel ', tooltip: 'Song song', category: 'geometry' },
  { display: '⊥', before: ' \\perp ', tooltip: 'Vuông góc', category: 'geometry' },
  { display: 'π', before: '\\pi ', tooltip: 'Số Pi', category: 'geometry' },

  // Symbols
  { display: '≠', before: ' \\ne ', tooltip: 'Khác', category: 'symbol' },
  { display: '≈', before: ' \\approx ', tooltip: 'Xấp xỉ', category: 'symbol' },
  { display: '≤', before: ' \\le ', tooltip: 'Nhỏ hơn hoặc bằng', category: 'symbol' },
  { display: '≥', before: ' \\ge ', tooltip: 'Lớn hơn hoặc bằng', category: 'symbol' },
  { display: '⇒', before: ' \\Rightarrow ', tooltip: 'Mũi tên suy ra', category: 'symbol' },
  { display: '⇔', before: ' \\Leftrightarrow ', tooltip: 'Mũi tên tương đương', category: 'symbol' },
  { display: 'Bọc $...$', before: '$', after: '$', tooltip: 'Công thức kẹp giữa văn bản', category: 'symbol' },
  { display: 'Bọc $$...$$', before: '$$', after: '$$', tooltip: 'Công thức dòng riêng biệt nổi bật', category: 'symbol' }
];

export default function App() {
  // Chat input and math keyboard state
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [showMathKeyboard, setShowMathKeyboard] = useState<boolean>(true);
  const [keyboardCategory, setKeyboardCategory] = useState<'basic' | 'algebra' | 'geometry' | 'symbol'>('basic');

  const insertMathSymbol = (symbolBefore: string, symbolAfter: string = '') => {
    const input = chatInputRef.current;
    if (!input) {
      setUserInput((prev) => prev + symbolBefore + symbolAfter);
      return;
    }

    const start = input.selectionStart ?? userInput.length;
    const end = input.selectionEnd ?? userInput.length;
    const textBefore = userInput.slice(0, start);
    const textAfter = userInput.slice(end);

    const newText = textBefore + symbolBefore + symbolAfter + textAfter;
    setUserInput(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      input.focus();
      const newCursorPos = start + symbolBefore.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Curriculum outline states
  const [activeChapterId, setActiveChapterId] = useState<string>('ch2');
  const [activeLessonId, setActiveLessonId] = useState<string>('hdt-binh-phuong');
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz' | 'lab'>('theory');

  // Track completed lesson IDs with LocalStorage persistence
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('math8_completed_lessons');
      return saved ? JSON.parse(saved) : ['da-thuc-cong-tru']; // starts with 1 completed by default
    } catch {
      return ['da-thuc-cong-tru'];
    }
  });

  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      const next = prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('math8_completed_lessons', JSON.stringify(next));
      return next;
    });
  };

  // Interactive Quiz assessment state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { isCorrect: boolean; showDetail: boolean }>>({});

  // Chat with Thầy giáo Hải
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Chào em! Thầy là Thầy Hải, giáo viên hướng sẫn môn Toán 8 của em. Hôm nay em muốn thầy trò chúng ta cùng nhau khám phá chương nào dưới đây hay em có đề bài toán nào cần thầy giải thích chi tiết từng bước, hãy nhắn cho thầy nhé! Thầy luôn sẵn sàng sát cánh cùng em! 🌸',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secretError, setSecretError] = useState<string | null>(null);

  // Algebra identity lab states
  const [algebraType, setAlgebraType] = useState<'tot-tong' | 'tot-hieu' | 'hieu-hai-bp'>('tot-tong');
  const [algebraA, setAlgebraA] = useState<string>('2x');
  const [algebraB, setAlgebraB] = useState<string>('3y');

  // Cartesian linear grapher states
  const [slopeA, setSlopeA] = useState<number>(2);
  const [yInterceptB, setYInterceptB] = useState<number>(-1);

  // Interactive Recharts statistics data states
  const [surveyItems, setSurveyItems] = useState([
    { name: 'Bóng đá', value: 45 },
    { name: 'Cầu lông', value: 25 },
    { name: 'Bóng rổ', value: 15 },
    { name: 'Cờ vua', value: 15 }
  ]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemValue, setNewItemValue] = useState<number>(10);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  // Geometry Pythagorean/Pyramid solver states
  const [geomSideA, setGeomSideA] = useState<number>(6);
  const [geomSideB, setGeomSideB] = useState<number>(8);
  const [pyramidBase, setPyramidBase] = useState<number>(10);
  const [pyramidHeight, setPyramidHeight] = useState<number>(12);

  // New States for Complete Chapters
  const [polyA, setPolyA] = useState<number>(2);
  const [polyB, setPolyB] = useState<number>(-3);
  const [quadAngleA, setQuadAngleA] = useState<number>(80);
  const [quadAngleB, setQuadAngleB] = useState<number>(100);
  const [quadAngleC, setQuadAngleC] = useState<number>(70);
  const [thalesAD, setThalesAD] = useState<number>(3);
  const [thalesDB, setThalesDB] = useState<number>(2);
  const [thalesAE, setThalesAE] = useState<number>(4.5);
  const [domainA, setDomainA] = useState<number>(2);
  const [domainX, setDomainX] = useState<number>(5);
  const [eqA, setEqA] = useState<number>(3);
  const [eqB, setEqB] = useState<number>(-12);
  const [triSideA, setTriSideA] = useState<number>(3);
  const [triSideB, setTriSideB] = useState<number>(4);
  const [triSideC, setTriSideC] = useState<number>(5);
  const [simScaleK, setSimScaleK] = useState<number>(2);
  const [triPyramidBase, setTriPyramidBase] = useState<number>(6);
  const [triPyramidHeight, setTriPyramidHeight] = useState<number>(8);

  // References and scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Find currently active chapter & lesson data
  const currentChapter = CURRICULUM.find(c => c.id === activeChapterId) || CURRICULUM[0];
  const currentLesson = currentChapter.lessons.find(l => l.id === activeLessonId) || currentChapter.lessons[0];

  // Compute progress parameters
  const totalLessonsCount = CURRICULUM.reduce((acc, chap) => acc + chap.lessons.length, 0);
  const completedLessonsCount = completedLessonIds.length;
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  // Compute progress by chapter for Recharts progress bar chart
  const progressByChapterData = CURRICULUM.map(chapter => {
    const chapLessons = chapter.lessons;
    const completedInChap = chapLessons.filter(l => completedLessonIds.includes(l.id)).length;
    const percent = Math.round((completedInChap / chapLessons.length) * 100);
    return {
      name: chapter.title.includes(':') ? chapter.title.split(':')[1].trim() : chapter.title,
      'Sĩ số bài đã học': completedInChap,
      'Tổng học phần': chapLessons.length,
      'Phần trăm': percent
    };
  });

  // Auto mark lesson as completed when all quizzes of the current lesson are answered correctly!
  useEffect(() => {
    if (!currentLesson || !currentLesson.quizzes || currentLesson.quizzes.length === 0) return;
    
    // Check if every quiz of this lesson has a correct result in quizResults
    const allCorrect = currentLesson.quizzes.every(q => quizResults[q.id]?.isCorrect === true);
    if (allCorrect && !completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds(prev => {
        const next = prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id];
        localStorage.setItem('math8_completed_lessons', JSON.stringify(next));
        return next;
      });
    }
  }, [quizResults, currentLesson, completedLessonIds]);

  // Context-aware Suggested Replies
  const getSuggestedReplies = () => {
    if (messages.length === 0) return [];
    const lastMsgContent = messages[messages.length - 1]?.content || '';
    
    // If last message asked about a specific quiz question or was explanation
    if (lastMsgContent.includes('giải thích chi tiết') || lastMsgContent.includes('giải thích giúp em') || lastMsgContent.includes('sư phạm') || lastMsgContent.includes('hướng dẫn')) {
      return [
        'Em đã hiểu rồi, mong thầy cho em thêm bài mẫu tương tự ạ!',
        'Có mẹo tính nhanh hay cách giải ngắn gọn nào khác không hả thầy?',
        'Thầy làm rõ lại giúp em bước biến đổi đó được không ạ?'
      ];
    }

    if (lastMsgContent.includes('nhầm') || lastMsgContent.includes('sai') || lastMsgContent.includes('[SAI:')) {
      return [
        'Dạ em đã nhận ra lỗi sai rồi ạ, cảm ơn thầy!',
        'Nhờ thầy cho em một đề ôn tập dạng tương tự để em tự tính lại xem sao.',
        'Tại sao phép nhân/chia đó thầy lại đổi ngược dấu thế ạ?'
      ];
    }

    // Default suggestions based on active lesson category or active chapter
    if (activeLessonId === 'hdt-binh-phuong') {
      return [
        'Thầy lấy ví dụ thực tế của hằng đẳng thức đáng nhớ được không ạ?',
        'Có cách nào để nhẩm thật nhanh bình phương của một hiệu không ạ?',
        'Cho em làm thêm một câu đố vui toán học về hằng đẳng thức nhé thầy.'
      ];
    }

    if (activeLessonId === 'da-thuc-cong-tru') {
      return [
        'Thầy ơi cho em hỏi quy tắc đổi dấu khi phá ngoặc có dấu trừ đằng trước ạ.',
        'Làm sao phân biệt đơn thức đồng dạng nhanh nhất hả thầy?',
        'Hãy chấm điểm và thử thách thêm em bài đa thức khó đi thầy!'
      ];
    }

    // Fallbacks
    return [
      `Em muốn học tiếp nội dung của bài "${currentLesson.title}" ạ.`,
      `Thầy Hải đố em một câu hỏi bất đồng trong bài "${currentLesson.title}" đi ạ!`,
      `Kiến thức hôm nay dể hiểu quá, em cảm ơn thầy rất nhiều!`
    ];
  };

  // Helper function to format math outputs elegantly
  const formatMathString = (text: string) => {
    if (!text) return '';
    // Format simple squared indicators
    let result = text
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/sqrt\(([^)]+)\)/g, '√$1')
      .replace(/sqrt/g, '√')
      .replace(/\*/g, '·')
      .replace(/ <= /g, ' ≤ ')
      .replace(/ >= /g, ' ≥ ');
    return result;
  };

  // Submit Answer handler for quizzes
  const handleAnswerSelect = (questionId: string, value: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const checkAnswer = (question: Question) => {
    const userAnswer = quizAnswers[question.id];
    if (!userAnswer) return;

    const isCorrect = userAnswer === question.correctAnswer;
    setQuizResults(prev => ({
      ...prev,
      [question.id]: { isCorrect, showDetail: true }
    }));
  };

  // Trigger Thầy giáo Hải to help explain a specific question in chat
  const askTeacherAboutQuestion = async (q: Question) => {
    const teacherPrompt = `Thầy Hải giải thích chi tiết giúp em bài toán này với ạ:

Đề bài: "${q.questionText}"
Đáp án đúng là: "${q.correctAnswer}"

Em muốn thầy hướng dẫn chi tiết từng bước giải thích tại sao lại chọn đáp án này và phương pháp làm dạng bài này ạ.`;
    
    // Add prompt message
    const updatedMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: `Thầy ơi giải thích giúp em câu hỏi về "${q.questionText}" với ạ!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(updatedMessages);
    setIsLoading(true);
    setSecretError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeLessonContext: {
            title: currentLesson.title,
            chapterTitle: currentChapter.title
          },
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: teacherPrompt }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === "SECRET_MISSING") {
          setSecretError(data.message);
          setMessages(prev => [
            ...prev,
            {
              role: 'model',
              content: data.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || "Failed to call teacher");
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'Thầy Hải hiện tại đang bận chấm bài một chút. Em có thể kiểm tra xem Khóa bí mật GEMINI_API_KEY trong biểu tượng bánh răng đã chính xác chưa nhé, hoặc thử nhắn lại cho thầy nha!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // General Chat message sender
  const handleSendMessage = async (e?: React.FormEvent, messageOverride?: string) => {
    if (e) e.preventDefault();
    const query = (messageOverride || userInput).trim();
    if (!query || isLoading) return;

    const userMsg = query;
    const updatedMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: userMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(updatedMessages);
    if (!messageOverride) {
      setUserInput('');
    }
    setIsLoading(true);
    setSecretError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeLessonContext: {
            title: currentLesson.title,
            chapterTitle: currentChapter.title
          },
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === "SECRET_MISSING") {
          setSecretError(data.message);
          setMessages(prev => [
            ...prev,
            {
              role: 'model',
              content: data.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || "Error running chat");
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'Xin lỗi em, Thầy vừa gặp sự cố đường truyền mạng lớp học. Em hãy kiểm tra xem Khóa bí mật API ở Secrets panel đã lưu chưa nhé, rồi gửi lại thử xem sao nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-configured question clicks
  const askPreconfiguredQuestion = (qs: string) => {
    handleSendMessage(undefined, qs);
  };

  // Helper method for algebraic step calculations
  const calculateAlgebraSteps = () => {
    const A = algebraA || 'a';
    const B = algebraB || 'b';

    if (algebraType === 'tot-tong') {
      return {
        formula: `(${A} + ${B})² = (${A})² + 2·(${A})·(${B}) + (${B})²`,
        expanded: `(${A})² + 2·(${A})·(${B}) + (${B})²`,
        simplified: `Biến đổi chi tiết: Tập trung khai triển số bình phương thứ nhất (${A})², nhân gộp hạng tử giữa 2·(${A})·(${B}), rồi cộng bình phương ${B}².`
      };
    } else if (algebraType === 'tot-hieu') {
      return {
        formula: `(${A} - ${B})² = (${A})² - 2·(${A})·(${B}) + (${B})²`,
        expanded: `(${A})² - 2·(${A})·(${B}) + (${B})²`,
        simplified: `Biến đổi chi tiết: Lưu ý dấu trừ ở hạng tử giữa: -2·(${A})·(${B}). Các bình phương hai đầu vẫn mang dấu dương.`
      };
    } else {
      return {
        formula: `(${A})² - (${B})² = (${A} - ${B})(${A} + ${B})`,
        expanded: `(${A} - ${B})(${A} + ${B})`,
        simplified: `Biến đổi chi tiết: Đây là hiệu hai bình phương, đưa về tích của hiệu và tổng hai biểu thức cơ sở.`
      };
    }
  };

  const algebraResult = calculateAlgebraSteps();

  // Draw chart calculations of statistics
  const addSurveyItem = () => {
    if (!newItemName.trim() || newItemValue <= 0) return;
    setSurveyItems(prev => [...prev, { name: newItemName.trim(), value: Number(newItemValue) }]);
    setNewItemName('');
  };

  const removeSurveyItem = (index: number) => {
    setSurveyItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalSurveyValue = surveyItems.reduce((acc, curr) => acc + curr.value, 0);

  // Geometry calculations
  const geomHypotenuse = Math.sqrt(geomSideA * geomSideA + geomSideB * geomSideB).toFixed(2);
  
  // Square Pyramid V = 1/3 * a^2 * h
  const pyramidV = ((1 / 3) * (pyramidBase * pyramidBase) * pyramidHeight).toFixed(2);
  
  // Pyramid Slant height (trung đoạn d): h_slant = sqrt( pyramidHeight^2 + (pyramidBase / 2)^2 )
  const pyramidSlant = Math.sqrt(pyramidHeight * pyramidHeight + (pyramidBase / 2) * (pyramidBase / 2)).toFixed(2);
  const pyramidS_xq = (2 * pyramidBase * parseFloat(pyramidSlant)).toFixed(2); // S_xq = 4 * (1/2 * a * d) = 2 * a * d

  // Inline SVG graph plotter components
  const renderSVGGraph = () => {
    const width = 360;
    const height = 240;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 14; // pixels per unit

    // Generate path or line segments for y = ax + b
    // Find boundary values of y at x = -10 and x = 10
    const xMin = -12;
    const xMax = 12;
    const yAtMin = slopeA * xMin + yInterceptB;
    const yAtMax = slopeA * xMax + yInterceptB;

    // Map mathematical coordinates to SVG viewport coordinates
    const mapX = (mx: number) => centerX + mx * scale;
    const mapY = (my: number) => centerY - my * scale;

    const svgLineX1 = mapX(xMin);
    const svgLineY1 = mapY(yAtMin);
    const svgLineX2 = mapX(xMax);
    const svgLineY2 = mapY(yAtMax);

    // Grid cells
    const grids = [];
    for (let i = -10; i <= 10; i++) {
        grids.push(
          <line key={`v-${i}`} x1={mapX(i)} y1={0} x2={mapX(i)} y2={height} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        );
        grids.push(
          <line key={`h-${i}`} x1={0} y1={mapY(i)} x2={width} y2={mapY(i)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        );
    }

    return (
      <div className="relative bg-[#111116] border border-white/10 rounded-xl p-3.5 flex flex-col items-center">
        <svg width={width} height={height} className="overflow-visible border border-white/5 rounded-lg bg-black/40">
          {/* Grids */}
          {grids}

          {/* Axes */}
          <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
          <line x1={centerX} y1={0} x2={centerX} y2={height} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />

          {/* Axe Arrow Marks */}
          <polygon points={`${width},${centerY} ${width-8},${centerY-4} ${width-8},${centerY+4}`} fill="#e0e0e0" />
          <polygon points={`${centerX},0 ${centerX-4},8 ${centerX+4},8`} fill="#e0e0e0" />

          {/* Giao điểm s - intercepts point dots */}
          <circle cx={mapX(0)} cy={mapY(yInterceptB)} r={4} fill="#f59e0b" />
          {slopeA !== 0 && (
            <circle cx={mapX(-yInterceptB / slopeA)} cy={mapY(0)} r={4} fill="#3b82f6" />
          )}

          {/* Primary Line */}
          <line 
            x1={svgLineX1} 
            y1={svgLineY1} 
            x2={svgLineX2} 
            y2={svgLineY2} 
            stroke="#10b981" 
            strokeWidth={3} 
            strokeLinecap="round"
          />

          {/* Captions */}
          <text x={mapX(0.5)} y={mapY(yInterceptB + 1.2)} fill="#f59e0b" className="text-[10px] font-bold">A(0; {yInterceptB})</text>
          {slopeA !== 0 && (
            <text x={mapX(-yInterceptB / slopeA - 2.8)} y={mapY(-1.2)} fill="#3b82f6" className="text-[10px] font-bold">B({(-yInterceptB / slopeA).toFixed(1)}; 0)</text>
          )}
          
          <text x={width - 15} y={centerY + 14} fill="#9ca3af" className="text-xs italic font-bold">x</text>
          <text x={centerX - 14} y={15} fill="#9ca3af" className="text-xs italic font-bold">y</text>
          <text x={centerX - 10} y={centerY + 12} fill="#9ca3af" className="text-[10px] font-bold">O</text>
        </svg>

        <div className="mt-3 text-[11px] text-white/50 w-full flex justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block"></span> Giao điểm trục tung Oy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] inline-block"></span> Giao điểm trục hoành Ox
          </span>
        </div>
      </div>
    );
  };

  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="min-h-screen bg-[#050507] text-[#e0e0e0] font-sans flex flex-col">
      
      {/* Premium Header Banner */}
      <header className="bg-[#0a0a0c] text-white shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400/10 border border-amber-400/30 p-2.5 rounded-xl shadow-inner text-amber-400">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif italic text-amber-400 tracking-wider flex items-center gap-2">
                MATH8 <span className="text-white font-normal not-italic font-sans text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-mono">PRO</span>
              </h1>
              <p className="text-white/60 text-xs md:text-sm mt-0.5">
                Lớp học tương tác chất lượng cao cùng <span className="text-amber-400 font-semibold">Thầy Giáo Hải AI</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-xl border border-white/10 shadow-inner">
            <div className="text-right">
              <span className="block text-[9px] text-[#9ca3af] tracking-widest font-mono uppercase">TIẾN ĐỘ HỌC TẬP</span>
              <span className="text-xs md:text-sm font-bold flex items-center gap-1.5 text-amber-400 font-sans">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" /> Đã học {completedLessonsCount}/{totalLessonsCount} bài ({progressPercent}%)
              </span>
            </div>
            {/* Visual small progress ring */}
            <div className="w-10 h-10 relative flex items-center justify-center shrink-0 hidden sm:flex">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="transparent" />
                <circle 
                  cx="20" 
                  cy="20" 
                  r="16" 
                  stroke="#ef4444" 
                  strokeWidth="3" 
                  fill="transparent" 
                  className="stroke-amber-400 transition-all duration-300"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                />
              </svg>
              <span className="absolute text-[8px] font-black text-amber-300 font-mono">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Chapter Navigation & Lesson Material Layout */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Chapter Selector Tabs */}
          <div className="bg-[#0d0d10] p-4 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-bold text-amber-400/80 font-mono tracking-[0.15em] flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" /> CHƯƠNG TRÌNH ĐÀO TẠO
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded-md">Toán 8 KNTT</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CURRICULUM.map(chapter => {
                const chapLessons = chapter.lessons;
                const completedInChap = chapLessons.filter(l => completedLessonIds.includes(l.id)).length;
                const isChapFullyDone = completedInChap === chapLessons.length;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setActiveChapterId(chapter.id);
                      setActiveLessonId(chapter.lessons[0].id);
                    }}
                    className={`px-3 py-2 rounded-xl text-left transition-colors duration-200 flex flex-col gap-1 border ${
                      activeChapterId === chapter.id 
                      ? 'bg-amber-400 border-amber-400 text-black shadow-md font-bold'
                      : 'bg-[#15151b] hover:bg-white/5 border-white/5 text-white/70'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] uppercase tracking-wider font-bold font-mono ${
                        activeChapterId === chapter.id ? 'text-black/60' : 'text-amber-400/80'
                      }`}>
                        Tập {chapter.bookVolume}
                      </span>
                      {completedInChap > 0 && (
                        <span className={`text-[8px] px-1 rounded font-black font-mono shrink-0 scale-95 ${
                          isChapFullyDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-amber-300/20 text-amber-300'
                        }`}>
                          {completedInChap}/{chapLessons.length} ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                      {chapter.title.includes(':') ? chapter.title.split(':')[1].trim() : chapter.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Lesson Selector Sub-navigation */}
            {currentChapter.lessons.length > 1 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9ca3af]/60 font-mono mr-2">BÀI HỌC:</span>
                {currentChapter.lessons.map(lesson => {
                  const isDone = completedLessonIds.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setActiveTab('theory');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                        activeLessonId === lesson.id
                          ? 'bg-amber-400 border-amber-400 text-black font-extrabold shadow-md'
                          : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border-white/5'
                      }`}
                    >
                      <span className="leading-none">{lesson.title}</span>
                      {isDone && (
                        <CheckCircle className={`w-3.5 h-3.5 ${activeLessonId === lesson.id ? 'text-black fill-transparent' : 'text-emerald-400 fill-emerald-950/20'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* EXPANDED PROGRESS DASHBOARD (Theo dõi tiến độ) */}
          <div className="bg-[#0d0d12] border border-white/10 p-4 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-bold text-amber-400/85 font-mono tracking-[0.15em] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> KHẢO SÁT TIẾN ĐỘ HỌC TẬP LỚP 8 PRO
              </h3>
              <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-1 rounded self-start">
                Xếp hạng: {progressPercent >= 80 ? 'Học Thần Toán Khối 👑' : progressPercent >= 60 ? 'Học Giả Toán Học 📐' : progressPercent >= 30 ? 'Trạng Nguyên Tập Sự 🖊️' : 'Mầm Non Số Học 🌱'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left col: Stats description & progress bar */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-white font-bold text-xs">Tổng số học trình đã học</span>
                  <span className="text-xs font-mono font-black text-amber-300">{completedLessonsCount}/{totalLessonsCount} bài học ({progressPercent}%)</span>
                </div>
                {/* Custom-styled Progress Slider */}
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  {progressPercent === 100 
                    ? 'Xuất sắc! Em đã thông thạo 100% chương trình SGK Toán 8 rồi! Hãy tự tin đạt điểm tuyệt đối trên trường nhé!' 
                    : 'Hãy tiếp tục đọc các nội dung lý thuyết, hoặc giải đúng tất cả câu hỏi trắc nghiệm để tự động đánh dấu hoàn thành bài học nhé!'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-white/60 font-mono">
                    Cloud Saved ✓
                  </span>
                  {!isConfirmingReset ? (
                    <button
                      onClick={() => setIsConfirmingReset(true)}
                      className="text-[9px] uppercase hover:text-rose-400 text-rose-400/80 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 px-2 py-1 rounded transition font-mono"
                    >
                      Reset tiến trình
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                      <span className="text-[9px] text-rose-400 font-bold font-mono uppercase">Xóa thật?</span>
                      <button
                        onClick={() => {
                          setCompletedLessonIds([]);
                          setQuizAnswers({});
                          setQuizResults({});
                          localStorage.removeItem('math8_completed_lessons');
                          setIsConfirmingReset(false);
                        }}
                        className="text-[8px] uppercase bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded-md font-sans font-black"
                      >
                        Xóa hết
                      </button>
                      <button
                        onClick={() => setIsConfirmingReset(false)}
                        className="text-[8px] uppercase bg-white/10 hover:bg-white/20 text-white/80 px-2 py-0.5 rounded-md font-sans font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right col: Recharts visualizer by chapters */}
              <div className="md:col-span-7 h-[140px] w-full bg-black/40 border border-white/5 rounded-xl p-2 font-sans select-none overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressByChapterData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.35)" fontSize={7} interval={0} tickFormatter={(name) => name.replace('Chương', 'Ch.')} />
                    <YAxis stroke="rgba(255,255,255,0.35)" fontSize={8} allowDecimals={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'sans-serif' }}
                      labelStyle={{ color: '#f59e0b', fontWeight: 'extrabold', fontSize: '9px' }}
                      itemStyle={{ color: '#fff', fontSize: '9px', padding: 0 }}
                    />
                    <Bar name="Đã hoàn thành" dataKey="Sĩ số bài đã học" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar name="Mục tiêu bài" dataKey="Tổng học phần" fill="rgba(255, 255, 255, 0.12)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Lesson Display Block */}
          <div className="bg-[#111116] rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header detailing active lesson */}
            <div className="bg-[#17171f] border-b border-white/10 px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-bold text-amber-400 tracking-wider bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full inline-block uppercase">
                    {currentLesson.subtitle}
                  </span>
                  <button
                    onClick={() => toggleLessonComplete(currentLesson.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide transition-all border flex items-center gap-1 shrink-0 ${
                      completedLessonIds.includes(currentLesson.id)
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/25 animate-pulse-subtle'
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/70'
                    }`}
                    title="Đánh dấu đã hoàn thành hoặc chưa hoàn thành bài học này"
                  >
                    <CheckCircle className="w-3 h-3 text-current" />
                    <span>{completedLessonIds.includes(currentLesson.id) ? 'Đã học ✓' : 'Chưa đánh dấu'}</span>
                  </button>
                </div>
                <h2 className="text-base md:text-lg font-serif italic text-white flex items-center gap-2">
                  {currentLesson.title}
                </h2>
              </div>
              <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'theory' ? 'bg-amber-400 text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Lý thuyết
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'quiz' ? 'bg-amber-400 text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Bài kiểm tra
                </button>
                <button
                  onClick={() => setActiveTab('lab')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'lab' ? 'bg-amber-400 text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Phòng Thí Nghiệm
                </button>
              </div>
            </div>

            {/* Tab content area */}
            <div className="p-6 flex-grow min-h-[380px]">
              
              {/* TAB 1: THEORY SCREEN */}
              {activeTab === 'theory' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-amber-400/80 tracking-[0.2em] mb-2.5 font-mono">mục tiêu bài học</h4>
                    <p className="text-sm text-amber-100/90 leading-relaxed bg-amber-400/5 p-4 rounded-xl border-l-4 border-amber-400/80 italic">
                      "{currentLesson.objective}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-amber-400/80 tracking-[0.2em] mb-3 font-mono">Tóm tắt kiến thức cốt lõi</h4>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3 shadow-inner">
                      {currentLesson.theory.map((line, idx) => (
                        <div key={idx} className="text-sm text-[#e0e0e0] leading-relaxed">
                          <MathRenderer text={line} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-amber-400/80 tracking-[0.2em] mb-3 font-mono">ví dụ minh họa minh bạch</h4>
                    <div className="space-y-4">
                      {currentLesson.examples.map((ex, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5">
                          <h5 className="text-sm font-serif italic text-white flex items-start gap-2">
                            <span className="bg-amber-400 text-black not-italic text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0 mt-0.5">Ví dụ {idx + 1}</span>
                            <div className="flex-grow"><MathRenderer text={ex.problem} /></div>
                          </h5>
                          <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                            {ex.solution.map((step, sIdx) => (
                              <div key={sIdx} className="text-xs text-white/80 leading-relaxed flex gap-2 items-start">
                                <span className="text-amber-400 font-bold font-mono shrink-0">Bước {sIdx + 1}:</span>
                                <div className="flex-grow"><MathRenderer text={step} /></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE QUIZZES */}
              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold uppercase text-amber-400/80 tracking-[0.2em] font-mono">Bài tập thực hành tự kiểm định</span>
                    <button 
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizResults({});
                      }}
                      className="text-xs text-amber-400 font-bold flex items-center gap-1.5 hover:text-amber-300 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Thử làm lại từ đầu
                    </button>
                  </div>

                  <div className="space-y-6">
                    {currentLesson.quizzes.map((q, idx) => {
                      const ansState = quizResults[q.id];
                      const diffMatch = q.questionText.match(/^\[(.*?)(?:—\s*(.*?))?\]/);
                      const difficulty = diffMatch ? diffMatch[1].trim() + (diffMatch[2] ? ` • ${diffMatch[2].trim()}` : '') : '';
                      const displayQuestionText = diffMatch ? q.questionText.replace(/^\[.*?\]\s*/, '') : q.questionText;

                      let diffBadgeStyle = 'bg-white/10 text-white/70 border border-white/10';
                      if (q.questionText.includes('Nhận biết') || q.questionText.includes('Dễ')) {
                        diffBadgeStyle = 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
                      } else if (q.questionText.includes('Thông hiểu') || q.questionText.includes('Trung bình')) {
                        diffBadgeStyle = 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
                      } else if (q.questionText.includes('Vận dụng cao') || q.questionText.includes('Cực khó')) {
                        diffBadgeStyle = 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
                      } else if (q.questionText.includes('Vận dụng') || q.questionText.includes('Khó')) {
                        diffBadgeStyle = 'bg-amber-500/15 text-amber-450 text-amber-300 border border-amber-500/30';
                      }

                      return (
                        <div key={q.id} className="border border-white/10 rounded-xl p-5 space-y-4 shadow-lg bg-white/5 transition hover:bg-white/[0.07]">
                          <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-2.5">
                            <span className="bg-amber-400 text-black text-[10px] px-2.5 py-0.5 rounded-md font-mono font-black uppercase tracking-wider shrink-0">Câu {idx + 1}</span>
                            {difficulty && (
                              <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-widest ${diffBadgeStyle}`}>
                                {difficulty}
                              </span>
                            )}
                          </div>

                          <h4 className="font-semibold text-sm text-white leading-relaxed pl-0">
                            <MathRenderer text={displayQuestionText} />
                          </h4>

                          {q.options ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-8">
                              {q.options.map((opt) => {
                                const isSelected = quizAnswers[q.id] === opt;
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => handleAnswerSelect(q.id, opt)}
                                    disabled={ansState?.showDetail}
                                    className={`p-3 text-left rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                                      isSelected 
                                      ? 'bg-amber-400/15 border-amber-400 text-amber-400 ring-2 ring-amber-400/30 shadow-md'
                                      : 'bg-[#17171f] hover:bg-white/5 text-white/70 border-white/10'
                                    } ${ansState?.showDetail ? 'opacity-85 pointer-events-none' : ''}`}
                                  >
                                    <MathRenderer text={opt} />
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="pl-8">
                              <input 
                                type="text"
                                placeholder="Hãy điền giá trị kết quả của em..."
                                value={quizAnswers[q.id] || ''}
                                onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                                disabled={ansState?.showDetail}
                                className="bg-black/30 border border-white/10 text-white placeholder-white/30 rounded-xl p-2.5 text-xs w-full max-w-xs focus:ring-2 focus:ring-amber-400/50 outline-none"
                              />
                            </div>
                          )}

                          {/* Action footer for each question */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-white/10 pt-4 pl-0 md:pl-8 gap-3">
                            <div className="flex items-center gap-2">
                              {!ansState?.showDetail ? (
                                <button
                                  onClick={() => checkAnswer(q)}
                                  className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                                >
                                  Nộp Đáp Án
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs font-bold">
                                  {ansState.isCorrect ? (
                                    <span className="text-emerald-400 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 fill-emerald-950/40 text-emerald-400" /> Đúng rồi, giỏi quá!</span>
                                  ) : (
                                    <span className="text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 fill-rose-950/40 text-rose-400" /> Chưa chính xác em ơi.</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button 
                              onClick={() => askTeacherAboutQuestion(q)}
                              className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                            >
                              <Sparkles className="w-3.5 h-3.5 fill-current" /> Nhờ Thầy Hải AI hướng dẫn giải
                            </button>
                          </div>

                          {/* Explanation summary if submitted */}
                          {ansState?.showDetail && (
                            <div className="pl-0 md:pl-8 mt-2 bg-black/20 border border-white/5 p-3.5 rounded-xl">
                              <span className="block text-[9px] font-bold text-amber-400/85 uppercase font-mono mb-1 tracking-wider">giải thích sư phạm</span>
                              <div className="text-xs text-white/70 leading-relaxed">
                                <MathRenderer text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: INNOVATIVE INTERACTIVE LABS */}
              {activeTab === 'lab' && (
                <div className="space-y-6">
                  
                  {/* CHƯƠNG 1: ĐA THỨC */}
                  {activeChapterId === 'ch1' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Nhân Đa Thức Bậc Nhất</h3>
                          <p className="text-xs text-white/50">Khai triển tích hai đa thức bậc nhất dạng (x + a)(x + b) từng bước chi tiết.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Nhập hệ số tự do a (nguyên):</label>
                          <input 
                            type="number" 
                            value={polyA} 
                            onChange={(e) => setPolyA(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Nhập hệ số tự do b (nguyên):</label>
                          <input 
                            type="number" 
                            value={polyB} 
                            onChange={(e) => setPolyB(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase font-mono text-white/40 tracking-wider">Phép toán khai triển:</span>
                        <div className="text-sm font-extrabold text-amber-400 font-mono">
                          (x {polyA >= 0 ? `+ ${polyA}` : `- ${Math.abs(polyA)}`})(x {polyB >= 0 ? `+ ${polyB}` : `- ${Math.abs(polyB)}`})
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs">
                          <p className="text-white/60 font-semibold">Các bước nhân phân phối:</p>
                          <div className="bg-black/30 p-3 rounded-lg font-mono text-white/80 space-y-1">
                            <p>= x² {polyB >= 0 ? `+ ${polyB}x` : `- ${Math.abs(polyB)}x`} {polyA >= 0 ? `+ ${polyA}x` : `- ${Math.abs(polyA)}x`} {polyA * polyB >= 0 ? `+ ${polyA * polyB}` : `- ${Math.abs(polyA * polyB)}`}</p>
                            <p>= x² + ({polyA} + {polyB})x + ({polyA} · {polyB})</p>
                            <p className="text-amber-400 font-bold">= x² {polyA + polyB >= 0 ? `+ ${polyA + polyB}x` : `- ${Math.abs(polyA + polyB)}x`} {polyA * polyB >= 0 ? `+ ${polyA * polyB}` : `- ${Math.abs(polyA * polyB)}`}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Thầy hãy hướng dẫn em các bước nhân và thu gọn tích hai đa thức bậc nhất (x ${polyA >= 0 ? `+ ${polyA}` : `- ${Math.abs(polyA)}`})(x ${polyB >= 0 ? `+ ${polyB}` : `- ${Math.abs(polyB)}`}) theo chương 1 với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Gửi nhờ Thầy Hải giải thích chi tiết
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 2: HẰNG ĐẲNG THỨC ĐÁNG NHỚ */}
                  {activeChapterId === 'ch2' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm 1: Máy Khai Triển Hằng Đẳng Thức Đại Số</h3>
                          <p className="text-xs text-white/50">Giúp trực quan hóa từng bước biến đổi bình phương và tích đa thức.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">1. Hãy chọn Hằng đẳng thức</label>
                          <select 
                            value={algebraType} 
                            onChange={(e) => setAlgebraType(e.target.value as any)}
                            className="bg-[#17171f] border border-white/10 rounded-xl p-2.5 text-xs w-full text-white/95 focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none"
                          >
                            <option value="tot-tong">Bình phương của một Tổng</option>
                            <option value="tot-hieu">Bình phương của một Hiệu</option>
                            <option value="hieu-hai-bp">Hiệu hai Bình phương</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">2. Nhập biểu thức A</label>
                          <input 
                            type="text" 
                            value={algebraA} 
                            onChange={(e) => setAlgebraA(e.target.value)}
                            placeholder="Ví dụ: 2x" 
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-center font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">3. Nhập biểu thức B</label>
                          <input 
                            type="text" 
                            value={algebraB} 
                            onChange={(e) => setAlgebraB(e.target.value)}
                            placeholder="Ví dụ: 3y" 
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-center font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 shadow-lg shadow-black/30">
                        <span className="text-[10px] font-bold uppercase font-mono text-white/40 tracking-wider">Công thức lý thuyết</span>
                        <div className="text-sm font-extrabold text-amber-400 font-mono my-1.5">
                          <MathRenderer text={algebraResult.formula} />
                        </div>
                        <div className="mt-3 py-3 border-t border-white/5 space-y-2">
                          <p className="text-xs text-white/50">Khai triển thay thế:</p>
                          <div className="bg-black/40 p-2.5 rounded-lg text-xs font-mono font-bold text-white/90 border border-white/5">
                            <MathRenderer text={algebraResult.expanded} />
                          </div>
                          <p className="text-xs text-amber-300 bg-amber-400/5 border border-amber-400/20 p-2.5 rounded-lg italic">
                            💡 {algebraResult.simplified}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            const questionText = algebraType === 'tot-tong'
                              ? `Thầy Hải ơi! Thầy hãy giải thích chi tiết, vẽ hình trực quan hoặc chứng minh giúp em hằng đẳng thức khai triển của biểu thức (${algebraA} + ${algebraB})² được không ạ?`
                              : algebraType === 'tot-hieu'
                              ? `Thầy Hải ơi! Thầy hãy giải thích chi tiết, vẽ hình trực quan hoặc chứng minh giúp em hằng đẳng thức khai triển của biểu thức (${algebraA} - ${algebraB})² được không ạ?`
                              : `Thầy Hải ơi! Thầy hãy giải thích chi tiết, vẽ hình trực quan hoặc chứng minh giúp em hằng đẳng thức hiệu hai bình phương của biểu thức (${algebraA})² - (${algebraB})² được không ạ?`;
                            askPreconfiguredQuestion(questionText);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Gửi bài này nhờ Thầy giảng giải
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 3: TỨ GIÁC */}
                  {activeChapterId === 'ch3' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Compass className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Tính Tổng Góc Tứ Giác</h3>
                          <p className="text-xs text-white/50">Nhập số đo 3 góc của một tứ giác lồi, hệ thống sẽ tự động tính góc thứ 4 và trực quan.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Góc A (độ):</label>
                          <input 
                            type="number" 
                            value={quadAngleA} 
                            onChange={(e) => setQuadAngleA(Math.min(179, Math.max(1, Number(e.target.value))))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Góc B (độ):</label>
                          <input 
                            type="number" 
                            value={quadAngleB} 
                            onChange={(e) => setQuadAngleB(Math.min(179, Math.max(1, Number(e.target.value))))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Góc C (độ):</label>
                          <input 
                            type="number" 
                            value={quadAngleC} 
                            onChange={(e) => setQuadAngleC(Math.min(179, Math.max(1, Number(e.target.value))))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase font-mono text-white/40 tracking-wider">Kết quả tính toán góc D:</span>
                          <div className="text-sm font-extrabold text-amber-400 font-mono">
                            Góc D = 360° - (Góc A + Góc B + Góc C)
                          </div>
                          <div className="bg-black/30 p-3 rounded-lg text-xs font-mono space-y-1.5">
                            <p>= 360° - ({quadAngleA}° + {quadAngleB}° + {quadAngleC}°)</p>
                            <p>= 360° - {quadAngleA + quadAngleB + quadAngleC}°</p>
                            <p className={`font-bold ${360 - (quadAngleA + quadAngleB + quadAngleC) <= 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                              {"=>"} Góc D = {360 - (quadAngleA + quadAngleB + quadAngleC)}°
                            </p>
                          </div>
                          {(quadAngleA + quadAngleB + quadAngleC) >= 360 && (
                            <p className="text-[10px] text-rose-400 bg-rose-500/10 p-2 border border-rose-500/20 rounded">
                              ⚠️ Lỗi: Tổng 3 góc đã lớn hơn hoặc bằng 360 độ! Điều này không tạo được tứ giác lồi hợp lệ.
                            </p>
                          )}
                        </div>

                        {/* Visual representation in SVG */}
                        <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-xl border border-white/5 min-h-[120px]">
                          <span className="text-[9px] uppercase font-mono text-white/40 mb-2">Mô hình Tứ Giác Trực Quan</span>
                          <svg width="140" height="100" className="overflow-visible">
                            <polygon 
                              points="20,80 120,80 100,20 40,30" 
                              fill="rgba(245, 158, 11, 0.15)" 
                              stroke="#f59e0b" 
                              strokeWidth="2" 
                            />
                            <text x="12" y="88" fill="#fff" fontSize="10" fontWeight="bold">A</text>
                            <text x="125" y="88" fill="#fff" fontSize="10" fontWeight="bold">B</text>
                            <text x="105" y="16" fill="#fff" fontSize="10" fontWeight="bold">C</text>
                            <text x="32" y="24" fill="#fff" fontSize="10" fontWeight="bold">D</text>
                          </svg>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Em gặp một bài toán tứ giác ABCD biết số đo góc A = ${quadAngleA} độ, B = ${quadAngleB} độ, C = ${quadAngleC} độ. Thầy hãy giúp em chứng minh định lí tổng 4 góc của tứ giác luôn bằng 360 độ và tính góc D này với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Nhờ Thầy giải thích định lí tổng góc
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 4: ĐỊNH LÍ THALÈS */}
                  {activeChapterId === 'ch4' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Grid className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Tính Tỉ Lệ Thức Thalès</h3>
                          <p className="text-xs text-white/50">Cho tam giác ABC có đường thẳng MN song song với BC. Nhập 3 đoạn thẳng để tìm đoạn thứ 4.</p>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 italic bg-amber-400/5 p-3 rounded-lg border-l-2 border-amber-400">
                        Giả sử đoạn thẳng MN cắt hai cạnh AB, AC của tam giác ABC sao cho MN // BC (M ∈ AB, N ∈ AC). Theo định lí Thalès: AM/MB = AN/NC.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Độ dài AM (cm):</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={thalesAD} 
                            onChange={(e) => setThalesAD(Math.max(0.1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Độ dài MB (cm):</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={thalesDB} 
                            onChange={(e) => setThalesDB(Math.max(0.1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Độ dài AN (cm):</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={thalesAE} 
                            onChange={(e) => setThalesAE(Math.max(0.1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase font-mono text-white/40 tracking-wider">Tính toán đoạn NC:</span>
                          <div className="text-xs font-bold text-amber-400 font-mono">
                            AM / MB = AN / NC {"=>"} NC = (MB · AN) / AM
                          </div>
                          <div className="bg-black/30 p-3 rounded-lg text-xs font-mono space-y-1.5">
                            <p>NC = ({thalesDB} · {thalesAE}) / {thalesAD}</p>
                            <p>NC = {thalesDB * thalesAE} / {thalesAD}</p>
                            <p className="text-amber-400 font-bold">
                              {"=>"} NC = {((thalesDB * thalesAE) / thalesAD).toFixed(2)} cm
                            </p>
                          </div>
                        </div>

                        {/* Tri SVG representation */}
                        <div className="flex flex-col items-center justify-center p-2 bg-black/20 rounded-xl border border-white/5">
                          <span className="text-[9px] uppercase font-mono text-white/40 mb-2">Đường song song trong tam giác</span>
                          <svg width="150" height="110" className="overflow-visible">
                            {/* Outer Triangle ABC */}
                            <polygon points="75,10 10,100 140,100" fill="none" stroke="#e0e0e0" strokeWidth="2" />
                            {/* Parallel Line MN */}
                            <line x1="42" y1="55" x2="108" y2="55" stroke="#f59e0b" strokeWidth="3" />
                            
                            <text x="71" y="6" fill="#fff" fontSize="10" fontWeight="bold">A</text>
                            <text x="2" y="105" fill="#fff" fontSize="10" fontWeight="bold">B</text>
                            <text x="142" y="105" fill="#fff" fontSize="10" fontWeight="bold">C</text>
                            <text x="25" y="58" fill="#f59e0b" fontSize="10" fontWeight="bold">M</text>
                            <text x="114" y="58" fill="#f59e0b" fontSize="10" fontWeight="bold">N</text>
                          </svg>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Em có một tam giác ABC có đường thẳng MN song song với cạnh đáy BC. Đoạn thẳng AM = ${thalesAD} cm, MB = ${thalesDB} cm, AN = ${thalesAE} cm. Nhờ Thầy vẽ hình minh họa và hướng dẫn chi tiết từng bước áp dụng định lí Thalès để tìm đoạn NC với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Nhờ Thầy giải thích tỉ lệ bằng Thalès
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 5: DỮ LIỆU VÀ BIỂU ĐỒ */}
                  {activeChapterId === 'ch5' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm 2: Trực Quan Hóa Bảng Số Liệu và Biểu Đồ Thống Kê</h3>
                          <p className="text-xs text-white/50">Nhập số liệu học thuật lớp học thực tế để tự vẽ đồ thị cột, tròn hay đoạn thẳng.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Data Input Form */}
                        <div className="md:col-span-4 space-y-3">
                          <div className="bg-[#17171f] p-3.5 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold text-white/40 block mb-2 tracking-wider">THÊM MỤC SỐ LIỆU MỚI</span>
                            <div className="space-y-2">
                              <input 
                                type="text"
                                placeholder="Tên mục (VD: Cầu lông)"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/10 rounded-lg focus:outline-none focus:border-amber-400/50 placeholder-white/20"
                              />
                              <input 
                                type="number"
                                placeholder="Giá trị mục (VD: 25)"
                                value={newItemValue}
                                onChange={(e) => setNewItemValue(Number(e.target.value))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/10 rounded-lg focus:outline-none focus:border-amber-400/50 placeholder-white/20"
                              />
                              <button
                                onClick={addSurveyItem}
                                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs py-2 rounded-lg transition active:scale-95"
                              >
                                Thêm vào bảng số liệu
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#17171f] p-3.5 rounded-xl border border-white/10 max-h-[160px] overflow-y-auto">
                            <span className="text-[10px] font-bold text-white/40 block mb-2 uppercase tracking-wider">Bảng kiểm đếm số liệu</span>
                            {surveyItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-white/5 mb-1.5 last:border-0 last:mb-0">
                                <span className="font-semibold text-white/85">{item.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-amber-400 border border-white/5">{item.value}</span>
                                  <button onClick={() => removeSurveyItem(idx)} className="text-rose-400 hover:text-rose-300 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Animated Chart Output Area */}
                        <div className="md:col-span-8 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setChartType('bar')} 
                                className={`px-2.5 py-1 rounded text-xs font-semibold border ${chartType === 'bar' ? 'bg-amber-400 text-black border-amber-400' : 'bg-[#17171f] border-white/10 text-white/70 hover:bg-white/5'}`}
                              >
                                Biểu đồ cột
                              </button>
                              <button 
                                onClick={() => setChartType('pie')} 
                                className={`px-2.5 py-1 rounded text-xs font-semibold border ${chartType === 'pie' ? 'bg-amber-400 text-black border-amber-400' : 'bg-[#17171f] border-white/10 text-white/70 hover:bg-white/5'}`}
                              >
                                Biểu đồ quạt tròn
                              </button>
                              <button 
                                onClick={() => setChartType('line')} 
                                className={`px-2.5 py-1 rounded text-xs font-semibold border ${chartType === 'line' ? 'bg-amber-400 text-black border-amber-400' : 'bg-[#17171f] border-white/10 text-white/70 hover:bg-white/5'}`}
                              >
                                Biểu đồ đoạn thẳng
                              </button>
                            </div>
                            <span className="text-[10px] text-white/50 font-bold font-mono uppercase tracking-wider">Tổng cộng: {totalSurveyValue} (100%)</span>
                          </div>

                          <div className="bg-black/35 p-3 rounded-xl border border-white/10 min-h-[220px] flex items-center justify-center shadow-inner">
                            {surveyItems.length === 0 ? (
                              <p className="text-white/30 text-xs italic">Hãy thêm ít nhất một mục số liệu để vẽ đồ thị.</p>
                            ) : (
                              <div className="w-full h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  {chartType === 'bar' ? (
                                    <BarChart data={surveyItems} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                      <RechartsTooltip contentStyle={{ backgroundColor: '#111116', borderColor: '#333', color: '#fff' }} />
                                      <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                                        {surveyItems.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  ) : chartType === 'pie' ? (
                                    <PieChart>
                                      <Pie
                                        data={surveyItems}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        {surveyItems.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                      </Pie>
                                      <RechartsTooltip contentStyle={{ backgroundColor: '#111116', borderColor: '#333', color: '#fff' }} />
                                      <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                                    </PieChart>
                                  ) : (
                                    <RechartsLineChart data={surveyItems} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                      <RechartsTooltip contentStyle={{ backgroundColor: '#111116', borderColor: '#333', color: '#fff' }} />
                                      <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} />
                                    </RechartsLineChart>
                                  )}
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Thầy hãy phân tích bảng số liệu về (${surveyItems.map(item => `${item.name}: ${item.value}`).join(', ')}) và tư vấn cho em xem dữ liệu này là số liệu rời rạc hay liên tục, và nên vẽ biểu đồ gì để so sánh phần trăm tối ưu nhất ạ?`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Gửi bảng số liệu cho Thầy tư vấn
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 6: PHÂN THỨC ĐẠI SỐ */}
                  {activeChapterId === 'ch6' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Khảo Sát Tập Xác Định Phân Thức</h3>
                          <p className="text-xs text-white/50">Cho biểu thức phân thức A(x) = (x + 3)/(x - a). Tìm miền xác định và tính giá trị của biểu thức tại điểm x nhập vào.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Mẫu thức số trừ a (VD: 2):</label>
                          <input 
                            type="number" 
                            value={domainA} 
                            onChange={(e) => setDomainA(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Tọa độ x muốn tính:</label>
                          <input 
                            type="number" 
                            value={domainX} 
                            onChange={(e) => setDomainX(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase font-mono text-white/40 tracking-wider">Phân thức được khảo nghiệm:</span>
                          <span className="text-xs font-mono font-extrabold text-amber-400">P(x) = (x + 3) / (x - {domainA})</span>
                        </div>
                        
                        <div className="text-xs space-y-2">
                          <p className="font-bold text-white/80">1. Điều kiện xác định (ĐKXĐ):</p>
                          <p className="bg-black/20 p-2.5 rounded font-mono text-white/70">
                            mẫu thức ≠ 0 {"=>"} x - {domainA} ≠ 0 {"=>"} <span className="text-amber-400 font-bold">x ≠ {domainA}</span>
                          </p>

                          <p className="font-bold text-white/80 mt-3">2. Tính giá trị P({domainX}):</p>
                          {domainX === domainA ? (
                            <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-rose-300 font-bold font-mono">
                              ⚠️ Lỗi: x = {domainX} trùng với giá trị cấm ĐKXĐ! Mẫu thức bằng 0, giá trị phân thức KHÔNG XÁC ĐỊNH.
                            </div>
                          ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl font-mono text-emerald-300 space-y-1">
                              <p>P({domainX}) = ({domainX} + 3) / ({domainX} - {domainA})</p>
                              <p>P({domainX}) = {domainX + 3} / {domainX - domainA}</p>
                              <p className="font-extrabold text-amber-400 text-sm">{"=>"} P({domainX}) = {((domainX + 3) / (domainX - domainA)).toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Thầy hãy giải thích cho em thế nào là điều kiện xác định của một phân thức đại số và chỉ giúp em các bước tính giá trị của phân thức P(x) = (x + 3)/(x - ${domainA}) tại x = ${domainX} với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Hỏi Thầy cách tìm ĐKXĐ phân thức
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 7: PHƯƠNG TRÌNH BẬC NHẤT */}
                  {activeChapterId === 'ch7' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Calculator className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Giải Phương Trình Bậc Nhất Một Ẩn</h3>
                          <p className="text-xs text-white/50">Giải phương trình dạng ax + b = 0 theo quy tắc chuyển vế và nhân.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Hệ số a (VD: 3):</label>
                          <input 
                            type="number" 
                            value={eqA} 
                            onChange={(e) => setEqA(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Hệ số b (VD: -12):</label>
                          <input 
                            type="number" 
                            value={eqB} 
                            onChange={(e) => setEqB(Number(e.target.value))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] border border-white/10 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase font-sans text-white/40 tracking-wider">Phương trình khảo nghiệm:</span>
                        <div className="text-sm font-extrabold text-amber-400">
                          {eqA}x {eqB >= 0 ? `+ ${eqB}` : `- ${Math.abs(eqB)}`} = 0
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-white/70">
                          <p className="font-semibold font-sans text-white/90">Các bước biến đổi cụ thể:</p>
                          <div className="bg-black/30 p-3 rounded-lg space-y-2">
                            <p>• Bước 1: Áp dụng quy tắc chuyển hạng tử tự do b sang vế phải:</p>
                            <p className="font-bold text-amber-300">{"=>"} {eqA}x = {-eqB}</p>
                            
                            <p>• Bước 2: Chia hai vế cho hệ số góc a để thu được x:</p>
                            {eqA === 0 ? (
                              eqB === 0 ? (
                                <p className="text-emerald-400 font-extrabold font-sans">{"=>"} 0x = 0: Phương trình VÔ SỐ NGHIỆM (mọi số thực x đều thỏa mãn).</p>
                              ) : (
                                <p className="text-rose-400 font-extrabold font-sans">{"=>"} 0x = {-eqB} (vô lý): Phương trình VÔ NGHIỆM.</p>
                              )
                            ) : (
                              <div>
                                <p>{"=>"} x = {-eqB} / {eqA}</p>
                                <p className="text-amber-400 font-extrabold font-sans">{"=>"} Tập nghiệm S = &#x7b; {(-eqB / eqA).toFixed(2)} &#x7d;</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Thầy hãy giải thích cho em quy tắc chuyển vế và quy tắc nhân để giải phương trình bậc nhất, và hướng dẫn giải phương trình ${eqA}x ${eqB >= 0 ? `+ ${eqB}` : `- ${Math.abs(eqB)}`} = 0 này với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Gửi nhờ Thầy Hải hướng dẫn lập tức
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 8: HÀM SỐ VÀ ĐỒ THỊ */}
                  {activeChapterId === 'ch8' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Grid className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm 3: Trực Quan Hóa Đồ Thị Đường Thẳng y = ax + b</h3>
                          <p className="text-xs text-white/50">Thay đổi các hệ số a (hệ số góc) và b (tung độ gốc) để vẽ biểu đồ và tìm tính đồng biến/nghịch biến.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        
                        {/* Param Controls */}
                        <div className="md:col-span-5 space-y-4">
                          <div className="bg-[#17171f] p-4 border border-white/10 rounded-xl space-y-3">
                            <span className="block text-[10px] font-bold uppercase text-white/45 tracking-wider">Công thức hàm số:</span>
                            <div className="bg-black/35 px-3 py-2 border border-white/5 rounded-lg font-mono text-center text-sm font-extrabold text-amber-400">
                              y = {slopeA}x {yInterceptB >= 0 ? `+ ${yInterceptB}` : `- ${Math.abs(yInterceptB)}`}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-white/80 font-semibold">
                                <span>Hệ số góc a: {slopeA}</span>
                                <span className={slopeA > 0 ? "text-emerald-400 font-bold" : slopeA < 0 ? "text-rose-400 font-bold" : "text-amber-400 font-bold"}>
                                  {slopeA > 0 ? 'Đồng biến' : slopeA < 0 ? 'Nghịch biến' : 'Hàm hằng'}
                                </span>
                              </div>
                              <input 
                                type="range" 
                                min="-5" 
                                max="5" 
                                step="1" 
                                value={slopeA}
                                onChange={(e) => setSlopeA(Number(e.target.value) || 1)} // prevent zero
                                className="w-full accent-amber-400 cursor-pointer"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-white/80 font-semibold">
                                <span>Tung độ gốc b (Giao Oy): {yInterceptB}</span>
                              </div>
                              <input 
                                type="range" 
                                min="-6" 
                                max="6" 
                                step="1" 
                                value={yInterceptB}
                                onChange={(e) => setYInterceptB(Number(e.target.value))}
                                className="w-full accent-amber-400 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl text-xs text-white/70 space-y-1.5 font-mono">
                            <p className="font-sans font-bold text-amber-400">📌 Điểm cắt tọa độ giải tích:</p>
                            <p>• Điểm cắt Oy: <span className="font-bold text-amber-400">A(0; {yInterceptB})</span></p>
                            <p>• Điểm cắt Ox: <span className="font-bold text-blue-400">
                              {slopeA !== 0 ? `B(${(-yInterceptB / slopeA).toFixed(2)}; 0)` : "Không cắt Ox (song song trục Ox)"}
                            </span></p>
                          </div>
                        </div>

                        {/* Interactive SVG Graph */}
                        <div className="md:col-span-7 flex flex-col justify-center">
                          {renderSVGGraph()}
                        </div>

                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Thầy giảng giải giúp em cách vẽ chi tiết đồ thị hàm số bậc nhất y = ${slopeA}x ${yInterceptB >= 0 ? `+ ${yInterceptB}` : `- ${Math.abs(yInterceptB)}`} và tại sao hệ số góc a = ${slopeA} lại chứng tỏ hàm số này ${slopeA > 0 ? 'đồng biến' : 'nghịch biến'} với ạ?`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Gửi đồ thị nhờ Thầy giảng giải
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 9: TAM GIÁC ĐỒNG DẠNG */}
                  {activeChapterId === 'ch9' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Compass className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm: Máy Tính Tỉ Lệ Tam Giác Đồng Dạng</h3>
                          <p className="text-xs text-white/50">Cho một tam giác ABC có độ dài các cạnh. Bạn thiết lập tỉ số đồng dạng k để tự động vẽ tam giác đồng dạng A\'B\'C\' tỉ lệ tương ứng.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Cạnh AB:</label>
                          <input 
                            type="number" 
                            value={triSideA} 
                            onChange={(e) => setTriSideA(Math.max(1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Cạnh BC:</label>
                          <input 
                            type="number" 
                            value={triSideB} 
                            onChange={(e) => setTriSideB(Math.max(1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Cạnh CA:</label>
                          <input 
                            type="number" 
                            value={triSideC} 
                            onChange={(e) => setTriSideC(Math.max(1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1.5">Tỉ số k:</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={simScaleK} 
                            onChange={(e) => setSimScaleK(Math.max(0.1, Number(e.target.value)))}
                            className="bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs w-full text-white font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="bg-[#17171f] grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/10 rounded-xl p-4">
                        <div className="space-y-2 text-xs font-mono text-white/80">
                          <span className="text-[10px] font-bold uppercase font-sans text-white/40 tracking-wider">Cấu hình cạnh tam giác đồng dạng:</span>
                          <p>• Tam giác ABC gốc: AB = {triSideA}cm, BC = {triSideB}cm, CA = {triSideC}cm.</p>
                          <p>• Tam giác A\'B\'C\' đồng dạng (tỉ số k = {simScaleK}):</p>
                          <div className="bg-black/30 p-2.5 rounded-lg space-y-1 text-amber-400 font-bold">
                            <p>A\'B\' = k · AB = {simScaleK} · {triSideA} = {(simScaleK * triSideA).toFixed(1)} cm</p>
                            <p>B\'C\' = k · BC = {simScaleK} · {triSideB} = {(simScaleK * triSideB).toFixed(1)} cm</p>
                            <p>C\'A\' = k · CA = {simScaleK} · {triSideC} = {(simScaleK * triSideC).toFixed(1)} cm</p>
                          </div>
                        </div>

                        {/* Side-by-side standard visualization */}
                        <div className="flex justify-around items-center bg-black/20 rounded-xl p-2 border border-white/5 min-h-[100px]">
                          <div className="text-center">
                            <span className="text-[8px] uppercase text-white/40 block mb-1">ΔABC gốc</span>
                            <svg width="60" height="50">
                              <polygon points="30,5 5,45 55,45" fill="none" stroke="#e0e0e0" strokeWidth="2" />
                            </svg>
                          </div>
                          <ChevronRight className="w-4 h-4 text-amber-400" />
                          <div className="text-center">
                            <span className="text-[8px] uppercase text-white/40 block mb-1">ΔA\'B\'C\' (k={simScaleK})</span>
                            <svg width="80" height="70">
                              <polygon points="40,5 5,65 75,65" fill="none" stroke="#f59e0b" strokeWidth="2" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Em muốn tìm hiểu sâu về định nghĩa hai tam giác đồng dạng với tỉ số k = ${simScaleK}, các cạnh gốc lần lượt là AB = ${triSideA}, BC = ${triSideB}, CA = ${triSideC}. Thầy giảng giúp em các tính chất chu vi và diện tích thay đổi như thế nào so với k với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md font-sans"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Nhờ Thầy giải thích tam giác đồng dạng
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHƯƠNG 10: HÌNH KHỐI TRONG THỰC TIỄN */}
                  {activeChapterId === 'ch9-10' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Compass className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="font-serif italic text-base text-white">Thí Nghiệm Tổng Hợp: Trực Quan Hình Học Thơ Mộng & Hình Khối Thực Tiễn</h3>
                          <p className="text-xs text-white/50">Lớp học tính toán liên kết Pythagore, Hình Chóp Tam Giác Đều và Hình Chóp Tứ Giác Đều.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                        
                        {/* Tool 1: Pythagorean Solver */}
                        <div className="bg-[#17171f] p-4 rounded-xl border border-white/10 flex flex-col gap-3 shadow-lg font-sans">
                          <span className="text-[10px] font-bold text-amber-400 block border-b border-white/5 pb-2 font-mono uppercase tracking-wider">Công cụ 1: Tam giác vuông Pythagore</span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Cạnh góc vuông a (cm)</label>
                              <input 
                                type="number" 
                                value={geomSideA}
                                onChange={(e) => setGeomSideA(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Cạnh góc vuông b (cm)</label>
                              <input 
                                type="number" 
                                value={geomSideB}
                                onChange={(e) => setGeomSideB(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                          </div>

                          <div className="bg-black/25 border border-white/5 p-3 rounded-lg text-xs space-y-1.5 font-mono">
                            <p className="font-sans font-bold text-white/70">Công thức huyền:</p>
                            <p className="text-amber-400/90 font-bold">c = √({geomSideA}² + {geomSideB}²)</p>
                            <p className="text-amber-400/90 font-bold">c = √({geomSideA * geomSideA} + {geomSideB * geomSideB}) = √{geomSideA * geomSideA + geomSideB * geomSideB}</p>
                            <p className="text-xs font-bold text-white/90 mt-2 font-sans border-t border-white/5 pt-2">Cạnh huyền c ≈ {geomHypotenuse} cm</p>
                          </div>
                        </div>

                        {/* Tool 2: Triangular Pyramid Solver */}
                        <div className="bg-[#17171f] p-4 rounded-xl border border-white/10 flex flex-col gap-3 shadow-lg">
                          <span className="text-[10px] font-bold text-amber-400 block border-b border-white/5 pb-2 font-mono uppercase tracking-wider">Công cụ 2: Chóp TAM GIÁC đều</span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Cạnh đáy a (cm)</label>
                              <input 
                                type="number" 
                                value={triPyramidBase}
                                onChange={(e) => setTriPyramidBase(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Chiều cao h (cm)</label>
                              <input 
                                type="number" 
                                value={triPyramidHeight}
                                onChange={(e) => setTriPyramidHeight(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                          </div>

                          <div className="bg-black/25 border border-white/5 p-3 rounded-lg text-[10px] space-y-1 font-mono text-white/80">
                            <p className="font-sans font-bold text-white/70">Mặt đáy tam giác đều:</p>
                            <p>• S_đáy = (a² · √3)/4 ≈ {(triPyramidBase * triPyramidBase * 0.433).toFixed(2)} cm²</p>
                            <p>• Nửa chu vi đáy p = 1.5 · a = {(1.5 * triPyramidBase).toFixed(1)} cm</p>
                            <p>• Trung đoạn d = √(h² + a²/12) ≈ {Math.sqrt(triPyramidHeight * triPyramidHeight + (triPyramidBase * triPyramidBase) / 12).toFixed(2)} cm</p>
                            <p className="text-amber-400 font-bold mt-1.5 font-sans border-t border-white/5 pt-1.5">
                              • S_xq = p · d ≈ {(1.5 * triPyramidBase * Math.sqrt(triPyramidHeight * triPyramidHeight + (triPyramidBase * triPyramidBase) / 12)).toFixed(2)} cm²
                            </p>
                            <p className="text-amber-400 font-bold font-sans">
                              • Thể tích V = (1/3) · S_đáy · h ≈ {((1/3) * (triPyramidBase * triPyramidBase * 0.433) * triPyramidHeight).toFixed(2)} cm³
                            </p>
                          </div>
                        </div>

                        {/* Tool 3: Square Pyramid Solver */}
                        <div className="bg-[#17171f] p-4 rounded-xl border border-white/10 flex flex-col gap-3 shadow-lg">
                          <span className="text-[10px] font-bold text-amber-400 block border-b border-white/5 pb-2 font-mono uppercase tracking-wider">Công cụ 3: Chóp TỨ GIÁC đều</span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Cạnh đáy a (cm)</label>
                              <input 
                                type="number" 
                                value={pyramidBase}
                                onChange={(e) => setPyramidBase(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-bold text-white/50 mb-1">Chiều cao h (cm)</label>
                              <input 
                                type="number" 
                                value={pyramidHeight}
                                onChange={(e) => setPyramidHeight(Math.max(1, Number(e.target.value)))}
                                className="w-full text-xs p-2 bg-black/25 text-white border border-white/5 rounded focus:outline-none focus:border-amber-400/50 font-bold font-mono"
                              />
                            </div>
                          </div>

                          <div className="bg-black/25 border border-white/5 p-3 rounded-lg text-[10px] space-y-1 font-mono text-white/80">
                            <p className="font-sans font-bold text-white/70">Mặt đáy hình vuông:</p>
                            <p>• S_đáy = a² = {pyramidBase * pyramidBase} cm²</p>
                            <p>• Trung đoạn d = √(h² + (a/2)²) ≈ {pyramidSlant} cm</p>
                            <p className="text-amber-400 font-bold mt-1.5 font-sans border-t border-white/5 pt-1.5">
                              • S_xq = 2 · a · d ≈ {pyramidS_xq} cm²
                            </p>
                            <p className="text-amber-400 font-bold font-sans">
                              • Thể tích V = (1/3) · S_đáy · h ≈ {pyramidV} cm³
                            </p>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Em có một hình chóp tam giác đều với độ dài cạnh đáy bằng ${triPyramidBase} cm, chiều cao bằng ${triPyramidHeight} cm. Nhờ Thầy hướng dẫn chi tiết các bước tính diện tích xung quanh, trung đoạn d và thể tích V của hình chóp tam giác này với ạ!`);
                          }}
                          className="text-xs text-black bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md font-sans"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" /> Giải hộ hình chóp tam giác đều
                        </button>
                        <button
                          onClick={() => {
                            askPreconfiguredQuestion(`Thầy Hải ơi! Em có một hình chóp tứ giác đều với độ dài cạnh đáy bằng ${pyramidBase} cm, chiều cao bằng ${pyramidHeight} cm. Nhờ Thầy hướng dẫn chi tiết các bước tính diện tích xung quanh, trung đoạn d và thể tích V của hình chóp tứ giác này với ạ!`);
                          }}
                          className="text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-md font-sans"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400" /> Giải hộ hình chóp tứ giác đều
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

        {/* Right Side: Virtual Interactive Chat with Thầy giáo Hải AI */}
        <div className="lg:col-span-4 flex flex-col bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl h-[580px] lg:h-[780px] overflow-hidden">
          
          {/* Header for Teacher Sea Profile */}
          <div className="bg-gradient-to-r from-teal-950 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-white/10 animate-pulse-once">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-amber-400 border-2 border-[#0d0d12] flex items-center justify-center text-emerald-950 font-extrabold text-base shadow-md">
                  H
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d0d12]"></div>
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Thầy giáo Hải AI <Sparkles className="w-3.5 h-3.5 fill-current text-amber-300" />
                </h3>
                <span className="text-[10px] text-teal-300 uppercase font-mono tracking-wider font-bold">Cố vấn học tập toán 8</span>
              </div>
            </div>
            
            <div className="bg-emerald-500/10 px-2.5 py-1 rounded-xl text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              ● Trực tuyến
            </div>
          </div>

          {/* Quick FAQ / Prompt Suggestions */}
          <div className="bg-[#15151b] border-b border-white/5 p-3 flex flex-wrap gap-1.5 justify-start">
            <button 
              onClick={() => askPreconfiguredQuestion("Thầy giảng giúp em ý nghĩa hệ số góc a trong đồ thị hàm số bậc nhất với ạ!")}
              className="text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 p-1 rounded-md transition"
            >
              Hệ số góc a là gì?
            </button>
            <button 
              onClick={() => askPreconfiguredQuestion("Mẹo nhớ hằng đẳng thức đáng nhớ số 1 và số 2 dễ nhất ạ?")}
              className="text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 p-1 rounded-md transition"
            >
              Mẹo nhớ hằng đẳng thức?
            </button>
            <button 
              onClick={() => askPreconfiguredQuestion("Làm sao phân biệt dữ liệu liên tục và dữ liệu rời rạc trong thống kê ạ?")}
              className="text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 p-1 rounded-md transition"
            >
              Phân loại số liệu?
            </button>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#0a0a0f]">
            {messages.map((m, idx) => {
              const isTeacher = m.role === 'model';
              return (
                <div key={idx} className={`flex ${isTeacher ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] flex gap-2 ${isTeacher ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Tiny visual avatar indicator */}
                    <div className="flex-shrink-0">
                      {isTeacher ? (
                        <div className="w-8 h-8 rounded-full bg-amber-400 font-extrabold text-xs text-emerald-950 flex items-center justify-center shadow-sm">
                          ThH
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#1b1b24] text-white/75 flex items-center justify-center font-bold text-xs shadow-sm border border-white/5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className={`p-3.5 rounded-2xl text-xs md:text-sm shadow-sm leading-relaxed ${
                        isTeacher 
                        ? 'bg-[#15151c] text-white border border-white/10 rounded-tl-sm' 
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                      }`}>
                        {/* Dynamic custom math renderer layout parsed safely */}
                        <div className="text-xs md:text-sm leading-relaxed">
                          <MathRenderer text={m.content} />
                        </div>
                      </div>
                      <span className={`text-[9px] text-white/40 mt-1 ${isTeacher ? 'text-left' : 'text-right'}`}>
                        {m.timestamp}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Simulated generation loading reflection */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%] items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-400 font-extrabold text-xs text-emerald-950 flex items-center justify-center animate-bounce">
                    H
                  </div>
                  <div className="bg-[#15151c] border border-white/10 p-3.5 rounded-2xl rounded-tl-sm text-xs text-white/50 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-100 pb-0.5"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce delay-200"></span>
                    </div>
                    Thầy Hải đang viết lời giải từng bước...
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Secure interactive API Key Warning overlay */}
          {secretError && (
            <div className="mx-4 my-2 p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Lưu ý Sư phạm:</p>
                <p className="mt-0.5">Ứng dụng cần Khóa bảo mật API để kết nối với lớp học.</p>
                <p className="mt-1">Em hãy chuyển tới bảng điều khiển của AI Studio, click <strong>Settings &gt; Secrets</strong> rồi điền một khóa bí mật tên là <strong>GEMINI_API_KEY</strong> để Thầy Hải có thể hỗ trợ em nhé!</p>
              </div>
            </div>
          )}

          {/* Virtual Mathematical Keyboard */}
          {showMathKeyboard && (
            <div className="bg-[#15151b] border-t border-white/10 p-3 space-y-2.5 select-none transition-all animate-fade-in">
              {/* Category selector & actions */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-white/5 scrollbar-thin">
                <div className="flex gap-1">
                  {(['basic', 'algebra', 'geometry', 'symbol'] as const).map((cat) => {
                    const label = cat === 'basic' ? 'Cơ bản' : cat === 'algebra' ? 'Đại số' : cat === 'geometry' ? 'Hình học' : 'Ký hiệu';
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setKeyboardCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border transition ${keyboardCategory === cat ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5'}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMathKeyboard(false)}
                  className="text-[9px] font-mono tracking-wider text-white/45 hover:text-rose-400 uppercase bg-black/30 hover:bg-rose-500/10 px-2 py-0.5 rounded-md border border-white/5 hover:border-rose-500/25 transition"
                >
                  Thu gọn ×
                </button>
              </div>

              {/* Grid of keys */}
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                {MATH_KEYS.filter(k => k.category === keyboardCategory).map((key) => {
                  return (
                    <button
                      key={key.display}
                      type="button"
                      title={key.tooltip}
                      onClick={() => insertMathSymbol(key.before, key.after)}
                      className="bg-black/35 hover:bg-amber-400/15 border border-white/5 hover:border-amber-400/40 text-white/90 hover:text-amber-300 p-2 text-xs font-bold rounded-lg transition-all font-mono shadow-sm active:scale-95 flex items-center justify-center min-h-[34px]"
                    >
                      {key.display}
                    </button>
                  );
                })}
              </div>

              {/* Quick Mathematical Formulas / Templates */}
              <div className="flex flex-col gap-1 border-t border-white/5 pt-2">
                <span className="text-[9px] uppercase tracking-widest font-bold text-white/30 font-mono">Mẫu gõ nhanh các Hằng Đẳng Thức & Hàm số:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertMathSymbol('(a + b)^2 = a^2 + 2ab + b^2')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md transition hover:scale-102"
                  >
                    (a+b)² = a²+2ab+b²
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSymbol('(a - b)^2 = a^2 - 2ab + b^2')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md transition hover:scale-102"
                  >
                    (a-b)² = a²-2ab+b²
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSymbol('a^2 - b^2 = (a - b)(a + b)')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md transition hover:scale-102"
                  >
                    a²-b² = (a-b)(a+b)
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMathSymbol('y = ax + b')}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md transition hover:scale-102"
                  >
                    y = ax + b
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Suggested Replies */}
          {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'model' && (
            <div className="px-3 py-2 bg-[#08080a] border-t border-white/5 space-y-1.5 select-none shrink-0">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal-400 font-mono block">Gợi ý trả lời Thầy Hải:</span>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                {getSuggestedReplies().map((replyText, rid) => (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => handleSendMessage(undefined, replyText)}
                    className="text-[10px] text-teal-300 hover:text-white bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 px-2.5 py-1 rounded-lg transition duration-150 active:scale-95 text-left font-medium max-w-full truncate"
                  >
                    {replyText}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Form Entry box */}
          <form 
            id="sendMessageForm"
            onSubmit={handleSendMessage} 
            className="p-3 bg-[#111116] border-t border-white/10 flex gap-2 items-center"
          >
            <button
              type="button"
              title="Bàn phím vật lý / công thức toán"
              onClick={() => setShowMathKeyboard(!showMathKeyboard)}
              className={`p-2.5 rounded-xl transition-all border shrink-0 ${showMathKeyboard ? 'bg-amber-400 text-black border-amber-400 font-extrabold' : 'bg-white/5 hover:bg-white/10 text-white/50 border-white/10'}`}
            >
              <span className="text-xs font-bold font-mono">f(x)</span>
            </button>
            <input 
              ref={chatInputRef}
              type="text"
              placeholder="Nhập câu hỏi toán hoặc dán đề bài của em..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              className="flex-grow bg-black/35 border border-white/10 rounded-xl px-3.5 py-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-75 transition-all text-white placeholder-white/20"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl shadow-sm transition disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </main>

      {/* Humble Elegant Footer bar */}
      <footer className="bg-slate-900 mt-auto border-t border-slate-800 text-slate-500 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p>© 2026 Học Tốt Toán 8. Thiết kế sư phạm chuẩn chuẩn mực bám sát Sách Kết Nối Tri Thức.</p>
          <p className="font-mono text-[10px] text-slate-600">Thầy giáo Hải AI - Người bạn đồng hành thông thái</p>
        </div>
      </footer>

    </div>
  );
}
