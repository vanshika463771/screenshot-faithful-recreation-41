export type SubjectId = "python" | "java" | "r" | "javascript" | "cpp" | "c";
export type Level = "easy" | "moderate" | "hard";
export const LEVELS: Level[] = ["easy", "moderate", "hard"];

export interface Subject {
  id: SubjectId;
  name: string;
  short: string;
  emoji: string;
  description: string;
  topics: string[];
}

export const SUBJECTS: Subject[] = [
  { id: "python", name: "Python", short: "PY", emoji: "🐍", description: "Readable, beginner-friendly language for data, automation and AI.", topics: ["variables", "data types", "conditions", "loops", "lists", "functions", "dictionaries", "oop"] },
  { id: "java", name: "Java", short: "JV", emoji: "☕", description: "Strongly-typed, object-oriented language powering enterprise and Android.", topics: ["variables", "data types", "conditions", "loops", "arrays", "methods", "classes", "inheritance"] },
  { id: "r", name: "R Programming / RStudio", short: "R", emoji: "📊", description: "The statistician's toolkit for data analysis and visualization.", topics: ["variables", "vectors", "data frames", "conditions", "loops", "functions", "data visualization"] },
  { id: "javascript", name: "JavaScript", short: "JS", emoji: "⚡", description: "The language of the web — interactive pages, apps and servers.", topics: ["variables", "data types", "functions", "arrays", "objects", "dom", "events"] },
  { id: "cpp", name: "C++", short: "C++", emoji: "⚙️", description: "High-performance language with classes, OOP and low-level control.", topics: ["syntax", "variables", "conditions", "loops", "arrays", "functions", "pointers", "classes", "oop"] },
  { id: "c", name: "C Programming", short: "C", emoji: "🔧", description: "The foundation of systems programming — close to the hardware.", topics: ["variables", "data types", "operators", "conditions", "loops", "arrays", "functions", "pointers"] },
];

export const getSubject = (id: string) => SUBJECTS.find((s) => s.id === id);
export const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase()).replace("Oop", "OOP").replace("Dom", "DOM");

/** Plain-language explanation + analogy for each concept (language-agnostic). */
export const CONCEPTS: Record<string, { simple: string; analogy: string; hinglish: string }> = {
  variables: { simple: "A variable is a named box that stores a value so you can use it later.", analogy: "Like a labelled jar in your kitchen: the label is the name, the sugar inside is the value.", hinglish: "Variable ek naam wala dabba hai jisme hum value rakhte hain, baad mein use karne ke liye." },
  "data types": { simple: "A data type tells the computer what kind of value something is — number, text, true/false — and what you can do with it.", analogy: "Like containers: you pour milk into a bottle, not into a paper bag. Each value needs the right container.", hinglish: "Data type batata hai ki value kis type ki hai — number, text ya true/false." },
  operators: { simple: "Operators are symbols that do work on values: + adds, == compares, && combines conditions.", analogy: "Like buttons on a calculator — each button performs one operation.", hinglish: "Operators symbols hote hain jo values par kaam karte hain, jaise + jodta hai, == compare karta hai." },
  conditions: { simple: "Conditions (if/else) let a program choose what to do based on whether something is true.", analogy: "If it is raining, take an umbrella; else wear sunglasses.", hinglish: "Condition se program decide karta hai — agar ye sach hai to ye karo, warna wo karo." },
  loops: { simple: "A loop repeats a block of code until a condition stops it.", analogy: "Like doing 10 push-ups: you repeat the same action and count until you hit 10.", hinglish: "Loop ek hi code ko baar-baar chalata hai jab tak condition false na ho jaye." },
  lists: { simple: "A list holds many values in order, and you reach each one by its index (starting from 0).", analogy: "Like a train: each coach has a number, and coach 0 is the first one.", hinglish: "List ek saath kai values ko order mein rakhti hai, index 0 se shuru hota hai." },
  arrays: { simple: "An array stores many values of the same kind in order; each has an index starting at 0.", analogy: "Like a row of numbered lockers — locker 0, locker 1, locker 2…", hinglish: "Array mein ek jaise type ki kai values order mein hoti hain, index 0 se shuru." },
  vectors: { simple: "In R, a vector is the basic collection of values of one type. Indexing starts at 1.", analogy: "Like a row of exam marks for one student, one after another.", hinglish: "R mein vector ek type ki values ka collection hai, aur index 1 se shuru hota hai." },
  functions: { simple: "A function is a reusable named block of code. You give it inputs (parameters) and it can return an output.", analogy: "Like a juicer: put fruit in, get juice out — and you can reuse it any time.", hinglish: "Function ek reusable code block hai — input do, output lo, baar-baar use karo." },
  methods: { simple: "A method is a function that belongs to a class or object.", analogy: "A car can 'drive()' and 'brake()' — those are actions that belong to the car.", hinglish: "Method ek function hai jo kisi class ya object ka hissa hota hai." },
  dictionaries: { simple: "A dictionary stores key → value pairs so you can look things up by name.", analogy: "Like a phone book: look up a name (key) to find a number (value).", hinglish: "Dictionary key-value pairs rakhti hai, jaise phone book mein naam se number." },
  objects: { simple: "An object groups related data (properties) and behaviour (methods) under one name.", analogy: "A student object has name, roll number, and can 'study()'.", hinglish: "Object related data aur kaam ko ek naam ke neeche rakhta hai." },
  oop: { simple: "Object-Oriented Programming organises code around objects built from classes, using ideas like encapsulation and inheritance.", analogy: "A class is a cookie cutter; each cookie is an object made from it.", hinglish: "OOP mein code ko classes aur objects ke around organise karte hain — class saancha hai, object uska cookie." },
  classes: { simple: "A class is a blueprint describing what data and methods its objects will have.", analogy: "A house blueprint — many houses (objects) can be built from one plan.", hinglish: "Class ek blueprint hai jisse objects bante hain." },
  inheritance: { simple: "Inheritance lets one class reuse and extend another class's fields and methods.", analogy: "A child inherits traits from parents but can also have their own.", hinglish: "Inheritance mein ek class doosri class ki properties aur methods le leti hai." },
  pointers: { simple: "A pointer is a variable that stores the memory address of another variable.", analogy: "Like writing down a friend's home address instead of carrying the friend around.", hinglish: "Pointer ek variable hai jo doosre variable ka memory address store karta hai." },
  syntax: { simple: "Syntax is the grammar of a language — the rules for how code must be written.", analogy: "Like punctuation in English: miss a full stop and the sentence breaks.", hinglish: "Syntax programming language ki grammar hai — rules todoge to error aayega." },
  "data frames": { simple: "A data frame is a table: columns are variables, rows are observations.", analogy: "Like an Excel sheet with named columns.", hinglish: "Data frame ek table hai — columns variables hain aur rows records." },
  "data visualization": { simple: "Data visualization turns numbers into charts so patterns are easy to see.", analogy: "A picture of your marks over time tells the story faster than a list of numbers.", hinglish: "Data visualization numbers ko charts mein badalta hai taaki pattern dikh jaye." },
  dom: { simple: "The DOM is the browser's tree of page elements that JavaScript can read and change.", analogy: "Like a family tree of the webpage — html is the grandparent, body and head its children.", hinglish: "DOM webpage ka tree hai jise JavaScript se badal sakte hain." },
  events: { simple: "Events are things that happen (click, keypress) that your code can listen and react to.", analogy: "A doorbell: when someone presses it (event), you go open the door (handler).", hinglish: "Event jaise click ya keypress — code unhe sunkar react karta hai." },
};

const EX: Record<SubjectId, Record<string, string>> = {
  python: {
    variables: 'name = "Asha"\nage = 19\nprint(name, age)',
    conditions: 'marks = 72\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Try again")',
    loops: "for i in range(1, 4):\n    print(i)   # 1 2 3",
    functions: "def greet(name):\n    return 'Hi ' + name\n\nprint(greet('Ravi'))",
    lists: "fruits = ['apple', 'mango']\nfruits.append('kiwi')\nprint(fruits[0])  # apple",
    dictionaries: "student = {'name': 'Asha', 'age': 19}\nprint(student['name'])",
    oop: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return self.name + ' says woof'",
    "data types": "x = 5        # int\ny = 3.2      # float\nz = 'hi'     # str\nprint(type(z))",
  },
  java: {
    variables: 'int age = 19;\nString name = "Asha";\nSystem.out.println(name + " " + age);',
    conditions: 'int marks = 72;\nif (marks >= 40) {\n  System.out.println("Pass");\n} else {\n  System.out.println("Try again");\n}',
    loops: "for (int i = 1; i <= 3; i++) {\n  System.out.println(i);\n}",
    methods: "static int square(int n) {\n  return n * n;\n}\n// square(4) -> 16",
    arrays: "int[] nums = {10, 20, 30};\nSystem.out.println(nums[0]); // 10",
    classes: "class Dog {\n  String name;\n  void bark() { System.out.println(name + \" barks\"); }\n}",
    inheritance: "class Animal { void eat() {} }\nclass Dog extends Animal { void bark() {} }",
    "data types": "int a = 5;\ndouble b = 2.5;\nboolean ok = true;\nchar c = 'A';",
  },
  r: {
    variables: 'name <- "Asha"\nage <- 19\nprint(age)',
    vectors: "marks <- c(70, 85, 90)\nmarks[1]   # 70 (R starts at 1)\nmean(marks)",
    "data frames": 'df <- data.frame(name = c("A", "B"), score = c(80, 92))\ndf$score',
    conditions: 'x <- 7\nif (x > 5) {\n  print("big")\n} else {\n  print("small")\n}',
    loops: "for (i in 1:3) {\n  print(i)\n}",
    functions: "square <- function(n) {\n  n^2\n}\nsquare(4)  # 16",
    "data visualization": "scores <- c(60, 75, 90)\nbarplot(scores)\n# or ggplot2::ggplot(df, aes(name, score)) + geom_col()",
  },
  javascript: {
    variables: 'let age = 19;\nconst name = "Asha";\nconsole.log(name, age);',
    functions: "function greet(name) {\n  return `Hi ${name}`;\n}\nconst add = (a, b) => a + b;",
    arrays: "const fruits = ['apple', 'mango'];\nfruits.push('kiwi');\nconsole.log(fruits.length); // 3",
    objects: "const student = { name: 'Asha', age: 19 };\nconsole.log(student.name);",
    dom: "const title = document.querySelector('h1');\ntitle.textContent = 'Hello!';",
    events: "button.addEventListener('click', () => {\n  alert('Clicked!');\n});",
    "data types": "typeof 42        // 'number'\ntypeof 'hi'      // 'string'\ntypeof true      // 'boolean'",
  },
  cpp: {
    syntax: '#include <iostream>\nint main() {\n  std::cout << "Hello";\n  return 0;\n}',
    variables: "int age = 19;\ndouble gpa = 8.5;\nstd::cout << age;",
    conditions: 'if (marks >= 40) {\n  std::cout << "Pass";\n} else {\n  std::cout << "Try again";\n}',
    loops: "for (int i = 1; i <= 3; i++) {\n  std::cout << i << \" \";\n}",
    arrays: "int nums[3] = {10, 20, 30};\nstd::cout << nums[0]; // 10",
    functions: "int square(int n) {\n  return n * n;\n}",
    pointers: "int x = 5;\nint* p = &x;\nstd::cout << *p; // 5",
    classes: "class Dog {\npublic:\n  std::string name;\n  void bark() { std::cout << name << \" barks\"; }\n};",
    oop: "class Animal { public: virtual void speak() {} };\nclass Dog : public Animal {\npublic: void speak() override { std::cout << \"Woof\"; }\n};",
  },
  c: {
    variables: 'int age = 19;\nprintf("%d", age);',
    "data types": "int a = 5;\nfloat b = 2.5f;\nchar c = 'A';\nprintf(\"%d %.1f %c\", a, b, c);",
    operators: "int a = 7, b = 2;\nprintf(\"%d %d\", a / b, a % b); // 3 1",
    conditions: 'if (marks >= 40) {\n  printf("Pass");\n} else {\n  printf("Try again");\n}',
    loops: 'for (int i = 1; i <= 3; i++) {\n  printf("%d ", i);\n}',
    arrays: 'int nums[3] = {10, 20, 30};\nprintf("%d", nums[0]); // 10',
    functions: "int square(int n) {\n  return n * n;\n}",
    pointers: 'int x = 5;\nint *p = &x;\nprintf("%d", *p); // 5',
  },
};

export function codeExample(subject: SubjectId, concept: string): string {
  return EX[subject][concept] ?? EX[subject].variables ?? Object.values(EX[subject])[0];
}

export function codeLang(subject: SubjectId) {
  return { python: "python", java: "java", r: "r", javascript: "javascript", cpp: "cpp", c: "c" }[subject];
}
