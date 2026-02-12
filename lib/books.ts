export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  coverImage: string;
  chapters: number;
  pages: number;
  topics: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
}

export const books: Book[] = [
  {
    id: "practical-statistics",
    title: "Practical Statistics for Data Scientists",
    subtitle: "50+ Essential Concepts Using R and Python",
    description:
      "A hands-on guide to the essential statistical concepts every data scientist needs. Covers exploratory data analysis, distributions, statistical experiments, regression, classification, and more with practical R and Python examples.",
    price: 20,
    originalPrice: 39.99,
    coverImage: "/books/practical-stats-cover.jpg",
    chapters: 14,
    pages: 368,
    topics: [
      "Exploratory Data Analysis",
      "Statistical Experiments",
      "Regression",
      "Classification",
      "R & Python",
      "Probability & Distributions",
    ],
    level: "Beginner",
  },
  {
    id: "python-ds-handbook",
    title: "Python Data Science Handbook",
    subtitle: "Essential Tools for Working with Data",
    description:
      "A comprehensive guide to the core libraries of Python's data science stack. Master IPython, NumPy, Pandas, Matplotlib, and Scikit-Learn with practical examples and real-world data analysis techniques.",
    price: 10,
    originalPrice: 24.99,
    coverImage: "/books/python-ds-handbook-cover.jpg",
    chapters: 16,
    pages: 548,
    topics: [
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Scikit-Learn",
      "Data Wrangling",
      "Visualization",
    ],
    level: "Intermediate",
  },
  {
    id: "intro-econometrics",
    title: "Introduction to Econometrics",
    subtitle: "Global Edition - Fourth Edition",
    description:
      "A thorough introduction to econometric methods and their real-world applications. Covers regression analysis, causal inference, time series, panel data, and instrumental variables with rigorous yet accessible explanations.",
    price: 15,
    originalPrice: 34.99,
    coverImage: "/books/intro-econometrics-cover.jpg",
    chapters: 19,
    pages: 768,
    topics: [
      "Regression Analysis",
      "Causal Inference",
      "Time Series",
      "Panel Data",
      "Hypothesis Testing",
      "Instrumental Variables",
    ],
    level: "Advanced",
  },
];
