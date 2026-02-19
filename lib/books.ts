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
    price: 1699,
    originalPrice: 3299,
    coverImage: "/books/practical-stats-cover.jpg",
    chapters: 7,
    pages: 363,
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
    price: 1,
    originalPrice: 1999,
    coverImage: "/books/python-ds-handbook-cover.jpg",
    chapters: 50,
    pages: 591,
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
    price: 1249,
    originalPrice: 2899,
    coverImage: "/books/intro-econometrics-cover.jpg",
    chapters: 19,
    pages: 801,
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
