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
    id: "ml-fundamentals",
    title: "Machine Learning Fundamentals",
    subtitle: "A Practical Guide to ML Algorithms",
    description:
      "Master the core concepts of machine learning from supervised and unsupervised learning to model evaluation and deployment. This book covers regression, classification, clustering, and ensemble methods with real-world Python examples.",
    price: 9.99,
    originalPrice: 19.99,
    coverImage: "/books/ml-fundamentals-cover.jpg",
    chapters: 14,
    pages: 320,
    topics: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Feature Engineering",
      "Model Evaluation",
      "Scikit-Learn",
      "Real-World Projects",
    ],
    level: "Beginner",
  },
  {
    id: "deep-learning",
    title: "Deep Learning with Python",
    subtitle: "Neural Networks from Scratch to Production",
    description:
      "Dive deep into neural networks, CNNs, RNNs, transformers, and generative models. Learn to build, train, and deploy deep learning models using TensorFlow and PyTorch with hands-on projects and industry best practices.",
    price: 14.99,
    originalPrice: 29.99,
    coverImage: "/books/deep-learning-cover.jpg",
    chapters: 18,
    pages: 480,
    topics: [
      "Neural Networks",
      "CNNs & RNNs",
      "Transformers",
      "GANs",
      "TensorFlow & PyTorch",
      "MLOps",
    ],
    level: "Intermediate",
  },
  {
    id: "data-science-handbook",
    title: "Data Science Handbook",
    subtitle: "Complete Reference for Modern Data Science",
    description:
      "The ultimate reference for data science practitioners. Covers statistics, data wrangling, visualization, machine learning pipelines, A/B testing, and big data tools. Packed with case studies from tech companies.",
    price: 12.99,
    originalPrice: 24.99,
    coverImage: "/books/data-science-cover.jpg",
    chapters: 22,
    pages: 550,
    topics: [
      "Statistics & Probability",
      "Data Wrangling",
      "Visualization",
      "ML Pipelines",
      "A/B Testing",
      "Big Data Tools",
    ],
    level: "Advanced",
  },
];
